import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input, Alert, LoadingSpinner } from './ui';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  StarIcon,
  CreditCardIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    loyaltyPoints: 0,
    totalBookings: 0,
    totalSpent: 0,
    memberSince: '',
    preferences: {
      roomType: 'DOUBLE',
      smokingPreference: 'NON_SMOKING',
      bedType: 'QUEEN',
      floorPreference: 'HIGH'
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error('User ID not available');
      }
      const response = await axios.get(`http://localhost:8080/api/customers/${user.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert('Error loading profile from server', 'error');
      setProfile({
        id: user?.id,
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username || '',
        email: user?.email || '',
        phone: '',
        address: '',
        dateOfBirth: '',
        loyaltyPoints: 0,
        totalBookings: 0,
        totalSpent: 0,
        memberSince: '',
        preferences: {
          roomType: 'DOUBLE',
          smokingPreference: 'NON_SMOKING',
          bedType: 'QUEEN',
          floorPreference: 'HIGH'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profile.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (profile.phone && !/^\+?[\d\s-()]+$/.test(profile.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      const response = await axios.put('/api/customers/profile', profile);
      showAlert('Profile updated successfully!', 'success');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('Error updating profile. Please try again.', 'error');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex-center" style={{ padding: 'var(--spacing-xl)' }}>
        <LoadingSpinner size="large" />
        <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading profile...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <h1>👤 My Profile</h1>
          <p>Manage your account information and preferences</p>
        </motion.div>
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
        
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card title="Profile Overview">
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md)',
                fontSize: '3rem',
                color: 'white'
              }}>
                {profile.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              
              <h2 style={{ margin: '0 0 var(--spacing-xs)', fontSize: '1.5rem', fontWeight: '600' }}>
                {profile.name}
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
                <StarIcon className="w-4 h-4" style={{ color: '#fbbf24' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  {profile.loyaltyPoints} Loyalty Points
                </span>
              </div>
              
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                Member since {formatDate(profile.memberSince)}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', textAlign: 'center' }}>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                  {profile.totalBookings}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Total Bookings</div>
              </div>
              
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary-color)' }}>
                  {formatCurrency(profile.totalSpent)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Total Spent</div>
              </div>
              
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                  VIP
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Member Status</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            title="Personal Information"
            actions={
              <Button
                onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
                variant={editMode ? "outline" : "primary"}
                style={{ minWidth: '100px' }}
              >
                {editMode ? (
                  <>
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </>
                )}
              </Button>
            }
          >
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <Input
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  error={errors.name}
                  required
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  error={errors.email}
                  required
                />
                
                <Input
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  error={errors.phone}
                />
                
                <Input
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
                
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              
              {editMode && (
                <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="btn-success"
                  >
                    {saving ? <LoadingSpinner size="small" /> : <CheckIcon className="w-4 h-4 mr-1" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </motion.div>

        {/* Booking Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ gridColumn: 'span 2' }}
        >
          <Card title="🏨 Booking Preferences">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
                  Preferred Room Type
                </label>
                <select
                  name="preferences.roomType"
                  value={profile.preferences.roomType}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--gray-300)',
                    borderRadius: 'var(--radius-md)',
                    background: editMode ? 'white' : 'var(--gray-100)'
                  }}
                >
                  <option value="SINGLE">Single Room</option>
                  <option value="DOUBLE">Double Room</option>
                  <option value="SUITE">Suite</option>
                  <option value="DELUXE">Deluxe Room</option>
                  <option value="FAMILY">Family Room</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
                  Smoking Preference
                </label>
                <select
                  name="preferences.smokingPreference"
                  value={profile.preferences.smokingPreference}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--gray-300)',
                    borderRadius: 'var(--radius-md)',
                    background: editMode ? 'white' : 'var(--gray-100)'
                  }}
                >
                  <option value="NON_SMOKING">Non-Smoking</option>
                  <option value="SMOKING">Smoking Allowed</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
                  Bed Type
                </label>
                <select
                  name="preferences.bedType"
                  value={profile.preferences.bedType}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--gray-300)',
                    borderRadius: 'var(--radius-md)',
                    background: editMode ? 'white' : 'var(--gray-100)'
                  }}
                >
                  <option value="TWIN">Twin Beds</option>
                  <option value="QUEEN">Queen Bed</option>
                  <option value="KING">King Bed</option>
                  <option value="SOFA_BED">Sofa Bed</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
                  Floor Preference
                </label>
                <select
                  name="preferences.floorPreference"
                  value={profile.preferences.floorPreference}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--gray-300)',
                    borderRadius: 'var(--radius-md)',
                    background: editMode ? 'white' : 'var(--gray-100)'
                  }}
                >
                  <option value="LOW">Low Floor (1-3)</option>
                  <option value="MIDDLE">Middle Floor (4-10)</option>
                  <option value="HIGH">High Floor (11+)</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;