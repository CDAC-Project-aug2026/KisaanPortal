package com.agrirent.pricing_service.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.agrirent.pricing_service.entity.Coupon;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class CouponRepositoryTest {

    @Autowired
    private CouponRepository couponRepository;

    @Test
    void testFindByCode() {
        couponRepository.deleteAll();

        Coupon coupon = new Coupon();
        coupon.setCode("SAVE10");
        coupon.setDiscountPercent(10);

        couponRepository.save(coupon);

        Optional<Coupon> result =
                couponRepository.findByCode("SAVE10");

        assertTrue(result.isPresent());
        assertEquals(10,
                result.get().getDiscountPercent());
    }
}