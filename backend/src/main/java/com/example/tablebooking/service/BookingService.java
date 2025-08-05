package com.example.tablebooking.service;

import com.example.tablebooking.model.Booking;
import com.example.tablebooking.model.Booking.BookingStatus;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class BookingService {
    
    private final Map<Long, Booking> bookings = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @PostConstruct
    public void initializeMockData() {
        // Create some sample bookings
        createBooking(new Booking(1L, "John Smith", "john.smith@email.com", "+1-555-0101", 
                4, LocalDateTime.now().plusDays(1)));
        
        createBooking(new Booking(2L, "Sarah Johnson", "sarah.j@email.com", "+1-555-0102", 
                2, LocalDateTime.now().plusDays(2)));
        
        Booking confirmedBooking = new Booking(3L, "Mike Wilson", "mike.w@email.com", "+1-555-0103", 
                6, LocalDateTime.now().plusDays(3));
        confirmedBooking.setStatus(BookingStatus.CONFIRMED);
        confirmedBooking.setSpecialRequests("Birthday celebration - need cake service");
        createBooking(confirmedBooking);
        
        createBooking(new Booking(1L, "Emma Davis", "emma.d@email.com", "+1-555-0104", 
                3, LocalDateTime.now().plusDays(5)));
        
        Booking cancelledBooking = new Booking(4L, "Robert Brown", "robert.b@email.com", "+1-555-0105", 
                8, LocalDateTime.now().plusDays(7));
        cancelledBooking.setStatus(BookingStatus.CANCELLED);
        createBooking(cancelledBooking);
    }

    public List<Booking> getAllBookings() {
        return new ArrayList<>(bookings.values());
    }

    public Optional<Booking> getBookingById(Long id) {
        return Optional.ofNullable(bookings.get(id));
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookings.values().stream()
                .filter(booking -> booking.getStatus() == status)
                .collect(Collectors.toList());
    }

    public List<Booking> getBookingsByTableId(Long tableId) {
        return bookings.values().stream()
                .filter(booking -> booking.getTableId().equals(tableId))
                .collect(Collectors.toList());
    }

    public List<Booking> getBookingsByCustomerEmail(String email) {
        return bookings.values().stream()
                .filter(booking -> booking.getCustomerEmail().toLowerCase().contains(email.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Booking> getBookingsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return bookings.values().stream()
                .filter(booking -> booking.getBookingDateTime().isAfter(startDate) && 
                                 booking.getBookingDateTime().isBefore(endDate))
                .collect(Collectors.toList());
    }

    public List<Booking> getTodaysBookings() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return getBookingsByDateRange(startOfDay, endOfDay);
    }

    public Booking createBooking(Booking booking) {
        booking.setId(idGenerator.getAndIncrement());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        bookings.put(booking.getId(), booking);
        return booking;
    }

    public Optional<Booking> updateBooking(Long id, Booking updatedBooking) {
        Booking existingBooking = bookings.get(id);
        if (existingBooking != null) {
            updatedBooking.setId(id);
            updatedBooking.setCreatedAt(existingBooking.getCreatedAt());
            updatedBooking.setUpdatedAt(LocalDateTime.now());
            bookings.put(id, updatedBooking);
            return Optional.of(updatedBooking);
        }
        return Optional.empty();
    }

    public Optional<Booking> updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookings.get(id);
        if (booking != null) {
            booking.setStatus(status);
            booking.setUpdatedAt(LocalDateTime.now());
            return Optional.of(booking);
        }
        return Optional.empty();
    }

    public boolean deleteBooking(Long id) {
        return bookings.remove(id) != null;
    }

    public boolean isTableAvailable(Long tableId, LocalDateTime bookingDateTime, Integer durationHours) {
        LocalDateTime endTime = bookingDateTime.plusHours(durationHours);
        
        return bookings.values().stream()
                .filter(booking -> booking.getTableId().equals(tableId))
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED || 
                                 booking.getStatus() == BookingStatus.PENDING)
                .noneMatch(booking -> {
                    LocalDateTime existingStart = booking.getBookingDateTime();
                    LocalDateTime existingEnd = existingStart.plusHours(booking.getDurationHours());
                    
                    // Check for time overlap
                    return (bookingDateTime.isBefore(existingEnd) && endTime.isAfter(existingStart));
                });
    }

    public Map<String, Object> getBookingStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalBookings = bookings.size();
        long confirmedBookings = getBookingsByStatus(BookingStatus.CONFIRMED).size();
        long pendingBookings = getBookingsByStatus(BookingStatus.PENDING).size();
        long cancelledBookings = getBookingsByStatus(BookingStatus.CANCELLED).size();
        long todaysBookings = getTodaysBookings().size();
        
        stats.put("totalBookings", totalBookings);
        stats.put("confirmedBookings", confirmedBookings);
        stats.put("pendingBookings", pendingBookings);
        stats.put("cancelledBookings", cancelledBookings);
        stats.put("todaysBookings", todaysBookings);
        stats.put("confirmationRate", totalBookings > 0 ? (double) confirmedBookings / totalBookings * 100 : 0);
        
        return stats;
    }
}