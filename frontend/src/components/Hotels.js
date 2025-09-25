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
      showAlert('Failed to fetch hotels', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (hotel) => {
    const newErrors = {};
    
    if (!hotel.name.trim()) {
      newErrors.name = 'Hotel name is required';
    }
    
    if (!hotel.address.trim()) {
      newErrors.address = 'Hotel address is required';
    }
    
    if (!hotel.managerId || parseInt(hotel.managerId) <= 0) {
      newErrors.managerId = 'Valid manager ID is required';
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
      
      setNewHotel({ name: '', address: '', managerId: '' });
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

  // Role-specific titles and descriptions
  const getPageInfo = () => {
    switch(user?.role) {
      case 'ADMIN':
        return {
          title: '🏨 Hotel Management',
          description: 'Manage all hotels in the system'
        };
      case 'MANAGER':
        return {
          title: '🏨 My Hotels',
          description: 'Manage your assigned hotels'
        };
      case 'CUSTOMER':
        return {
          title: '🏨 Browse Hotels',
          description: 'Discover and book amazing hotels'
        };
      default:
        return {
          title: 'Hotels',
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
          (user?.role === 'ADMIN' || user?.role === 'MANAGER') ? (
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add New Hotel'}
            </Button>
          ) : null
        }
      >
        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search hotels by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {showForm && (
          <div className="form-container">
            <h3>Add New Hotel</h3>
            <form onSubmit={handleSubmit}>
              <Input
                label="Hotel Name"
                name="name"
                value={newHotel.name}
                onChange={handleInputChange}
                required
                error={errors.name}
              />
              <Input
                label="Address"
                name="address"
                value={newHotel.address}
                onChange={handleInputChange}
                required
                error={errors.address}
              />
              <Input
                label="Manager ID"
                type="number"
                name="managerId"
                value={newHotel.managerId}
                onChange={handleInputChange}
                required
                error={errors.managerId}
              />
              <div className="flex gap-sm">
                <Button type="submit" loading={submitLoading}>
                  Add Hotel
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
              <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading hotels...</span>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
              {searchTerm ? 'No hotels found matching your search.' : 'No hotels found.'}
            </div>
          ) : (
            <div className="grid gap-md">
              {filteredHotels.map(hotel => (
                <div key={hotel.id} className="list-item">
                  <div className="list-item-header">
                    <div className="list-item-content">
                      <div className="list-item-title">{hotel.name}</div>
                      <div className="list-item-subtitle">{hotel.address}</div>
                      <div className="list-item-subtitle">ID: {hotel.id} | Manager ID: {hotel.managerId}</div>
                    </div>
                    <div className="list-item-actions">
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => handleEdit(hotel)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleDelete(hotel.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Hotel"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} loading={submitLoading}>
              Update Hotel
            </Button>
          </>
        }
      >
        {editHotel && (
          <form onSubmit={handleUpdateSubmit}>
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
              label="Manager ID"
              type="number"
              name="managerId"
              value={editHotel.managerId}
              onChange={handleEditInputChange}
              required
              error={errors.managerId}
            />
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Hotels;