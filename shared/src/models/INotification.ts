export interface INotification {
    id: number;
    userId: number;
    message: string;
    read: boolean;
    type: NotificationType;
    linkId: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum NotificationType {
    Message = "message",
    BookingRequest = "booking request",
    BookingAccepted = "booking accepted",
    BookingDeclined = "booking declined",
    BookingCancelled = "booking cancelled",
    BookingCompleteRequest = "booking complete request",
    BookingCompleted = "booking completed",
    BookingExpired = "booking expired",
    Review = "review",
    PaymentRefunded = "payment refunded",
    PaymentReceived = "payment received",
    System = "system",
    Other = "other"
}