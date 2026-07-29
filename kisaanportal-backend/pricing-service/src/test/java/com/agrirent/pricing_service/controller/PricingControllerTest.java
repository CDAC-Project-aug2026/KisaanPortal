package com.agrirent.pricing_service.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.agrirent.pricing_service.dto.PricingResponse;
import com.agrirent.pricing_service.service.PricingService;

@WebMvcTest(PricingController.class)
class PricingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PricingService pricingService;

    @Test
    void testCalculateBill() throws Exception {

        PricingResponse response = new PricingResponse();
        response.setFinalAmount(500);

        when(pricingService.calculateBill(
                anyDouble(),
                any(LocalDate.class),
                any(LocalDate.class),
                any(),
                any()))
                .thenReturn(response);

        mockMvc.perform(get("/pricing/bill")
                .param("pricePerDay", "100")
                .param("startDate", "2026-01-01")
                .param("endDate", "2026-01-06"))
                .andExpect(status().isOk());

    }

}