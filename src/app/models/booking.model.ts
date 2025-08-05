export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Booking {
  id?: number;
  tableId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  partySize: number;
  bookingDateTime: string;
  durationHours: number;
  specialRequests?: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingStatistics {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  todaysBookings: number;
  confirmationRate: number;
}