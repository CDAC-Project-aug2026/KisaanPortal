package booking_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import booking_service.entity.Booking;
import booking_service.service.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<Booking> addBooking(@RequestBody Booking booking) {

        Booking savedBooking = service.addBooking(booking);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(savedBooking);
    }


    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {

        List<Booking> bookings = service.getAllBookings();

        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(
            @PathVariable Long userId) {

        List<Booking> bookings = service.getBookingsByUser(userId);

        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/delete/{bookingId}")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Long bookingId) {

        service.cancelBooking(bookingId);

        return ResponseEntity.ok("Booking cancelled successfully");
    }
}