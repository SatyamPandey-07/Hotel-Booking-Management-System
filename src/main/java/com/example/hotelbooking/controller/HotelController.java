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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbooking.dao.HotelDAO;
import com.example.hotelbooking.model.Hotel;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class HotelController {
    @Autowired
    private HotelDAO hotelDAO;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        try {
            List<Hotel> hotels = hotelDAO.getAllHotels();
            long total = hotels.size();
            
            // Filter by search if provided
            if (!search.isEmpty()) {
                hotels = hotels.stream()
                    .filter(hotel -> 
                        hotel.getName().toLowerCase().contains(search.toLowerCase()) ||
                        hotel.getAddress().toLowerCase().contains(search.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
                total = hotels.size();
            }
            
            // Simple pagination
            int start = page * size;
            int end = Math.min(start + size, hotels.size());
            List<Hotel> paginatedHotels = hotels.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("hotels", paginatedHotels);
            response.put("totalElements", total);
            response.put("totalPages", (int) Math.ceil((double) total / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch hotels");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addHotel(@RequestBody Hotel hotel) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validation
            if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
                response.put("error", "Hotel name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (hotel.getAddress() == null || hotel.getAddress().trim().isEmpty()) {
                response.put("error", "Hotel address is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            hotelDAO.addHotel(hotel);
            response.put("message", "Hotel added successfully");
            response.put("hotel", hotel);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "Error adding hotel");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getHotelById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid hotel ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            Hotel hotel = hotelDAO.getHotelById(id);
            if (hotel == null) {
                response.put("error", "Hotel not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            response.put("hotel", hotel);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error fetching hotel");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateHotel(@PathVariable int id, @RequestBody Hotel hotel) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid hotel ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if hotel exists
            Hotel existingHotel = hotelDAO.getHotelById(id);
            if (existingHotel == null) {
                response.put("error", "Hotel not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Validation
            if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
                response.put("error", "Hotel name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (hotel.getAddress() == null || hotel.getAddress().trim().isEmpty()) {
                response.put("error", "Hotel address is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            hotel.setId(id);
            hotelDAO.updateHotel(hotel);
            response.put("message", "Hotel updated successfully");
            response.put("hotel", hotel);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error updating hotel");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteHotel(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid hotel ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if hotel exists
            Hotel existingHotel = hotelDAO.getHotelById(id);
            if (existingHotel == null) {
                response.put("error", "Hotel not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            hotelDAO.deleteHotel(id);
            response.put("message", "Hotel deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error deleting hotel");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}