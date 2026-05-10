export enum TripStatus {
    UPCOMING = "UPCOMING",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    PARTIAL = "PARTIAL",
}

export interface CreateTripDto {
    name: string;
    place?: string;
    startDate: string;
    endDate: string;
}

export interface AuthResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
}