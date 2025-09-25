package com.example.hotelbooking.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbooking.dao.BookingDAO;
import com.example.hotelbooking.model.Booking;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class BookingController {
    @Autowired
    private BookingDAO bookingDAO;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        try {
            List<Booking> bookings = bookingDAO.getAllBookings();
            long total = bookings.size();
            
            // Simple pagination
            int start = page * size;
            int end = Math.min(start + size, bookings.size());
            List<Booking> paginatedBookings = bookings.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("bookings", paginatedBookings);
            response.put("totalElements", total);
            response.put("totalPages", (int) Math.ceil((double) total / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch bookings");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addBooking(@RequestBody Booking booking) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validation
            if (booking.getCustomerId() <= 0) {
                response.put("error", "Valid customer ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (booking.getHotelId() <= 0) {
                response.put("error", "Valid hotel ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (booking.getCheckInDate() == null) {
                response.put("error", "Check-in date is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (booking.getCheckOutDate() == null) {
                response.put("error", "Check-out date is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (booking.getCheckInDate().after(booking.getCheckOutDate()) || 
                booking.getCheckInDate().equals(booking.getCheckOutDate())) {
                response.put("error", "Check-out date must be after check-in date");
                return ResponseEntity.badRequest().body(response);
            }
            
            bookingDAO.addBooking(booking);
            response.put("message", "Booking added successfully");
            response.put("booking", booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "Error adding booking");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBookingById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid booking ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            Booking booking = bookingDAO.getBookingById(id);
            if (booking == null) {
                response.put("error", "Booking not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            response.put("booking", booking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error fetching booking");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Map<String, Object>> getBookingsByCustomerId(@PathVariable int customerId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (customerId <= 0) {
                response.put("error", "Invalid customer ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<Booking> bookings = bookingDAO.getBookingsByCustomerId(customerId);
            response.put("bookings", bookings);
            response.put("totalElements", bookings.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error fetching customer bookings");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBooking(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid booking ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if booking exists
            Booking existingBooking = bookingDAO.getBookingById(id);
            if (existingBooking == null) {
                response.put("error", "Booking not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            bookingDAO.deleteBooking(id);
            response.put("message", "Booking deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error deleting booking");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}