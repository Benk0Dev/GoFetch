import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@client/context/AuthContext"
import styles from "@client/pages/DashboardPage/Bookings/Bookings.module.css";
import navigationStyles from "@client/pages/DashboardPage/Navigation.module.css";
import dashboardStyles from "@client/pages/DashboardPage/Dashboard.module.css";
import { BookingStatus, IBooking } from "@gofetch/models/IBooking";
import { Role } from "@gofetch/models/IUser";
import OwnerBooking from "@client/pages/DashboardPage/Bookings/OwnerBooking";
import MinderBooking from "@client/pages/DashboardPage/Bookings/MinderBooking";
import { startChat } from "@client/services/ChatRegistry";
import { getUserById, getUserByIdWithPictures } from "@client/services/UserRegistry";
import { getServiceById } from "@client/services/ServiceRegistry";
import { setBookingStatus } from "@client/services/BookingRegistry";
import { addReviewForUser } from "@client/services/ReviewRegistry";
import { IPet } from "@gofetch/models/IPet";
import CreateReview from "@client/pages/DashboardPage/Bookings/CreateReview";
import { IReview } from "@gofetch/models/IReview";

export interface Booking {
    id: number;
    time: Date;
    status: BookingStatus;
    owner: any;
    minder: any;
    pet: any;
    service: any;
    notes: string;
    reviewed: boolean;
}

function Bookings() {
    const { user, setUser } = useAuth();
    const [status, setStatus] = useState<BookingStatus>(BookingStatus.Confirmed);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            const rawBookings = user.currentRole === Role.OWNER
                ? user.ownerRoleInfo.bookings
                : user.minderRoleInfo.bookings;
    
            const detailedBookings = await Promise.all(
                rawBookings.map(async (booking: IBooking) => {
                    const [owner, minder, service] = await Promise.all([
                        getUserByIdWithPictures(booking.ownerId),
                        getUserById(booking.minderId),
                        getServiceById(booking.serviceId)
                    ]);
    
                    const pet = owner.ownerRoleInfo.pets.find((pet: IPet) => pet.id === booking.petId);

                    const reviewed = minder.minderRoleInfo.reviews.some((review: IReview) => review.bookingId === booking.id);
    
                    return {
                        id: booking.id,
                        time: booking.time,
                        status: booking.status,
                        owner,
                        minder,
                        pet,
                        service,
                        notes: booking.notes,
                        reviewed,
                    };
                })
            );
    
            const sortedBookings = detailedBookings.sort(
                (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
            );
    
            setBookings(sortedBookings);
            setLoading(false);
        };
    
        fetchInfo();
    }, [user]);

    const handleCancel = async (bookingId: number) => {
        const booking = await setBookingStatus(bookingId, BookingStatus.Cancelled);
        if (booking) {
            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleAccept = async (bookingId: number) => {
        const booking = await setBookingStatus(bookingId, BookingStatus.Confirmed);
        if (booking) {
            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleDecline = async (bookingId: number) => {
        const booking = await setBookingStatus(bookingId, BookingStatus.Cancelled);
        if (booking) {
            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleReview = (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setReviewModalOpen(true);
    }

    const handleMessage = async (recipientId: number) => {
        const chat = await startChat(recipientId);
        navigate(`/chats/${chat.id}`);
    }

    const handleComplete = async (bookingId: number) => {
        const booking = await setBookingStatus(bookingId, BookingStatus.Completed);
        if (booking) {
            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to complete booking.");
        }
    }

    async function handleSubmitReview(rating: number, review: string) {
        const revieweeId = bookings.find(b => b.id === selectedBookingId)!.minder.id;

        const reviewInfo: IReview = {
            id: 0,
            rating,
            review,
            date: new Date(),
            reviewerId: user.id,
            revieweeId,
            bookingId: selectedBookingId
        };

        const reviewCreated = await addReviewForUser(revieweeId, reviewInfo);

        if (reviewCreated) {
            bookings.find(b => b.id === selectedBookingId)!.reviewed = true;
            setBookings([...bookings]);
            console.log("Review created successfully.", reviewCreated);
        } else {
            console.error("Failed to create review.");
        }

        setReviewModalOpen(false);
    }

    return (
        <div className={`${dashboardStyles.dashboardSection}`}>
            <h2>Your Bookings</h2>
            <p>View and manage all your bookings.</p>
            <div className={styles.bookingsContainer}>
                <div className={styles.bookingsNavigation + " " + navigationStyles.navigation}>
                    <button
                        className={status === BookingStatus.Confirmed ? navigationStyles.active : ""}
                        onClick={() => setStatus(BookingStatus.Confirmed)}
                    >
                        Upcoming
                    </button>
                    <button
                        className={status === BookingStatus.Pending ? navigationStyles.active : ""}
                        onClick={() => setStatus(BookingStatus.Pending)}
                    >
                        Pending
                    </button>
                    <button
                        className={status === BookingStatus.Completed ? navigationStyles.active : ""}                      onClick={() => setStatus(BookingStatus.Completed)}
                    >
                        Past
                    </button>
                </div>
                <div className={styles.bookingsList}>
                    {loading ? (
                        <p className={styles.emptyState}>You have no {status === BookingStatus.Confirmed ? "upcoming" : status === BookingStatus.Pending ? "pending" : "past"} bookings.</p>
                    ) : (
                        bookings.filter((b: Booking) => b.status === status).length > 0 ? (
                                bookings
                                    .filter((b: Booking) => b.status === status)
                                    .map((booking: Booking) => (
                                        user.currentRole === Role.OWNER ? (
                                            <OwnerBooking key={booking.id} booking={booking} status={status} onCancel={handleCancel} onMessage={handleMessage} onReview={handleReview} />
                                        ) : (
                                            <MinderBooking key={booking.id} booking={booking} status={status} onAccept={handleAccept} onDecline={handleDecline} onMessage={handleMessage} onComplete={handleComplete} />
                                        )
                                        
                                    ))
                                ) : (
                                <p className={styles.emptyState}>You have no {status === BookingStatus.Confirmed ? "upcoming" : status === BookingStatus.Pending ? "pending" : "past"} bookings.</p>
                            ) 
                    )}
                </div>
            </div>
            {reviewModalOpen && (
                <CreateReview 
                    onSubmit={handleSubmitReview}
                    onCancel={() => setReviewModalOpen(false)}
                    minder={bookings.find(b => b.id === selectedBookingId)!.minder}
                />
            )}
        </div>
    );
}

export default Bookings;
