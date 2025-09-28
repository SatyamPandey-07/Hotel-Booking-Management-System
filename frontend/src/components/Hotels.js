import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Alert, LoadingSpinner, Modal } from './ui';
import {
  PlusIcon,
  MapPinIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

function Hotels() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    description: '',
    starRating: 5
  });
  const [editHotel, setEditHotel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'CUSTOMER';

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/hotels');
      console.log('Hotels from backend:', response.data);
      setHotels(response.data.hotels || response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      showAlert('Error connecting to server. Please ensure backend is running on port 8080.', 'error');
      // Show empty state instead of mock data
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (hotel) => {
    const newErrors = {};
    if (!hotel.name?.trim()) newErrors.name = 'Hotel name is required';
    if (!hotel.address?.trim()) newErrors.address = 'Address is required';
    if (!hotel.city?.trim()) newErrors.city = 'City is required';
    if (!hotel.country?.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(newHotel)) return;
    
    try {
      setSubmitLoading(true);
      const response = await axios.post('http://localhost:8080/api/hotels', newHotel);
      console.log('Hotel added:', response.data);
      setNewHotel({ name: '', address: '', city: '', country: '', description: '', starRating: 5 });
      setShowForm(false);
      setErrors({});
      fetchHotels(); // Refresh the list
      showAlert('Hotel added successfully!', 'success');
    } catch (error) {
      console.error('Error adding hotel:', error);
      showAlert('Error adding hotel. Please check if backend server is running.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditHotel({ ...hotel });
    setShowEditModal(true);
    setErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(editHotel)) return;
    
    try {
      setSubmitLoading(true);
      const response = await axios.put(`http://localhost:8080/api/hotels/${editHotel.id}`, editHotel);
      console.log('Hotel updated:', response.data);
      setShowEditModal(false);
      setErrors({});
      fetchHotels(); // Refresh the list
      showAlert('Hotel updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating hotel:', error);
      showAlert('Error updating hotel. Please check if backend server is running.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel(prev => ({ ...prev, [name]: value }));
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

  const filteredHotels = (hotels || []).filter(hotel =>
    hotel && (
      (hotel.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (hotel.address || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (hotel.city || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    )
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon 
        key={i} 
        className="w-4 h-4"
        style={{ 
          color: i < rating ? '#fbbf24' : '#e5e7eb',
          fill: i < rating ? '#fbbf24' : 'transparent'
        }} 
      />
    ));
  };

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Professional Header */}
      <div style={{ 
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              padding: '0.75rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BuildingOfficeIcon className="w-6 h-6" style={{ color: 'white' }} />
            </div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800',
              color: '#1f2937',
              margin: 0,
              background: 'linear-gradient(135deg, #1f2937, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Hotel Management
            </h1>
          </div>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.125rem',
            margin: 0,
            fontWeight: '500'
          }}>
            {isAdmin ? 'Manage your hotel properties and operations' : 'Discover amazing hotels for your next stay'}
          </p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={() => setShowForm(!showForm)}
            style={{
              background: showForm ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '12px',
              boxShadow: showForm 
                ? '0 4px 12px rgba(239, 68, 68, 0.25)' 
                : '0 4px 12px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.2s ease',
              minWidth: '160px'
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            {showForm ? 'Cancel' : 'Add Hotel'}
          </Button>
        )}
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)} style={{ marginBottom: '2rem' }}>
          {alert.message}
        </Alert>
      )}

      {/* Search Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '500px' }}>
          <Input
            placeholder="🔍 Search hotels by name, address, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '1rem',
              backgroundColor: '#f9fafb',
              transition: 'all 0.2s ease'
            }}
          />
        </div>
      </div>

      {/* Add Hotel Form */}
      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <PlusIcon className="w-6 h-6" style={{ color: '#4f46e5' }} />
              Add New Hotel
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
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
              </div>
              
              <Input
                label="Description"
                name="description"
                value={newHotel.description}
                onChange={handleInputChange}
                placeholder="Enter hotel description..."
                style={{ marginBottom: '1.5rem' }}
              />
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  style={{ minWidth: '100px' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={submitLoading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    minWidth: '120px'
                  }}
                >
                  {submitLoading ? 'Adding...' : 'Add Hotel'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotels Grid */}
      <div>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '4rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <LoadingSpinner size="large" />
            <span style={{ marginLeft: '1rem', fontSize: '1.1rem', color: '#6b7280' }}>
              Loading hotels...
            </span>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem', 
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <BuildingOfficeIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              No Hotels Found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {searchTerm ? 'No hotels match your search criteria.' : 'No hotels have been added yet.'}
            </p>
            {isAdmin && !searchTerm && (
              <Button 
                onClick={() => setShowForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 1.5rem'
                }}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Hotel
              </Button>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
            gap: '1.5rem'
          }}>
            <AnimatePresence>
              {filteredHotels.map((hotel, index) => (
                <motion.div 
                  key={hotel.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8, 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                  }}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Hotel Header */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #f8fafc, #e5e7eb)',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '1.375rem', 
                          fontWeight: '700',
                          color: '#1f2937',
                          margin: '0 0 0.5rem 0'
                        }}>
                          {hotel.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                          {renderStars(hotel.starRating)}
                          <span style={{ 
                            marginLeft: '0.5rem', 
                            fontSize: '0.875rem', 
                            color: '#6b7280',
                            fontWeight: '500'
                          }}>
                            {hotel.starRating}.0
                          </span>
                        </div>
                      </div>
                      <div style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        ID: {hotel.id}
                      </div>
                    </div>
                  </div>

                  {/* Hotel Content */}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <MapPinIcon className="w-4 h-4" style={{ 
                        color: '#6b7280', 
                        marginTop: '0.125rem',
                        flexShrink: 0
                      }} />
                      <div>
                        <p style={{ 
                          color: '#374151', 
                          margin: 0, 
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          lineHeight: '1.4'
                        }}>
                          {hotel.address}
                        </p>
                        <p style={{ 
                          color: '#6b7280', 
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.875rem'
                        }}>
                          {hotel.city}, {hotel.country}
                        </p>
                      </div>
                    </div>
                    
                    {hotel.description && (
                      <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '1rem',
                        margin: '1rem 0 1.5rem 0'
                      }}>
                        <h4 style={{
                          color: '#1e293b',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          margin: '0 0 0.5rem 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Description
                        </h4>
                        <p style={{ 
                          color: '#475569', 
                          fontSize: '0.95rem',
                          lineHeight: '1.6',
                          margin: '0',
                          fontWeight: '400'
                        }}>
                          {hotel.description}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.75rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #f3f4f6'
                    }}>
                      {isUser && (
                        <Button 
                          onClick={() => navigate(`/rooms?hotelId=${hotel.id}`)}
                          style={{ 
                            flex: 1,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            padding: '0.75rem 1rem'
                          }}
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Rooms
                        </Button>
                      )}
                      
                      {isAdmin && (
                        <>
                          <Button
                            onClick={() => handleEdit(hotel)}
                            variant="outline"
                            style={{ 
                              flex: 1,
                              borderColor: '#4f46e5',
                              color: '#4f46e5',
                              fontWeight: '600'
                            }}
                          >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => navigate(`/rooms?hotelId=${hotel.id}`)}
                            style={{ 
                              flex: 1,
                              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                              border: 'none',
                              color: 'white',
                              fontWeight: '600'
                            }}
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Rooms
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

      {/* Edit Hotel Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Hotel"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSubmit} 
              loading={submitLoading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none'
              }}
            >
              {submitLoading ? 'Updating...' : 'Update Hotel'}
            </Button>
          </div>
        }
      >
        {editHotel && (
          <form onSubmit={handleUpdateSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
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
                value={editHotel.city}
                onChange={handleEditInputChange}
                required
                error={errors.city}
              />
              <Input
                label="Country"
                name="country"
                value={editHotel.country}
                onChange={handleEditInputChange}
                required
                error={errors.country}
              />
              <Input
                label="Star Rating"
                name="starRating"
                type="number"
                min="1"
                max="5"
                value={editHotel.starRating}
                onChange={handleEditInputChange}
                required
                error={errors.starRating}
              />
            </div>
            <Input
              label="Description"
              name="description"
              value={editHotel.description || ''}
              onChange={handleEditInputChange}
              error={errors.description}
              placeholder="Enter hotel description..."
            />
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Hotels;