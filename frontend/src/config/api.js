// API Configuration for Railway Backend
// Replace YOUR_RAILWAY_URL with your actual Railway deployment URL

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  VALIDATE: `${API_BASE_URL}/api/auth/validate`,
  
  // Customer endpoints
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/api/customers/${id}`,
  
  // Hotel endpoints
  HOTELS: `${API_BASE_URL}/api/hotels`,
  HOTEL_BY_ID: (id) => `${API_BASE_URL}/api/hotels/${id}`,
  
  // Room endpoints
  ROOMS: `${API_BASE_URL}/api/rooms`,
  ROOMS_BY_HOTEL: (hotelId) => `${API_BASE_URL}/api/rooms/hotel/${hotelId}`,
  ROOM_BY_ID: (id) => `${API_BASE_URL}/api/rooms/${id}`,
  
  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  BOOKING_BY_ID: (id) => `${API_BASE_URL}/api/bookings/${id}`,
  BOOKINGS_BY_CUSTOMER: (customerId) => `${API_BASE_URL}/api/bookings/customer/${customerId}`,
  
  // Dashboard endpoints
  DASHBOARD_OVERVIEW: `${API_BASE_URL}/api/dashboard/overview`,
  DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard/stats`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/api/users`,
  USER_BY_USERNAME: (username) => `${API_BASE_URL}/api/users/by-username/${username}`,
};

export default API_BASE_URL;
