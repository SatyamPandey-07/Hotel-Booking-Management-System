import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Input, Alert, LoadingSpinner, Modal } from './ui';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [newRoom, setNewRoom] = useState({
    hotelId: '',
    roomNumber: '',
    roomType: 'SINGLE',
    capacity: 1,
    pricePerNight: '',
    amenities: '',
    isAvailable: true
  });
  const [editRoom, setEditRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [errors, setErrors] = useState({});

  const roomTypes = [
    { value: 'SINGLE', label: 'Single Room' },
    { value: 'DOUBLE', label: 'Double Room' },
    { value: 'SUITE', label: 'Suite' },
    { value: 'DELUXE', label: 'Deluxe Room' },
    { value: 'FAMILY', label: 'Family Room' }
  ];

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/rooms');
      
      if (response.data.rooms) {
        setRooms(response.data.rooms);
      } else {
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      showAlert('Failed to fetch rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/api/hotels');
      
      if (response.data.hotels) {
        setHotels(response.data.hotels);
      } else {
        setHotels(response.data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const validateForm = (room) => {
    const newErrors = {};
    
    if (!room.hotelId || room.hotelId === '') {
      newErrors.hotelId = 'Hotel is required';
    }
    
    if (!room.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    
    if (!room.roomType) {
      newErrors.roomType = 'Room type is required';
    }
    
    if (!room.capacity || room.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }
    
    if (!room.pricePerNight || room.pricePerNight <= 0) {
      newErrors.pricePerNight = 'Valid price per night is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setNewRoom(prev => ({ ...prev, [name]: newValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newRoom)) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const response = await axios.post('/api/rooms', {
        ...newRoom,
        hotelId: parseInt(newRoom.hotelId),
        capacity: parseInt(newRoom.capacity),
        pricePerNight: parseFloat(newRoom.pricePerNight)
      });
      
      setNewRoom({
        hotelId: '',
        roomNumber: '',
        roomType: 'SINGLE',
        capacity: 1,
        pricePerNight: '',
        amenities: '',
        isAvailable: true
      });
      setShowForm(false);
      setErrors({});
      fetchRooms();
      
      const message = response.data.message || 'Room added successfully!';
      showAlert(message, 'success');
    } catch (error) {
      console.error('Error adding room:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error adding room';
      showAlert(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.amenities && room.amenities.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesHotel = selectedHotel === '' || room.hotelId.toString() === selectedHotel;
    
    return matchesSearch && matchesHotel;
  });

  return (
    <div>
      <div className="header">
        <h1>Room Management</h1>
        <p>Manage hotel rooms and their details</p>
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      
      <Card
        title="Rooms"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Room'}
          </Button>
        }
      >
        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search rooms by number, type, or amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Filter by Hotel:</label>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">🏨 All Hotels</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id.toString()}>
                  🏨 {hotel.name} - {hotel.city || hotel.location || 'Unknown City'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {showForm && (
          <div className="form-container">
            <h3>Add New Room</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Hotel *</label>
                  <select
                    name="hotelId"
                    value={newRoom.hotelId}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: errors.hotelId ? '2px solid #ef4444' : '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      backgroundColor: errors.hotelId ? '#fef2f2' : 'white'
                    }}
                  >
                    <option value="">🏨 Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        🏨 {hotel.name} - {hotel.city || hotel.location || 'Unknown City'}
                      </option>
                    ))}
                  </select>
                  {errors.hotelId && (
                    <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {errors.hotelId}
                    </div>
                  )}
                </div>
                
                <Input
                  label="Room Number"
                  name="roomNumber"
                  value={newRoom.roomNumber}
                  onChange={handleInputChange}
                  required
                  error={errors.roomNumber}
                  placeholder="e.g., 101, A-205"
                />
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Room Type *</label>
                  <select
                    name="roomType"
                    value={newRoom.roomType}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: errors.roomType ? '2px solid #ef4444' : '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      backgroundColor: errors.roomType ? '#fef2f2' : 'white'
                    }}
                  >
                    {roomTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.value === 'SINGLE' ? '🛏️' : type.value === 'DOUBLE' ? '🛏️🛏️' : type.value === 'SUITE' ? '🏠' : type.value === 'DELUXE' ? '✨' : '👨‍👩‍👧‍👦'} {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.roomType && (
                    <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {errors.roomType}
                    </div>
                  )}
                </div>
                
                <Input
                  label="Capacity"
                  type="number"
                  name="capacity"
                  value={newRoom.capacity}
                  onChange={handleInputChange}
                  required
                  error={errors.capacity}
                  min="1"
                  max="10"
                />
                
                <Input
                  label="Price Per Night ($)"
                  type="number"
                  step="0.01"
                  name="pricePerNight"
                  value={newRoom.pricePerNight}
                  onChange={handleInputChange}
                  required
                  error={errors.pricePerNight}
                  min="0"
                />
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input
                    label="Amenities"
                    name="amenities"
                    value={newRoom.amenities}
                    onChange={handleInputChange}
                    placeholder="e.g., WiFi, TV, Mini Bar, Ocean View"
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="flex items-center gap-sm">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={newRoom.isAvailable}
                      onChange={handleInputChange}
                    />
                    <span>Room is available</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-sm" style={{ marginTop: 'var(--spacing-lg)' }}>
                <Button type="submit" loading={submitLoading}>
                  Add Room
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {loading ? (
            <div className="flex-center" style={{ padding: 'var(--spacing-xl)' }}>
              <LoadingSpinner size="large" />
              <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading rooms...</span>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
              {searchTerm || selectedHotel ? 'No rooms found matching your criteria.' : 'No rooms found.'}
            </div>
          ) : (
            <div className="grid gap-md">
              {filteredRooms.map(room => (
                <div key={room.id} className="list-item">
                  <div className="list-item-header">
                    <div className="list-item-content">
                      <div className="list-item-title">
                        Room {room.roomNumber} - {room.roomType.replace('_', ' ')}
                      </div>
                      <div className="list-item-subtitle">
                        {getHotelName(room.hotelId)} • Capacity: {room.capacity} • ${room.pricePerNight}/night
                      </div>
                      <div className="list-item-subtitle">
                        {room.amenities && `Amenities: ${room.amenities}`}
                      </div>
                      <div style={{ marginTop: 'var(--spacing-xs)' }}>
                        <span 
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: room.isAvailable ? 'var(--secondary-color)' : 'var(--danger-color)',
                            color: 'white'
                          }}
                        >
                          {room.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Rooms;