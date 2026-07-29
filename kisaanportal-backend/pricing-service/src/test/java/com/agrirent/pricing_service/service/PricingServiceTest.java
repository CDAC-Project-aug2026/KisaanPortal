package com.agrirent.pricing_service.service;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.agrirent.pricing_service.serviceImpl.PricingServiceImpl;

import com.agrirent.pricing_service.dto.PricingResponse;
import com.agrirent.pricing_service.entity.PricingRule;
import com.agrirent.pricing_service.repository.PricingRuleRepository;

class PricingServiceTest {

    @Mock
    private CouponService couponService;

    @Mock
    private PricingRuleRepository pricingRuleRepository;

   @InjectMocks
private PricingServiceImpl pricingService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }
    

    @Test
void testValidBillCalculation() {

    PricingRule rule = new PricingRule();
    rule.setMinDays(1);
    rule.setDiscountPercent(10);

    List<PricingRule> rules = new ArrayList<>();
    rules.add(rule);

    when(pricingRuleRepository.findAllByOrderByMinDaysDesc())
            .thenReturn(rules);

    PricingResponse response =
            pricingService.calculateBill(
                    100,
                    LocalDate.of(2026, 1, 1),
                    LocalDate.of(2026, 1, 6),
                    null,
                    null);

    assertNotNull(response);
    assertEquals(5, response.getRentalDays());
}
//2nd test
@Test
void testInvalidPrice() {

    RuntimeException ex =
            assertThrows(
                    RuntimeException.class,
                    () -> pricingService.calculateBill(
                            0,
                            LocalDate.now(),
                            LocalDate.now().plusDays(1),
                            null,
                            null));

    assertEquals(
            "Price must be greater than 0",
            ex.getMessage());
}
@Test
void testInvalidDates() {

    RuntimeException ex =
            assertThrows(
                    RuntimeException.class,
                    () -> pricingService.calculateBill(
                            100,
                            LocalDate.now(),
                            LocalDate.now().minusDays(1),
                            null,
                            null));

    assertEquals(
            "End date cannot be before start date",
            ex.getMessage());
}
@Test
void testCouponDiscount() {

    PricingRule rule = new PricingRule();
    rule.setMinDays(1);
    rule.setDiscountPercent(0);

    when(pricingRuleRepository
            .findAllByOrderByMinDaysDesc())
            .thenReturn(List.of(rule));

    when(couponService
            .getCouponDiscount("SAVE10"))
            .thenReturn(10.0);

    PricingResponse response =
            pricingService.calculateBill(
                    100,
                    LocalDate.of(2026,1,1),
                    LocalDate.of(2026,1,6),
                    "SAVE10",
                    null);

    assertTrue(response.getCouponDiscount() > 0);
}
@Test
void testSilverMembershipDiscount() {

    PricingRule rule = new PricingRule();
    rule.setMinDays(1);
    rule.setDiscountPercent(0);

    when(pricingRuleRepository
            .findAllByOrderByMinDaysDesc())
            .thenReturn(List.of(rule));

    PricingResponse response =
            pricingService.calculateBill(
                    100,
                    LocalDate.of(2026,1,1),
                    LocalDate.of(2026,1,6),
                    null,
                    "SILVER");

    assertTrue(response.getMembershipDiscount() > 0);
}
@Test
void testGoldMembershipDiscount() {

    PricingRule rule = new PricingRule();
    rule.setMinDays(1);
    rule.setDiscountPercent(0);

    when(pricingRuleRepository
            .findAllByOrderByMinDaysDesc())
            .thenReturn(List.of(rule));

    PricingResponse response =
            pricingService.calculateBill(
                    100,
                    LocalDate.of(2026,1,1),
                    LocalDate.of(2026,1,6),
                    null,
                    "GOLD");

    assertTrue(response.getMembershipDiscount() > 0);
}
@Test
void testSeasonalPricing() {

    PricingRule rule = new PricingRule();
    rule.setMinDays(1);
    rule.setDiscountPercent(0);

    when(pricingRuleRepository
            .findAllByOrderByMinDaysDesc())
            .thenReturn(List.of(rule));

    PricingResponse response =
            pricingService.calculateBill(
                    100,
                    LocalDate.of(2026,6,1),
                    LocalDate.of(2026,6,6),
                    null,
                    null);

    assertEquals(600.0,
            response.getBasePrice());
}


@Test
void testPricingRuleDiscount() {

    PricingRule rule = new PricingRule();
    rule.setMinDays(5);
    rule.setDiscountPercent(20);

    when(pricingRuleRepository
            .findAllByOrderByMinDaysDesc())
            .thenReturn(List.of(rule));

    PricingResponse response =
            pricingService.calculateBill(
                    100,
                    LocalDate.of(2026,1,1),
                    LocalDate.of(2026,1,6),
                    null,
                    null);

    assertEquals(100.0,
            response.getDiscount());
}
}
