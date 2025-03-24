import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Bookings.module.css";
import dashboardStyles from "../Dashboard.module.css";

interface Booking {
    id: number;
    petName: string;
    date: string;
    status: "Pending" | "Confirmed" | "Completed";
}

function Bookings() {
    const { user, setUser } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        // Mock load from user object (when integrated with backend, this would come from API)
        if (user?.bookings) {
            setBookings(user.bookings);
        } else {
            setBookings([
                { id: 1, petName: "Bella", date: "Tomorrow 10AM", status: "Pending" },
                { id: 2, petName: "Max", date: "Friday 6PM", status: "Confirmed" }
            ]);
        }
    }, [user]);

    const updateStatus = (id: number, newStatus: Booking["status"]) => {
        const updated = bookings.map(b =>
            b.id === id ? { ...b, status: newStatus } : b
        );

        setBookings(updated);

        // Update global user object to reflect the new booking status
        setUser({
            ...user,
            bookings: updated
        });
    };

    if (!user) return null;

    return (
        <div className={`${dashboardStyles.dashboardSection} ${styles.bookings}`}>
            <h2>Manage Bookings</h2>
            <ul>
                {bookings.map((booking) => (
                    <li key={booking.id}>
                        {booking.petName} - {booking.date} ({booking.status})
                        {booking.status === "Pending" && (
                            <>
                                <button onClick={() => updateStatus(booking.id, "Confirmed")}>Accept</button>
                                <button onClick={() => updateStatus(booking.id, "Completed")}>Complete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Bookings;
