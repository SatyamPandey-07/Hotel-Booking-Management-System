import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Input, Select, Alert, LoadingSpinner, Modal } from './ui';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [newBooking, setNewBooking] = useState({
    customerId: '',
    hotelId: '',
    bookingDate: ''
  });
  const [editBooking, setEditBooking] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
      fetchBookings(),
      fetchCustomers(),
      fetchHotels()
    ]);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings');
      
      // Handle both old and new API response formats
      if (response.data.bookings) {
        setBookings(response.data.bookings);
      } else {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showAlert('Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      if (response.data.customers) {
        setCustomers(response.data.customers);
      } else {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
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

  const validateForm = (booking) => {
    const newErrors = {};
    
    if (!booking.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    
    if (!booking.hotelId) {
      newErrors.hotelId = 'Hotel is required';
    }
    
    if (!booking.bookingDate) {
      newErrors.bookingDate = 'Booking date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBooking(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newBooking)) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const bookingData = {
        customerId: parseInt(newBooking.customerId),
        hotelId: parseInt(newBooking.hotelId),
        bookingDate: newBooking.bookingDate
      };
      const response = await axios.post('/api/bookings', bookingData);
      
      setNewBooking({ customerId: '', hotelId: '', bookingDate: '' });
      setShowForm(false);
      setErrors({});
      fetchBookings();
      
      const message = response.data.message || 'Booking added successfully!';
      showAlert(message, 'success');
    } catch (error) {
      console.error('Error adding booking:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error adding booking';
      showAlert(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setEditBooking({
      ...booking,
      customerId: booking.customerId.toString(),
      hotelId: booking.hotelId.toString(),
      bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0]
    });
    setShowEditModal(true);
    setErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editBooking)) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const bookingData = {
        customerId: parseInt(editBooking.customerId),
        hotelId: parseInt(editBooking.hotelId),
        bookingDate: editBooking.bookingDate
      };
      const response = await axios.put(`/api/bookings/${editBooking.id}`, bookingData);
      
      setShowEditModal(false);
      setEditBooking(null);
      setErrors({});
      fetchBookings();
      
      const message = response.data.message || 'Booking updated successfully!';
      showAlert(message, 'success');
    } catch (error) {
      console.error('Error updating booking:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error updating booking';
      showAlert(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await axios.delete(`/api/bookings/${id}`);
        fetchBookings();
        
        const message = response.data.message || 'Booking deleted successfully!';
        showAlert(message, 'success');
      } catch (error) {
        console.error('Error deleting booking:', error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error deleting booking';
        showAlert(errorMessage, 'error');
      }
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const filteredBookings = bookings.filter(booking => {
    const customerName = getCustomerName(booking.customerId).toLowerCase();
    const hotelName = getHotelName(booking.hotelId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return customerName.includes(searchLower) || 
           hotelName.includes(searchLower) ||
           booking.id.toString().includes(searchLower);
  });

  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: `${customer.name} (${customer.email})`
  }));

  const hotelOptions = hotels.map(hotel => ({
    value: hotel.id,
    label: `${hotel.name} - ${hotel.address}`
  }));

  return (
    <div>
      <div className="header">
        <h1>Booking Management</h1>
        <p>Manage hotel reservations and bookings</p>
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      
      <Card
        title="Bookings"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Booking'}
          </Button>
        }
      >
        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search bookings by customer, hotel, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {showForm && (
          <div className="form-container">
            <h3>Add New Booking</h3>
            <form onSubmit={handleSubmit}>
              <Select
                label="Customer"
                name="customerId"
                value={newBooking.customerId}
                onChange={handleInputChange}
                options={customerOptions}
                placeholder="Select Customer"
                required
                error={errors.customerId}
              />
              <Select
                label="Hotel"
                name="hotelId"
                value={newBooking.hotelId}
                onChange={handleInputChange}
                options={hotelOptions}
                placeholder="Select Hotel"
                required
                error={errors.hotelId}
              />
              <Input
                label="Booking Date"
                type="date"
                name="bookingDate"
                value={newBooking.bookingDate}
                onChange={handleInputChange}
                required
                error={errors.bookingDate}
              />
              <div className="flex gap-sm">
                <Button type="submit" loading={submitLoading}>
                  Add Booking
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
              <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading bookings...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
              {searchTerm ? 'No bookings found matching your search.' : 'No bookings found.'}
            </div>
          ) : (
            <div className="grid gap-md">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="list-item">
                  <div className="list-item-header">
                    <div className="list-item-content">
                      <div className="list-item-title">Booking #{booking.id}</div>
                      <div className="list-item-subtitle">Customer: {getCustomerName(booking.customerId)}</div>
                      <div className="list-item-subtitle">Hotel: {getHotelName(booking.hotelId)}</div>
                      <div className="list-item-subtitle">Date: {new Date(booking.bookingDate).toLocaleDateString()}</div>
                    </div>
                    <div className="list-item-actions">
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => handleEdit(booking)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleDelete(booking.id)}
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
        title="Edit Booking"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} loading={submitLoading}>
              Update Booking
            </Button>
          </>
        }
      >
        {editBooking && (
          <form onSubmit={handleUpdateSubmit}>
            <Select
              label="Customer"
              name="customerId"
              value={editBooking.customerId}
              onChange={handleEditInputChange}
              options={customerOptions}
              placeholder="Select Customer"
              required
              error={errors.customerId}
            />
            <Select
              label="Hotel"
              name="hotelId"
              value={editBooking.hotelId}
              onChange={handleEditInputChange}
              options={hotelOptions}
              placeholder="Select Hotel"
              required
              error={errors.hotelId}
            />
            <Input
              label="Booking Date"
              type="date"
              name="bookingDate"
              value={editBooking.bookingDate}
              onChange={handleEditInputChange}
              required
              error={errors.bookingDate}
            />
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Bookings;