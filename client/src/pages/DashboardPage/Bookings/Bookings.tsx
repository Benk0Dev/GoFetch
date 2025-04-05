import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { minderCompleted, ownerCompleted, setBookingStatus } from "@client/services/BookingRegistry";
import { addReviewForUser } from "@client/services/ReviewRegistry";
import { IPet } from "@gofetch/models/IPet";
import CreateReview from "@client/pages/DashboardPage/Bookings/CreateReview";
import { IReview } from "@gofetch/models/IReview";
import { createNotification } from "@client/services/NotificationRegistry";
import { NotificationType } from "@gofetch/models/INotification";

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
    ownerCompleted: boolean;
    minderCompleted: boolean;
}

function Bookings() {
    const { user, setUser } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const navigate = useNavigate();
    let { status } = useParams<{ status: string }>();
    status = status === "in-progress" ? BookingStatus.InProgress : status === "upcoming" ? BookingStatus.Confirmed : status === "pending" ? BookingStatus.Pending : BookingStatus.Completed;

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
                        ownerCompleted: booking.ownerCompleted,
                        minderCompleted: booking.minderCompleted
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

    const handleCancel = async (booking: Booking) => {
        const updatedBooking = await setBookingStatus(booking.id, BookingStatus.Cancelled);
        if (updatedBooking) {
            await createNotification({
                userId: user.id === booking.owner.id ? booking.minder.id : booking.owner.id,
                message: `${user.name.fname} ${user.name.sname} has cancelled a booking`,
                type: NotificationType.BookingCancelled,
                linkId: booking.id
            })

            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleAccept = async (booking: Booking) => {
        const updatedBooking = await setBookingStatus(booking.id, BookingStatus.Confirmed);
        if (updatedBooking) {
            await createNotification({
                userId: booking.owner.id,
                message: `${user.name.fname} ${user.name.sname} has accepted a booking`,
                type: NotificationType.BookingAccepted,
                linkId: booking.id
            })

            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleDecline = async (booking: Booking) => {
        const updatedBooking = await setBookingStatus(booking.id, BookingStatus.Cancelled);
        if (updatedBooking) {
            await createNotification({
                userId: booking.owner.id,
                message: `${user.name.fname} ${user.name.sname} has declined a booking`,
                type: NotificationType.BookingDeclined,
                linkId: booking.id
            })

            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleReview = (booking: Booking) => {
        setSelectedBooking(booking);
        setReviewModalOpen(true);
    }

    const handleMessage = async (recipientId: number) => {
        const chat = await startChat(recipientId);
        navigate(`/chats/${chat.id}`);
    }

    const handleComplete = async (booking: Booking) => {
        let updatedBooking;
        user.currentRole === Role.OWNER ? updatedBooking = await ownerCompleted(booking.id) : updatedBooking = await minderCompleted(booking.id);

        if (!updatedBooking) {
            console.error("Failed to complete booking.");
            return;
        }

        if (updatedBooking.ownerCompleted && updatedBooking.minderCompleted) {
            await createNotification({
                userId: user.id === booking.owner.id ? booking.minder.id : booking.owner.id,
                message: `A booking with ${user.name.fname} ${user.name.sname} has been confirmed completed`,
                type: NotificationType.BookingCompleted,
                linkId: booking.id
            });

            const completedBooking = await setBookingStatus(booking.id, BookingStatus.Completed);
            if (!completedBooking) {
                console.error("Failed to complete booking.");
                return;
            }
        } else {
            await createNotification({
                userId: user.id === booking.owner.id ? booking.minder.id : booking.owner.id,
                message: `${user.name.fname} ${user.name.sname} has requested to set a booking to complete`,
                type: NotificationType.BookingCompleteRequest,
                linkId: booking.id
            });
        }

        const updatedUser = await getUserByIdWithPictures(user.id);
        setUser(updatedUser);
    }

    async function handleSubmitReview(rating: number, review: string) {
        if (!selectedBooking) {
            console.error("No booking selected.");
            return;
        }

        const revieweeId = selectedBooking.minder.id;

        const reviewInfo: IReview = {
            id: 0,
            rating,
            review,
            date: new Date(),
            reviewerId: user.id,
            revieweeId,
            bookingId: selectedBooking.id,
        };

        const reviewCreated = await addReviewForUser(revieweeId, reviewInfo);

        if (reviewCreated) {
            await createNotification({
                userId: revieweeId,
                message: `${user.name.fname} ${user.name.sname} has left a review`,
                type: NotificationType.Review,
                linkId: reviewCreated.id
            });

            selectedBooking.reviewed = true;
            setBookings([...bookings]);
            console.log("Review created successfully.", reviewCreated);
        } else {
            console.error("Failed to create review.");
        }

        setReviewModalOpen(false);
    }

    const noBookingsMessage = () => {
        switch (status) {
            case BookingStatus.InProgress:
                return "You have no bookings in progress.";
            case BookingStatus.Confirmed:
                return "You have no upcoming bookings.";
            case BookingStatus.Pending:
                return "You have no pending bookings.";
            case BookingStatus.Completed:
                return "You have no past bookings.";
            default:
                return "";
        }
    }

    return (
        <div className={`${dashboardStyles.dashboardSection}`}>
            <h2>Your Bookings</h2>
            <p>View and manage all your bookings.</p>
            <div className={styles.bookingsContainer}>
                <div className={styles.bookingsNavigation + " " + navigationStyles.navigation}>
                    <button
                        className={status === BookingStatus.InProgress ? navigationStyles.active : ""}
                        onClick={() => navigate("/dashboard/bookings/in-progress")}
                    >
                        In Progress
                    </button>
                    <button
                        className={status === BookingStatus.Confirmed ? navigationStyles.active : ""}
                        onClick={() => navigate("/dashboard/bookings/upcoming")}
                    >
                        Upcoming
                    </button>
                    <button
                        className={status === BookingStatus.Pending ? navigationStyles.active : ""}
                        onClick={() => navigate("/dashboard/bookings/pending")}
                    >
                        Pending
                    </button>
                    <button
                        className={status === BookingStatus.Completed ? navigationStyles.active : ""}                      
                        onClick={() => navigate("/dashboard/bookings/past")}
                    >
                        Past
                    </button>
                </div>
                <div className={styles.bookingsList}>
                    {loading ? (
                        <p className={styles.emptyState}>{noBookingsMessage()}</p>
                    ) : (
                        bookings.filter((b: Booking) => b.status === status).length > 0 ? (
                                bookings
                                    .filter((b: Booking) => b.status === status)
                                    .map((booking: Booking) => (
                                        user.currentRole === Role.OWNER ? (
                                            <OwnerBooking key={booking.id} booking={booking} status={status as BookingStatus} onCancel={handleCancel} onMessage={handleMessage} onReview={handleReview} onComplete={handleComplete} />
                                        ) : (
                                            <MinderBooking key={booking.id} booking={booking} status={status as BookingStatus} onAccept={handleAccept} onDecline={handleDecline} onMessage={handleMessage} onComplete={handleComplete} onCancel={handleCancel} />
                                        )
                                        
                                    ))
                                ) : (
                                <p className={styles.emptyState}>{noBookingsMessage()}</p>
                            ) 
                    )}
                </div>
            </div>
            {reviewModalOpen && (
                <CreateReview 
                    onSubmit={handleSubmitReview}
                    onCancel={() => setReviewModalOpen(false)}
                    minder={selectedBooking?.minder}
                />
            )}
        </div>
    );
}

export default Bookings;
