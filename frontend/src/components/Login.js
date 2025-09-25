import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input, Alert } from './ui';
import { 
  UserIcon, 
  LockClosedIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  EyeIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import * as THREE from 'three';

// 3D Background for Login
function LoginBackground() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create floating particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x4f46e5,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    camera.position.z = 10;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.002;
      
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

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  const { login } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setAlert(null);
    
    try {
      const result = await login(credentials.username, credentials.password);
      
      if (result.success) {
        setAlert({ message: 'Login successful! Redirecting...', type: 'success' });
      } else {
        setAlert({ message: result.message, type: 'error' });
      }
    } catch (error) {
      setAlert({ message: 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (username, password) => {
    setCredentials({ username, password });
    setShowDemoAccounts(false);
  };

  const demoAccounts = [
    { role: 'Admin', username: 'admin', password: 'password', color: '#ef4444', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { role: 'Manager', username: 'manager1', password: 'password', color: '#f59e0b', icon: <CommandLineIcon className="w-5 h-5" /> },
    { role: 'Customer', username: 'customer1', password: 'password123', color: '#10b981', icon: <UserIcon className="w-5 h-5" /> }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <LoginBackground />
      
      {/* Animated mouse follower */}
      <motion.div
        style={{
          position: 'fixed',
          top: mousePosition.y - 15,
          left: mousePosition.x - 15,
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.6) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <div style={{ width: '100%', maxWidth: '450px', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Card variant="glass" elevation="high" glow>
            {/* Header */}
            <motion.div 
              style={{ textAlign: 'center', marginBottom: '2rem' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div
                style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}
                animate={{
                  rotateY: [0, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                🏨
              </motion.div>
              <h1 style={{ 
                margin: 0, 
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2rem',
                fontWeight: '800'
              }}>
                Hotel Booking
              </h1>
              <motion.p 
                style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1rem'
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Sign in to access your account
              </motion.p>
            </motion.div>
            
            {/* Alert */}
            <AnimatePresence>
              {alert && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <Alert type={alert.type} onClose={() => setAlert(null)}>
                    {alert.message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Login Form */}
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Input
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                error={errors.username}
                placeholder="Enter your username"
                variant="glass"
                floating
                icon={<UserIcon className="w-5 h-5" />}
                glow
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                error={errors.password}
                placeholder="Enter your password"
                variant="glass"
                floating
                icon={<LockClosedIcon className="w-5 h-5" />}
                glow
              />
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  loading={loading}
                  style={{ 
                    width: '100%', 
                    marginTop: '2rem',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700'
                  }}
                  glow
                >
                  {loading ? (
                    <>
                      <motion.div
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          marginRight: '0.5rem'
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>
            
            {/* Demo Accounts */}
            <motion.div 
              style={{ marginTop: '2rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <EyeIcon className="w-5 h-5" />
                  {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts
                </div>
              </motion.button>
              
              <AnimatePresence>
                {showDemoAccounts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      marginTop: '1rem',
                      padding: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    <h4 style={{ 
                      margin: '0 0 1rem 0', 
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      Demo Accounts
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {demoAccounts.map((account, index) => (
                        <motion.button
                          key={account.role}
                          type="button"
                          onClick={() => fillDemoCredentials(account.username, account.password)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: `1px solid ${account.color}30`,
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{
                            background: `${account.color}20`,
                            borderColor: `${account.color}60`,
                            scale: 1.02
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ color: account.color }}>
                              {account.icon}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600' }}>{account.role}</div>
                              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                                {account.username}
                              </div>
                            </div>
                          </div>
                          <motion.div
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: account.color,
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            Use
                          </motion.div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;