package com.example.hotelbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hotelbooking.dao.UserDAO;
import com.example.hotelbooking.dto.LoginRequest;
import com.example.hotelbooking.dto.LoginResponse;
import com.example.hotelbooking.model.User;
import com.example.hotelbooking.util.JwtUtil;

@Service
public class AuthService {
    
    @Autowired
    private UserDAO userDAO;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Find user by username
            User user = userDAO.findByUsername(loginRequest.getUsername());
            
            if (user == null) {
                return new LoginResponse(null, null, null, null, null, null, "Invalid username or password");
            }
            
            // For demo purposes, we're using plain text password comparison
            // In production, use BCrypt or similar for password hashing
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return new LoginResponse(null, null, null, null, null, null, "Invalid username or password");
            }
            
            if (!user.isActive()) {
                return new LoginResponse(null, null, null, null, null, null, "Account is deactivated");
            }
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            
            // Update last login
            userDAO.updateLastLogin(user.getId());
            
            return new LoginResponse(
                token, 
                user.getUsername(), 
                user.getRole(), 
                user.getFirstName(), 
                user.getLastName(),
                user.getId(),
                "Login successful"
            );
            
        } catch (Exception e) {
            return new LoginResponse(null, null, null, null, null, null, "Login failed: " + e.getMessage());
        }
    }
    
    public boolean validateToken(String token, String username) {
        try {
            return jwtUtil.validateToken(token, username);
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getUsernameFromToken(String token) {
        try {
            return jwtUtil.getUsernameFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }
    
    public String getRoleFromToken(String token) {
        try {
            return jwtUtil.getRoleFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }
}