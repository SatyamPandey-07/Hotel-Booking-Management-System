-- Database Performance Optimization - Indexes
-- Run this script after initial schema creation

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_active ON users(active);

-- Booking table indexes
CREATE INDEX IF NOT EXISTS idx_booking_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_booking_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_booking_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_created ON bookings(created_at);

-- Room table indexes
CREATE INDEX IF NOT EXISTS idx_room_hotel ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_room_type ON rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_room_available ON rooms(available);
CREATE INDEX IF NOT EXISTS idx_room_price ON rooms(price);

-- Hotel table indexes
CREATE INDEX IF NOT EXISTS idx_hotel_name ON hotels(name);
CREATE INDEX IF NOT EXISTS idx_hotel_city ON hotels(city);

-- Customer table indexes
CREATE INDEX IF NOT EXISTS idx_customer_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_phone ON customers(phone);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_booking_customer_dates ON bookings(customer_id, check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_room_hotel_available ON rooms(hotel_id, available);
CREATE INDEX IF NOT EXISTS idx_user_username_active ON users(username, active);
