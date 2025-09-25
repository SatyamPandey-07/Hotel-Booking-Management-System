package com.example.hotelbooking.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.hotelbooking.model.User;

@Repository
public class UserDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<User> getAllUsers() {
        String sql = "SELECT * FROM users WHERE is_active = true";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            User u = new User();
            u.setId(rs.getInt("id"));
            u.setUsername(rs.getString("username"));
            u.setEmail(rs.getString("email"));
            u.setPassword(rs.getString("password"));
            u.setRole(rs.getString("role"));
            u.setFirstName(rs.getString("first_name"));
            u.setLastName(rs.getString("last_name"));
            u.setPhone(rs.getString("phone"));
            u.setActive(rs.getBoolean("is_active"));
            u.setCreatedAt(rs.getTimestamp("created_at"));
            u.setLastLogin(rs.getTimestamp("last_login"));
            return u;
        });
    }

    public User findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ? AND is_active = true";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                User u = new User();
                u.setId(rs.getInt("id"));
                u.setUsername(rs.getString("username"));
                u.setEmail(rs.getString("email"));
                u.setPassword(rs.getString("password"));
                u.setRole(rs.getString("role"));
                u.setFirstName(rs.getString("first_name"));
                u.setLastName(rs.getString("last_name"));
                u.setPhone(rs.getString("phone"));
                u.setActive(rs.getBoolean("is_active"));
                u.setCreatedAt(rs.getTimestamp("created_at"));
                u.setLastLogin(rs.getTimestamp("last_login"));
                return u;
            }, username);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ? AND is_active = true";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                User u = new User();
                u.setId(rs.getInt("id"));
                u.setUsername(rs.getString("username"));
                u.setEmail(rs.getString("email"));
                u.setPassword(rs.getString("password"));
                u.setRole(rs.getString("role"));
                u.setFirstName(rs.getString("first_name"));
                u.setLastName(rs.getString("last_name"));
                u.setPhone(rs.getString("phone"));
                u.setActive(rs.getBoolean("is_active"));
                u.setCreatedAt(rs.getTimestamp("created_at"));
                u.setLastLogin(rs.getTimestamp("last_login"));
                return u;
            }, email);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void addUser(User user) {
        String sql = "INSERT INTO users(username, email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, user.getUsername(), user.getEmail(), user.getPassword(), 
                           user.getRole(), user.getFirstName(), user.getLastName(), user.getPhone());
    }

    public User getUserById(int id) {
        String sql = "SELECT * FROM users WHERE id = ? AND is_active = true";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                User u = new User();
                u.setId(rs.getInt("id"));
                u.setUsername(rs.getString("username"));
                u.setEmail(rs.getString("email"));
                u.setPassword(rs.getString("password"));
                u.setRole(rs.getString("role"));
                u.setFirstName(rs.getString("first_name"));
                u.setLastName(rs.getString("last_name"));
                u.setPhone(rs.getString("phone"));
                u.setActive(rs.getBoolean("is_active"));
                u.setCreatedAt(rs.getTimestamp("created_at"));
                u.setLastLogin(rs.getTimestamp("last_login"));
                return u;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateUser(User user) {
        String sql = "UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ?, phone = ?, role = ? WHERE id = ?";
        jdbcTemplate.update(sql, user.getUsername(), user.getEmail(), user.getFirstName(), 
                           user.getLastName(), user.getPhone(), user.getRole(), user.getId());
    }

    public void updateLastLogin(int userId) {
        String sql = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?";
        jdbcTemplate.update(sql, userId);
    }

    public void deleteUser(int id) {
        String sql = "UPDATE users SET is_active = false WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}