-- Initialize H2 database with sample data

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Create customers table (enhanced)
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(500),
    date_of_birth DATE,
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hotels table (enhanced)
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    description VARCHAR(1000),
    star_rating DECIMAL(2,1) DEFAULT 0.0,
    manager_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(20) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    price_per_night DECIMAL(10,2) NOT NULL,
    amenities VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Create enhanced bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'PENDING',
    special_requests VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- Insert sample users
INSERT INTO users (username, email, password, role, first_name, last_name, phone) VALUES
('admin', 'admin@hotel.com', 'password', 'ADMIN', 'Admin', 'User', '+1-555-0001'),
('customer1', 'john@example.com', 'password123', 'CUSTOMER', 'John', 'Doe', '+1-555-0101'),
('customer2', 'jane@example.com', 'password456', 'CUSTOMER', 'Jane', 'Smith', '+1-555-0102'),
('customer3', 'bob@example.com', 'password789', 'CUSTOMER', 'Bob', 'Johnson', '+1-555-0103');

-- Insert sample customers
INSERT INTO customers (user_id, name, email, password, phone, loyalty_points) VALUES
(3, 'John Doe', 'john@example.com', 'password123', '+1-555-0101', 100),
(4, 'Jane Smith', 'jane@example.com', 'password456', '+1-555-0102', 150),
(5, 'Bob Johnson', 'bob@example.com', 'password789', '+1-555-0103', 75);

-- Insert sample hotels
INSERT INTO hotels (name, address, city, state, country, phone, email, description, star_rating, manager_id) VALUES
('Grand Hotel', '123 Main St', 'New York', 'NY', 'USA', '+1-555-1001', 'grand@hotel.com', 'Luxury hotel in the heart of New York', 5.0, 2),
('Beach Resort', '456 Ocean Ave', 'Miami', 'FL', 'USA', '+1-555-1002', 'beach@resort.com', 'Beautiful beachfront resort', 4.5, 2),
('Mountain Lodge', '789 Peak Rd', 'Denver', 'CO', 'USA', '+1-555-1003', 'mountain@lodge.com', 'Cozy mountain retreat', 4.0, 2);

-- Insert sample rooms
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, price_per_night, amenities) VALUES
-- Grand Hotel rooms
(1, '101', 'SINGLE', 1, 150.00, 'WiFi, TV, Mini Bar'),
(1, '102', 'DOUBLE', 2, 200.00, 'WiFi, TV, Mini Bar, City View'),
(1, '201', 'SUITE', 4, 400.00, 'WiFi, TV, Mini Bar, City View, Jacuzzi'),
(1, '301', 'DELUXE', 2, 300.00, 'WiFi, TV, Mini Bar, Balcony'),
-- Beach Resort rooms
(2, '101', 'SINGLE', 1, 120.00, 'WiFi, TV, Ocean View'),
(2, '102', 'DOUBLE', 2, 180.00, 'WiFi, TV, Ocean View, Balcony'),
(2, '201', 'SUITE', 4, 350.00, 'WiFi, TV, Ocean View, Balcony, Kitchen'),
(2, '301', 'FAMILY', 6, 280.00, 'WiFi, TV, Ocean View, Kitchen'),
-- Mountain Lodge rooms
(3, '101', 'SINGLE', 1, 90.00, 'WiFi, TV, Fireplace'),
(3, '102', 'DOUBLE', 2, 140.00, 'WiFi, TV, Fireplace, Mountain View'),
(3, '201', 'SUITE', 4, 250.00, 'WiFi, TV, Fireplace, Mountain View, Kitchen'),
(3, '301', 'FAMILY', 6, 200.00, 'WiFi, TV, Fireplace, Kitchen');

-- Insert sample bookings
INSERT INTO bookings (customer_id, hotel_id, room_id, check_in_date, check_out_date, total_amount, status) VALUES
(1, 1, 1, '2024-01-15', '2024-01-17', 300.00, 'CONFIRMED'),
(2, 2, 6, '2024-02-20', '2024-02-23', 540.00, 'CONFIRMED'),
(3, 3, 10, '2024-03-10', '2024-03-12', 280.00, 'CHECKED_OUT'),
(1, 2, 7, '2024-04-05', '2024-04-08', 1050.00, 'PENDING');