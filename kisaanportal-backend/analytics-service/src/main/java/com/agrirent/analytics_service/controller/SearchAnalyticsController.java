package com.agrirent.analytics_service.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agrirent.analytics_service.dto.MonthlySearchReportDto;
import com.agrirent.analytics_service.service.SearchAnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class SearchAnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(SearchAnalyticsController.class);

    private final SearchAnalyticsService service;

    public SearchAnalyticsController(SearchAnalyticsService service) {
        this.service = service;
    }

    @PostMapping("/search-log")
    public String saveSearch(@RequestParam("keyword") String keyword) {
        logger.info("REST request to save search analytics for keyword: '{}'", keyword);
        
        service.saveSearch(keyword);
        
        logger.info("Successfully saved search analytics for keyword: '{}'", keyword);
        return "Search saved successfully";
    }

    @GetMapping("/monthly-report")
    public List<MonthlySearchReportDto> getMonthlyReport(
            @RequestParam int month,
            @RequestParam int year) {

        logger.info("REST request to fetch monthly search report for month: {} and year: {}", month, year);

        List<MonthlySearchReportDto> report = service.getMonthlyReport(month, year);

        logger.info("Fetched {} report record(s) for month: {} and year: {}", 
                    report != null ? report.size() : 0, month, year);

        return report;
    }
}