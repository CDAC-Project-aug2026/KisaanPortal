package com.agrirent.analytics_service.controller;

import com.agrirent.analytics_service.dto.MonthlySearchReportDto;
import com.agrirent.analytics_service.service.SearchAnalyticsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SearchAnalyticsController.class)
class SearchAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SearchAnalyticsService service;

    @Nested
    @DisplayName("POST /api/analytics/search-log")
    class SaveSearchEndpointTests {

        @Test
        @DisplayName("Should save search and return 200 OK with success message")
        void saveSearch_Success() throws Exception {
            String keyword = "Tractor";
            doNothing().when(service).saveSearch(keyword);

            mockMvc.perform(post("/api/analytics/search-log")
                            .param("keyword", keyword)
                            .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Search saved successfully"));

            verify(service).saveSearch(keyword);
        }

        @Test
        @DisplayName("Should return 400 Bad Request when keyword param is missing")
        void saveSearch_MissingParam_BadRequest() throws Exception {
            mockMvc.perform(post("/api/analytics/search-log"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Test
    @DisplayName("Should return monthly report list and 200 OK")
    void getMonthlyReport_Success() throws Exception {
        int month = 7;
        int year = 2026;

        // Mock response data
        MonthlySearchReportDto mockDto = org.mockito.Mockito.mock(MonthlySearchReportDto.class); 
        when(service.getMonthlyReport(month, year)).thenReturn(List.of(mockDto));

        mockMvc.perform(get("/api/analytics/monthly-report")
                        .param("month", String.valueOf(month))
                        .param("year", String.valueOf(year))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(service).getMonthlyReport(month, year);
    }

        @Test
        @DisplayName("Should return 400 Bad Request when required params are missing")
        void getMonthlyReport_MissingParams_BadRequest() throws Exception {
            mockMvc.perform(get("/api/analytics/monthly-report"))
                    .andExpect(status().isBadRequest());
        }
    }
