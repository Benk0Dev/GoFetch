import { useAuth } from "../../../context/AuthContext";
import styles from "./Home.module.css";
import dashboardStyles from "../Dashboard.module.css";
import { Role } from "../../../models/IUser";
import Statistic from "./Statistic";
import { PawPrint, Calendar, Star, Briefcase } from "lucide-react";
import { BookingStatus, IBooking } from "../../../models/IBooking";

function Home() {
    const { user, role } = useAuth();
    const fname = user.name.fname;

    const isOwner = user.roles.includes(Role.OWNER);
    const isMinder = user.roles.includes(Role.MINDER);

    const upcomingOwnerBookings = user.ownerRoleInfo.bookings.filter((booking: IBooking) => booking.status === BookingStatus.Confirmed).length;
    const petCount = user.ownerRoleInfo.pets.length;
    const upcomingMinderBookings = user.minderRoleInfo.bookings.filter((booking: IBooking) => booking.status === BookingStatus.Confirmed).length;
    const minderBookingRequests = user.minderRoleInfo.bookings.filter((booking: IBooking) => booking.status === BookingStatus.Pending).length;
    const serviceCount = user.minderRoleInfo?.services?.length;
    const rating = user.minderRoleInfo?.rating?.toFixed(1) || "N/A";

    return (
        <div className={dashboardStyles.dashboardSection}>
            <h2>Hello, {fname}!</h2>
            <p>An overview of your account.</p>
            <div className={styles.statsGrid}>

                {role === Role.OWNER && (
                    <>
                        <Statistic 
                            title="Pets" 
                            value={petCount.toString()} 
                            icon={<PawPrint size={18} strokeWidth={2} />} 
                        />
                        <Statistic 
                            title="Upcoming Bookings" 
                            value={upcomingOwnerBookings.toString()} 
                            icon={<Calendar size={18} strokeWidth={2} />} 
                        />
                    </>
                )}

                {role === Role.MINDER && (
                    <>
                        <Statistic 
                            title="Services Listed" 
                            value={serviceCount.toString()} 
                            icon={<Briefcase size={18} strokeWidth={2} />} 
                        />
                        <Statistic 
                            title="Rating" 
                            value={rating} 
                            icon={<Star size={18} strokeWidth={2} />} 
                        />
                        <Statistic 
                            title="Upcoming Bookings" 
                            value={upcomingMinderBookings.toString()} 
                            icon={<Calendar size={18} strokeWidth={2} />} 
                        />
                        <Statistic 
                            title="Booking Requests" 
                            value={minderBookingRequests.toString()} 
                            icon={<Calendar size={18} strokeWidth={2} />} 
                        />
                    </>
                )}
            </div>

            {isOwner && isMinder && (
                <div className={styles.note}>
                    <p>You’re currently viewing the <strong>{role === Role.MINDER ? "Pet Minder" : "Pet Owner"}</strong> dashboard.</p>
                    <p>Switch roles anytime from the profile menu.</p>
                </div>
            )}
        </div>
    );
}

export default Home;
