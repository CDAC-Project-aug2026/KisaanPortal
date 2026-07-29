package booking_service.service;

import booking_service.client.EquipmentFeignClient;
import booking_service.client.PricingClient;
import booking_service.entity.Booking;
import booking_service.exception.BookingCancellationNotAllowedException;
import booking_service.exception.BookingNotFoundException;
import booking_service.exception.EquipmentBookingConflictException;
import booking_service.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository repo;

    @Mock
    private PricingClient pricingClient;

    @Mock
    private EquipmentFeignClient equipmentFeignClient;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Booking sampleBooking;

    @BeforeEach
    void setUp() {
        sampleBooking = new Booking();
        sampleBooking.setId(1L);
        sampleBooking.setUserId(101L);
        sampleBooking.setEquipmentId(500L);
        // Setting dates sufficiently far in the future to pass cancellation rules
        sampleBooking.setStartDate(LocalDate.now().plusDays(5).toString());
        sampleBooking.setEndDate(LocalDate.now().plusDays(8).toString());
        sampleBooking.setStatus("BOOKED");
    }


    @Nested
    @DisplayName("addBooking Tests")
    class AddBookingTests {

        @Test
        @DisplayName("Should successfully create booking when equipment is available and clients succeed")
        void addBooking_Success() {
            // Given
            when(repo.findByEquipmentIdAndStatus(sampleBooking.getEquipmentId(), "BOOKED"))
                    .thenReturn(Collections.emptyList());

            Map<String, Object> equipmentData = Map.of(
                    "pricePerDay", 3000.0,
                    "name", "John Deere Tractor",
                    "imageUrl", "http://image.url/tractor.jpg"
            );
            Map<String, Object> equipmentResponse = Map.of("equipment", equipmentData);
            when(equipmentFeignClient.getEquipmentById(sampleBooking.getEquipmentId()))
                    .thenReturn(equipmentResponse);

            Map<String, Object> pricingResponse = Map.of("finalAmount", 9000.0);
            when(pricingClient.calculateBill(3000.0, sampleBooking.getStartDate(), sampleBooking.getEndDate()))
                    .thenReturn(pricingResponse);

            when(repo.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            Booking result = bookingService.addBooking(sampleBooking);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isEqualTo("BOOKED");
            assertThat(result.getEquipmentName()).isEqualTo("John Deere Tractor");
            assertThat(result.getEquipmentImageUrl()).isEqualTo("http://image.url/tractor.jpg");
            assertThat(result.getFinalPrice()).isEqualTo(9000.0);

            verify(repo).save(sampleBooking);
        }

        @Test
        @DisplayName("Should throw EquipmentBookingConflictException when dates overlap with an active booking")
        void addBooking_DateConflict_ThrowsException() {
            // Given
            Booking existingBooking = new Booking();
            existingBooking.setStartDate(sampleBooking.getStartDate());
            existingBooking.setEndDate(sampleBooking.getEndDate());

            when(repo.findByEquipmentIdAndStatus(sampleBooking.getEquipmentId(), "BOOKED"))
                    .thenReturn(List.of(existingBooking));

            // When & Then
            assertThatThrownBy(() -> bookingService.addBooking(sampleBooking))
                    .isInstanceOf(EquipmentBookingConflictException.class)
                    .hasMessageContaining("Equipment already booked for selected dates");

            verify(repo, never()).save(any());
        }

        @Test
        @DisplayName("Should use fallback rate (2500.0) when EquipmentFeignClient throws exception")
        void addBooking_EquipmentClientFails_UsesFallbackPrice() {
            // Given
            when(repo.findByEquipmentIdAndStatus(sampleBooking.getEquipmentId(), "BOOKED"))
                    .thenReturn(Collections.emptyList());

            // Simulate Feign Exception
            when(equipmentFeignClient.getEquipmentById(sampleBooking.getEquipmentId()))
                    .thenThrow(new RuntimeException("Equipment Service Down"));

            Map<String, Object> pricingResponse = Map.of("finalAmount", 7500.0);
            when(pricingClient.calculateBill(2500.0, sampleBooking.getStartDate(), sampleBooking.getEndDate()))
                    .thenReturn(pricingResponse);

            when(repo.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            Booking result = bookingService.addBooking(sampleBooking);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getFinalPrice()).isEqualTo(7500.0);
            verify(pricingClient).calculateBill(2500.0, sampleBooking.getStartDate(), sampleBooking.getEndDate());
        }
    }

   
    @Nested
    @DisplayName("Retrieval Tests")
    class RetrievalTests {

        @Test
        @DisplayName("Should return all bookings")
        void getAllBookings_ReturnsList() {
            when(repo.findAll()).thenReturn(List.of(sampleBooking));

            List<Booking> results = bookingService.getAllBookings();

            assertThat(results).hasSize(1);
            verify(repo).findAll();
        }

        @Test
        @DisplayName("Should return bookings for specific user")
        void getBookingsByUser_ReturnsUserBookings() {
            Long userId = 101L;
            when(repo.findByUserId(userId)).thenReturn(List.of(sampleBooking));

            List<Booking> results = bookingService.getBookingsByUser(userId);

            assertThat(results).hasSize(1);
            verify(repo).findByUserId(userId);
        }
    }

   
    @Nested
    @DisplayName("cancelBooking Tests")
    class CancelBookingTests {

        @Test
        @DisplayName("Should successfully cancel booking when notice is >= 24 hours")
        void cancelBooking_Success() {
            // Given
            Long bookingId = 1L;
            when(repo.findById(bookingId)).thenReturn(Optional.of(sampleBooking));

            // When
            bookingService.cancelBooking(bookingId);

            // Then
            assertThat(sampleBooking.getStatus()).isEqualTo("CANCELLED");
            verify(repo).save(sampleBooking);
        }

        @Test
        @DisplayName("Should throw BookingNotFoundException when booking ID does not exist")
        void cancelBooking_NotFound_ThrowsException() {
            Long bookingId = 99L;
            when(repo.findById(bookingId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> bookingService.cancelBooking(bookingId))
                    .isInstanceOf(BookingNotFoundException.class)
                    .hasMessageContaining("Booking not found with id: " + bookingId);
        }

        @Test
        @DisplayName("Should throw BookingCancellationNotAllowedException when status is not BOOKED")
        void cancelBooking_AlreadyCancelled_ThrowsException() {
            Long bookingId = 1L;
            sampleBooking.setStatus("CANCELLED");
            when(repo.findById(bookingId)).thenReturn(Optional.of(sampleBooking));

            assertThatThrownBy(() -> bookingService.cancelBooking(bookingId))
                    .isInstanceOf(BookingCancellationNotAllowedException.class)
                    .hasMessageContaining("Only active bookings can be cancelled");
        }

        @Test
        @DisplayName("Should throw BookingCancellationNotAllowedException when notice is less than 24 hours")
        void cancelBooking_LessThan24Hours_ThrowsException() {
            Long bookingId = 1L;
            // Set start date to today/tomorrow (less than 24 hrs from LocalDateTime.now())
            sampleBooking.setStartDate(LocalDate.now().toString());
            when(repo.findById(bookingId)).thenReturn(Optional.of(sampleBooking));

            assertThatThrownBy(() -> bookingService.cancelBooking(bookingId))
                    .isInstanceOf(BookingCancellationNotAllowedException.class)
                    .hasMessageContaining("at least 24 hours before the start date");

            verify(repo, never()).save(any());
        }
    }
}