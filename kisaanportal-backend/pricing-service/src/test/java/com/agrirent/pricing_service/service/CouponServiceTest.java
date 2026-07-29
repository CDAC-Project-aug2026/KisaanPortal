package com.agrirent.pricing_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.agrirent.pricing_service.entity.Coupon;
import com.agrirent.pricing_service.repository.CouponRepository;
import com.agrirent.pricing_service.serviceImpl.CouponServiceImpl;

class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CouponServiceImpl couponService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testValidCoupon() {

        Coupon coupon = new Coupon();
        coupon.setCode("SAVE10");
        coupon.setDiscountPercent(10);

        when(couponRepository.findByCode("SAVE10"))
                .thenReturn(Optional.of(coupon));

        double discount = couponService.getCouponDiscount("SAVE10");

        assertEquals(10, discount);
    }

    @Test
    void testInvalidCoupon() {

        when(couponRepository.findByCode("INVALID"))
                .thenReturn(Optional.empty());

        double discount = couponService.getCouponDiscount("INVALID");

        assertEquals(0, discount);
    }

    @Test
    void testNullCoupon() {

        double discount = couponService.getCouponDiscount(null);

        assertEquals(0, discount);
    }

    @Test
    void testBlankCoupon() {

        double discount = couponService.getCouponDiscount("");

        assertEquals(0, discount);
    }
}
