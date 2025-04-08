export interface IPayment {
    id: number;
    amount: number;
    cardDetails: ICardDetails;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICardDetails {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
}

export enum Status {
    PENDING = "Pending",
    PAID = "Paid",
    REFUNDED = "Refunded",
}