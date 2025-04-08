export interface IReport {
    id: number;
    reporterId: number;
    reporteeId: number;
    title: string;
    description: string;
    status: Status;
    result?: Result;
    createdAt: Date;
    updatedAt: Date;
}

export enum Status {
    PENDING = "Pending",
    RESOLVED = "Resolved",
}

export enum Result {
    SUSPENDED = "Suspended",
    WARNING = "Warning",
    BANNED = "Banned",
    NO_ACTION = "No Action",
}
