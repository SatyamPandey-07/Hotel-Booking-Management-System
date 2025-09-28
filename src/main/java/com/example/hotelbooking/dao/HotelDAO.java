package com.example.hotelbooking.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.hotelbooking.model.Hotel;

@Repository
public class HotelDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Hotel> getAllHotels() {
        String sql = "SELECT * FROM hotels WHERE is_active = true";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Hotel h = new Hotel();
            h.setId(rs.getInt("id"));
            h.setName(rs.getString("name"));
            h.setAddress(rs.getString("address"));
            h.setCity(rs.getString("city"));
            h.setState(rs.getString("state"));
            h.setCountry(rs.getString("country"));
            h.setPostalCode(rs.getString("postal_code"));
            h.setPhone(rs.getString("phone"));
            h.setEmail(rs.getString("email"));
            h.setDescription(rs.getString("description"));
            h.setStarRating(rs.getDouble("star_rating"));
            h.setManagerId(rs.getObject("manager_id", Integer.class));
            h.setIsActive(rs.getBoolean("is_active"));
            h.setCreatedAt(rs.getTimestamp("created_at"));
            return h;
        });
    }

    public void addHotel(Hotel hotel) {
        String sql = "INSERT INTO hotels(name, address, city, state, country, postal_code, phone, email, description, star_rating, manager_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, 
            hotel.getName(), 
            hotel.getAddress(), 
            hotel.getCity(),
            hotel.getState(),
            hotel.getCountry(),
            hotel.getPostalCode(),
            hotel.getPhone(),
            hotel.getEmail(),
            hotel.getDescription(),
            hotel.getStarRating(),
            hotel.getManagerId(),
            hotel.getIsActive() != null ? hotel.getIsActive() : true
        );
    }

    public Hotel getHotelById(int id) {
        String sql = "SELECT * FROM hotels WHERE id = ? AND is_active = true";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Hotel h = new Hotel();
                h.setId(rs.getInt("id"));
                h.setName(rs.getString("name"));
                h.setAddress(rs.getString("address"));
                h.setCity(rs.getString("city"));
                h.setState(rs.getString("state"));
                h.setCountry(rs.getString("country"));
                h.setPostalCode(rs.getString("postal_code"));
                h.setPhone(rs.getString("phone"));
                h.setEmail(rs.getString("email"));
                h.setDescription(rs.getString("description"));
                h.setStarRating(rs.getDouble("star_rating"));
                h.setManagerId(rs.getObject("manager_id", Integer.class));
                h.setIsActive(rs.getBoolean("is_active"));
                h.setCreatedAt(rs.getTimestamp("created_at"));
                return h;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateHotel(Hotel hotel) {
        String sql = "UPDATE hotels SET name = ?, address = ?, city = ?, state = ?, country = ?, postal_code = ?, phone = ?, email = ?, description = ?, star_rating = ?, manager_id = ?, is_active = ? WHERE id = ?";
        jdbcTemplate.update(sql, 
            hotel.getName(),
            hotel.getAddress(),
            hotel.getCity(),
            hotel.getState(),
            hotel.getCountry(),
            hotel.getPostalCode(),
            hotel.getPhone(),
            hotel.getEmail(),
            hotel.getDescription(),
            hotel.getStarRating(),
            hotel.getManagerId(),
            hotel.getIsActive(),
            hotel.getId()
        );
    }

    public void deleteHotel(int id) {
        String sql = "UPDATE hotels SET is_active = false WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}