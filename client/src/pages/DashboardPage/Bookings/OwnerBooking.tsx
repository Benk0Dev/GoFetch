import { BookingStatus } from "@gofetch/models/IBooking";
import BookingInfo from "@client/pages/DashboardPage/Bookings/BookingInfo";
import styles from "@client/pages/DashboardPage/Bookings/Bookings.module.css";
import { Booking } from "@client/pages/DashboardPage/Bookings/Bookings";
import { MessageSquare, MessageSquareText as Review, Check } from "lucide-react";

function OwnerBooking({ booking, status, onMessage, onCancel, onReview, onComplete }: { booking: Booking, status: BookingStatus, onMessage: (recipientId: number) => void, onCancel: (booking: Booking) => void, onReview: (booking: Booking) => void, onComplete: (booking: Booking) => void }) {
  return (
    <div className={styles.booking}>
        <BookingInfo booking={booking} />
        <div className={styles.bookingActions}>
            {status === BookingStatus.InProgress && (
                <>
                    <button className="btn btn-secondary" onClick={() => onMessage(booking.owner.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                    {booking.ownerCompleted && !booking.minderCompleted && (
                        <button className="btn btn-primary" style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}} disabled={true}>Pending Confirmation</button>
                    )}
                    {!booking.ownerCompleted && (
                        <button className="btn btn-primary" onClick={() => onComplete(booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Check size={18} strokeWidth={2} />Complete</button>
                    )}
                </>
            )}
            {status === BookingStatus.Confirmed && (
                <>
                    <button className="btn btn-secondary" onClick={() => onMessage(booking.minder.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                    <button className="btn btn-secondary" onClick={() => onCancel(booking)}>Cancel</button>
                </>
            )}
            {status === BookingStatus.Pending && (
                <button className="btn btn-secondary" onClick={() => onCancel(booking)}>Cancel</button>
            )} 
            {status === BookingStatus.Completed && !booking.reviewed && (
                <button className="btn btn-primary" onClick={() => onReview(booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Review size={18} strokeWidth={2} />Leave Review</button>
            )}
        </div>
    </div>
  );
}

export default OwnerBooking;