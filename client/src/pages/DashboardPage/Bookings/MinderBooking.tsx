import { EBookingStatus } from "../../../models/IBooking";
import BookingInfo from "./BookingInfo";
import styles from "./Bookings.module.css";
import { Booking } from "./Bookings";
import { MessageSquare, Check } from "lucide-react";

function MinderBooking({ booking, status, onMessage, onAccept, onDecline, onComplete }: { booking: Booking, status: EBookingStatus, onMessage: (bookingId: number) => void, onAccept: (bookingId: number) => void, onDecline: (bookingId: number) => void, onComplete: (bookingId: number) => void }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === EBookingStatus.Confirmed && (
                <>
                    <button className="btn btn-secondary" onClick={() => onMessage(booking.owner.userDetails.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                    <button className="btn btn-primary" onClick={() => onComplete(booking.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Check size={18} strokeWidth={2} />Complete</button>
                </>
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