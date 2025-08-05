import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from '../../models/table.model';
import { Booking, BookingStatus, BookingStatistics } from '../../models/booking.model';
import { TableService } from '../../services/table.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Data properties
  tables: Table[] = [];
  bookings: Booking[] = [];
  filteredTables: Table[] = [];
  filteredBookings: Booking[] = [];
  bookingStatistics: BookingStatistics | null = null;

  // UI state
  loading = false;
  error: string | null = null;
  activeTab: 'tables' | 'bookings' | 'statistics' = 'tables';

  // Forms
  bookingForm: FormGroup;
  tableForm: FormGroup;

  // Filter options
  BookingStatus = BookingStatus;
  selectedStatus: BookingStatus | 'ALL' = 'ALL';
  minCapacity = 1;
  locationFilter = '';

  constructor(
    private tableService: TableService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  private initializeForms(): void {
    this.bookingForm = this.fb.group({
      tableId: ['', [Validators.required]],
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: [''],
      partySize: ['', [Validators.required, Validators.min(1)]],
      bookingDateTime: ['', [Validators.required]],
      durationHours: [2, [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });

    this.tableForm = this.fb.group({
      name: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required]],
      description: [''],
      pricePerHour: ['', [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Load all data from API
   */
  loadAllData(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.loadTables(),
      this.loadBookings(),
      this.loadStatistics()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tableService.getAllTables().subscribe({
        next: (tables) => {
          this.tables = tables;
          this.filteredTables = tables;
          console.log('Tables loaded:', tables);
          resolve();
        },
        error: (error) => {
          console.error('Error loading tables:', error);
          this.error = 'Failed to load tables';
          reject(error);
        }
      });
    });
  }

  private loadBookings(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bookingService.getAllBookings().subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.filteredBookings = bookings;
          console.log('Bookings loaded:', bookings);
          resolve();
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.error = 'Failed to load bookings';
          reject(error);
        }
      });
    });
  }

  private loadStatistics(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bookingService.getBookingStatistics().subscribe({
        next: (stats) => {
          this.bookingStatistics = stats;
          console.log('Statistics loaded:', stats);
          resolve();
        },
        error: (error) => {
          console.error('Error loading statistics:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Filter tables by capacity
   */
  filterTablesByCapacity(): void {
    if (this.minCapacity === 1) {
      this.filteredTables = this.tables;
      return;
    }

    this.tableService.getTablesByCapacity(this.minCapacity).subscribe({
      next: (tables) => {
        this.filteredTables = tables;
      },
      error: (error) => {
        console.error('Error filtering tables:', error);
      }
    });
  }

  /**
   * Filter tables by location
   */
  filterTablesByLocation(): void {
    if (!this.locationFilter.trim()) {
      this.filteredTables = this.tables;
      return;
    }

    this.tableService.getTablesByLocation(this.locationFilter).subscribe({
      next: (tables) => {
        this.filteredTables = tables;
      },
      error: (error) => {
        console.error('Error filtering tables by location:', error);
      }
    });
  }

  /**
   * Filter bookings by status
   */
  filterBookingsByStatus(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredBookings = this.bookings;
      return;
    }

    this.bookingService.getBookingsByStatus(this.selectedStatus as BookingStatus).subscribe({
      next: (bookings) => {
        this.filteredBookings = bookings;
      },
      error: (error) => {
        console.error('Error filtering bookings:', error);
      }
    });
  }

  /**
   * Create a new booking
   */
  createBooking(): void {
    if (this.bookingForm.valid) {
      const bookingData: Booking = {
        ...this.bookingForm.value,
        status: BookingStatus.PENDING
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (booking) => {
          console.log('Booking created:', booking);
          this.bookingForm.reset();
          this.loadBookings();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.error = 'Failed to create booking';
        }
      });
    }
  }

  /**
   * Create a new table
   */
  createTable(): void {
    if (this.tableForm.valid) {
      const tableData: Table = {
        ...this.tableForm.value,
        isAvailable: true
      };

      this.tableService.createTable(tableData).subscribe({
        next: (table) => {
          console.log('Table created:', table);
          this.tableForm.reset();
          this.loadTables();
        },
        error: (error) => {
          console.error('Error creating table:', error);
          this.error = 'Failed to create table';
        }
      });
    }
  }

  /**
   * Toggle table availability
   */
  toggleTableAvailability(table: Table): void {
    if (table.id) {
      this.tableService.toggleTableAvailability(table.id).subscribe({
        next: () => {
          console.log('Table availability toggled');
          this.loadTables();
        },
        error: (error) => {
          console.error('Error toggling table availability:', error);
        }
      });
    }
  }

  /**
   * Update booking status
   */
  updateBookingStatus(booking: Booking, newStatus: BookingStatus): void {
    if (booking.id) {
      this.bookingService.updateBookingStatus(booking.id, newStatus).subscribe({
        next: () => {
          console.log('Booking status updated');
          this.loadBookings();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Error updating booking status:', error);
        }
      });
    }
  }

  /**
   * Delete a booking
   */
  deleteBooking(booking: Booking): void {
    if (booking.id && confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(booking.id).subscribe({
        next: () => {
          console.log('Booking deleted');
          this.loadBookings();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
        }
      });
    }
  }

  /**
   * Get available tables
   */
  showAvailableTables(): void {
    this.tableService.getAvailableTables().subscribe({
      next: (tables) => {
        this.filteredTables = tables;
      },
      error: (error) => {
        console.error('Error loading available tables:', error);
      }
    });
  }

  /**
   * Get today's bookings
   */
  showTodaysBookings(): void {
    this.bookingService.getTodaysBookings().subscribe({
      next: (bookings) => {
        this.filteredBookings = bookings;
      },
      error: (error) => {
        console.error('Error loading today\'s bookings:', error);
      }
    });
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.selectedStatus = 'ALL';
    this.minCapacity = 1;
    this.locationFilter = '';
    this.filteredTables = this.tables;
    this.filteredBookings = this.bookings;
  }

  /**
   * Get table by ID
   */
  getTableById(id: number): Table | undefined {
    return this.tables.find(table => table.id === id);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'badge-success';
      case BookingStatus.PENDING:
        return 'badge-warning';
      case BookingStatus.CANCELLED:
        return 'badge-danger';
      case BookingStatus.COMPLETED:
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }
}