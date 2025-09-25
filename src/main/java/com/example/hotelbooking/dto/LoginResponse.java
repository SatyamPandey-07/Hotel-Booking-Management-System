package com.example.hotelbooking.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String role;
    private String firstName;
    private String lastName;
    private String message;

    public LoginResponse() {}

    public LoginResponse(String token, String username, String role, String firstName, String lastName, String message) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}