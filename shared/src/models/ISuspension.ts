export interface ISuspension {
    id: number;
    userId: number;
    reason: string;
    startDate: Date;
    endDate: Date | null; // Nullable to allow for indefinite suspensions
}

export interface INewSuspension {
    userId: number;
    reason: string;
    duration: number | null; // Duration in days
}