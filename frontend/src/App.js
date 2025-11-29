import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/ui';
import axios from 'axios';

// Configure axios base URL globally
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Lazy load components
const ThemeWrapper = lazy(() => import('./components/ThemeWrapper'));
const Customers = lazy(() => import('./components/Customers'));
const Hotels = lazy(() => import('./components/Hotels'));
const Bookings = lazy(() => import('./components/Bookings'));
const Rooms = lazy(() => import('./components/Rooms'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const Profile = lazy(() => import('./components/Profile'));
const MyBookings = lazy(() => import('./components/MyBookings'));

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // Simplified role-based navigation items (ADMIN and USER only)
  const getNavigationItems = () => {
    const role = user?.role;
    
    const commonItems = [
      { path: '/dashboard', label: '📊 Dashboard', icon: '📊' }
    ];
    
    if (role === 'ADMIN') {
      return [
        ...commonItems,
        { path: '/customers', label: '👥 Customers', icon: '👥' },
        { path: '/hotels', label: '🏨 Manage Hotels', icon: '🏨' },
        { path: '/rooms', label: '🏠 Manage Rooms', icon: '🏠' },
        { path: '/bookings', label: '📝 All Bookings', icon: '📝' }
      ];
    } else { // USER/CUSTOMER role
      return [
        ...commonItems,
        { path: '/hotels', label: '🏨 Browse Hotels', icon: '🏨' },
        { path: '/rooms', label: '🏠 Browse Rooms', icon: '�' },
        { path: '/my-bookings', label: '📝 My Bookings', icon: '📝' },
        { path: '/profile', label: '👤 My Profile', icon: '👤' }
      ];
    }
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
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <LoadingSpinner />
      </div>
    }>
      <ThemeWrapper>
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
              <Route path="/customers" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Customers />
                </ProtectedRoute>
              } />
              
              <Route path="/bookings" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Bookings />
                </ProtectedRoute>
              } />
              
              {/* Hotels and Rooms - accessible to all but with different views */}
              <Route path="/hotels" element={
                <ProtectedRoute>
                  <Hotels />
                </ProtectedRoute>
              } />
              
              <Route path="/rooms" element={
                <ProtectedRoute>
                  <Rooms />
                </ProtectedRoute>
              } />
              
              {/* User/Customer-only routes */}
              <Route path="/my-bookings" element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'USER']}>
                  <MyBookings />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'USER']}>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </ThemeWrapper>
    </Suspense>
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