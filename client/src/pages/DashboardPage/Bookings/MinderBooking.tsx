import { MessageSquare, Check } from "lucide-react";
import { BookingStatus } from "@gofetch/models/IBooking";
import BookingInfo from "@client/pages/DashboardPage/Bookings/BookingInfo";
import styles from "@client/pages/DashboardPage/Bookings/Bookings.module.css";
import { Booking } from "@client/pages/DashboardPage/Bookings/Bookings";

function MinderBooking({ booking, status, onMessage, onAccept, onDecline, onComplete }: { booking: Booking, status: BookingStatus, onMessage: (bookingId: number) => void, onAccept: (bookingId: number) => void, onDecline: (bookingId: number) => void, onComplete: (bookingId: number) => void }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === BookingStatus.Confirmed && (
                <>
                    <button className="btn btn-secondary" onClick={() => onMessage(booking.owner.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                    <button className="btn btn-primary" onClick={() => onComplete(booking.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Check size={18} strokeWidth={2} />Complete</button>
                </>
            )}
            {status === BookingStatus.Pending && (
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