import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card, LoadingSpinner, Alert } from './ui';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import * as THREE from 'three';

// Animated Counter Component
function AnimatedCounter({ value, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  
  useEffect(() => {
    let startTime = null;
    const startValue = 0;
    const endValue = value;
    
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
}

// Mini Chart Component
function MiniChart({ data, color = '#4f46e5', type = 'line' }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.fillStyle = `${color}20`;
    
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    if (type === 'area') {
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.stroke();
  }, [data, color, type]);
  
  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={40}
      style={{
        width: '120px',
        height: '40px',
        borderRadius: '4px'
      }}
    />
  );
}

// 3D Background for Dashboard
function DashboardBackground() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create floating cubes
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4f46e5, 
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    
    const cubes = [];
    for (let i = 0; i < 20; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      cubes.push(cube);
      scene.add(cube);
    }
    
    camera.position.z = 10;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      cubes.forEach(cube => {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [chartData, setChartData] = useState({
    bookings: [12, 19, 15, 25, 22, 18, 24],
    revenue: [1200, 1900, 1500, 2500, 2200, 1800, 2400],
    customers: [5, 8, 6, 12, 10, 7, 11]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Mock data for demo
      setStats({
        totalBookings: 125,
        totalRevenue: 45000,
        totalHotels: 3,
        totalCustomers: 89,
        totalRooms: 12,
        myBookings: 3,
        myTotalSpent: 1250,
        loyaltyPoints: 150,
        upcomingBookings: 1,
        pendingBookings: 8,
        confirmedBookings: 45,
        checkedInBookings: 12,
        checkedOutBookings: 60,
        cancelledBookings: 5
      });
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

  // Role-specific dashboard titles and descriptions
  const getDashboardInfo = () => {
    switch(user?.role) {
      case 'ADMIN':
        return {
          title: '🛡️ Admin Dashboard',
          description: 'Complete system overview and management'
        };
      case 'MANAGER':
        return {
          title: '👨‍💼 Manager Dashboard', 
          description: 'Hotel operations and booking management'
        };
      case 'CUSTOMER':
        return {
          title: '🏨 Welcome to Hotel Booking',
          description: 'Your personal booking dashboard'
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Hotel booking system overview'
        };
    }
  };

  const dashboardInfo = getDashboardInfo();

  // Enhanced stats configuration with icons and trends
  const getStatsConfig = () => {
    const baseConfig = {
      CUSTOMER: [
        {
          label: 'My Bookings',
          value: stats?.myBookings || 0,
          icon: <CalendarDaysIcon className="w-6 h-6" />,
          color: 'from-blue-500 to-purple-600',
          trend: '+12%',
          chartData: chartData.bookings
        },
        {
          label: 'Total Spent',
          value: stats?.myTotalSpent || 0,
          prefix: '$',
          icon: <CurrencyDollarIcon className="w-6 h-6" />,
          color: 'from-green-500 to-emerald-600',
          trend: '+8%',
          chartData: chartData.revenue
        },
        {
          label: 'Loyalty Points',
          value: stats?.loyaltyPoints || 0,
          icon: <StarIcon className="w-6 h-6" />,
          color: 'from-yellow-500 to-orange-600',
          trend: '+25%',
          chartData: chartData.customers
        },
        {
          label: 'Upcoming Stays',
          value: stats?.upcomingBookings || 0,
          icon: <ClockIcon className="w-6 h-6" />,
          color: 'from-purple-500 to-pink-600',
          trend: '+5%',
          chartData: chartData.bookings
        }
      ],
      ADMIN: [
        {
          label: 'Total Bookings',
          value: stats?.totalBookings || 0,
          icon: <ChartBarIcon className="w-6 h-6" />,
          color: 'from-blue-500 to-purple-600',
          trend: '+15%',
          chartData: chartData.bookings
        },
        {
          label: 'Total Revenue',
          value: stats?.totalRevenue || 0,
          prefix: '$',
          icon: <CurrencyDollarIcon className="w-6 h-6" />,
          color: 'from-green-500 to-emerald-600',
          trend: '+22%',
          chartData: chartData.revenue
        },
        {
          label: 'Total Hotels',
          value: stats?.totalHotels || 0,
          icon: <BuildingOfficeIcon className="w-6 h-6" />,
          color: 'from-purple-500 to-pink-600',
          trend: '+3%',
          chartData: chartData.customers
        },
        {
          label: 'Total Customers',
          value: stats?.totalCustomers || 0,
          icon: <UserGroupIcon className="w-6 h-6" />,
          color: 'from-yellow-500 to-orange-600',
          trend: '+18%',
          chartData: chartData.customers
        }
      ],
      MANAGER: [
        {
          label: 'Hotel Bookings',
          value: stats?.totalBookings || 0,
          icon: <ChartBarIcon className="w-6 h-6" />,
          color: 'from-blue-500 to-purple-600',
          trend: '+12%',
          chartData: chartData.bookings
        },
        {
          label: 'Hotel Revenue',
          value: stats?.totalRevenue || 0,
          prefix: '$',
          icon: <CurrencyDollarIcon className="w-6 h-6" />,
          color: 'from-green-500 to-emerald-600',
          trend: '+20%',
          chartData: chartData.revenue
        },
        {
          label: 'Total Rooms',
          value: stats?.totalRooms || 0,
          icon: <BuildingOfficeIcon className="w-6 h-6" />,
          color: 'from-purple-500 to-pink-600',
          trend: '+5%',
          chartData: chartData.customers
        },
        {
          label: 'Hotel Customers',
          value: stats?.totalCustomers || 0,
          icon: <UserGroupIcon className="w-6 h-6" />,
          color: 'from-yellow-500 to-orange-600',
          trend: '+15%',
          chartData: chartData.customers
        }
      ]
    };
    
    return baseConfig[user?.role] || baseConfig.CUSTOMER;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#f8fafc',
        position: 'relative'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '2rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div 
            className="header"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#1f2937',
              textAlign: 'center',
              padding: '3rem 2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1
              style={{ 
                margin: 0, 
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#1f2937'
              }}
            >
              {dashboardInfo.title}
            </motion.h1>
            <motion.p
              style={{
                margin: '1rem 0 0 0',
                fontSize: '1.2rem',
                color: '#6b7280'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {dashboardInfo.description}
            </motion.p>
          </motion.div>
          
          <motion.div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4rem 0'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <div style={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ marginBottom: '1rem' }}
              >
                <LoadingSpinner size="large" />
              </motion.div>
              <motion.span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#4f46e5'
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading dashboard data...
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      position: 'relative'
    }}>      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '2rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Alert */}
        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              style={{ marginBottom: '2rem' }}
            >
              <Alert type={alert.type} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simplified Header */}
        <motion.div 
          className="header"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            color: '#1f2937',
            textAlign: 'center',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            style={{ 
              margin: 0, 
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              color: '#1f2937'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {dashboardInfo.title}
          </motion.h1>
          <motion.p
            style={{
              margin: '1rem 0 0 0',
              fontSize: '1.1rem',
              color: '#6b7280'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {dashboardInfo.description}
          </motion.p>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {getStatsConfig().map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.6 + (index * 0.1), 
                duration: 0.6,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              <Card
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: '#4f46e5'
                  }}>
                    {stat.icon}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: stat.trend?.startsWith('+') ? '#10b981' : '#ef4444'
                  }}>
                    {stat.trend?.startsWith('+') ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                
                <div>
                  <motion.div
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: '900',
                      marginBottom: '0.5rem',
                      color: '#1f2937'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + (index * 0.1) }}
                  >
                    <AnimatedCounter 
                      value={stat.value}
                      prefix={stat.prefix || ''}
                      duration={2000 + (index * 200)}
                    />
                  </motion.div>
                  
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    {stat.label}
                  </div>
                  
                  {/* Mini chart */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <MiniChart 
                      data={stat.chartData} 
                      color="#4f46e5"
                      type="area"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional dashboard content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Quick Actions Card */}
          <Card
            title="Quick Actions"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <motion.button
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {user?.role === 'CUSTOMER' ? 'Browse Hotels' : 'Manage Bookings'}
              </motion.button>
              
              <motion.button
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {user?.role === 'CUSTOMER' ? 'My Bookings' : 'View Reports'}
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Dashboard;