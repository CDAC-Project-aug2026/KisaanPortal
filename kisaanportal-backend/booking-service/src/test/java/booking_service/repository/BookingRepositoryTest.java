package booking_service.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import booking_service.entity.Booking;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest

public class BookingRepositoryTest {

    @Autowired
    private BookingRepository repo;

    private Booking booking1;
    private Booking booking2;

    @BeforeEach
    void setUp() {

        booking1 = new Booking();
        booking1.setUserId(101L);
        booking1.setEquipmentId(500L);
        booking1.setStartDate("2026-06-15");
        booking1.setEndDate("2026-06-18");
        booking1.setStatus("BOOKED");

        booking2 = new Booking();
        booking2.setUserId(102L);
        booking2.setEquipmentId(500L);
        booking2.setStartDate("2026-06-20");
        booking2.setEndDate("2026-06-22");
        booking2.setStatus("BOOKED");

        repo.save(booking1);
        repo.save(booking2);
    }

    @Test
    void testFindByEquipmentIdAndStatus() {

        List<Booking> result =
                repo.findByEquipmentIdAndStatus(500L, "BOOKED");

        assertNotNull(result);
        assertEquals(2, result.size());
    }


    @Test
    void testFindByUserId() {

        List<Booking> result =
                repo.findByUserId(101L);

        assertEquals(1, result.size());
        assertEquals(101L, result.get(0).getUserId());
    }

 
    @Test
    void testDeleteByEquipmentId() {

        repo.deleteByEquipmentId(500L);

        List<Booking> result =
                repo.findByEquipmentIdAndStatus(500L, "BOOKED");

        assertEquals(0, result.size());
    }
}