import styles from "./Bookings.module.css";
import { IBooking } from "../../../models/IBooking";
import { useAuth } from "../../../context/AuthContext";
import { Calendar, Clock, MapPin, PawPrint, PoundSterling } from "lucide-react";
import { useEffect, useState } from "react";
import { getServiceById, getUserById } from "../../../services/Registry";
import { IService } from "../../../models/IService";
import { Role } from "../../../models/IUser";
import { IPet } from "../../../models/IPet";

function BookingInfo({ booking }: { booking: IBooking }) {
    const { user } = useAuth();
    const [service, setService] = useState<IService | null>(null);
    const [owner, setOwner] = useState<any>(null);
    const [minder, setMinder] = useState<any>(null);
    const [pet, setPet] = useState<IPet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            const [service, owner, minder] = await Promise.all([
                getServiceById(booking.serviceId),
                getUserById(booking.ownerId),
                getUserById(booking.minderId)
            ]);
            setService(service);
            setOwner(owner);
            setMinder(minder);
            setPet(owner.ownerRoleInfo.pets.find((pet: IPet) => pet.id === booking.petId));
            setLoading(false);
        }
        fetchService();
    }, []);

    const getFullName = (user: any) => {
        return `${user.userDetails.fname} ${user.userDetails.sname}`;
    }

    if (loading || !service) {
        return null;
    }

    return (
        <div className={styles.bookingInfo}>
            <div className={styles.bookingHeading}>
                <h5>{service.type} {user.currentRole === Role.OWNER ? "with " + getFullName(minder) : "for " + getFullName(owner)}</h5>
                <h5>£{service.price}</h5>
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
                <span>{user.currentRole === Role.OWNER ? minder.primaryUserInfo.location.name : owner.primaryUserInfo.location.name}</span>
            </div>
            <div className={styles.bookingDetail}>
                <PawPrint size={16} strokeWidth={2} />
                <span>{pet?.name} ({pet?.breed})</span>
            </div>
        </div>
    )
}

export default BookingInfo;