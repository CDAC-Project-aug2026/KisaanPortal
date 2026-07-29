package booking_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import booking_service.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByEquipmentIdAndStatus(Long equipmentId, String status);
    List<Booking> findByUserId(Long userId);

    void deleteByEquipmentId(Long equipmentId);
}