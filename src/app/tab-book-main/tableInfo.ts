export interface bookingInfo {
    phoneNumber: string;
    name: string;
    guestTotal: number;
    bookedFor: string;
}

export interface tableInfo {
    tableId: string;
    isAvailable: boolean;
    capacity: number;
    bookingInfo: bookingInfo | null;
}