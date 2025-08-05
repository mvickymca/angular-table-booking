import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingStatus, BookingStatistics } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) { }

  /**
   * Get all bookings
   */
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get bookings by status
   */
  getBookingsByStatus(status: BookingStatus): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/status/${status}`);
  }

  /**
   * Get bookings by table ID
   */
  getBookingsByTableId(tableId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/table/${tableId}`);
  }

  /**
   * Get bookings by customer email
   */
  getBookingsByCustomerEmail(email: string): Observable<Booking[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Booking[]>(`${this.apiUrl}/customer`, { params });
  }

  /**
   * Get bookings by date range
   */
  getBookingsByDateRange(startDate: string, endDate: string): Observable<Booking[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Booking[]>(`${this.apiUrl}/date-range`, { params });
  }

  /**
   * Get today's bookings
   */
  getTodaysBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/today`);
  }

  /**
   * Get booking statistics
   */
  getBookingStatistics(): Observable<BookingStatistics> {
    return this.http.get<BookingStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Check table availability
   */
  checkTableAvailability(tableId: number, bookingDateTime: string, durationHours: number): Observable<boolean> {
    const params = new HttpParams()
      .set('tableId', tableId.toString())
      .set('bookingDateTime', bookingDateTime)
      .set('durationHours', durationHours.toString());
    return this.http.get<boolean>(`${this.apiUrl}/availability`, { params });
  }

  /**
   * Create a new booking
   */
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  /**
   * Update an existing booking
   */
  updateBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  /**
   * Update booking status
   */
  updateBookingStatus(id: number, status: BookingStatus): Observable<Booking> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  /**
   * Delete a booking
   */
  deleteBooking(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  /**
   * Helper method to format date for API
   */
  formatDateForApi(date: Date): string {
    return date.toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss
  }

  /**
   * Helper method to get current date time formatted for API
   */
  getCurrentDateTime(): string {
    return this.formatDateForApi(new Date());
  }
}