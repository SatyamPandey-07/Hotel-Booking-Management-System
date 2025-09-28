import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Alert, LoadingSpinner, Modal } from './ui';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  HomeIcon,
  WifiIcon,
  TvIcon,
  ShieldCheckIcon,
  StarIcon,
  CalendarDaysIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

function Rooms() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [newRoom, setNewRoom] = useState({
    hotelId: '',
    roomNumber: '',
    roomType: 'DOUBLE',
    capacity: 2,
    pricePerNight: '',
    amenities: '',
    isAvailable: true
  });
  const [editRoom, setEditRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [errors, setErrors] = useState({});
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  // Role-based permissions
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'CUSTOMER';
  
  // Get hotel ID from URL params if navigating from hotels page
  const urlParams = new URLSearchParams(location.search);
  const hotelIdFromUrl = urlParams.get('hotelId');

  const roomTypes = [
    { value: 'SINGLE', label: '🛏️ Single Room', capacity: 1 },
    { value: 'DOUBLE', label: '🛏️🛏️ Double Room', capacity: 2 },
    { value: 'SUITE', label: '🏠 Suite', capacity: 4 },
    { value: 'DELUXE', label: '✨ Deluxe Room', capacity: 2 },
    { value: 'FAMILY', label: '👨‍👩‍👧‍👦 Family Room', capacity: 6 }
  ];

  useEffect(() => {
    fetchRooms();
    fetchHotels();
    
    // Set selected hotel from URL
    if (hotelIdFromUrl) {
      setSelectedHotel(hotelIdFromUrl);
    }
  }, [hotelIdFromUrl]);

  // Re-fetch rooms when selected hotel changes
  useEffect(() => {
    fetchRooms();
  }, [selectedHotel]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // Always use hotel-specific endpoint when a hotel is selected, otherwise get all hotels' rooms
      let allRooms = [];
      
      if (selectedHotel) {
        // Fetch rooms for the selected hotel only
        const response = await axios.get(`http://localhost:8080/api/rooms/hotel/${selectedHotel}`);
        console.log('Rooms response for hotel:', selectedHotel, response.data);
        if (response.data.rooms) {
          allRooms = response.data.rooms;
        }
      } else {
        // Fetch rooms from all hotels using hotel-specific endpoints (workaround for getAllRooms bug)
        const hotelsResponse = await axios.get('http://localhost:8080/api/hotels');
        const hotels = hotelsResponse.data.hotels || hotelsResponse.data;
        
        for (const hotel of hotels) {
          try {
            const response = await axios.get(`http://localhost:8080/api/rooms/hotel/${hotel.id}`);
            if (response.data.rooms) {
              allRooms = [...allRooms, ...response.data.rooms];
            }
          } catch (error) {
            console.warn(`Failed to fetch rooms for hotel ${hotel.id}:`, error);
          }
        }
      }
      
      setRooms(allRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      showAlert('Error connecting to server. Please ensure backend is running on port 8080.', 'error');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/hotels');
      console.log('Hotels for rooms:', response.data);
      
      if (response.data.hotels) {
        setHotels(response.data.hotels);
      } else {
        setHotels(response.data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    }
  };

  const validateBooking = () => {
    const newErrors = {};
    
    if (!bookingData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }
    
    if (!bookingData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }
    
    if (bookingData.checkIn && bookingData.checkOut) {
      if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
        newErrors.checkOut = 'Check-out must be after check-in';
      }
      
      if (new Date(bookingData.checkIn) < new Date()) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }
    }
    
    if (bookingData.guests < 1 || bookingData.guests > selectedRoom?.capacity) {
      newErrors.guests = `Guests must be between 1 and ${selectedRoom?.capacity}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateBooking()) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const bookingPayload = {
        customerId: user.id,
        hotelId: selectedRoom.hotelId,
        roomId: selectedRoom.id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        totalAmount: calculateTotalAmount(),
        specialRequests: bookingData.specialRequests
      };
      
      const response = await axios.post('http://localhost:8080/api/bookings', bookingPayload);
      console.log('Booking response:', response.data);
      showAlert('Room booked successfully! Confirmation details sent to your email.', 'success');
      setShowBookingModal(false);
      setBookingData({ checkIn: '', checkOut: '', guests: 1, specialRequests: '' });
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      showAlert('Booking successful! (Demo mode - connect backend for real bookings)', 'success');
      setShowBookingModal(false);
      setBookingData({ checkIn: '', checkOut: '', guests: 1, specialRequests: '' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !selectedRoom) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * selectedRoom.pricePerNight;
  };

  const openBookingModal = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
    // Reset all booking data when opening modal
    setBookingData({
      checkIn: '',
      checkOut: '',
      guests: 1,
      specialRequests: ''
    });
    setErrors({});
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRoomTypeIcon = (roomType) => {
    const icons = {
      'SINGLE': '🛏️',
      'DOUBLE': '🛏️🛏️', 
      'SUITE': '🏠',
      'DELUXE': '✨',
      'FAMILY': '👨‍👩‍👧‍👦'
    };
    return icons[roomType] || '🏨';
  };

  // Admin room management functions
  const validateRoom = (room) => {
    const newErrors = {};
    if (!room.hotelId) newErrors.hotelId = 'Hotel is required';
    if (!room.roomNumber?.trim()) newErrors.roomNumber = 'Room number is required';
    if (!room.roomType) newErrors.roomType = 'Room type is required';
    if (room.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (room.pricePerNight <= 0) newErrors.pricePerNight = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!validateRoom(newRoom)) return;
    
    try {
      setSubmitLoading(true);
      const response = await axios.post('http://localhost:8080/api/rooms', newRoom);
      console.log('Room added:', response.data);
      setNewRoom({
        hotelId: hotelIdFromUrl || '',
        roomNumber: '',
        roomType: 'DOUBLE',
        capacity: 2,
        pricePerNight: '',
        amenities: '',
        isAvailable: true
      });
      setShowForm(false);
      setErrors({});
      fetchRooms();
      showAlert('Room added successfully!', 'success');
    } catch (error) {
      console.error('Error adding room:', error);
      showAlert('Error adding room. Please check if backend server is running.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditRoom({ ...room });
    setShowEditModal(true);
    setErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateRoom(editRoom)) return;
    
    try {
      setSubmitLoading(true);
      const response = await axios.put(`http://localhost:8080/api/rooms/${editRoom.id}`, editRoom);
      console.log('Room updated:', response.data);
      setShowEditModal(false);
      setErrors({});
      fetchRooms();
      showAlert('Room updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating room:', error);
      showAlert('Error updating room. Please check if backend server is running.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/rooms/${roomId}`);
      fetchRooms();
      showAlert('Room deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting room:', error);
      showAlert('Error deleting room. Please try again.', 'error');
    }
  };

  const handleRoomInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRoom(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditRoom(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Get page info based on context
  const getPageInfo = () => {
    if (hotelIdFromUrl && rooms.length > 0) {
      const hotelName = rooms[0]?.hotelName || 'Selected Hotel';
      return {
        title: isUser ? `🏠 ${hotelName} - Available Rooms` : `🏠 Manage Rooms - ${hotelName}`,
        description: isUser ? 'Choose your perfect room and book your stay' : 'Manage rooms for this hotel'
      };
    }
    
    return {
      title: isUser ? '🏠 Browse All Rooms' : '🏠 Room Management',
      description: isUser ? 'Find and book the perfect room for your stay' : 'Manage all rooms across hotels'
    };
  };

  const pageInfo = getPageInfo();

  // Filter rooms based on search and hotel selection
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.amenities?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.hotelName?.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesHotel = !selectedHotel || room.hotelId.toString() === selectedHotel;
    
    return matchesSearch && matchesHotel;
  });

  return (
    <div>
      <div className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <h1>{pageInfo.title}</h1>
          <p>{pageInfo.description}</p>
          
          {hotelIdFromUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => navigate('/hotels')}
                variant="outline"
                style={{ marginTop: 'var(--spacing-sm)' }}
              >
                ← Back to Hotels
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Admin Add Room Button */}
      {isAdmin && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-lg)' }}>
          <Button 
            onClick={() => setShowForm(!showForm)}
            style={{
              background: showForm ? '#dc2626' : '#059669',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <PlusIcon className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Room'}
          </Button>
        </div>
      )}

      {/* Add Room Form */}
      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 'var(--spacing-xl)' }}
          >
            <Card>
              <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <PlusIcon className="w-5 h-5" style={{ color: '#059669' }} />
                Add New Room
              </h3>
              
              <form onSubmit={handleRoomSubmit}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: 'var(--spacing-lg)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <div>
                    <label>Hotel *</label>
                    <select
                      name="hotelId"
                      value={newRoom.hotelId}
                      onChange={handleRoomInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        border: errors.hotelId ? '2px solid #dc2626' : '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius)'
                      }}
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map(hotel => (
                        <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                      ))}
                    </select>
                    {errors.hotelId && <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{errors.hotelId}</span>}
                  </div>

                  <Input
                    label="Room Number *"
                    name="roomNumber"
                    value={newRoom.roomNumber}
                    onChange={handleRoomInputChange}
                    required
                    error={errors.roomNumber}
                    placeholder="e.g., 101, A-205"
                  />

                  <div>
                    <label>Room Type *</label>
                    <select
                      name="roomType"
                      value={newRoom.roomType}
                      onChange={handleRoomInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        border: errors.roomType ? '2px solid #dc2626' : '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius)'
                      }}
                    >
                      {roomTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {errors.roomType && <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{errors.roomType}</span>}
                  </div>

                  <Input
                    label="Capacity *"
                    name="capacity"
                    type="number"
                    min="1"
                    max="10"
                    value={newRoom.capacity}
                    onChange={handleRoomInputChange}
                    required
                    error={errors.capacity}
                    placeholder="Maximum guests"
                  />

                  <Input
                    label="Price Per Night ($) *"
                    name="pricePerNight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRoom.pricePerNight}
                    onChange={handleRoomInputChange}
                    required
                    error={errors.pricePerNight}
                    placeholder="199.99"
                  />
                </div>

                <Input
                  label="Amenities"
                  name="amenities"
                  value={newRoom.amenities}
                  onChange={handleRoomInputChange}
                  placeholder="WiFi, TV, Mini Bar, City View, Air Conditioning..."
                  style={{ marginBottom: 'var(--spacing-lg)' }}
                />

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={submitLoading}
                    style={{ background: '#059669', color: 'white' }}
                  >
                    {submitLoading ? 'Adding...' : 'Add Room'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        {/* Search and Filter Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 'var(--spacing-lg)', 
          marginBottom: 'var(--spacing-xl)' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
              🔍 Search Rooms
            </label>
            <Input
              placeholder="Search by room number, type, or amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          {!hotelIdFromUrl && (
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
                🏨 Filter by Hotel
              </label>
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--gray-300)',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Hotels</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Room Grid */}
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {loading ? (
            <div className="flex-center" style={{ padding: 'var(--spacing-xl)' }}>
              <LoadingSpinner size="large" />
              <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading rooms...</span>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
              <HomeIcon className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--gray-400)' }} />
              <h3>No Rooms Found</h3>
              <p>{searchTerm || selectedHotel ? 'No rooms match your search criteria.' : 'No rooms available.'}</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
              gap: 'var(--spacing-lg)' 
            }}>
              <AnimatePresence>
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    style={{
                      background: 'white',
                      border: '2px solid var(--gray-200)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--spacing-xl)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Room Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: 'var(--spacing-md)',
                      right: 'var(--spacing-md)',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      background: room.isAvailable ? 'linear-gradient(135deg, #059669, #10b981)' : '#ef4444',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {room.isAvailable ? '✅ Available' : '❌ Booked'}
                    </div>

                    {/* Room Header */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                        <span style={{ fontSize: '2rem' }}>{getRoomTypeIcon(room.roomType)}</span>
                        <div>
                          <h3 style={{ 
                            margin: 0, 
                            fontSize: '1.5rem', 
                            fontWeight: '700',
                            color: 'var(--primary-color)'
                          }}>
                            Room {room.roomNumber}
                          </h3>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '1rem',
                            color: 'var(--gray-600)',
                            fontWeight: '500'
                          }}>
                            {roomTypes.find(type => type.value === room.roomType)?.label}
                          </p>
                        </div>
                      </div>
                      
                      <p style={{ 
                        margin: 0,
                        fontSize: '0.875rem', 
                        color: 'var(--gray-600)',
                        fontWeight: '500'
                      }}>
                        🏨 {room.hotelName}
                      </p>
                    </div>

                    {/* Room Details */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: 'var(--spacing-md)', 
                      marginBottom: 'var(--spacing-lg)',
                      padding: 'var(--spacing-md)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacity</span>
                        <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                          👥 {room.capacity} guests
                        </div>
                      </div>
                      
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</span>
                        <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                          📐 {room.size || '25 sqm'}
                        </div>
                      </div>
                      
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bed</span>
                        <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                          🛏️ {room.bedType || 'Queen'}
                        </div>
                      </div>
                      
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View</span>
                        <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                          🪟 {room.view || 'Standard'}
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
                        ✨ Amenities
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 'var(--spacing-xs)',
                        fontSize: '0.75rem'
                      }}>
                        {room.amenities?.split(', ').map((amenity, i) => (
                          <span 
                            key={i}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: 'var(--primary-color)20',
                              color: 'var(--primary-color)',
                              borderRadius: '12px',
                              fontWeight: '500'
                            }}
                          >
                            {amenity}
                          </span>
                        )) || (
                          <span style={{ color: 'var(--gray-500)' }}>Standard amenities included</span>
                        )}
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: 'var(--spacing-md)',
                      borderTop: '1px solid var(--gray-200)'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '2rem', 
                          fontWeight: '900', 
                          color: 'var(--success-color)' 
                        }}>
                          {formatCurrency(room.pricePerNight)}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          per night
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        {isUser && room.isAvailable && (
                          <Button
                            onClick={() => openBookingModal(room)}
                            className="btn-success"
                            style={{
                              background: 'linear-gradient(135deg, #059669, #10b981)',
                              border: 'none',
                              color: 'white',
                              fontWeight: '600',
                              padding: 'var(--spacing-sm) var(--spacing-lg)'
                            }}
                          >
                            🏨 Book Now
                          </Button>
                        )}
                        
                        {isAdmin && (
                          <>
                            <Button
                              onClick={() => handleEdit(room)}
                              variant="outline"
                              size="small"
                              style={{
                                borderColor: '#3b82f6',
                                color: '#3b82f6',
                                marginRight: 'var(--spacing-xs)'
                              }}
                            >
                              <PencilIcon className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(room.id)}
                              variant="outline"
                              size="small"
                              style={{
                                borderColor: '#dc2626',
                                color: '#dc2626'
                              }}
                            >
                              <TrashIcon className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Card>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title={`🏨 Book Room ${selectedRoom?.roomNumber}`}
        footer={
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
            <Button 
              variant="outline" 
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBookingSubmit} 
              disabled={submitLoading}
              className="btn-success"
            >
              {submitLoading ? <LoadingSpinner size="small" /> : '✅ Confirm Booking'}
            </Button>
          </div>
        }
      >
        {selectedRoom && (
          <form onSubmit={handleBookingSubmit}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-sm)', color: 'var(--primary-color)' }}>
                {selectedRoom.hotelName} - Room {selectedRoom.roomNumber}
              </h4>
              <p style={{ margin: 0, color: 'var(--gray-600)' }}>
                {roomTypes.find(type => type.value === selectedRoom.roomType)?.label} • 
                Capacity: {selectedRoom.capacity} guests • 
                {formatCurrency(selectedRoom.pricePerNight)}/night
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
              <Input
                label="Check-in Date"
                type="date"
                value={bookingData.checkIn}
                onChange={(e) => {
                  setBookingData(prev => ({ ...prev, checkIn: e.target.value }));
                  // Clear error when user starts typing
                  if (errors.checkIn) {
                    setErrors(prev => ({ ...prev, checkIn: null }));
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                required
                error={errors.checkIn}
              />
              
              <Input
                label="Check-out Date"
                type="date"
                value={bookingData.checkOut}
                onChange={(e) => {
                  setBookingData(prev => ({ ...prev, checkOut: e.target.value }));
                  // Clear error when user starts typing
                  if (errors.checkOut) {
                    setErrors(prev => ({ ...prev, checkOut: null }));
                  }
                }}
                min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                required
                error={errors.checkOut}
              />
            </div>
            
            <Input
              label="Number of Guests"
              type="number"
              min="1"
              max={selectedRoom.capacity}
              value={bookingData.guests}
              onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              required
              error={errors.guests}
            />
            
            <Input
              label="Special Requests (Optional)"
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Any special requests or preferences..."
            />
            
            {bookingData.checkIn && bookingData.checkOut && (
              <div style={{ 
                padding: 'var(--spacing-md)', 
                background: 'var(--gray-50)', 
                borderRadius: 'var(--radius-md)', 
                marginTop: 'var(--spacing-md)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                  <span>Duration:</span>
                  <span>{Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))} nights</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem', color: 'var(--success-color)' }}>
                  <span>Total Amount:</span>
                  <span>{formatCurrency(calculateTotalAmount())}</span>
                </div>
              </div>
            )}
          </form>
        )}
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Room"
        footer={
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSubmit} 
              loading={submitLoading}
              style={{ background: '#059669', color: 'white' }}
            >
              {submitLoading ? 'Updating...' : 'Update Room'}
            </Button>
          </div>
        }
      >
        {editRoom && (
          <form onSubmit={handleUpdateSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div>
                <label>Hotel *</label>
                <select
                  name="hotelId"
                  value={editRoom.hotelId}
                  onChange={handleEditInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    border: errors.hotelId ? '2px solid #dc2626' : '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)'
                  }}
                >
                  <option value="">Select Hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                  ))}
                </select>
                {errors.hotelId && <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{errors.hotelId}</span>}
              </div>

              <Input
                label="Room Number *"
                name="roomNumber"
                value={editRoom.roomNumber}
                onChange={handleEditInputChange}
                required
                error={errors.roomNumber}
              />

              <div>
                <label>Room Type *</label>
                <select
                  name="roomType"
                  value={editRoom.roomType}
                  onChange={handleEditInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    border: errors.roomType ? '2px solid #dc2626' : '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)'
                  }}
                >
                  {roomTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.roomType && <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{errors.roomType}</span>}
              </div>

              <Input
                label="Capacity *"
                name="capacity"
                type="number"
                min="1"
                max="10"
                value={editRoom.capacity}
                onChange={handleEditInputChange}
                required
                error={errors.capacity}
              />

              <Input
                label="Price Per Night ($) *"
                name="pricePerNight"
                type="number"
                min="0"
                step="0.01"
                value={editRoom.pricePerNight}
                onChange={handleEditInputChange}
                required
                error={errors.pricePerNight}
              />
            </div>

            <Input
              label="Amenities"
              name="amenities"
              value={editRoom.amenities || ''}
              onChange={handleEditInputChange}
              placeholder="WiFi, TV, Mini Bar, City View, Air Conditioning..."
              style={{ marginBottom: 'var(--spacing-lg)' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={editRoom.isAvailable}
                onChange={handleEditInputChange}
                id="editAvailable"
              />
              <label htmlFor="editAvailable">Room is available for booking</label>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Rooms;