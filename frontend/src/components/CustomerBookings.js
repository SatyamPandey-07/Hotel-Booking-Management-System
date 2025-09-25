import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card, LoadingSpinner, Alert, Button } from './ui';

function CustomerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      // For demo, using mock data. In real app, use customer-specific endpoint
      const response = await axios.get('/api/bookings');
      
      // Handle structured API response - bookings are in response.data.bookings
      let bookingsData = [];
      if (response.data && response.data.bookings && Array.isArray(response.data.bookings)) {
        bookingsData = response.data.bookings;
      } else if (Array.isArray(response.data)) {
        bookingsData = response.data;
      }
      
      // Filter bookings for current customer (demo logic)
      const myBookings = bookingsData.filter(booking => 
        booking.customerName === user?.firstName + ' ' + user?.lastName ||
        booking.customerId === user?.id
      );
      
      setBookings(myBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Mock data for demo
      setBookings([
        {
          id: 1,
          hotelName: 'Grand Hotel',
          roomNumber: '101',
          checkInDate: '2024-12-01',
          checkOutDate: '2024-12-03',
          totalAmount: 300.00,
          status: 'CONFIRMED',
          roomType: 'SINGLE'
        },
        {
          id: 2,
          hotelName: 'Beach Resort',
          roomNumber: '205',
          checkInDate: '2024-12-15',
          checkOutDate: '2024-12-18',
          totalAmount: 540.00,
          status: 'PENDING',
          roomType: 'SUITE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'var(--success-color)';
      case 'PENDING': return 'var(--warning-color)';
      case 'CHECKED_OUT': return 'var(--info-color)';
      case 'CANCELLED': return 'var(--danger-color)';
      default: return 'var(--gray-600)';
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`/api/bookings/${bookingId}/status`, { status: 'CANCELLED' });
        fetchMyBookings();
        showAlert('Booking cancelled successfully', 'success');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        showAlert('Failed to cancel booking', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <h1>📝 My Bookings</h1>
          <p>Manage your hotel reservations</p>
        </div>
        <div className="flex-center" style={{ padding: 'var(--spacing-2xl)' }}>
          <LoadingSpinner size="large" />
          <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>📝 My Bookings</h1>
        <p>Manage your hotel reservations and travel history</p>
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-lg)' }}>🏨</div>
            <h3>No Bookings Yet</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-lg)' }}>
              You haven't made any hotel bookings yet. Start exploring our amazing hotels!
            </p>
            <Button onClick={() => window.location.href = '/hotels'}>
              Browse Hotels
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-lg">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                    <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>
                      {booking.hotelName}
                    </h3>
                    <span style={{
                      background: getStatusColor(booking.status),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div>
                      <strong>Room:</strong> {booking.roomNumber} ({booking.roomType})
                    </div>
                    <div>
                      <strong>Amount:</strong> {formatCurrency(booking.totalAmount)}
                    </div>
                    <div>
                      <strong>Check-in:</strong> {formatDate(booking.checkInDate)}
                    </div>
                    <div>
                      <strong>Check-out:</strong> {formatDate(booking.checkOutDate)}
                    </div>
                  </div>
                  
                  {booking.specialRequests && (
                    <div style={{ 
                      background: 'var(--gray-50)', 
                      padding: 'var(--spacing-sm)', 
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: 'var(--spacing-md)'
                    }}>
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  {booking.status === 'PENDING' && (
                    <Button 
                      variant="danger" 
                      size="small"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => showAlert('Modification feature coming soon!', 'info')}
                    >
                      Modify
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
        <Button onClick={() => window.location.href = '/hotels'}>
          Book Another Hotel
        </Button>
      </div>
    </div>
  );
}

export default CustomerBookings;