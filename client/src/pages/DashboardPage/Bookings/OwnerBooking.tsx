import { EBookingStatus, IBooking } from "../../../models/IBooking";
import BookingInfo from "./BookingInfo";
import styles from "./Bookings.module.css";

function OwnerBooking({ booking, status, onMessage, onCancel, onReview }: { booking: IBooking, status: EBookingStatus, onMessage: (bookingId: number) => void, onCancel: (bookingId: number) => void, onReview: (bookingId: number) => void }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === EBookingStatus.Confirmed && (
                <>
                    <button className="btn btn-primary" onClick={() => onMessage(booking.id)}>Message</button>
                    <button className="btn btn-secondary" onClick={() => onCancel(booking.id)}>Cancel</button>
                </>
            )}
            {status === EBookingStatus.Pending && (
                <button className="btn btn-secondary" onClick={() => onCancel(booking.id)}>Cancel</button>
            )} 
            {status === EBookingStatus.Completed && (
                <button className="btn btn-primary" onClick={() => onReview(booking.id)}>Leave Review</button>
            )}
        </div>
    </div>
  );
}

export default OwnerBooking;