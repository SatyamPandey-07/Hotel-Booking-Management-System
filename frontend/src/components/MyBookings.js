import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Alert, LoadingSpinner, Modal } from './ui';
import {
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const bookingStatuses = {
    'PENDING': { icon: '⏳', color: '#f59e0b', label: 'Pending Confirmation' },
    'CONFIRMED': { icon: '✅', color: '#059669', label: 'Confirmed' },
    'CANCELLED': { icon: '❌', color: '#dc2626', label: 'Cancelled' },
    'COMPLETED': { icon: '✨', color: '#7c3aed', label: 'Completed' },
    'CHECKED_IN': { icon: '🏨', color: '#2563eb', label: 'Checked In' }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error('User ID not available');
      }
      const response = await axios.get(`http://localhost:8080/api/bookings/customer/${user.id}`);
      setBookings(response.data.bookings || response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showAlert('Error loading bookings. Using demo data.', 'warning');
      
      // Mock bookings data when backend is not available
      const mockBookings = [
        {
          id: 1,
          hotelName: 'Grand Palace Hotel',
          roomNumber: '101',
          roomType: 'DELUXE',
          checkInDate: '2024-01-15',
          checkOutDate: '2024-01-18',
          totalAmount: 899.97,
          status: 'CONFIRMED',
          bookingDate: '2024-01-01',
          specialRequests: 'Late check-in after 9 PM',
          guests: 2,
          nights: 3
        },
        {
          id: 2,
          hotelName: 'Seaside Resort & Spa',
          roomNumber: '201',
          roomType: 'DOUBLE',
          checkInDate: '2024-02-20',
          checkOutDate: '2024-02-23',
          totalAmount: 599.97,
          status: 'PENDING',
          bookingDate: '2024-01-10',
          specialRequests: 'Ocean view room preferred',
          guests: 2,
          nights: 3
        },
        {
          id: 3,
          hotelName: 'Mountain View Lodge',
          roomNumber: '150',
          roomType: 'SINGLE',
          checkInDate: '2023-12-10',
          checkOutDate: '2023-12-12',
          totalAmount: 299.98,
          status: 'COMPLETED',
          bookingDate: '2023-11-20',
          specialRequests: '',
          guests: 1,
          nights: 2
        },
        {
          id: 4,
          hotelName: 'Grand Palace Hotel',
          roomNumber: '102',
          roomType: 'SUITE',
          checkInDate: '2024-03-15',
          checkOutDate: '2024-03-17',
          totalAmount: 999.98,
          status: 'CANCELLED',
          bookingDate: '2024-01-05',
          specialRequests: 'Honeymoon package',
          guests: 2,
          nights: 2
        }
      ];
      
      setBookings(mockBookings);
      
      if (!error.response || error.response.status >= 500) {
        showAlert('Using demo data - Connect to backend for live booking data', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setCancelLoading(true);
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      showAlert('Booking cancelled successfully', 'success');
      fetchMyBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      // Mock cancellation for demo
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' }
          : booking
      ));
      showAlert('Booking cancelled successfully (Demo mode)', 'success');
    } finally {
      setCancelLoading(false);
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
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canCancelBooking = (booking) => {
    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') return false;
    const checkInDate = new Date(booking.checkInDate);
    const today = new Date();
    return checkInDate > today;
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.checkInDate) >= new Date() && 
    (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
  );

  const pastBookings = bookings.filter(booking => 
    new Date(booking.checkOutDate) < new Date() || 
    booking.status === 'COMPLETED' || 
    booking.status === 'CANCELLED'
  );

  return (
    <div>
      <div className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <h1>📋 My Bookings</h1>
          <p>Manage your hotel reservations and booking history</p>
        </motion.div>
      </div>

      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <Card>
          <div className="flex-center" style={{ padding: 'var(--spacing-xl)' }}>
            <LoadingSpinner size="large" />
            <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading your bookings...</span>
          </div>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <div className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
            <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--gray-400)' }} />
            <h3>No Bookings Found</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-lg)' }}>
              You haven't made any hotel bookings yet.
            </p>
            <Button
              onClick={() => navigate('/hotels')}
              style={{ 
                background: 'var(--primary-color)',
                color: 'white',
                padding: 'var(--spacing-md) var(--spacing-lg)'
              }}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Browse Hotels & Book Now
            </Button>
          </div>
        </Card>
      ) : (
        <div>
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 style={{ 
                  marginBottom: 'var(--spacing-lg)', 
                  color: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  🚀 Upcoming Bookings ({upcomingBookings.length})
                </h2>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
                  gap: 'var(--spacing-lg)' 
                }}>
                  <AnimatePresence>
                    {upcomingBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -3 }}
                        style={{
                          background: 'white',
                          border: '2px solid var(--gray-200)',
                          borderRadius: 'var(--radius-xl)',
                          padding: 'var(--spacing-xl)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: 'var(--spacing-md)',
                          right: 'var(--spacing-md)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          background: bookingStatuses[booking.status]?.color || '#6b7280',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {bookingStatuses[booking.status]?.icon}
                          {bookingStatuses[booking.status]?.label}
                        </div>

                        {/* Hotel & Room Info */}
                        <div style={{ marginBottom: 'var(--spacing-lg)', paddingRight: '120px' }}>
                          <h3 style={{ 
                            margin: '0 0 var(--spacing-sm) 0', 
                            fontSize: '1.5rem', 
                            fontWeight: '700',
                            color: 'var(--primary-color)'
                          }}>
                            {booking.hotelName}
                          </h3>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '1.1rem',
                            color: 'var(--gray-600)',
                            fontWeight: '500'
                          }}>
                            🏨 Room {booking.roomNumber} • {booking.roomType}
                          </p>
                        </div>

                        {/* Booking Details */}
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
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Check-in</span>
                            <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                              📅 {formatDate(booking.checkInDate)}
                            </div>
                          </div>
                          
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Check-out</span>
                            <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                              📅 {formatDate(booking.checkOutDate)}
                            </div>
                          </div>
                          
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Guests</span>
                            <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                              👥 {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                            </div>
                          </div>
                          
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Duration</span>
                            <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                              🌙 {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                            </div>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          paddingTop: 'var(--spacing-md)',
                          borderTop: '1px solid var(--gray-200)'
                        }}>
                          <div>
                            <div style={{ 
                              fontSize: '1.75rem', 
                              fontWeight: '900', 
                              color: 'var(--success-color)' 
                            }}>
                              {formatCurrency(booking.totalAmount)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                              Total amount
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => openDetailsModal(booking)}
                            >
                              <EyeIcon className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                            
                            {canCancelBooking(booking) && (
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancelLoading}
                                style={{ borderColor: '#dc2626', color: '#dc2626' }}
                              >
                                <XCircleIcon className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </Card>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <Card>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 style={{ 
                  marginBottom: 'var(--spacing-lg)', 
                  color: 'var(--gray-700)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  📚 Booking History ({pastBookings.length})
                </h2>

                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                  {pastBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        background: 'white',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-lg)',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto auto',
                        gap: 'var(--spacing-lg)',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        background: `${bookingStatuses[booking.status]?.color}20`,
                        color: bookingStatuses[booking.status]?.color,
                        fontSize: '1.5rem'
                      }}>
                        {bookingStatuses[booking.status]?.icon}
                      </div>
                      
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '700' }}>
                          {booking.hotelName}
                        </h4>
                        <p style={{ margin: 0, color: 'var(--gray-600)' }}>
                          Room {booking.roomNumber} • {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                        </p>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                          {formatCurrency(booking.totalAmount)}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: bookingStatuses[booking.status]?.color,
                          fontWeight: '500' 
                        }}>
                          {bookingStatuses[booking.status]?.label}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => openDetailsModal(booking)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Card>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="📋 Booking Details"
        footer={
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
            <Button 
              variant="outline" 
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
            {selectedBooking && canCancelBooking(selectedBooking) && (
              <Button 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleCancelBooking(selectedBooking.id);
                }}
                style={{ borderColor: '#dc2626', color: '#dc2626' }}
                variant="outline"
              >
                Cancel Booking
              </Button>
            )}
          </div>
        }
      >
        {selectedBooking && (
          <div>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ margin: '0 0 var(--spacing-sm)', color: 'var(--primary-color)' }}>
                {selectedBooking.hotelName}
              </h3>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                background: bookingStatuses[selectedBooking.status]?.color || '#6b7280',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {bookingStatuses[selectedBooking.status]?.icon}
                {bookingStatuses[selectedBooking.status]?.label}
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Booking ID:</strong>
                <span>#{selectedBooking.id}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Room:</strong>
                <span>Room {selectedBooking.roomNumber} ({selectedBooking.roomType})</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Check-in:</strong>
                <span>{formatDate(selectedBooking.checkInDate)}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Check-out:</strong>
                <span>{formatDate(selectedBooking.checkOutDate)}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Duration:</strong>
                <span>{selectedBooking.nights} {selectedBooking.nights === 1 ? 'night' : 'nights'}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Guests:</strong>
                <span>{selectedBooking.guests} {selectedBooking.guests === 1 ? 'guest' : 'guests'}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Booked on:</strong>
                <span>{formatDate(selectedBooking.bookingDate)}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                <strong>Total Amount:</strong>
                <span style={{ fontWeight: '700', color: 'var(--success-color)' }}>
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>
              
              {selectedBooking.specialRequests && (
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--spacing-sm)' }}>
                  <strong>Special Requests:</strong>
                  <span style={{ fontStyle: 'italic' }}>{selectedBooking.specialRequests}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MyBookings;