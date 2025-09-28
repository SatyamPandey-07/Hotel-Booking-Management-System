package com.example.hotelbooking.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbooking.dto.LoginRequest;
import com.example.hotelbooking.dto.LoginResponse;
import com.example.hotelbooking.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Validation
            if (loginRequest.getUsername() == null || loginRequest.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(null, null, null, null, null, null, "Username is required"));
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse(null, null, null, null, null, null, "Password is required"));
            }
            
            LoginResponse response = authService.login(loginRequest);
            
            if (response.getToken() != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(null, null, null, null, null, null, "Login failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("valid", false);
                response.put("message", "Invalid authorization header");
                return ResponseEntity.badRequest().body(response);
            }
            
            String token = authHeader.substring(7);
            String username = authService.getUsernameFromToken(token);
            
            if (username != null && authService.validateToken(token, username)) {
                String role = authService.getRoleFromToken(token);
                response.put("valid", true);
                response.put("username", username);
                response.put("role", role);
                return ResponseEntity.ok(response);
            } else {
                response.put("valid", false);
                response.put("message", "Invalid or expired token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", "Token validation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        // For JWT, logout is typically handled on the client side by removing the token
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}