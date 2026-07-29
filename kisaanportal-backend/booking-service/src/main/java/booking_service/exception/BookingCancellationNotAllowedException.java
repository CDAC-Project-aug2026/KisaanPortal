package booking_service.exception;

public class BookingCancellationNotAllowedException extends RuntimeException {

    public BookingCancellationNotAllowedException(String msg) {
        super(msg);
    }
}
