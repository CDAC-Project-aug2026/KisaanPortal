package com.agrirent.pricing_service.controller;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agrirent.pricing_service.dto.PricingResponse;
import com.agrirent.pricing_service.service.PricingService;

@RestController
@RequestMapping("/pricing")
public class PricingController {

    private static final Logger log = LoggerFactory.getLogger(PricingController.class);

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping("/bill")
    public ResponseEntity<PricingResponse> calculateBill(
            @RequestParam double pricePerDay,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) String coupon,
            @RequestParam(required = false) String membershipType) {

        log.info("Bill API called");

        PricingResponse response = pricingService.calculateBill(
                pricePerDay,
                LocalDate.parse(startDate),
                LocalDate.parse(endDate),
                coupon,
                membershipType);

        return ResponseEntity.ok(response);
    }
}
