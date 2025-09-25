package com.example.hotelbooking.model;

import java.util.Date;

public class Booking {
    private int id;
    private int customerId;
    private int hotelId;
    private Integer roomId; // Can be null for hotel-only bookings
    private Date checkInDate;
    private Date checkOutDate;
    private Date bookingDate;
    private Double totalAmount;
    private String status; // PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED
    private String specialRequests;
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public Booking() {}

    // Constructor with parameters
    public Booking(int id, int customerId, int hotelId, Integer roomId, 
                   Date checkInDate, Date checkOutDate, Date bookingDate, 
                   Double totalAmount, String status, String specialRequests) {
        this.id = id;
        this.customerId = customerId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookingDate = bookingDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.specialRequests = specialRequests;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getHotelId() {
        return hotelId;
    }

    public void setHotelId(int hotelId) {
        this.hotelId = hotelId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Date getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(Date checkInDate) {
        this.checkInDate = checkInDate;
    }

    public Date getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(Date checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Date getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(Date bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", customerId=" + customerId +
                ", hotelId=" + hotelId +
                ", roomId=" + roomId +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", totalAmount=" + totalAmount +
                ", status='" + status + '\'' +
                '}';
    }
}