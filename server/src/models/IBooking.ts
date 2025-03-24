export interface IBooking {
    id: number;
    petId: number;
    minderId: number;
    ownerId: number;
    serviceId: number;
    status: EBookingStatus;
    notes?: string;
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

export interface INewBooking {
    petId: number;
    minderId: number;
    ownerId: number;
    serviceId: number;
    notes?: string;
}