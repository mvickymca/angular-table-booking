import { Component, OnInit } from '@angular/core';
import { tableInfo } from './tableInfo';
import { Table } from '../models/table.model';
import { Booking, BookingStatus, BookingStatistics } from '../models/booking.model';
import { TableService } from '../services/table.service';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-tab-book-main',
  templateUrl: './tab-book-main.component.html',
  styleUrls: ['./tab-book-main.component.css']
})
export class TabBookMainComponent implements OnInit {

  // Legacy mock data for backward compatibility
  tableInfos: tableInfo[] = [
    {
      "tableId": "1",
      "isAvailable": true,
      "capacity": 5,
      "bookingInfo": null
    }, {
      "tableId": "2",
      "isAvailable": true,
      "capacity": 5,
      "bookingInfo": null
    },
    {
      "tableId": "3",
      "isAvailable": true,
      "capacity": 5,
      "bookingInfo": null
    },
    {
      "tableId": "4",
      "isAvailable": false,
      "capacity": 5,
      "bookingInfo": {
        "phoneNumber": "7684763876",
        "name": "Kavin Subramanian",
        "guestTotal": 4,
        "bookedFor": "Break Fast"
      }
    }, {
      "tableId": "5",
      "isAvailable": true,
      "capacity": 5,
      "bookingInfo": null
    }, {
      "tableId": "6",
      "isAvailable": true,
      "capacity": 5,
      "bookingInfo": null
    }
  ];

  // New API-driven data
  tables: Table[] = [];
  bookings: Booking[] = [];
  bookingStatistics: BookingStatistics | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private tableService: TableService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    console.log("NgOnInit Method is running");
    this.loadTablesFromAPI();
    this.loadBookingsFromAPI();
    this.loadBookingStatistics();
  }

  /**
   * Load tables from the Spring Boot API
   */
  loadTablesFromAPI(): void {
    this.loading = true;
    this.tableService.getAllTables().subscribe({
      next: (tables) => {
        this.tables = tables;
        this.loading = false;
        console.log('Tables loaded from API:', tables);
      },
      error: (error) => {
        this.error = 'Failed to load tables from API. Using mock data.';
        this.loading = false;
        console.error('Error loading tables:', error);
      }
    });
  }

  /**
   * Load bookings from the Spring Boot API
   */
  loadBookingsFromAPI(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        console.log('Bookings loaded from API:', bookings);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  /**
   * Load booking statistics
   */
  loadBookingStatistics(): void {
    this.bookingService.getBookingStatistics().subscribe({
      next: (stats) => {
        this.bookingStatistics = stats;
        console.log('Booking statistics loaded:', stats);
      },
      error: (error) => {
        console.error('Error loading booking statistics:', error);
      }
    });
  }

  /**
   * Get available tables only
   */
  getAvailableTables(): void {
    this.tableService.getAvailableTables().subscribe({
      next: (tables) => {
        this.tables = tables;
        console.log('Available tables loaded:', tables);
      },
      error: (error) => {
        console.error('Error loading available tables:', error);
      }
    });
  }

  /**
   * Get today's bookings
   */
  getTodaysBookings(): void {
    this.bookingService.getTodaysBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        console.log('Today\'s bookings loaded:', bookings);
      },
      error: (error) => {
        console.error('Error loading today\'s bookings:', error);
      }
    });
  }

  /**
   * Refresh all data
   */
  refreshData(): void {
    this.loadTablesFromAPI();
    this.loadBookingsFromAPI();
    this.loadBookingStatistics();
  }

}
