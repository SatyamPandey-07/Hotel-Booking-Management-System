package com.example.hotelbooking.model;

public class Room {
    private int id;
    private int hotelId;
    private String roomNumber;
    private String roomType; // SINGLE, DOUBLE, SUITE, DELUXE, FAMILY
    private int capacity;
    private double pricePerNight;
    private String amenities;
    private boolean isAvailable;
    private boolean isActive;

    // Default constructor
    public Room() {}

    // Constructor with parameters
    public Room(int id, int hotelId, String roomNumber, String roomType, 
                int capacity, double pricePerNight, String amenities, 
                boolean isAvailable, boolean isActive) {
        this.id = id;
        this.hotelId = hotelId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.amenities = amenities;
        this.isAvailable = isAvailable;
        this.isActive = isActive;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getHotelId() {
        return hotelId;
    }

    public void setHotelId(int hotelId) {
        this.hotelId = hotelId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", hotelId=" + hotelId +
                ", roomNumber='" + roomNumber + '\'' +
                ", roomType='" + roomType + '\'' +
                ", capacity=" + capacity +
                ", pricePerNight=" + pricePerNight +
                ", isAvailable=" + isAvailable +
                '}';
    }
}