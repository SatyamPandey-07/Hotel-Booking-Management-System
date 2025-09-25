package com.example.hotelbooking.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbooking.dao.BookingDAO;
import com.example.hotelbooking.dao.CustomerDAO;
import com.example.hotelbooking.dao.HotelDAO;
import com.example.hotelbooking.dao.RoomDAO;
import com.example.hotelbooking.dao.UserDAO;
import com.example.hotelbooking.model.Booking;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    @Autowired
    private BookingDAO bookingDAO;
    
    @Autowired
    private CustomerDAO customerDAO;
    
    @Autowired
    private HotelDAO hotelDAO;
    
    @Autowired
    private RoomDAO roomDAO;
    
    @Autowired
    private UserDAO userDAO;
    
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        try {
            Map<String, Object> overview = new HashMap<>();
            
            // Basic counts
            int totalBookings = bookingDAO.getTotalBookingsCount();
            int totalCustomers = customerDAO.getAllCustomers().size();
            int totalHotels = hotelDAO.getAllHotels().size();
            int totalRooms = roomDAO.getAllRooms().size();
            
            // Booking status counts
            int pendingBookings = bookingDAO.getBookingsCountByStatus("PENDING");
            int confirmedBookings = bookingDAO.getBookingsCountByStatus("CONFIRMED");
            int checkedInBookings = bookingDAO.getBookingsCountByStatus("CHECKED_IN");
            int checkedOutBookings = bookingDAO.getBookingsCountByStatus("CHECKED_OUT");
            int cancelledBookings = bookingDAO.getBookingsCountByStatus("CANCELLED");
            
            // Revenue calculation
            Double totalRevenue = bookingDAO.getTotalRevenue();
            
            // Mock customer-specific data (these would normally come from session/auth)
            int myBookings = 3;
            double myTotalSpent = 1250.0;
            int loyaltyPoints = 150;
            int upcomingBookings = 1;
            
            overview.put("totalBookings", totalBookings);
            overview.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
            overview.put("totalHotels", totalHotels);
            overview.put("totalCustomers", totalCustomers);
            overview.put("totalRooms", totalRooms);
            overview.put("myBookings", myBookings);
            overview.put("myTotalSpent", myTotalSpent);
            overview.put("loyaltyPoints", loyaltyPoints);
            overview.put("upcomingBookings", upcomingBookings);
            overview.put("pendingBookings", pendingBookings);
            overview.put("confirmedBookings", confirmedBookings);
            overview.put("checkedInBookings", checkedInBookings);
            overview.put("checkedOutBookings", checkedOutBookings);
            overview.put("cancelledBookings", cancelledBookings);
            
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch dashboard overview");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Basic counts
            int totalBookings = bookingDAO.getTotalBookingsCount();
            int totalCustomers = customerDAO.getAllCustomers().size();
            int totalHotels = hotelDAO.getAllHotels().size();
            int totalRooms = roomDAO.getAllRooms().size();
            int totalUsers = userDAO.getAllUsers().size();
            
            // Booking status counts
            int pendingBookings = bookingDAO.getBookingsCountByStatus("PENDING");
            int confirmedBookings = bookingDAO.getBookingsCountByStatus("CONFIRMED");
            int checkedInBookings = bookingDAO.getBookingsCountByStatus("CHECKED_IN");
            int checkedOutBookings = bookingDAO.getBookingsCountByStatus("CHECKED_OUT");
            int cancelledBookings = bookingDAO.getBookingsCountByStatus("CANCELLED");
            
            // Revenue
            Double totalRevenue = bookingDAO.getTotalRevenue();
            
            // Recent bookings
            List<Booking> recentBookings = bookingDAO.getRecentBookings(10);
            
            stats.put("totalBookings", totalBookings);
            stats.put("totalCustomers", totalCustomers);
            stats.put("totalHotels", totalHotels);
            stats.put("totalRooms", totalRooms);
            stats.put("totalUsers", totalUsers);
            stats.put("pendingBookings", pendingBookings);
            stats.put("confirmedBookings", confirmedBookings);
            stats.put("checkedInBookings", checkedInBookings);
            stats.put("checkedOutBookings", checkedOutBookings);
            stats.put("cancelledBookings", cancelledBookings);
            stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
            stats.put("recentBookings", recentBookings);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch dashboard statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/booking-status-chart")
    public ResponseEntity<Map<String, Object>> getBookingStatusChart() {
        try {
            Map<String, Object> chartData = new HashMap<>();
            
            int pending = bookingDAO.getBookingsCountByStatus("PENDING");
            int confirmed = bookingDAO.getBookingsCountByStatus("CONFIRMED");
            int checkedIn = bookingDAO.getBookingsCountByStatus("CHECKED_IN");
            int checkedOut = bookingDAO.getBookingsCountByStatus("CHECKED_OUT");
            int cancelled = bookingDAO.getBookingsCountByStatus("CANCELLED");
            
            chartData.put("labels", new String[]{"Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"});
            chartData.put("data", new int[]{pending, confirmed, checkedIn, checkedOut, cancelled});
            chartData.put("backgroundColor", new String[]{
                "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"
            });
            
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch booking status chart data");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        try {
            Map<String, Object> summary = new HashMap<>();
            
            // Key metrics
            summary.put("totalBookings", bookingDAO.getTotalBookingsCount());
            summary.put("totalRevenue", bookingDAO.getTotalRevenue());
            summary.put("activeHotels", hotelDAO.getAllHotels().size());
            summary.put("registeredCustomers", customerDAO.getAllCustomers().size());
            
            // Recent activity
            List<Booking> recentBookings = bookingDAO.getRecentBookings(5);
            summary.put("recentBookings", recentBookings);
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch dashboard summary");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}