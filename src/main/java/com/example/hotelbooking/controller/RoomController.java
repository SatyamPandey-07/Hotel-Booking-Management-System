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

import com.example.hotelbooking.dao.RoomDAO;
import com.example.hotelbooking.model.Room;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class RoomController {
    @Autowired
    private RoomDAO roomDAO;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int hotelId) {
        try {
            List<Room> rooms;
            
            if (hotelId > 0) {
                rooms = roomDAO.getRoomsByHotelId(hotelId);
            } else {
                rooms = roomDAO.getAllRooms();
            }
            
            long total = rooms.size();
            
            // Filter by search if provided
            if (!search.isEmpty()) {
                rooms = rooms.stream()
                    .filter(room -> 
                        room.getRoomNumber().toLowerCase().contains(search.toLowerCase()) ||
                        room.getRoomType().toLowerCase().contains(search.toLowerCase()) ||
                        room.getAmenities().toLowerCase().contains(search.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
                total = rooms.size();
            }
            
            // Simple pagination
            int start = page * size;
            int end = Math.min(start + size, rooms.size());
            List<Room> paginatedRooms = rooms.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("rooms", paginatedRooms);
            response.put("totalElements", total);
            response.put("totalPages", (int) Math.ceil((double) total / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch rooms");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addRoom(@RequestBody Room room) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validation
            if (room.getHotelId() <= 0) {
                response.put("error", "Valid hotel ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getRoomNumber() == null || room.getRoomNumber().trim().isEmpty()) {
                response.put("error", "Room number is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getRoomType() == null || room.getRoomType().trim().isEmpty()) {
                response.put("error", "Room type is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getCapacity() <= 0) {
                response.put("error", "Valid capacity is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getPricePerNight() <= 0) {
                response.put("error", "Valid price per night is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Ensure new rooms are available and active
            room.setAvailable(true);
            room.setActive(true);
            
            roomDAO.addRoom(room);
            response.put("message", "Room added successfully");
            response.put("room", room);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "Error adding room");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRoomById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid room ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            Room room = roomDAO.getRoomById(id);
            if (room == null) {
                response.put("error", "Room not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            response.put("room", room);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error fetching room");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateRoom(@PathVariable int id, @RequestBody Room room) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid room ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if room exists
            Room existingRoom = roomDAO.getRoomById(id);
            if (existingRoom == null) {
                response.put("error", "Room not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Validation
            if (room.getHotelId() <= 0) {
                response.put("error", "Valid hotel ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getRoomNumber() == null || room.getRoomNumber().trim().isEmpty()) {
                response.put("error", "Room number is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getRoomType() == null || room.getRoomType().trim().isEmpty()) {
                response.put("error", "Room type is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getCapacity() <= 0) {
                response.put("error", "Valid capacity is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (room.getPricePerNight() <= 0) {
                response.put("error", "Valid price per night is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            room.setId(id);
            roomDAO.updateRoom(room);
            response.put("message", "Room updated successfully");
            response.put("room", room);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error updating room");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteRoom(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid room ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if room exists
            Room existingRoom = roomDAO.getRoomById(id);
            if (existingRoom == null) {
                response.put("error", "Room not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            roomDAO.deleteRoom(id);
            response.put("message", "Room deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error deleting room");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Map<String, Object>> getRoomsByHotelId(@PathVariable int hotelId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (hotelId <= 0) {
                response.put("error", "Invalid hotel ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<Room> rooms = roomDAO.getRoomsByHotelId(hotelId);
            response.put("rooms", rooms);
            response.put("totalElements", rooms.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error fetching hotel rooms");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}