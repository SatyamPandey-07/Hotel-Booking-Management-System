import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Customers from './components/Customers';
import Hotels from './components/Hotels';
import Bookings from './components/Bookings';
import CustomerBookings from './components/CustomerBookings';
import Rooms from './components/Rooms';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import LandingPage from './components/LandingPage';

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // Role-based navigation items
  const getNavigationItems = () => {
    const role = user?.role;
    
    const commonItems = [
      { path: '/dashboard', label: '📊 Dashboard', icon: '📊' }
    ];
    
    if (role === 'ADMIN') {
      return [
        ...commonItems,
        { path: '/users', label: '👤 Users', icon: '👤' },
        { path: '/customers', label: '👥 Customers', icon: '👥' },
        { path: '/hotels', label: '🏨 Hotels', icon: '🏨' },
        { path: '/rooms', label: '🏠 Rooms', icon: '🏠' },
        { path: '/bookings', label: '📝 All Bookings', icon: '📝' }
      ];
    } else if (role === 'MANAGER') {
      return [
        ...commonItems,
        { path: '/hotels', label: '🏨 My Hotels', icon: '🏨' },
        { path: '/rooms', label: '🏠 Rooms', icon: '🏠' },
        { path: '/bookings', label: '📝 Bookings', icon: '📝' },
        { path: '/customers', label: '👥 Customers', icon: '👥' }
      ];
    } else if (role === 'CUSTOMER') {
      return [
        ...commonItems,
        { path: '/hotels', label: '🏨 Browse Hotels', icon: '🏨' },
        { path: '/my-bookings', label: '📝 My Bookings', icon: '📝' },
        { path: '/profile', label: '👤 My Profile', icon: '👤' }
      ];
    }
    
    return commonItems;
  };
  
  return (
    <nav className="navigation">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '1.25rem',
              color: 'white',
              marginRight: 'var(--spacing-xl)'
            }}>
              🏨 Hotel Booking System
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              {getNavigationItems().map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={isActive(item.path) ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <span style={{ color: 'white', fontSize: '0.875rem' }}>
              Welcome, {user?.firstName || user?.username} 
              <span style={{ 
                background: user?.role === 'ADMIN' ? '#dc3545' : user?.role === 'MANAGER' ? '#ffc107' : '#28a745',
                color: user?.role === 'MANAGER' ? '#000' : '#fff',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '0.75rem',
                marginLeft: '8px',
                fontWeight: 'bold'
              }}>
                {user?.role}
              </span>
            </span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'var(--danger-color)',
                color: 'white',
                border: 'none',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific roles are required, check user role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div style={{
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--danger-color)'
      }}>
        <h2>🚫 Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Required roles: {allowedRoles.join(', ')}</p>
        <p>Your role: {user?.role}</p>
      </div>
    );
  }
  
  return children;
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading application...
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  
  return (
    <div className="App">
      <Navigation />
      
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Common routes for all authenticated users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin-only routes */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <h2>👤 User Management</h2>
                <p>Admin-only feature: Manage all system users</p>
                <p style={{ color: 'var(--gray-600)' }}>This feature is coming soon...</p>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Admin and Manager routes */}
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Customers />
            </ProtectedRoute>
          } />
          
          <Route path="/rooms" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Rooms />
            </ProtectedRoute>
          } />
          
          {/* Different booking views based on role */}
          <Route path="/bookings" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Bookings />
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerBookings />
            </ProtectedRoute>
          } />
          
          {/* Hotels - accessible to all but with different views */}
          <Route path="/hotels" element={
            <ProtectedRoute>
              <Hotels />
            </ProtectedRoute>
          } />
          
          {/* Customer-only routes */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <h2>👤 My Profile</h2>
                <p>Customer profile management</p>
                <p style={{ color: 'var(--gray-600)' }}>This feature is coming soon...</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;