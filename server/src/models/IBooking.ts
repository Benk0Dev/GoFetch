export interface IBooking {
    id: number;
    petId: number;
    minderId: number;
    ownerId: number;
    serviceId: number;
    date: string;
    status: EBookingStatus;
    notes?: string;
    price?: number;
}

export enum EBookingStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Completed = "Completed",
    Cancelled = "Cancelled"
}