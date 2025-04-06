import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@client/context/AuthContext"
import styles from "@client/pages/DashboardPage/Bookings/Bookings.module.css";
import detailsStyles from "@client/pages/DashboardPage/Bookings/BookingDetails.module.css";
import navigationStyles from "@client/pages/DashboardPage/Navigation.module.css";
import dashboardStyles from "@client/pages/DashboardPage/Dashboard.module.css";
import { BookingStatus, IBooking } from "@gofetch/models/IBooking";
import { Role } from "@gofetch/models/IUser";
import { startChat } from "@client/services/ChatRegistry";
import { getUserByIdWithPictures } from "@client/services/UserRegistry";
import { getServiceById } from "@client/services/ServiceRegistry";
import { minderCompleted, ownerCompleted, setBookingStatus } from "@client/services/BookingRegistry";
import { addReviewForUser } from "@client/services/ReviewRegistry";
import { IPet } from "@gofetch/models/IPet";
import CreateReview from "@client/pages/DashboardPage/Bookings/CreateReview";
import { IReview } from "@gofetch/models/IReview";
import { createNotification } from "@client/services/NotificationRegistry";
import { NotificationType } from "@gofetch/models/INotification";
import { updatePaymentStatus, getPaymentByBookingId } from "@client/services/PaymentRegistry";
import { Status } from "@gofetch/models/IPayment";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import BookingInfo from "./BookingInfo";
import BookingActions from "./ BookingActions";

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
    const [status, setStatus] = useState<BookingStatus | null>(BookingStatus.InProgress);
    const [bookingId, setBookingId] = useState<number>(0);
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const navigate = useNavigate();
    const { extension } = useParams<{ extension: string }>();

    useEffect(() => {
        const statuses = ["in-progress", "upcoming", "pending", "past"];
        if (statuses.includes(extension as string)) {
            switch (extension) {
                case "in-progress":
                    setStatus(BookingStatus.InProgress);
                    break;
                case "upcoming":
                    setStatus(BookingStatus.Confirmed);
                    break;
                case "pending":
                    setStatus(BookingStatus.Pending);
                    break;
                case "past":
                    setStatus(BookingStatus.Completed);
                    break;
                default:
                    break;
            }
            setBookingId(0);
        } else if (!isNaN(Number(extension as string))) {
            setBookingId(Number(extension));
            setStatus(null);
        } else {
            navigate("/dashboard/bookings");
        }
    }, [extension, navigate]);

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);

            const rawBookings = [...user.ownerRoleInfo.bookings, ...user.minderRoleInfo.bookings];
    
            const detailedBookings = await Promise.all(
                rawBookings.map(async (booking: IBooking) => {
                    const [owner, minder, service] = await Promise.all([
                        getUserByIdWithPictures(booking.ownerId),
                        getUserByIdWithPictures(booking.minderId),
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
                        notes: booking.notes || "",
                        reviewed,
                        ownerCompleted: booking.ownerCompleted,
                        minderCompleted: booking.minderCompleted
                    };
                })
            );
    
            const sortedBookings = detailedBookings.sort(
                (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
            );
    
            setAllBookings(sortedBookings);
            setLoading(false);

            if (bookingId && sortedBookings.filter((booking: Booking) => booking.id === bookingId).length === 0) {
                navigate("/dashboard/bookings");
            }
        };
    
        fetchInfo();
    }, [user]);

    useEffect(() => {
        if (allBookings.length === 0) return;
        if (status) {
            if (status === BookingStatus.Completed) {
                setBookings(allBookings.filter((booking: Booking) => booking.status === status && (user.currentRole === Role.OWNER ? booking.owner.id === user.id : booking.minder.id === user.id)).reverse());
            } else {
                setBookings(allBookings.filter((booking: Booking) => booking.status === status && (user.currentRole === Role.OWNER ? booking.owner.id === user.id : booking.minder.id === user.id)));
            }
        } else if (bookingId) {
            setBookings(allBookings.filter((booking: Booking) => booking.id === bookingId));
        }
    }, [allBookings, bookingId, status]);

    const handleCancel = async (e: React.MouseEvent, booking: Booking) => {
        e.stopPropagation();
        const updatedBooking = await setBookingStatus(booking.id, BookingStatus.Cancelled);
        if (updatedBooking) {
            const payment = await getPaymentByBookingId(booking.id);
            await updatePaymentStatus(payment.id, Status.REFUNDED);

            if (user.currentRole === Role.OWNER) {
                await createNotification({
                    userId: booking.minder.id,
                    message: `${user.name.fname} ${user.name.sname} has cancelled booking #${booking.id}.`,
                    type: NotificationType.Booking,
                    linkId: booking.id
                })
                await createNotification({
                    userId: booking.owner.id,
                    message: `You have received a refund of £${payment.amount}.`,
                    type: NotificationType.Booking,
                    linkId: booking.id
                })
            } else {
                await createNotification({
                    userId: booking.owner.id,
                    message: `${user.name.fname} ${user.name.sname} has cancelled booking #${booking.id}. You have received a refund of £${payment.amount}.`,
                    type: NotificationType.Booking,
                    linkId: booking.id
                })
            }
          
            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleAccept = async (e: React.MouseEvent, booking: Booking) => {
        e.stopPropagation();
        const updatedBooking = await setBookingStatus(booking.id, BookingStatus.Confirmed);
        if (updatedBooking) {
            await createNotification({
                userId: booking.owner.id,
                message: `${user.name.fname} ${user.name.sname} has accepted booking #${booking.id}.`,
                type: NotificationType.Booking,
                linkId: booking.id
            })

            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleDecline = async (e: React.MouseEvent, booking: Booking) => {
        e.stopPropagation();
        const updatedBooking = await setBookingStatus(booking.id, BookingStatus.Cancelled);
        if (updatedBooking) {
            const payment = await getPaymentByBookingId(booking.id);
            await updatePaymentStatus(payment.id, Status.REFUNDED);
          
            await createNotification({
                userId: booking.owner.id,
                message: `${user.name.fname} ${user.name.sname} has declined booking request #${booking.id}. You have received a refund of £${payment.amount}.`,
                type: NotificationType.Booking,
                linkId: booking.id
            })
            const updatedUser = await getUserByIdWithPictures(user.id);
            setUser(updatedUser);
        } else {
            console.error("Failed to cancel booking.");
        }
    }

    const handleReview = (e: React.MouseEvent, booking: Booking) => {
        e.stopPropagation();
        setSelectedBooking(booking);
        setReviewModalOpen(true);
    }

    const handleMessage = async (e: React.MouseEvent, recipientId: number) => {
        e.stopPropagation();
        const chat = await startChat(recipientId);
        navigate(`/chats/${chat.id}`);
    }

    const handleComplete = async (e: React.MouseEvent, booking: Booking) => {
        e.stopPropagation();
        let updatedBooking;
        user.currentRole === Role.OWNER ? updatedBooking = await ownerCompleted(booking.id) : updatedBooking = await minderCompleted(booking.id);

        if (!updatedBooking) {
            console.error("Failed to complete booking.");
            return;
        }

        if (updatedBooking.ownerCompleted && updatedBooking.minderCompleted) {
            const payment = await getPaymentByBookingId(booking.id);
            await updatePaymentStatus(payment.id, Status.PAID);

            if (user.currentRole === Role.OWNER) {
                await createNotification({
                    userId: booking.minder.id,
                    message: `Booking #${booking.id} has been completed. You have received a payment of £${payment.amount}.`,
                    type: NotificationType.Booking,
                    linkId: booking.id
                });
            } else {
                await createNotification({
                    userId: booking.owner.id,
                    message: `Booking #${booking.id} has been completed.`,
                    type: NotificationType.Booking,
                    linkId: booking.id
                });
                await createNotification({
                    userId: booking.minder.id,
                    message: `You have received a payment of £${payment.amount}.`,
                    type: NotificationType.Booking,
                    linkId: booking.id
                });
            }

            const completedBooking = await setBookingStatus(booking.id, BookingStatus.Completed);
            if (!completedBooking) {
                console.error("Failed to complete booking.");
                return;
            }
        } else {
            await createNotification({
                userId: user.id === booking.owner.id ? booking.minder.id : booking.owner.id,
                message: `${user.name.fname} ${user.name.sname} has requested to set booking #${booking.id} to complete.`,
                type: NotificationType.Booking,
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
                message: `${user.name.fname} ${user.name.sname} has left a review.`,
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

    const getStatusText = () => {
        switch (bookings[0].status) {
            case BookingStatus.Pending:
                return "Pending";
            case BookingStatus.Confirmed:
                return "Upcoming";
            case BookingStatus.InProgress:
                return "In Progress";
            case BookingStatus.Completed:
                return "Completed";
            case BookingStatus.Cancelled:
                return "Cancelled";
            case BookingStatus.Rejected:
                return "Declined";
            default:
                return "Unknown";
        }
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

    if (loading || (bookingId && bookings.length === 0)) {
        return <></>;
    }

    return (
        bookingId ? (
            <div className={`container ${detailsStyles.bookingDetails}`}>
                <div className={detailsStyles.bookingDetailsContainer}>
                    <button className={`btn-link ${detailsStyles.backButton}`} onClick={() => {
                        switch (bookings[0].status) {
                            case BookingStatus.InProgress:
                                navigate("/dashboard/bookings/in-progress", { replace: true });
                                break;
                            case BookingStatus.Confirmed:
                                navigate("/dashboard/bookings/upcoming", { replace: true });
                                break;
                            case BookingStatus.Pending:
                                navigate("/dashboard/bookings/pending", { replace: true });
                                break;
                            case BookingStatus.Completed:
                                navigate("/dashboard/bookings/past", { replace: true });
                                break;
                            default:
                                navigate("/dashboard/bookings", { replace: true });
                        }
                    }}>
                        <ArrowLeft size={20} />
                        <span>Return to bookings</span>
                    </button>
                    <div className={detailsStyles.bookingDetailsContent}>
                        <div className={detailsStyles.bookingDetailsHeader}>
                            <h3>Booking #{bookings[0].id}</h3>
                            <span>{getStatusText()}</span>
                        </div>
                        <div className={detailsStyles.detailsContainer}>
                            <h5>Service Details</h5>
                            <div className={detailsStyles.serviceDetailsContainer}>
                                <div className={detailsStyles.bookingHeading}>
                                    <h6>{bookings[0].service.type} {user.currentRole === Role.OWNER ? `with ${(bookings[0].minder.name.fname)}` : `for ${(bookings[0].owner.name.fname)}`}</h6>
                                    <h6>£{bookings[0].service.price}</h6>
                                </div>
                                <div className={detailsStyles.serviceDetail}>
                                    <Calendar size={16} strokeWidth={2} />
                                    <span>{new Date(bookings[0].time).toLocaleDateString()}</span>
                                </div>
                                <div className={detailsStyles.serviceDetail}>
                                    <Clock size={16} strokeWidth={2} />
                                    <span>{new Date(bookings[0].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={detailsStyles.serviceDetail}>
                                    <MapPin size={16} strokeWidth={2} />
                                    <span>{user.id === bookings[0].owner.id ? bookings[0].minder.primaryUserInfo.address.street + ", " + bookings[0].minder.primaryUserInfo.address.city : bookings[0].owner.primaryUserInfo.address.street + ", " + bookings[0].owner.primaryUserInfo.address.city}</span>
                                </div>
                            </div>
                        </div>
                        <div className={detailsStyles.detailsContainer}>
                            {user.id === bookings[0].minder.id ? (
                                <>
                                    <h5>Owner Details</h5>
                                    <div className={detailsStyles.userDetailsContainer}>
                                        <img src={bookings[0].owner.primaryUserInfo.profilePic} alt={bookings[0].owner.name.fname + " " + bookings[0].owner.name.sname} />
                                        <div className={detailsStyles.userDetailsInfo}>
                                            <h6>{bookings[0].owner.name.fname} {bookings[0].owner.name.sname}</h6>
                                            <span style={{display: "flex", alignItems: "center", gap: "5px"}}><MapPin size={16} />{bookings[0].owner.primaryUserInfo.address.street}, {bookings[0].owner.primaryUserInfo.address.city}</span>
                                        </div>
                                        <button className="btn btn-secondary" onClick={() => navigate(`/users/${bookings[0].owner.id}`)}>
                                            View Profile
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h5>Minder Details</h5>
                                    <div className={detailsStyles.userDetailsContainer}>
                                        <img src={bookings[0].minder.primaryUserInfo.profilePic} alt={bookings[0].minder.name.fname + " " + bookings[0].minder.name.sname} />
                                        <div className={detailsStyles.userDetailsInfo}>
                                            <h6>{bookings[0].minder.name.fname} {bookings[0].minder.name.sname}</h6>
                                            <span style={{display: "flex", alignItems: "center", gap: "5px"}}><MapPin size={16} />{bookings[0].minder.primaryUserInfo.address.street}, {bookings[0].minder.primaryUserInfo.address.city}</span>
                                        </div>
                                        <button className="btn btn-secondary" onClick={() => navigate(`/users/${bookings[0].minder.id}`)}>
                                            View Profile
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={detailsStyles.detailsContainer}>
                            <h5>Pet Details</h5>
                            <div className={detailsStyles.userDetailsContainer}>
                                <img src={bookings[0].pet.picture} alt={bookings[0].pet.name} />
                                <div className={detailsStyles.userDetailsInfo}>
                                    <h6>{bookings[0].pet.name}</h6>
                                    <span>{bookings[0].pet.breed}</span>
                                </div>
                                <button className="btn btn-secondary" onClick={() => navigate(`/pets/${bookings[0].pet.id}`)}>
                                    View Pet Profile
                                </button>
                            </div>
                        </div>
                        <div className={detailsStyles.detailsContainer}>
                            <h5>Special Instructions</h5>
                            <div className={detailsStyles.specialInstructionsContainer}>
                                <p>{bookings[0].notes ? bookings[0].notes : "None."}</p>
                            </div>
                        </div>
                        <BookingActions
                            booking={bookings[0]}
                            status={bookings[0].status}
                            onMessage={handleMessage}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                            onComplete={handleComplete}
                            onCancel={handleCancel}
                            onReview={handleReview}
                            extraMargin={true}
                        />
                    </div>
                </div>
                {reviewModalOpen && (
                    <CreateReview 
                        onSubmit={handleSubmitReview}
                        onCancel={() => setReviewModalOpen(false)}
                        minder={bookings[0].minder}
                    />
                )}
            </div>
        ) : (
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
                        {bookings.filter((b: Booking) => b.status === status).length > 0 ? (
                                bookings
                                    .filter((b: Booking) => b.status === status)
                                    .map((booking: Booking) => (
                                        <div className={styles.booking} onClick={() => navigate(`/dashboard/bookings/${booking.id}`)} key={booking.id}>
                                            <BookingInfo booking={booking} />
                                            <BookingActions
                                                booking={booking}
                                                status={status as BookingStatus}
                                                onMessage={handleMessage}
                                                onAccept={handleAccept}
                                                onDecline={handleDecline}
                                                onComplete={handleComplete}
                                                onCancel={handleCancel}
                                                onReview={handleReview}
                                            />
                                        </div>
                                    ))
                                ) : (
                                <p className={styles.emptyState}>{noBookingsMessage()}</p>
                            )
                        }
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
        )
    );
}

export default Bookings;
