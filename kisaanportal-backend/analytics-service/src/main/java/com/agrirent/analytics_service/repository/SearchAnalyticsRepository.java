package com.agrirent.analytics_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agrirent.analytics_service.dto.MonthlySearchReportDto;
import com.agrirent.analytics_service.entity.SearchAnalytics;

public interface SearchAnalyticsRepository extends JpaRepository<SearchAnalytics, Long> {

    @Query("""
            SELECT new com.agrirent.analytics_service.dto.MonthlySearchReportDto(
                s.keyword,
                COUNT(s),
                s.equipmentAvailable
            )
            FROM SearchAnalytics s
            WHERE s.month = :month AND s.year = :year
            GROUP BY s.keyword, s.equipmentAvailable
            ORDER BY COUNT(s) DESC
            """)
    List<MonthlySearchReportDto> getMonthlyReport(
            @Param("month") int month,
            @Param("year") int year
    );
}
