package com.example.hotelbooking.model;

public class Hotel {
    private int id;
    private String name;
    private String address;
    private int managerId;

    // Default constructor
    public Hotel() {}

    // Constructor with parameters
    public Hotel(int id, String name, String address, int managerId) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.managerId = managerId;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getManagerId() {
        return managerId;
    }

    public void setManagerId(int managerId) {
        this.managerId = managerId;
    }

    @Override
    public String toString() {
        return "Hotel{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", managerId=" + managerId +
                '}';
    }
}