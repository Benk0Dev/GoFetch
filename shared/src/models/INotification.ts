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
    Booking = "booking",
    Review = "review",
    System = "system",
    Other = "other"
}