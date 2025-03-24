import { EBookingStatus, IBooking } from "../../../models/IBooking";
import BookingInfo from "./BookingInfo";
import styles from "./Bookings.module.css";

function OwnerBooking({ booking, status }: { booking: IBooking, status: EBookingStatus }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === EBookingStatus.Confirmed && (
                <>
                    <button className="btn btn-primary">Message</button>
                    <button className="btn btn-secondary">Cancel</button>
                </>
            )}
            {status === EBookingStatus.Pending && (
                <button className="btn btn-secondary">Cancel</button>
            )} 
            {status === EBookingStatus.Completed && (
                <button className="btn btn-primary">Leave Review</button>
            )}
        </div>
    </div>
  );
}

export default OwnerBooking;