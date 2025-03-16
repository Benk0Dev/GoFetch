import { useState } from "react";
import styles from "./Bookings.module.css";

interface Booking {
    id: number;
    petName: string;
    date: string;
    status: "Pending" | "Confirmed" | "Completed";
}

function Bookings() {
    const [bookings, setBookings] = useState<Booking[]>([
        { id: 1, petName: "Bella", date: "Tomorrow 10AM", status: "Pending" },
        { id: 2, petName: "Max", date: "Friday 6PM", status: "Confirmed" }
    ]);

    const updateStatus = (id: number, newStatus: Booking["status"]) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div className={styles.bookings}>
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
