package com.agrirent.analytics_service.service;

import com.agrirent.analytics_service.client.EquipmentClient;
import com.agrirent.analytics_service.dto.MonthlySearchReportDto;
import com.agrirent.analytics_service.entity.SearchAnalytics;
import com.agrirent.analytics_service.repository.SearchAnalyticsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchAnalyticsServiceTest {

    @Mock
    private SearchAnalyticsRepository repository;

    @Mock
    private EquipmentClient equipmentClient;

    @InjectMocks
    private SearchAnalyticsService searchAnalyticsService;

    @Captor
    private ArgumentCaptor<SearchAnalytics> analyticsCaptor;

    private final String keyword = "Tractor";

    @Nested
    @DisplayName("saveSearch Tests")
    class SaveSearchTests {

        @Test
        @DisplayName("Should save analytics with equipmentAvailable=true when equipment is found")
        void saveSearch_EquipmentFound_SetsAvailableTrue() {
            // Given
            List<Object> mockEquipmentList = List.of(new Object());
            when(equipmentClient.getByType(keyword)).thenReturn(mockEquipmentList);

            // When
            searchAnalyticsService.saveSearch(keyword);

            // Then
            verify(repository, times(1)).save(analyticsCaptor.capture());
            SearchAnalytics savedEntity = analyticsCaptor.getValue();

            assertThat(savedEntity.getKeyword()).isEqualTo(keyword);
            assertThat(savedEntity.isEquipmentAvailable()).isTrue();
            assertThat(savedEntity.getMonth()).isEqualTo(LocalDateTime.now().getMonthValue());
            assertThat(savedEntity.getYear()).isEqualTo(LocalDateTime.now().getYear());
            assertThat(savedEntity.getSearchedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should save analytics with equipmentAvailable=false when equipment list is empty")
        void saveSearch_EquipmentNotFound_SetsAvailableFalse() {
            // Given
            when(equipmentClient.getByType(keyword)).thenReturn(Collections.emptyList());

            // When
            searchAnalyticsService.saveSearch(keyword);

            // Then
            verify(repository, times(1)).save(analyticsCaptor.capture());
            SearchAnalytics savedEntity = analyticsCaptor.getValue();

            assertThat(savedEntity.getKeyword()).isEqualTo(keyword);
            assertThat(savedEntity.isEquipmentAvailable()).isFalse();
        }

        @Test
        @DisplayName("Should save analytics with equipmentAvailable=false when equipmentClient returns null")
        void saveSearch_NullResponse_SetsAvailableFalse() {
            // Given
            when(equipmentClient.getByType(keyword)).thenReturn(null);

            // When
            searchAnalyticsService.saveSearch(keyword);

            // Then
            verify(repository, times(1)).save(analyticsCaptor.capture());
            SearchAnalytics savedEntity = analyticsCaptor.getValue();

            assertThat(savedEntity.isEquipmentAvailable()).isFalse();
        }

        @Test
        @DisplayName("Should handle exception gracefully and save analytics with equipmentAvailable=false")
        void saveSearch_ClientThrowsException_SetsAvailableFalse() {
            // Given
            when(equipmentClient.getByType(keyword)).thenThrow(new RuntimeException("Feign 404 Not Found"));

            // When
            searchAnalyticsService.saveSearch(keyword);

            // Then
            verify(repository, times(1)).save(analyticsCaptor.capture());
            SearchAnalytics savedEntity = analyticsCaptor.getValue();

            assertThat(savedEntity.getKeyword()).isEqualTo(keyword);
            assertThat(savedEntity.isEquipmentAvailable()).isFalse();
        }
    }

    @Nested
    @DisplayName("getMonthlyReport Tests")
    class GetMonthlyReportTests {

        @Test
        @DisplayName("Should return monthly report list from repository")
        void getMonthlyReport_ReturnsData() {
            // Given
            int month = 7;
            int year = 2026;
            MonthlySearchReportDto mockDto = mock(MonthlySearchReportDto.class);
            when(repository.getMonthlyReport(month, year)).thenReturn(List.of(mockDto));

            // When
            List<MonthlySearchReportDto> report = searchAnalyticsService.getMonthlyReport(month, year);

            // Then
            assertThat(report).isNotNull().hasSize(1);
            verify(repository, times(1)).getMonthlyReport(month, year);
        }
    }
}