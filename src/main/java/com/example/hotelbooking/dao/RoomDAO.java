package com.example.hotelbooking.dao;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.hotelbooking.model.Room;

@Repository
public class RoomDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Room> getAllRooms() {
        String sql = "SELECT * FROM rooms WHERE is_active = true";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Room r = new Room();
            r.setId(rs.getInt("id"));
            r.setHotelId(rs.getInt("hotel_id"));
            r.setRoomNumber(rs.getString("room_number"));
            r.setRoomType(rs.getString("room_type"));
            r.setCapacity(rs.getInt("capacity"));
            r.setPricePerNight(rs.getDouble("price_per_night"));
            r.setAmenities(rs.getString("amenities"));
            r.setAvailable(rs.getBoolean("is_available"));
            r.setActive(rs.getBoolean("is_active"));
            return r;
        });
    }

    public List<Room> getRoomsByHotelId(int hotelId) {
        String sql = "SELECT * FROM rooms WHERE hotel_id = ? AND is_active = true";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Room r = new Room();
            r.setId(rs.getInt("id"));
            r.setHotelId(rs.getInt("hotel_id"));
            r.setRoomNumber(rs.getString("room_number"));
            r.setRoomType(rs.getString("room_type"));
            r.setCapacity(rs.getInt("capacity"));
            r.setPricePerNight(rs.getDouble("price_per_night"));
            r.setAmenities(rs.getString("amenities"));
            r.setAvailable(rs.getBoolean("is_available"));
            r.setActive(rs.getBoolean("is_active"));
            return r;
        }, hotelId);
    }

    public List<Room> getAvailableRooms(int hotelId, Date checkIn, Date checkOut) {
        String sql = "SELECT r.* FROM rooms r WHERE r.hotel_id = ? AND r.is_available = true AND r.is_active = true " +
                    "AND r.id NOT IN (SELECT b.room_id FROM bookings b WHERE b.room_id IS NOT NULL " +
                    "AND b.status IN ('CONFIRMED', 'CHECKED_IN') " +
                    "AND ((b.check_in_date <= ? AND b.check_out_date > ?) " +
                    "OR (b.check_in_date < ? AND b.check_out_date >= ?)))";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Room r = new Room();
            r.setId(rs.getInt("id"));
            r.setHotelId(rs.getInt("hotel_id"));
            r.setRoomNumber(rs.getString("room_number"));
            r.setRoomType(rs.getString("room_type"));
            r.setCapacity(rs.getInt("capacity"));
            r.setPricePerNight(rs.getDouble("price_per_night"));
            r.setAmenities(rs.getString("amenities"));
            r.setAvailable(rs.getBoolean("is_available"));
            r.setActive(rs.getBoolean("is_active"));
            return r;
        }, hotelId, checkIn, checkIn, checkOut, checkOut);
    }

    public void addRoom(Room room) {
        String sql = "INSERT INTO rooms(hotel_id, room_number, room_type, capacity, price_per_night, amenities) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, room.getHotelId(), room.getRoomNumber(), room.getRoomType(), 
                           room.getCapacity(), room.getPricePerNight(), room.getAmenities());
    }

    public Room getRoomById(int id) {
        String sql = "SELECT * FROM rooms WHERE id = ? AND is_active = true";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Room r = new Room();
                r.setId(rs.getInt("id"));
                r.setHotelId(rs.getInt("hotel_id"));
                r.setRoomNumber(rs.getString("room_number"));
                r.setRoomType(rs.getString("room_type"));
                r.setCapacity(rs.getInt("capacity"));
                r.setPricePerNight(rs.getDouble("price_per_night"));
                r.setAmenities(rs.getString("amenities"));
                r.setAvailable(rs.getBoolean("is_available"));
                r.setActive(rs.getBoolean("is_active"));
                return r;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateRoom(Room room) {
        String sql = "UPDATE rooms SET hotel_id = ?, room_number = ?, room_type = ?, capacity = ?, price_per_night = ?, amenities = ?, is_available = ? WHERE id = ?";
        jdbcTemplate.update(sql, room.getHotelId(), room.getRoomNumber(), room.getRoomType(), 
                           room.getCapacity(), room.getPricePerNight(), room.getAmenities(), 
                           room.isAvailable(), room.getId());
    }

    public void deleteRoom(int id) {
        String sql = "UPDATE rooms SET is_active = false WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void updateRoomAvailability(int roomId, boolean isAvailable) {
        String sql = "UPDATE rooms SET is_available = ? WHERE id = ?";
        jdbcTemplate.update(sql, isAvailable, roomId);
    }
}