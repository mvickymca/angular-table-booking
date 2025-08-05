package com.example.tablebooking.controller;

import com.example.tablebooking.model.Booking;
import com.example.tablebooking.model.Booking.BookingStatus;
import com.example.tablebooking.service.BookingService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@Api(tags = "Booking Management", description = "Operations for managing table bookings")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    @ApiOperation(value = "Get all bookings", notes = "Retrieve a list of all bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Get booking by ID", notes = "Retrieve a specific booking by its ID")
    public ResponseEntity<Booking> getBookingById(
            @ApiParam(value = "Booking ID", required = true) @PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @ApiOperation(value = "Get bookings by status", notes = "Retrieve all bookings with a specific status")
    public ResponseEntity<List<Booking>> getBookingsByStatus(
            @ApiParam(value = "Booking status", required = true) @PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/table/{tableId}")
    @ApiOperation(value = "Get bookings by table ID", notes = "Retrieve all bookings for a specific table")
    public ResponseEntity<List<Booking>> getBookingsByTableId(
            @ApiParam(value = "Table ID", required = true) @PathVariable Long tableId) {
        List<Booking> bookings = bookingService.getBookingsByTableId(tableId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/customer")
    @ApiOperation(value = "Get bookings by customer email", notes = "Retrieve all bookings for a customer by email")
    public ResponseEntity<List<Booking>> getBookingsByCustomerEmail(
            @ApiParam(value = "Customer email", required = true) @RequestParam String email) {
        List<Booking> bookings = bookingService.getBookingsByCustomerEmail(email);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/date-range")
    @ApiOperation(value = "Get bookings by date range", notes = "Retrieve bookings within a specific date range")
    public ResponseEntity<List<Booking>> getBookingsByDateRange(
            @ApiParam(value = "Start date", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @ApiParam(value = "End date", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Booking> bookings = bookingService.getBookingsByDateRange(startDate, endDate);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/today")
    @ApiOperation(value = "Get today's bookings", notes = "Retrieve all bookings for today")
    public ResponseEntity<List<Booking>> getTodaysBookings() {
        List<Booking> bookings = bookingService.getTodaysBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/statistics")
    @ApiOperation(value = "Get booking statistics", notes = "Retrieve booking statistics and metrics")
    public ResponseEntity<Map<String, Object>> getBookingStatistics() {
        Map<String, Object> statistics = bookingService.getBookingStatistics();
        return ResponseEntity.ok(statistics);
    }

    @PostMapping
    @ApiOperation(value = "Create new booking", notes = "Create a new table booking")
    public ResponseEntity<Booking> createBooking(
            @ApiParam(value = "Booking information", required = true) @Valid @RequestBody Booking booking) {
        Booking createdBooking = bookingService.createBooking(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Update booking", notes = "Update an existing booking")
    public ResponseEntity<Booking> updateBooking(
            @ApiParam(value = "Booking ID", required = true) @PathVariable Long id,
            @ApiParam(value = "Updated booking information", required = true) @Valid @RequestBody Booking booking) {
        Optional<Booking> updatedBooking = bookingService.updateBooking(id, booking);
        return updatedBooking.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @ApiOperation(value = "Update booking status", notes = "Update the status of a booking")
    public ResponseEntity<Booking> updateBookingStatus(
            @ApiParam(value = "Booking ID", required = true) @PathVariable Long id,
            @ApiParam(value = "New booking status", required = true) @RequestParam BookingStatus status) {
        Optional<Booking> updatedBooking = bookingService.updateBookingStatus(id, status);
        return updatedBooking.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/availability")
    @ApiOperation(value = "Check table availability", notes = "Check if a table is available for a specific date and time")
    public ResponseEntity<Boolean> checkTableAvailability(
            @ApiParam(value = "Table ID", required = true) @RequestParam Long tableId,
            @ApiParam(value = "Booking date and time", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime bookingDateTime,
            @ApiParam(value = "Duration in hours", required = true) @RequestParam Integer durationHours) {
        boolean isAvailable = bookingService.isTableAvailable(tableId, bookingDateTime, durationHours);
        return ResponseEntity.ok(isAvailable);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Delete booking", notes = "Delete a booking")
    public ResponseEntity<String> deleteBooking(
            @ApiParam(value = "Booking ID", required = true) @PathVariable Long id) {
        boolean deleted = bookingService.deleteBooking(id);
        if (deleted) {
            return ResponseEntity.ok("Booking deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}