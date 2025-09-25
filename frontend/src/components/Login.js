import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Alert } from './ui';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import * as THREE from 'three';

// 3D Background matching landing page theme
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
    
    // Create floating geometric shapes (matching landing page)
    const geometries = [
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.IcosahedronGeometry(1, 0)
    ];
    
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4f46e5, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    const shapes = [];
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      shapes.push(mesh);
      scene.add(mesh);
    }
    
    camera.position.z = 10;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.001;
        shape.rotation.y += 0.005 + index * 0.001;
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

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();

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
  };

  const demoAccounts = [
    { role: 'Admin', username: 'admin', password: 'password', emoji: '👑', color: '#ef4444' },
    { role: 'Manager', username: 'manager1', password: 'password', emoji: '👨‍💼', color: '#f59e0b' },
    { role: 'Customer', username: 'customer1', password: 'password123', emoji: '👤', color: '#10b981' }
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
      {/* Add CSS for better placeholder visibility */}
      <style>
        {`
          .glass-input input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
            opacity: 1 !important;
          }
          .glass-input input::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
            opacity: 1 !important;
          }
          .glass-input input::-moz-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
            opacity: 1 !important;
          }
          .glass-input input:-ms-input-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
            opacity: 1 !important;
          }
          .glass-input input {
            color: white !important;
          }
        `}
      </style>
      <LoginBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(6, 182, 212, 0.15))',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background pattern */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)',
            pointerEvents: 'none'
          }}
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'center', marginBottom: '2.5rem' }}
          >
            <motion.h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
                textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              🏨 Welcome Back
            </motion.h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              margin: 0
            }}>
              Sign in to your hotel booking account
            </p>
          </motion.div>

          {/* Alert */}
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <Alert type={alert.type} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            </motion.div>
          )}

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginBottom: '2rem' }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <Input
                label="Username"
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                error={errors.username}
                icon={<UserIcon className="w-5 h-5" />}
                variant="glass"
                glow={true}
                className="glass-input"
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <Input
                label="Password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                error={errors.password}
                icon={<LockClosedIcon className="w-5 h-5" />}
                variant="glass"
                glow={true}
                className="glass-input"
              />
            </div>
            
            <Button
              type="submit"
              loading={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                border: 'none',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                borderRadius: '15px',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              {loading ? 'Signing In...' : '🚀 Sign In'}
            </Button>
          </motion.form>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              ⚡ Quick Demo Access
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {demoAccounts.map((account, index) => (
                <motion.button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemoCredentials(account.username, account.password)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: `linear-gradient(135deg, ${account.color}20, ${account.color}10)`,
                    border: `1px solid ${account.color}30`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{account.emoji}</span>
                    <span style={{ fontWeight: '600' }}>{account.role}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Click to fill</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;