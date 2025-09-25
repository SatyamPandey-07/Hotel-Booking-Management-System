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
        String sql = "SELECT * FROM hotels";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Hotel h = new Hotel();
            h.setId(rs.getInt("id"));
            h.setName(rs.getString("name"));
            h.setAddress(rs.getString("address"));
            h.setManagerId(rs.getInt("manager_id"));
            return h;
        });
    }

    public void addHotel(Hotel hotel) {
        String sql = "INSERT INTO hotels(name, address, manager_id) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, hotel.getName(), hotel.getAddress(), hotel.getManagerId());
    }

    public Hotel getHotelById(int id) {
        String sql = "SELECT * FROM hotels WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Hotel h = new Hotel();
                h.setId(rs.getInt("id"));
                h.setName(rs.getString("name"));
                h.setAddress(rs.getString("address"));
                h.setManagerId(rs.getInt("manager_id"));
                return h;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateHotel(Hotel hotel) {
        String sql = "UPDATE hotels SET name = ?, address = ?, manager_id = ? WHERE id = ?";
        jdbcTemplate.update(sql, hotel.getName(), hotel.getAddress(), hotel.getManagerId(), hotel.getId());
    }

    public void deleteHotel(int id) {
        String sql = "DELETE FROM hotels WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}