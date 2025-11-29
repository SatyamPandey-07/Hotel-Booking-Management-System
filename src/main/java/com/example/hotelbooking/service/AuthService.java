package com.example.hotelbooking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hotelbooking.dao.UserDAO;
import com.example.hotelbooking.dto.LoginRequest;
import com.example.hotelbooking.dto.LoginResponse;
import com.example.hotelbooking.dto.RegisterRequest;
import com.example.hotelbooking.dto.RegisterResponse;
import com.example.hotelbooking.model.User;
import com.example.hotelbooking.util.JwtUtil;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private UserDAO userDAO;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Find user by username
            User user = userDAO.findByUsername(loginRequest.getUsername());
            
            if (user == null) {
                logger.warn("Login attempt for non-existent user: {}", loginRequest.getUsername());
                return new LoginResponse(null, null, null, null, null, null, "Invalid username or password");
            }
            
            // Use BCrypt to verify password (supports both plain and hashed for migration)
            boolean passwordMatches = false;
            if (user.getPassword().startsWith("$2a$") || user.getPassword().startsWith("$2b$")) {
                // Already hashed password
                passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            } else {
                // Plain text password (for backward compatibility during migration)
                passwordMatches = user.getPassword().equals(loginRequest.getPassword());
                if (passwordMatches) {
                    logger.info("User {} logged in with plain password - will hash on next update", user.getUsername());
                }
            }
            
            if (!passwordMatches) {
                logger.warn("Failed login attempt for user: {}", loginRequest.getUsername());
                return new LoginResponse(null, null, null, null, null, null, "Invalid username or password");
            }
            
            if (!user.isActive()) {
                logger.warn("Login attempt for deactivated user: {}", loginRequest.getUsername());
                return new LoginResponse(null, null, null, null, null, null, "Account is deactivated");
            }
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            
            // Update last login
            userDAO.updateLastLogin(user.getId());
            
            logger.info("User {} logged in successfully with role {}", user.getUsername(), user.getRole());
            
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
            logger.error("Login failed for user {}: {}", loginRequest.getUsername(), e.getMessage(), e);
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
    
    public RegisterResponse register(RegisterRequest registerRequest) {
        try {
            // Check if username already exists
            User existingUser = userDAO.findByUsername(registerRequest.getUsername());
            if (existingUser != null) {
                logger.warn("Registration attempt with existing username: {}", registerRequest.getUsername());
                return new RegisterResponse(false, "Username already exists", null, null, null);
            }
            
            // Check if email already exists
            User existingEmail = userDAO.findByEmail(registerRequest.getEmail());
            if (existingEmail != null) {
                logger.warn("Registration attempt with existing email: {}", registerRequest.getEmail());
                return new RegisterResponse(false, "Email already exists", null, null, null);
            }
            
            // Create new user
            User newUser = new User();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setEmail(registerRequest.getEmail());
            
            // Hash password using BCrypt
            String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
            newUser.setPassword(hashedPassword);
            
            // Auto-assign CUSTOMER role
            newUser.setRole("CUSTOMER");
            newUser.setFirstName(registerRequest.getFirstName());
            newUser.setLastName(registerRequest.getLastName());
            newUser.setPhone(registerRequest.getPhone());
            newUser.setActive(true);
            
            // Save user to database
            userDAO.addUser(newUser);
            
            // Retrieve the created user to get the generated ID
            User createdUser = userDAO.findByUsername(newUser.getUsername());
            
            logger.info("User {} registered successfully with role CUSTOMER", newUser.getUsername());
            
            return new RegisterResponse(
                true, 
                "Registration successful. Please login with your credentials.", 
                createdUser.getId(),
                createdUser.getUsername(),
                createdUser.getRole()
            );
            
        } catch (Exception e) {
            logger.error("Registration failed for user {}: {}", registerRequest.getUsername(), e.getMessage(), e);
            return new RegisterResponse(false, "Registration failed: " + e.getMessage(), null, null, null);
        }
    }
}