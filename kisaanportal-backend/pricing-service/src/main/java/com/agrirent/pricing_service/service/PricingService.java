package com.agrirent.pricing_service.service;

import java.time.LocalDate;

import com.agrirent.pricing_service.dto.PricingResponse;

public interface PricingService {

    PricingResponse calculateBill(
            double pricePerDay,
            LocalDate startDate,
            LocalDate endDate,
            String couponCode,
            String membershipType);
}
