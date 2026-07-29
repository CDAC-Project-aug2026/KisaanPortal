package booking_service.service;

import java.util.List;
import booking_service.entity.Booking;

public interface BookingService {

    Booking addBooking(Booking booking);

    List<Booking> getAllBookings();

    List<Booking> getBookingsByUser(Long userId);

    void cancelBooking(Long bookingId);
}