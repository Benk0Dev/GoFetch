export interface IService {
    id: number;
    type: Type;
    duration: Duration;
    price: number;
}

export enum Type {
    WALK = "Dog Walking",
    SIT = "Pet Sitting",
    CARE = "Day Care",
    BOARD = "Overnight Boarding",
    GROOM = "Grooming",
    TRAIN = "Training",
    VISIT = "Home Visit",
    MEDICATE = "Medication Administration",
    TRANSPORT = "Pet Transport",
    OTHER = "Other Service",
}

export enum Duration {
    MINS_15 = "15 minutes",
    MINS_30 = "30 minutes",
    MINS_45 = "45 minutes",
    HOUR = "1 hour",
    HOUR_30 = "1 hour 30 minutes",
    HOURS_2 = "2 hours",
    HOURS_3 = "3 hours",
    HOURS_4 = "4 hours",
    FULL_DAY = "8 hours (Full Day)",
    OVERNIGHT = "24 hours (Overnight)",
}

export interface INewService {
    type: Type;
    duration: Duration;
    price: number;
}