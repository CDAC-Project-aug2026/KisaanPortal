package com.agrirent.pricing_service.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.agrirent.pricing_service.entity.PricingRule;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class PricingRuleRepositoryTest {

    @Autowired
    private PricingRuleRepository pricingRuleRepository;

    @Test
    void testFindAllByOrderByMinDaysDesc() {
         pricingRuleRepository.deleteAll();

        // First Pricing Rule
        PricingRule rule1 = new PricingRule();
        rule1.setMinDays(1);
        rule1.setDiscountPercent(5);

        // Second Pricing Rule
        PricingRule rule2 = new PricingRule();
        rule2.setMinDays(10);
        rule2.setDiscountPercent(20);

        pricingRuleRepository.save(rule1);
        pricingRuleRepository.save(rule2);

        List<PricingRule> rules =
                pricingRuleRepository.findAllByOrderByMinDaysDesc();

        assertEquals(2, rules.size());
        assertEquals(10, rules.get(0).getMinDays());
        assertEquals(20, rules.get(0).getDiscountPercent());

        assertEquals(1, rules.get(1).getMinDays());
        assertEquals(5, rules.get(1).getDiscountPercent());
    }
}