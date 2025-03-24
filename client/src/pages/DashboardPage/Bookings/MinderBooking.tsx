import { EBookingStatus, IBooking } from "../../../models/IBooking";
import BookingInfo from "./BookingInfo";
import styles from "./Bookings.module.css";

function MinderBooking({ booking, status }: { booking: IBooking, status: EBookingStatus }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === EBookingStatus.Confirmed && (
                <button className="btn btn-primary">Message</button>
            )}
            {status === EBookingStatus.Pending && (
                <>
                    <button className="btn btn-primary">Accept</button>
                    <button className="btn btn-secondary">Decline</button>
                </>
            )}
        </div>
    </div>
  );

}

export default MinderBooking;