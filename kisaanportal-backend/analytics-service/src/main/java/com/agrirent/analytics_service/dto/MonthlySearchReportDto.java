package com.agrirent.analytics_service.dto;

public class MonthlySearchReportDto {

    private String keyword;
    private Long searchCount;
    private boolean equipmentAvailable;

    public MonthlySearchReportDto(String keyword, Long searchCount, boolean equipmentAvailable) {
        this.keyword = keyword;
        this.searchCount = searchCount;
        this.equipmentAvailable = equipmentAvailable;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Long getSearchCount() {
        return searchCount;
    }

    public void setSearchCount(Long searchCount) {
        this.searchCount = searchCount;
    }

    public boolean isEquipmentAvailable() {
        return equipmentAvailable;
    }

    public void setEquipmentAvailable(boolean equipmentAvailable) {
        this.equipmentAvailable = equipmentAvailable;
    }
}
