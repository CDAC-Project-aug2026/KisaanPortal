package booking_service.exception;

public class EquipmentBookingConflictException extends RuntimeException {

    public EquipmentBookingConflictException(String msg) {
        super(msg);
    }
}
