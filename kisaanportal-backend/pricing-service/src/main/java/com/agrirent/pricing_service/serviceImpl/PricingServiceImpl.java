package com.agrirent.pricing_service.serviceImpl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.agrirent.pricing_service.dto.PricingResponse;
import com.agrirent.pricing_service.entity.PricingRule;
import com.agrirent.pricing_service.repository.PricingRuleRepository;
import com.agrirent.pricing_service.service.CouponService;
import com.agrirent.pricing_service.service.PricingService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PricingServiceImpl implements PricingService {

    private static final Logger log = LoggerFactory.getLogger(PricingServiceImpl.class);

    private final CouponService couponService;
    private final PricingRuleRepository pricingRuleRepository;

    public PricingServiceImpl(CouponService couponService, PricingRuleRepository pricingRuleRepository) {
        this.couponService = couponService;
        this.pricingRuleRepository = pricingRuleRepository;
    }

    @Override
    public PricingResponse calculateBill(
            double pricePerDay,
            LocalDate startDate,
            LocalDate endDate,
            String couponCode,
            String membershipType) {

        log.info("Price calculation started");

        if (pricePerDay <= 0) {
            throw new RuntimeException("Price must be greater than 0");
        }

        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("End date cannot be before start date");
        }

        long days = ChronoUnit.DAYS.between(startDate, endDate);

        if (days <= 0) {
            throw new RuntimeException("Rental duration must be at least 1 day");
        }

        double basePrice = days * pricePerDay;

        int month = startDate.getMonthValue();

        if (month >= 6 && month <= 8) {
            basePrice = basePrice * 1.20;
        }

        double discountPercent = 0;

        List<PricingRule> rules =
                pricingRuleRepository.findAllByOrderByMinDaysDesc();

        for (PricingRule rule : rules) {
            if (days >= rule.getMinDays()) {
                discountPercent = rule.getDiscountPercent();
                break;
            }
        }

        double discount = basePrice * discountPercent / 100;

        double amount = basePrice - discount;

        double couponPercent = 0;

        if (couponCode != null && !couponCode.isBlank()) {
            couponPercent = couponService.getCouponDiscount(couponCode);
        }

        double couponDiscount = amount * couponPercent / 100;

        amount = amount - couponDiscount;

        double membershipDiscount = 0;

        if (membershipType != null) {

            switch (membershipType.toUpperCase()) {

            case "SILVER":
                membershipDiscount = amount * 0.05;
                break;

            case "GOLD":
                membershipDiscount = amount * 0.10;
                break;
            }
        }

        amount = amount - membershipDiscount;

        double gst = amount * 0.18;

        double finalAmount = amount + gst;

        PricingResponse response = new PricingResponse();

        response.setRentalDays(days);
        response.setBasePrice(basePrice);
        response.setDiscount(discount);
        response.setCouponDiscount(couponDiscount);
        response.setCouponCode(couponCode);
        response.setMembershipType(membershipType);
        response.setMembershipDiscount(membershipDiscount);
        response.setGst(gst);
        response.setFinalAmount(finalAmount);

        log.info("Price calculation completed");

        return response;
    }
}
