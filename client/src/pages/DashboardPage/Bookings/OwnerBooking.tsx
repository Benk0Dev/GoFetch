import { EBookingStatus } from "../../../models/IBooking";
import BookingInfo from "./BookingInfo";
import styles from "./Bookings.module.css";
import { Booking } from "./Bookings";
import { MessageSquare, MessageSquareText as Review } from "lucide-react";

function OwnerBooking({ booking, status, onMessage, onCancel, onReview }: { booking: Booking, status: EBookingStatus, onMessage: (bookingId: number) => void, onCancel: (bookingId: number) => void, onReview: (bookingId: number) => void }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === EBookingStatus.Confirmed && (
                <>
                    <button className="btn btn-primary" onClick={() => onMessage(booking.minder.userDetails.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                    <button className="btn btn-secondary" onClick={() => onCancel(booking.id)}>Cancel</button>
                </>
            )}
            {status === EBookingStatus.Pending && (
                <button className="btn btn-secondary" onClick={() => onCancel(booking.id)}>Cancel</button>
            )} 
            {status === EBookingStatus.Completed && (
                <button className="btn btn-primary" onClick={() => onReview(booking.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Review size={18} strokeWidth={2} />Leave Review</button>
            )}
        </div>
    </div>
  );
}

export default OwnerBooking;