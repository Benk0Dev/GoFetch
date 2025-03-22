export interface IBooking {
    id: number;
    petId: number;
    minderId: number;
    ownerId: number;
    serviceId: number;
    startDate: string;
    endDate: string;
    status: EBookingStatus;
    notes?: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum EBookingStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Completed = "Completed",
    Cancelled = "Cancelled",
    Rejected = "Rejected"
}