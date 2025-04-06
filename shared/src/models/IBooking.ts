export interface IBooking {
    id: number;
    petId: number;
    minderId: number;
    ownerId: number;
    serviceId: number;
    time: Date;
    status: BookingStatus;
    notes?: string;
    ownerCompleted: boolean;
    minderCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export enum BookingStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    InProgress = "In Progress",
    Completed = "Completed",
    Cancelled = "Cancelled",
    Rejected = "Rejected"
}

export interface INewBooking {
    petId: number;
    minderId: number;
    ownerId: number;
    serviceId: number;
    time: Date;
    notes?: string;
}