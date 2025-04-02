import { PawPrint, Calendar, Star, Briefcase, UserRound, Flag } from "lucide-react";
import { useAuth } from "@client/context/AuthContext";
import styles from "@client/pages/DashboardPage/Home/Home.module.css";
import dashboardStyles from "@client/pages/DashboardPage/Dashboard.module.css";
import { Role } from "@gofetch/models/IUser";
import Statistic from "@client/pages/DashboardPage/Home/Statistic";
import { BookingStatus, IBooking } from "@gofetch/models/IBooking";
import { useEffect, useState } from "react";
import { IReport } from "@gofetch/models/IReport";
import { getAllReports } from "@client/services/ReportRegistry";

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

    // Some of this code should be moved elsewhere
    const [reports, setReports] = useState<IReport[]>([]);
    
        useEffect(() => {
            const loadReports = async () => {
                try {
                    const data = await getAllReports();
                    setReports(data);
                } catch (error) {
                    console.error("Failed to load reports:", error);
                } 
            }
            loadReports();
        }, []);
    

    return (
        <div className={dashboardStyles.dashboardSection}>
            <h2>Hello, {fname}!</h2>
            {role === Role.ADMIN ? <p>An overview of the system.</p> : <p>An overview of your account.</p>}
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
                            value={parseFloat(rating).toFixed(1)} 
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

                {role === Role.ADMIN && (
                    <>
                        <Statistic 
                            title="Total Users" 
                            value={"0"} 
                            icon={<UserRound size={18} strokeWidth={2} />} 
                        />
                        <Statistic 
                            title="Reports" 
                            value={reports.length.toString()} 
                            icon={<Flag size={18} strokeWidth={2} />} 
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
