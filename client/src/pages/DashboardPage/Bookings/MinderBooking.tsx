import { EBookingStatus } from "../../../models/IBooking";
import BookingInfo from "./BookingInfo";
import styles from "./Bookings.module.css";
import { Booking } from "./Bookings";

function MinderBooking({ booking, status, onMessage, onAccept, onDecline }: { booking: Booking, status: EBookingStatus, onMessage: (bookingId: number) => void, onAccept: (bookingId: number) => void, onDecline: (bookingId: number) => void }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === EBookingStatus.Confirmed && (
                <button className="btn btn-primary" onClick={() => onMessage(booking.id)}>Message</button>
            )}
            {status === EBookingStatus.Pending && (
                <>
                    <button className="btn btn-primary" onClick={() => onAccept(booking.id)}>Accept</button>
                    <button className="btn btn-secondary" onClick={() => onDecline(booking.id)}>Decline</button>
                </>
            )}
        </div>
    </div>
  );

}

export default MinderBooking;