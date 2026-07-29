package booking_service.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import booking_service.entity.Booking;
import booking_service.service.BookingService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    @Mock
    private BookingService service;

    @InjectMocks
    private BookingController controller;

    private Booking booking;

    @BeforeEach
    void setUp() {
        booking = new Booking();
        booking.setId(1L);
        booking.setUserId(101L);
        booking.setEquipmentId(500L);
        booking.setStartDate("2026-06-15");
        booking.setEndDate("2026-06-18");
        booking.setStatus("BOOKED");
        booking.setFinalPrice(7500.0);
    }

    @Test
    void testAddBooking() {

        when(service.addBooking(any(Booking.class))).thenReturn(booking);

        ResponseEntity<Booking> response = controller.addBooking(booking);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(booking, response.getBody());

        verify(service, times(1)).addBooking(booking);
    }

    @Test
    void testGetAllBookings() {

        List<Booking> bookingList = Arrays.asList(booking);

        when(service.getAllBookings()).thenReturn(bookingList);

        ResponseEntity<List<Booking>> response = controller.getAllBookings();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());

        verify(service, times(1)).getAllBookings();
    }

    @Test
    void testGetBookingsByUser() {

        List<Booking> bookingList = Arrays.asList(booking);

        when(service.getBookingsByUser(101L)).thenReturn(bookingList);

        ResponseEntity<List<Booking>> response =
                controller.getBookingsByUser(101L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());

        verify(service, times(1)).getBookingsByUser(101L);
    }

   
    @Test
    void testCancelBooking() {

        doNothing().when(service).cancelBooking(1L);

        ResponseEntity<String> response =
                controller.cancelBooking(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Booking cancelled successfully", response.getBody());

        verify(service, times(1)).cancelBooking(1L);
    }
}