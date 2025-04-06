import { BookingStatus } from "@gofetch/models/IBooking";
import styles from "@client/pages/DashboardPage/Bookings/Bookings.module.css";
import { Booking } from "@client/pages/DashboardPage/Bookings/Bookings";
import { MessageSquare, MessageSquareText as Review, Check } from "lucide-react";
import { useAuth } from "@client/context/AuthContext";

function BookingActions({ booking, status, onMessage, onAccept, onDecline, onCancel, onReview, onComplete, extraMargin=false }: { booking: Booking, status: BookingStatus, onMessage: (e: React.MouseEvent, recipientId: number) => void, onAccept: (e: React.MouseEvent, booking: Booking) => void, onDecline: (e: React.MouseEvent, booking: Booking) => void, onCancel: (e: React.MouseEvent, booking: Booking) => void, onReview: (e: React.MouseEvent, booking: Booking) => void, onComplete: (e: React.MouseEvent, booking: Booking) => void, extraMargin?: boolean }) {
    const { user } = useAuth();

    return (
        <div className={styles.bookingActions} style={extraMargin ? {marginTop: "10px"} : {}}>
            {user.id === booking.owner.id && (
                <>
                    {status === BookingStatus.InProgress && (
                        <>
                            <button className="btn btn-secondary" onClick={(e) => onMessage(e, booking.owner.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                            {booking.ownerCompleted && !booking.minderCompleted && (
                                <button className="btn btn-primary" style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}} disabled={true}>Pending Confirmation</button>
                            )}
                            {!booking.ownerCompleted && (
                                <button className="btn btn-primary" onClick={(e) => onComplete(e, booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Check size={18} strokeWidth={2} />Complete</button>
                            )}
                        </>
                    )}
                    {status === BookingStatus.Confirmed && (
                        <>
                            <button className="btn btn-secondary" onClick={(e) => onMessage(e, booking.minder.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                            <button className="btn btn-secondary" onClick={(e) => onCancel(e, booking)}>Cancel</button>
                        </>
                    )}
                    {status === BookingStatus.Pending && (
                        <button className="btn btn-secondary" onClick={(e) => onCancel(e, booking)}>Cancel</button>
                    )} 
                    {status === BookingStatus.Completed && !booking.reviewed && (
                        <button className="btn btn-primary" onClick={(e) => onReview(e, booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Review size={18} strokeWidth={2} />Leave Review</button>
                    )}
                </>
            )}
            {user.id === booking.minder.id && (
                <>
                    {status === BookingStatus.InProgress && (
                        <>
                            <button className="btn btn-secondary" onClick={(e) => onMessage(e, booking.owner.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                            {booking.minderCompleted && !booking.ownerCompleted && (
                                <button className="btn btn-primary" style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}} disabled={true}>Pending Confirmation</button>
                            )}
                            {!booking.minderCompleted && (
                                <button className="btn btn-primary" onClick={(e) => onComplete(e, booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><Check size={18} strokeWidth={2} />Complete</button>
                            )}
                        </>
                    )}
                    {status === BookingStatus.Confirmed && (
                        <>
                            <button className="btn btn-secondary" onClick={(e) => onMessage(e, booking.owner.id)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}><MessageSquare size={18} strokeWidth={2} />Message</button>
                            <button className="btn btn-primary" onClick={(e) => onCancel(e, booking)} style={{display: "flex", alignContent: "center", columnGap: "5px", justifyContent: "center"}}>Cancel</button>
                        </>
                    )}
                    {status === BookingStatus.Pending && (
                        <>
                            <button className="btn btn-primary" onClick={(e) => onAccept(e, booking)}>Accept</button>
                            <button className="btn btn-secondary" onClick={(e) => onDecline(e, booking)}>Decline</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default BookingActions;