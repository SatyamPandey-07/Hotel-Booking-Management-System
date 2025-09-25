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

import com.example.hotelbooking.dao.CustomerDAO;
import com.example.hotelbooking.model.Customer;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class CustomerController {
    @Autowired
    private CustomerDAO customerDAO;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        try {
            List<Customer> customers = customerDAO.getAllCustomers();
            long total = customers.size();
            
            // Filter by search if provided
            if (!search.isEmpty()) {
                customers = customers.stream()
                    .filter(customer -> 
                        customer.getName().toLowerCase().contains(search.toLowerCase()) ||
                        customer.getEmail().toLowerCase().contains(search.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
                total = customers.size();
            }
            
            // Simple pagination
            int start = page * size;
            int end = Math.min(start + size, customers.size());
            List<Customer> paginatedCustomers = customers.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("customers", paginatedCustomers);
            response.put("totalElements", total);
            response.put("totalPages", (int) Math.ceil((double) total / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch customers");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addCustomer(@RequestBody Customer customer) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validation
            if (customer.getName() == null || customer.getName().trim().isEmpty()) {
                response.put("error", "Customer name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (customer.getEmail() == null || customer.getEmail().trim().isEmpty()) {
                response.put("error", "Customer email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (!isValidEmail(customer.getEmail())) {
                response.put("error", "Invalid email format");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (customer.getPassword() == null || customer.getPassword().length() < 6) {
                response.put("error", "Password must be at least 6 characters");
                return ResponseEntity.badRequest().body(response);
            }
            
            customerDAO.addCustomer(customer);
            response.put("message", "Customer added successfully");
            response.put("customer", customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "Error adding customer");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCustomerById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid customer ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            Customer customer = customerDAO.getCustomerById(id);
            if (customer == null) {
                response.put("error", "Customer not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            response.put("customer", customer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error fetching customer");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCustomer(@PathVariable int id, @RequestBody Customer customer) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid customer ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if customer exists
            Customer existingCustomer = customerDAO.getCustomerById(id);
            if (existingCustomer == null) {
                response.put("error", "Customer not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Validation
            if (customer.getName() == null || customer.getName().trim().isEmpty()) {
                response.put("error", "Customer name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (customer.getEmail() == null || customer.getEmail().trim().isEmpty()) {
                response.put("error", "Customer email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (!isValidEmail(customer.getEmail())) {
                response.put("error", "Invalid email format");
                return ResponseEntity.badRequest().body(response);
            }
            
            customer.setId(id);
            customerDAO.updateCustomer(customer);
            response.put("message", "Customer updated successfully");
            response.put("customer", customer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error updating customer");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCustomer(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (id <= 0) {
                response.put("error", "Invalid customer ID");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if customer exists
            Customer existingCustomer = customerDAO.getCustomerById(id);
            if (existingCustomer == null) {
                response.put("error", "Customer not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            customerDAO.deleteCustomer(id);
            response.put("message", "Customer deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error deleting customer");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}