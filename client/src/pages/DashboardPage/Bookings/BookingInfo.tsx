import { Calendar, Clock, MapPin, PawPrint, ArrowRight } from "lucide-react";
import styles from "@client/pages/DashboardPage/Bookings/Bookings.module.css";
import { useAuth } from "@client/context/AuthContext";
import { Role } from "@gofetch/models/IUser";
import { Booking } from "@client/pages/DashboardPage/Bookings/Bookings";

function BookingInfo({ booking }: { booking: Booking }) {
    const { user } = useAuth();

    const getFullName = (user: any) => {
        return `${user.name.fname} ${user.name.sname}`;
    }

    return (
        <div className={styles.bookingInfo}>
            <div className={styles.bookingHeading}>
                <h5 style={{display: "flex", alignItems: "center", gap: "5px"}}>{booking.service.type} {user.currentRole === Role.OWNER ? `with ${getFullName(booking.minder)}` : `for ${getFullName(booking.owner)}`}<ArrowRight size={20} strokeWidth={3.5} className={styles.arrow} /></h5>
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
                <span>{user.currentRole === Role.OWNER ? booking.minder.primaryUserInfo.address.city : booking.owner.primaryUserInfo.address.city}</span>
            </div>
            <div className={styles.bookingDetail}>
                <PawPrint size={16} strokeWidth={2} />
                <span>{booking.pet.name}</span>
            </div>
        </div>
    )
}

export default BookingInfo;