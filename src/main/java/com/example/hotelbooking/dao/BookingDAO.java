package com.example.hotelbooking.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.hotelbooking.model.Booking;

@Repository
public class BookingDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Booking> getAllBookings() {
        String sql = "SELECT * FROM bookings ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Booking b = new Booking();
            b.setId(rs.getInt("id"));
            b.setCustomerId(rs.getInt("customer_id"));
            b.setHotelId(rs.getInt("hotel_id"));
            b.setRoomId(rs.getObject("room_id", Integer.class));
            b.setCheckInDate(rs.getDate("check_in_date"));
            b.setCheckOutDate(rs.getDate("check_out_date"));
            b.setBookingDate(rs.getTimestamp("booking_date"));
            b.setTotalAmount(rs.getObject("total_amount", Double.class));
            b.setStatus(rs.getString("status"));
            b.setSpecialRequests(rs.getString("special_requests"));
            b.setCreatedAt(rs.getTimestamp("created_at"));
            b.setUpdatedAt(rs.getTimestamp("updated_at"));
            return b;
        });
    }

    public void addBooking(Booking booking) {
        String sql = "INSERT INTO bookings(customer_id, hotel_id, room_id, check_in_date, check_out_date, total_amount, status, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, booking.getCustomerId(), booking.getHotelId(), booking.getRoomId(),
                           booking.getCheckInDate(), booking.getCheckOutDate(), booking.getTotalAmount(),
                           booking.getStatus() != null ? booking.getStatus() : "PENDING", booking.getSpecialRequests());
    }

    public Booking getBookingById(int id) {
        String sql = "SELECT * FROM bookings WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Booking b = new Booking();
                b.setId(rs.getInt("id"));
                b.setCustomerId(rs.getInt("customer_id"));
                b.setHotelId(rs.getInt("hotel_id"));
                b.setRoomId(rs.getObject("room_id", Integer.class));
                b.setCheckInDate(rs.getDate("check_in_date"));
                b.setCheckOutDate(rs.getDate("check_out_date"));
                b.setBookingDate(rs.getTimestamp("booking_date"));
                b.setTotalAmount(rs.getObject("total_amount", Double.class));
                b.setStatus(rs.getString("status"));
                b.setSpecialRequests(rs.getString("special_requests"));
                b.setCreatedAt(rs.getTimestamp("created_at"));
                b.setUpdatedAt(rs.getTimestamp("updated_at"));
                return b;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Booking> getBookingsByCustomerId(int customerId) {
        String sql = "SELECT * FROM bookings WHERE customer_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Booking b = new Booking();
            b.setId(rs.getInt("id"));
            b.setCustomerId(rs.getInt("customer_id"));
            b.setHotelId(rs.getInt("hotel_id"));
            b.setRoomId(rs.getObject("room_id", Integer.class));
            b.setCheckInDate(rs.getDate("check_in_date"));
            b.setCheckOutDate(rs.getDate("check_out_date"));
            b.setBookingDate(rs.getTimestamp("booking_date"));
            b.setTotalAmount(rs.getObject("total_amount", Double.class));
            b.setStatus(rs.getString("status"));
            b.setSpecialRequests(rs.getString("special_requests"));
            b.setCreatedAt(rs.getTimestamp("created_at"));
            b.setUpdatedAt(rs.getTimestamp("updated_at"));
            return b;
        }, customerId);
    }

    public List<Booking> getBookingsByHotelId(int hotelId) {
        String sql = "SELECT * FROM bookings WHERE hotel_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Booking b = new Booking();
            b.setId(rs.getInt("id"));
            b.setCustomerId(rs.getInt("customer_id"));
            b.setHotelId(rs.getInt("hotel_id"));
            b.setRoomId(rs.getObject("room_id", Integer.class));
            b.setCheckInDate(rs.getDate("check_in_date"));
            b.setCheckOutDate(rs.getDate("check_out_date"));
            b.setBookingDate(rs.getTimestamp("booking_date"));
            b.setTotalAmount(rs.getObject("total_amount", Double.class));
            b.setStatus(rs.getString("status"));
            b.setSpecialRequests(rs.getString("special_requests"));
            b.setCreatedAt(rs.getTimestamp("created_at"));
            b.setUpdatedAt(rs.getTimestamp("updated_at"));
            return b;
        }, hotelId);
    }

    public void updateBooking(Booking booking) {
        String sql = "UPDATE bookings SET customer_id = ?, hotel_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?, total_amount = ?, status = ?, special_requests = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        jdbcTemplate.update(sql, booking.getCustomerId(), booking.getHotelId(), booking.getRoomId(),
                           booking.getCheckInDate(), booking.getCheckOutDate(), booking.getTotalAmount(),
                           booking.getStatus(), booking.getSpecialRequests(), booking.getId());
    }

    public void updateBookingStatus(int bookingId, String status) {
        String sql = "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        jdbcTemplate.update(sql, status, bookingId);
    }

    public void deleteBooking(int id) {
        String sql = "DELETE FROM bookings WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    // Dashboard/Analytics methods
    public int getTotalBookingsCount() {
        String sql = "SELECT COUNT(*) FROM bookings";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    public int getBookingsCountByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM bookings WHERE status = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, status);
        return count != null ? count : 0;
    }

    public Double getTotalRevenue() {
        String sql = "SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE status IN ('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT')";
        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    public List<Booking> getRecentBookings(int limit) {
        String sql = "SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Booking b = new Booking();
            b.setId(rs.getInt("id"));
            b.setCustomerId(rs.getInt("customer_id"));
            b.setHotelId(rs.getInt("hotel_id"));
            b.setRoomId(rs.getObject("room_id", Integer.class));
            b.setCheckInDate(rs.getDate("check_in_date"));
            b.setCheckOutDate(rs.getDate("check_out_date"));
            b.setBookingDate(rs.getTimestamp("booking_date"));
            b.setTotalAmount(rs.getObject("total_amount", Double.class));
            b.setStatus(rs.getString("status"));
            b.setSpecialRequests(rs.getString("special_requests"));
            b.setCreatedAt(rs.getTimestamp("created_at"));
            b.setUpdatedAt(rs.getTimestamp("updated_at"));
            return b;
        }, limit);
    }
}