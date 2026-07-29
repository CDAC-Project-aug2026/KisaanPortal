package booking_service.exception;

public class BookingNotFoundException extends RuntimeException {

    public BookingNotFoundException(String msg) {
        super(msg);
    }
}
