package com.agrirent.pricing_service.serviceImpl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.agrirent.pricing_service.entity.Coupon;
import com.agrirent.pricing_service.repository.CouponRepository;
import com.agrirent.pricing_service.service.CouponService;

@Service
public class CouponServiceImpl implements CouponService {

    private static final Logger log = LoggerFactory.getLogger(CouponServiceImpl.class);

    private final CouponRepository couponRepository;

    public CouponServiceImpl(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public double getCouponDiscount(String couponCode) {

        log.info("Checking coupon: {}", couponCode);

        if (couponCode == null || couponCode.isBlank()) {
            return 0;
        }

        Optional<Coupon> coupon = couponRepository.findByCode(couponCode);

        if (coupon.isEmpty()) {
            log.warn("Coupon not found: {}", couponCode);
            return 0;
        }

        log.info("Coupon applied successfully: {}", couponCode);

        return coupon.get().getDiscountPercent();
    }
}
