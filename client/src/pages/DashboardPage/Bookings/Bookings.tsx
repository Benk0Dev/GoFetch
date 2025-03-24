import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Bookings.module.css";
import navigationStyles from "../Navigation.module.css";
import dashboardStyles from "../Dashboard.module.css";
import { EBookingStatus, IBooking } from "../../../models/IBooking";
import { Role } from "../../../models/IUser";
import OwnerBooking from "./OwnerBooking";
import MinderBooking from "./MinderBooking";
import { getUserById, setBookingStatus } from "../../../services/Registry";

function Bookings() {
    const { user, setUser } = useAuth();
    const [status, setStatus] = useState<EBookingStatus>(EBookingStatus.Confirmed);

    const handleCancel = async (bookingId: number) => {
        const booking = await setBookingStatus(bookingId, EBookingStatus.Cancelled);
        if (booking) {
            const updatedUser = await getUserById(user.userDetails.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleAccept = async (bookingId: number) => {
        const booking = await setBookingStatus(bookingId, EBookingStatus.Confirmed);
        if (booking) {
            const updatedUser = await getUserById(user.userDetails.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleDecline = async (bookingId: number) => {
        const booking = await setBookingStatus(bookingId, EBookingStatus.Cancelled);
        if (booking) {
            const updatedUser = await getUserById(user.userDetails.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleReview = (bookingId: number) => {
        console.log("Review booking", bookingId);
        // Open review modal
    }

    const handleMessage = (bookingId: number) => {
        console.log("Message user", bookingId);
        // Open chat with user
    }

    return (
        <div className={`${dashboardStyles.dashboardSection}`}>
            <h2>Your Bookings</h2>
            <p>View and manage all your bookings.</p>
            <div className={styles.bookingsContainer}>
                <div className={styles.bookingsNavigation + " " + navigationStyles.navigation}>
                    <button
                        className={status === EBookingStatus.Confirmed ? navigationStyles.active : ""}
                        onClick={() => setStatus(EBookingStatus.Confirmed)}
                    >
                        Upcoming
                    </button>
                    <button
                        className={status === EBookingStatus.Pending ? navigationStyles.active : ""}
                        onClick={() => setStatus(EBookingStatus.Pending)}
                    >
                        Pending
                    </button>
                    <button
                        className={status === EBookingStatus.Completed ? navigationStyles.active : ""}                      onClick={() => setStatus(EBookingStatus.Completed)}
                    >
                        Past
                    </button>
                </div>
                <div className={styles.bookingsList}>
                    {user.currentRole === Role.OWNER ? (
                        user.ownerRoleInfo.bookings.filter((b: IBooking) => b.status === status).length > 0 ? (
                        user.ownerRoleInfo.bookings
                            .filter((b: IBooking) => b.status === status)
                            .map((booking: IBooking) => (
                                <OwnerBooking key={booking.id} booking={booking} status={status} onCancel={handleCancel} onMessage={handleMessage} onReview={handleReview} />
                            ))
                        ) : (
                        <p className={styles.emptyState}>You have no {status === EBookingStatus.Confirmed ? "upcoming" : status === EBookingStatus.Pending ? "pending" : "past"} bookings.</p>
                        )
                    ) : user.minderRoleInfo.bookings.filter((b: IBooking) => b.status === status).length > 0 ? (
                        user.minderRoleInfo.bookings
                        .filter((b: IBooking) => b.status === status)
                        .map((booking: IBooking) => (
                            <MinderBooking key={booking.id} booking={booking} status={status} onAccept={handleAccept} onDecline={handleDecline} onMessage={handleMessage} />
                        ))
                    ) : (
                        <p className={styles.emptyState}>You have no {status === EBookingStatus.Confirmed ? "upcoming" : status === EBookingStatus.Pending ? "pending" : "past"} bookings.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Bookings;
