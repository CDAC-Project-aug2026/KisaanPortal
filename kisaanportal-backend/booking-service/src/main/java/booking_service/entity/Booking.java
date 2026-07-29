package booking_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long equipmentId;

    @Column
    private String equipmentName;

    @Column
    private String equipmentImageUrl;

    @Column
    private Long userId;

    @Column
    private String startDate;

    @Column
    private String endDate;

    @Column
    private String status;

    @Column
    private Double finalPrice;

    public Booking() {
    }

    public Booking(Long id, Long equipmentId, Long userId, String startDate, String endDate, String status,
            Double finalPrice) {
        this.id = id;
        this.equipmentId = equipmentId;
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.finalPrice = finalPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getEquipmentImageUrl() {
        return equipmentImageUrl;
    }

    public void setEquipmentImageUrl(String equipmentImageUrl) {
        this.equipmentImageUrl = equipmentImageUrl;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    @Override
    public String toString() {
        return "Booking [id=" + id + ", equipmentId=" + equipmentId + ", equipmentName=" + equipmentName
                + ", userId=" + userId + ", startDate=" + startDate
                + ", endDate=" + endDate + ", status=" + status + ", finalPrice=" + finalPrice + "]";
    }
}
