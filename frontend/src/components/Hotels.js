import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input, Alert, LoadingSpinner, Modal } from './ui';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

function Hotels() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    description: '',
    starRating: 5,
    managerId: ''
  });
  const [editHotel, setEditHotel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  
  // Simplified role-based permissions (ADMIN and USER only)
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'CUSTOMER' || user?.role === 'USER';
  
  // Determine what user can do
  const canAddHotels = isAdmin; // Only admin can add hotels
  const canEditHotels = isAdmin; // Only admin can edit hotels
  const canDeleteHotels = isAdmin; // Only admin can delete hotels
  const canViewDetails = true; // Everyone can view hotel details
  const canBookRooms = isUser; // Only users can book rooms

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hotels');
      
      // Handle both old and new API response formats
      if (response.data.hotels) {
        setHotels(response.data.hotels);
      } else {
        setHotels(response.data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      
      // Provide mock data when backend is not available
      const mockHotels = [
        {
          id: 1,
          name: 'Grand Palace Hotel',
          address: '123 Broadway Ave, New York, NY 10001',
          city: 'New York',
          country: 'USA',
          description: 'Luxury hotel in the heart of Manhattan with world-class amenities and breathtaking city views.',
          starRating: 5,
          managerId: 2,
          isActive: true
        },
        {
          id: 2,
          name: 'Seaside Resort & Spa',
          address: '456 Ocean Drive, Miami Beach, FL 33139',
          city: 'Miami Beach',
          country: 'USA',
          description: 'Beachfront resort offering pristine beaches, spa services, and gourmet dining experiences.',
          starRating: 4,
          managerId: 2,
          isActive: true
        },
        {
          id: 3,
          name: 'Mountain View Lodge',
          address: '789 Alpine Way, Aspen, CO 81611',
          city: 'Aspen',
          country: 'USA',
          description: 'Cozy mountain lodge perfect for skiing and outdoor adventures with rustic charm.',
          starRating: 4,
          managerId: 2,
          isActive: true
        }
      ];
      
      setHotels(mockHotels);
      if (!error.response || error.response.status >= 500) {
        showAlert('Using demo data - Connect to backend for live hotel data', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (hotel) => {
    const newErrors = {};
    
    if (!hotel.name?.trim()) {
      newErrors.name = 'Hotel name is required';
    }
    
    if (!hotel.address?.trim()) {
      newErrors.address = 'Hotel address is required';
    }
    
    if (!hotel.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!hotel.country?.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (hotel.starRating < 1 || hotel.starRating > 5) {
      newErrors.starRating = 'Star rating must be between 1 and 5';
    }
    
    // Only admin needs to assign manager (simplified)
    if (isAdmin && (!hotel.managerId || parseInt(hotel.managerId) <= 0)) {
      newErrors.managerId = 'Valid manager ID is required for admin';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditHotel(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newHotel)) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const hotelData = {
        ...newHotel,
        managerId: parseInt(newHotel.managerId)
      };
      const response = await axios.post('/api/hotels', hotelData);
      
      setNewHotel({ 
        name: '', 
        address: '', 
        city: '',
        country: '',
        description: '',
        starRating: 5,
        managerId: '' 
      });
      setShowForm(false);
      setErrors({});
      fetchHotels();
      
      const message = response.data.message || 'Hotel added successfully!';
      showAlert(message, 'success');
    } catch (error) {
      console.error('Error adding hotel:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error adding hotel';
      showAlert(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditHotel({ ...hotel, managerId: hotel.managerId.toString() });
    setShowEditModal(true);
    setErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editHotel)) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const hotelData = {
        ...editHotel,
        managerId: parseInt(editHotel.managerId)
      };
      const response = await axios.put(`/api/hotels/${editHotel.id}`, hotelData);
      
      setShowEditModal(false);
      setEditHotel(null);
      setErrors({});
      fetchHotels();
      
      const message = response.data.message || 'Hotel updated successfully!';
      showAlert(message, 'success');
    } catch (error) {
      console.error('Error updating hotel:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error updating hotel';
      showAlert(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await axios.delete(`/api/hotels/${id}`);
        fetchHotels();
        
        const message = response.data.message || 'Hotel deleted successfully!';
        showAlert(message, 'success');
      } catch (error) {
        console.error('Error deleting hotel:', error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error deleting hotel';
        showAlert(errorMessage, 'error');
      }
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // Role-specific titles and descriptions (ADMIN and USER only)
  const getPageInfo = () => {
    switch(user?.role) {
      case 'ADMIN':
        return {
          title: '🏨 Hotel Management',
          description: 'Manage all hotels in the system - Add, edit, and monitor hotel properties'
        };
      case 'CUSTOMER':
      case 'USER':
        return {
          title: '🏨 Discover Amazing Hotels',
          description: 'Browse our collection of premium hotels and find your perfect stay'
        };
      default:
        return {
          title: '🏨 Hotels',
          description: 'Hotel listings and information'
        };
    }
  };

  const pageInfo = getPageInfo();

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h1>{pageInfo.title}</h1>
        <p>{pageInfo.description}</p>
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      
      <Card
        title={pageInfo.title}
        actions={
          canAddHotels ? (
            <Button 
              onClick={() => setShowForm(!showForm)}
              style={{
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                color: 'white',
                border: 'none'
              }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {showForm ? 'Cancel' : 'Add New Hotel'}
            </Button>
          ) : null
        }
      >
        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder={`Search hotels by name or address...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '2px solid var(--gray-300)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem'
              }}
            />
          </div>
          <MagnifyingGlassIcon className="w-6 h-6" style={{ color: 'var(--gray-500)' }} />
        </div>
        
        {showForm && canAddHotels && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-container"
            style={{
              background: 'linear-gradient(135deg, var(--gray-50), white)',
              border: '2px solid var(--primary-color)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-xl)',
              marginBottom: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h3 style={{ 
              color: 'var(--primary-color)', 
              marginBottom: 'var(--spacing-lg)',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>✨ Add New Hotel</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                <Input
                  label="Hotel Name"
                  name="name"
                  value={newHotel.name}
                  onChange={handleInputChange}
                  required
                  error={errors.name}
                  placeholder="Enter hotel name"
                />
                <Input
                  label="Address"
                  name="address"
                  value={newHotel.address}
                  onChange={handleInputChange}
                  required
                  error={errors.address}
                  placeholder="Enter full address"
                />
                <Input
                  label="City"
                  name="city"
                  value={newHotel.city}
                  onChange={handleInputChange}
                  required
                  error={errors.city}
                  placeholder="Enter city"
                />
                <Input
                  label="Country"
                  name="country"
                  value={newHotel.country}
                  onChange={handleInputChange}
                  required
                  error={errors.country}
                  placeholder="Enter country"
                />
                <Input
                  label="Star Rating"
                  name="starRating"
                  type="number"
                  min="1"
                  max="5"
                  value={newHotel.starRating}
                  onChange={handleInputChange}
                  required
                  error={errors.starRating}
                />
                {isAdmin && (
                  <Input
                    label="Manager ID"
                    name="managerId"
                    type="number"
                    value={newHotel.managerId}
                    onChange={handleInputChange}
                    required
                    error={errors.managerId}
                    placeholder="Enter manager ID"
                  />
                )}
              </div>
              <Input
                label="Description"
                name="description"
                value={newHotel.description}
                onChange={handleInputChange}
                placeholder="Enter hotel description (optional)"
                style={{ marginTop: 'var(--spacing-lg)' }}
              />
              <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                <Button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitLoading}
                  className="btn-success"
                  style={{ minWidth: '120px' }}
                >
                  {submitLoading ? <LoadingSpinner /> : '✅ Add Hotel'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
        
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {loading ? (
            <div className="flex-center" style={{ padding: 'var(--spacing-xl)' }}>
              <LoadingSpinner size="large" />
              <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading hotels...</span>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
              <BuildingOfficeIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--gray-400)' }} />
              <h3>No Hotels Found</h3>
              <p>{searchTerm ? 'No hotels found matching your search.' : 'No hotels available yet.'}</p>
              {canAddHotels && !searchTerm && (
                <Button 
                  onClick={() => setShowForm(true)}
                  style={{ marginTop: 'var(--spacing-lg)' }}
                  className="btn-success"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add First Hotel
                </Button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
              <AnimatePresence>
                {filteredHotels.map(hotel => (
                  <motion.div 
                    key={hotel.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="list-item"
                    style={{
                      background: 'white',
                      border: '2px solid var(--gray-200)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--spacing-xl)',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'all 0.2s ease',
                      cursor: isCustomer ? 'pointer' : 'default'
                    }}
                    whileHover={isCustomer ? { scale: 1.02, boxShadow: 'var(--shadow-lg)' } : {}}
                  >
                    <div className="list-item-header">
                      <div className="list-item-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                          <h3 className="list-item-title" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>
                            {hotel.name}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(Math.floor(hotel.starRating || 5))].map((_, i) => (
                              <span key={i} style={{ color: '#fbbf24', fontSize: '1.2rem' }}>⭐</span>
                            ))}
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            <MapPinIcon className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
                            <span className="list-item-subtitle">{hotel.address}</span>
                          </div>
                          {hotel.city && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                              <span className="list-item-subtitle">📍 {hotel.city}, {hotel.country}</span>
                            </div>
                          )}
                          {isAdmin && hotel.managerId && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                              <UserIcon className="w-4 h-4" style={{ color: 'var(--gray-500)' }} />
                              <span className="list-item-subtitle">Manager ID: {hotel.managerId}</span>
                            </div>
                          )}
                          {isUser && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--success-color)' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>✨ Available for Booking</span>
                            </div>
                          )}
                        </div>
                        
                        {hotel.description && (
                          <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-md)', lineHeight: '1.5' }}>
                            {hotel.description}
                          </p>
                        )}
                        
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                          Hotel ID: #{hotel.id}
                        </div>
                      </div>
                      
                      <div className="list-item-actions" style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                        {canBookRooms && (
                          <>
                            <Button 
                              className="btn-success"
                              style={{ 
                                minWidth: '120px',
                                background: 'linear-gradient(135deg, #059669, #10b981)',
                                border: 'none',
                                color: 'white',
                                fontWeight: '600'
                              }}
                              onClick={() => {
                                // Navigate to rooms for this hotel
                                window.location.href = `/rooms?hotelId=${hotel.id}`;
                              }}
                            >
                              🏠 View Rooms
                            </Button>
                            <Button 
                              variant="outline"
                              style={{ 
                                minWidth: '100px',
                                borderColor: '#6366f1',
                                color: '#6366f1'
                              }}
                            >
                              ❤️ Save Hotel
                            </Button>
                          </>
                        )}
                        
                        {isAdmin && (
                          <>
                            <Button 
                              variant="outline"
                              style={{ 
                                minWidth: '120px',
                                borderColor: '#f59e0b',
                                color: '#f59e0b'
                              }}
                              onClick={() => {
                                window.location.href = `/rooms?hotelId=${hotel.id}`;
                              }}
                            >
                              🏠 Manage Rooms
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => handleEdit(hotel)}
                              style={{ 
                                minWidth: '80px',
                                borderColor: '#6366f1',
                                color: '#6366f1'
                              }}
                            >
                              <PencilIcon className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            
                            <Button 
                              variant="danger" 
                              size="small"
                              onClick={() => handleDelete(hotel.id)}
                              style={{ minWidth: '80px' }}
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
      
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="✏️ Edit Hotel"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} loading={submitLoading} className="btn-success">
              Update Hotel
            </Button>
          </>
        }
      >
        {editHotel && (
          <form onSubmit={handleUpdateSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
              <Input
                label="Hotel Name"
                name="name"
                value={editHotel.name}
                onChange={handleEditInputChange}
                required
                error={errors.name}
              />
              <Input
                label="Address"
                name="address"
                value={editHotel.address}
                onChange={handleEditInputChange}
                required
                error={errors.address}
              />
              <Input
                label="City"
                name="city"
                value={editHotel.city || ''}
                onChange={handleEditInputChange}
                error={errors.city}
              />
              <Input
                label="Country"
                name="country"
                value={editHotel.country || ''}
                onChange={handleEditInputChange}
                error={errors.country}
              />
              <Input
                label="Star Rating"
                name="starRating"
                type="number"
                min="1"
                max="5"
                value={editHotel.starRating || 5}
                onChange={handleEditInputChange}
                error={errors.starRating}
              />
              {isAdmin && (
                <Input
                  label="Manager ID"
                  type="number"
                  name="managerId"
                  value={editHotel.managerId}
                  onChange={handleEditInputChange}
                  required
                  error={errors.managerId}
                />
              )}
            </div>
            <Input
              label="Description"
              name="description"
              value={editHotel.description || ''}
              onChange={handleEditInputChange}
              error={errors.description}
              style={{ marginTop: 'var(--spacing-md)' }}
            />
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Hotels;