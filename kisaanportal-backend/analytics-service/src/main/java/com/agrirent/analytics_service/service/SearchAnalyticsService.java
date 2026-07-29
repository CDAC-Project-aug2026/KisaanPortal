package com.agrirent.analytics_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.agrirent.analytics_service.client.EquipmentClient;
import com.agrirent.analytics_service.dto.MonthlySearchReportDto;
import com.agrirent.analytics_service.entity.SearchAnalytics;
import com.agrirent.analytics_service.repository.SearchAnalyticsRepository;

@Service
public class SearchAnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(SearchAnalyticsService.class);

    private final SearchAnalyticsRepository repository;
    private final EquipmentClient equipmentClient;

    public SearchAnalyticsService(SearchAnalyticsRepository repository, EquipmentClient equipmentClient) {
        this.repository = repository;
        this.equipmentClient = equipmentClient;
    }

    public void saveSearch(String keyword) {
        logger.info("Processing search analytics for keyword: '{}'", keyword);

        SearchAnalytics analytics = new SearchAnalytics();
        analytics.setKeyword(keyword);

        boolean available = false;

        try {
            List<Object> results = equipmentClient.getByType(keyword);
            // Available is true ONLY if equipment exists in DB
            available = (results != null && !results.isEmpty());
            logger.debug("Equipment check for keyword '{}' returned {} result(s). Available: {}", 
                         keyword, (results != null ? results.size() : 0), available);
        } catch (Exception e) {
            // If Feign gets 404 or fails, it means NO equipment was found
            logger.warn("Could not check equipment availability for keyword '{}' via equipment-service: {} - {}", 
                        keyword, e.getClass().getSimpleName(), e.getMessage());
            available = false;
        }

        analytics.setEquipmentAvailable(available);
        analytics.setMonth(LocalDateTime.now().getMonthValue());
        analytics.setYear(LocalDateTime.now().getYear());
        analytics.setSearchedAt(LocalDateTime.now());

        SearchAnalytics savedAnalytics = repository.save(analytics);
        logger.info("Search analytics saved successfully with id: {} for keyword: '{}'", 
                    savedAnalytics.getId(), keyword);
    }

    public List<MonthlySearchReportDto> getMonthlyReport(int month, int year) {
        logger.info("Generating monthly search report for month: {} and year: {}", month, year);

        List<MonthlySearchReportDto> report = repository.getMonthlyReport(month, year);

        logger.info("Found {} report record(s) for month: {} and year: {}", 
                    (report != null ? report.size() : 0), month, year);

        return report;
    }
}