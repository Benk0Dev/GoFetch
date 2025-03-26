import styles from "./Bookings.module.css";
import { useAuth } from "../../../context/AuthContext";
import { Calendar, Clock, MapPin, PawPrint, ArrowDown, UserRound, NotebookPen, User } from "lucide-react";
import { Role } from "../../../models/IUser";
import { Booking } from "./Bookings";
import { useState } from "react";
import { EGender } from "../../../models/IPet";

function BookingInfo({ booking }: { booking: Booking }) {
    const { user } = useAuth();
    const [showDetails, setShowDetails] = useState(false);

    const getFullName = (user: any) => {
        return `${user.userDetails.fname} ${user.userDetails.sname}`;
    }

    const getAge = (dob: Date) => {
        const diff = new Date().getTime() - new Date(dob).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
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
                <span>{booking.pet.name}</span>
            </div>
            {user.currentRole === Role.MINDER && (
                <>
                    <button className={`btn-link ${styles.bookingDetail} ${styles.moreDetailsButton}`} onClick={() => setShowDetails(prev => !prev)}>
                    {showDetails ? (
                        <>
                            <ArrowDown size={16} strokeWidth={2} style={{ transform: "rotate(-180deg)" }} />
                            <span>Hide Details</span>
                        </>
                    ) : (
                        <>
                            <ArrowDown size={16} strokeWidth={2} />
                            <span>Show Details</span>
                        </>
                    )}
                    </button>
                    {showDetails && (
                        <div className={styles.moreDetails}>
                            <div className={styles.ownerPetInfo}>
                                <div className={styles.infoSection}>
                                    <div className={styles.bookingDetail}>
                                        <UserRound size={16} strokeWidth={2} />
                                        <span>{booking.owner.userDetails.fname}</span>
                                    </div>
                                    <div className={styles.section}>
                                        <img src={booking.owner.primaryUserInfo.profilePic} alt={getFullName(booking.owner)} />
                                    </div>
                                </div>
                                <div className={styles.infoSection}>
                                    <div className={styles.bookingDetail}>
                                        <PawPrint size={16} strokeWidth={2} />
                                        <span>{booking.pet.name}</span>
                                    </div>
                                    <div className={`${styles.section} ${styles.petInfo}`}>
                                        <div className={styles.double}>
                                            <img src={booking.pet.picture} alt={booking.pet.name} />
                                            <div className={styles.petInfoShort}>
                                                <span className={styles.petTitle}>{booking.pet.breed}</span>
                                                <span className={styles.petTitle}>{getAge(booking.pet.dob)} years old</span>
                                                <span className={styles.petTitle}>{booking.pet.gender === EGender.MALE ? "Male" : "Female"}</span>
                                                <span className={styles.petTitle}>{booking.pet.size}</span>
                                                <span  className={styles.petTitle} style={{width: "max-content"}}>{booking.pet.neutered ? "" : "Not "}Neutered/Sprayed</span>
                                            </div>
                                        </div>
                                        <div className={styles.petInfoLong}>
                                            <span className={styles.petTitle}>Behaviour</span>
                                            <span style={{marginBottom: "5px"}}>{booking.pet.behaviour ? booking.pet.behaviour : "N/A"}</span>
                                            <span className={styles.petTitle}>Allergies</span>
                                            <span>{booking.pet.allergies ? booking.pet.allergies : "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.infoSection}>
                                <div className={styles.bookingDetail}>
                                    <NotebookPen size={16} strokeWidth={2} />
                                    <span>Notes</span>
                                </div>
                                <div className={styles.section}>
                                    <span>{booking.notes ? booking.notes : "No notes."}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default BookingInfo;