import { MessageSquare, Check } from "lucide-react";
import { BookingStatus } from "@gofetch/models/IBooking";
import BookingInfo from "@client/pages/DashboardPage/Bookings/BookingInfo";
import styles from "@client/pages/DashboardPage/Bookings/Bookings.module.css";
import { Booking } from "@client/pages/DashboardPage/Bookings/Bookings";

function MinderBooking({ booking, status, onMessage, onAccept, onDecline, onComplete, onCancel }: { booking: Booking, status: BookingStatus, onMessage: (recipientId: number) => void, onAccept: (booking: Booking) => void, onDecline: (booking: Booking) => void, onComplete: (booking: Booking) => void, onCancel: (booking: Booking) => void }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === BookingStatus.InProgress && (
                <>
                    <button className="btn btn-secondary" onClick={() => onMessage(booking.owner.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                    {booking.minderCompleted && !booking.ownerCompleted && (
                        <button className="btn btn-primary" style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}} disabled={true}>Pending Confirmation</button>
                    )}
                    {!booking.minderCompleted && (
                        <button className="btn btn-primary" onClick={() => onComplete(booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Check size={18} strokeWidth={2} />Complete</button>
                    )}
                </>
            )}
            {status === BookingStatus.Confirmed && (
                <>
                    <button className="btn btn-secondary" onClick={() => onMessage(booking.owner.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                    <button className="btn btn-primary" onClick={() => onCancel(booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}>Cancel</button>
                </>
            )}
            {status === BookingStatus.Pending && (
                <>
                    <button className="btn btn-primary" onClick={() => onAccept(booking)}>Accept</button>
                    <button className="btn btn-secondary" onClick={() => onDecline(booking)}>Decline</button>
                </>
            )}
        </div>
    </div>
  );

}

export default MinderBooking;