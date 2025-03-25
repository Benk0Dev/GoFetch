import styles from "./Bookings.module.css";
import { useAuth } from "../../../context/AuthContext";
import { Calendar, Clock, MapPin, PawPrint } from "lucide-react";
import { Role } from "../../../models/IUser";
import { Booking } from "./Bookings";

function BookingInfo({ booking }: { booking: Booking }) {
    const { user } = useAuth();

    const getFullName = (user: any) => {
        return `${user.userDetails.fname} ${user.userDetails.sname}`;
    }

    return (
        <div className={styles.bookingInfo}>
            <div className={styles.bookingHeading}>
                <h5>{booking.service.type} {user.currentRole === Role.OWNER ? "with " + getFullName(booking.minder) : "for " + getFullName(booking.owner)}</h5>
                <h5>£{booking.service.price}</h5>
            </div>
            <div className={styles.bookingDetail}>
                <Calendar size={16} strokeWidth={2} />
                <span>{new Date(booking.time).toLocaleDateString()}</span>
            </div>
            <div className={styles.bookingDetail}>
                <Clock size={16} strokeWidth={2} />
                <span>{new Date(booking.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className={styles.bookingDetail}>
                <MapPin size={16} strokeWidth={2} />
                <span>{user.currentRole === Role.OWNER ? booking.minder.primaryUserInfo.location.name : booking.owner.primaryUserInfo.location.name}</span>
            </div>
            <div className={styles.bookingDetail}>
                <PawPrint size={16} strokeWidth={2} />
                <span>{booking.pet.name} ({booking.pet.breed})</span>
            </div>
        </div>
    )
}

export default BookingInfo;