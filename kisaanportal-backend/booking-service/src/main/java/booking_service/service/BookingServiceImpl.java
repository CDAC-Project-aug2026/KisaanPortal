package booking_service.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import booking_service.client.EquipmentFeignClient;
import booking_service.client.PricingClient;
import booking_service.entity.Booking;
import booking_service.exception.BookingCancellationNotAllowedException;
import booking_service.exception.BookingNotFoundException;
import booking_service.exception.EquipmentBookingConflictException;
import booking_service.repository.BookingRepository;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository repo;
    private final PricingClient pricingClient;
    private final EquipmentFeignClient equipmentFeignClient;

    public BookingServiceImpl(BookingRepository repo,
                              PricingClient pricingClient,
                              EquipmentFeignClient equipmentFeignClient) {
        this.repo = repo;
        this.pricingClient = pricingClient;
        this.equipmentFeignClient = equipmentFeignClient;
    }

    public Booking addBooking(Booking booking) {

        logger.info("Creating booking for equipmentId: {}, userId: {}",
                booking.getEquipmentId(), booking.getUserId());

        // Check for overlapping bookings...
        List<Booking> existingBookings = repo.findByEquipmentIdAndStatus(
                booking.getEquipmentId(), "BOOKED"
        );

        LocalDate newStart = LocalDate.parse(booking.getStartDate());
        LocalDate newEnd = LocalDate.parse(booking.getEndDate());

        for (Booking oldBooking : existingBookings) {
            LocalDate oldStart = LocalDate.parse(oldBooking.getStartDate());
            LocalDate oldEnd = LocalDate.parse(oldBooking.getEndDate());

            if (!newEnd.isBefore(oldStart) && !newStart.isAfter(oldEnd)) {
                throw new EquipmentBookingConflictException("Equipment already booked for selected dates");
            }
        }

        // 1. Fetch equipment details (name, image, price) so the booking always
        //    reflects the equipment that was actually booked, instead of relying
        //    on any hardcoded id->name mapping on the frontend.
        double pricePerDay = 2500.0; // Default fallback
        try {
            Map<String, Object> response = equipmentFeignClient.getEquipmentById(booking.getEquipmentId());
            if (response != null && response.containsKey("equipment")) {
                Map<String, Object> equipmentData = (Map<String, Object>) response.get("equipment");
                if (equipmentData != null) {
                    if (equipmentData.get("pricePerDay") != null) {
                        pricePerDay = ((Number) equipmentData.get("pricePerDay")).doubleValue();
                    }
                    if (equipmentData.get("name") != null) {
                        booking.setEquipmentName((String) equipmentData.get("name"));
                    }
                    if (equipmentData.get("imageUrl") != null) {
                        booking.setEquipmentImageUrl((String) equipmentData.get("imageUrl"));
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Could not fetch equipment details from equipment-service, using fallback rate: {}. Reason: {} - {}",
                    pricePerDay, e.getClass().getSimpleName(), e.getMessage());
        }

        // 2. Call pricing-service
        Map<String, Object> pricingResponse = pricingClient.calculateBill(
                pricePerDay,
                booking.getStartDate(),
                booking.getEndDate()
        );

        // 3. Extract "finalAmount" (matches field in PricingResponse DTO)
        Number finalPriceNumber = (Number) pricingResponse.get("finalAmount");
        booking.setFinalPrice(finalPriceNumber != null ? finalPriceNumber.doubleValue() : 0.0);

        booking.setStatus("BOOKED");

        Booking saved = repo.save(booking);
        logger.info("Booking created successfully with id: {}", saved.getId());

        return saved;
    }

    @Override
    public List<Booking> getAllBookings() {
        logger.info("Fetching all bookings");
        return repo.findAll();
    }

    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        logger.info("Fetching bookings for userId: {}", userId);
        return repo.findByUserId(userId);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {

        Booking booking = repo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(
                        "Booking not found with id: " + bookingId));

        if (!"BOOKED".equals(booking.getStatus())) {
            throw new BookingCancellationNotAllowedException(
                    "Only active bookings can be cancelled");
        }

        LocalDateTime startDateTime = LocalDate.parse(booking.getStartDate()).atStartOfDay();
        long hoursUntilStart = ChronoUnit.HOURS.between(LocalDateTime.now(), startDateTime);

        if (hoursUntilStart < 24) {
            logger.warn("Cancellation blocked for bookingId: {} ({} hours until start)",
                    bookingId, hoursUntilStart);
            throw new BookingCancellationNotAllowedException(
                    "Bookings can only be cancelled at least 24 hours before the start date");
        }

        booking.setStatus("CANCELLED");
        repo.save(booking);
        logger.info("Booking cancelled successfully, id: {}", bookingId);
    }
}