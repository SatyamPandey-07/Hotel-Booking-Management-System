import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import * as THREE from 'three';
import '../index.css';

// 3D Background matching login page theme
function SignupBackground() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create floating geometric shapes
    const geometries = [
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.IcosahedronGeometry(1, 0)
    ];
    
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x10b981, 
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

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength === 0) return { label: '', color: '' };
    if (strength <= 2) return { label: 'Weak', color: '#ff4444' };
    if (strength <= 4) return { label: 'Medium', color: '#ffaa00' };
    return { label: 'Strong', color: '#00C851' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        }
        break;

      case 'phone':
        if (value && !/^[0-9]{10}$/.test(value)) {
          error = 'Phone number must be 10 digits';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });

    // Clear submit messages
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null
      });

      if (response.data.success) {
        setSubmitSuccess(response.data.message || 'Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSubmitError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setSubmitError(error.response.data.message);
        } else if (error.response.data.errors) {
          // Handle validation errors from backend
          const backendErrors = {};
          error.response.data.errors.forEach((err) => {
            backendErrors[err.field] = err.message;
          });
          setErrors({ ...errors, ...backendErrors });
        } else {
          setSubmitError('Registration failed. Please try again.');
        }
      } else {
        setSubmitError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1rem'
    }}>
      <style>
        {`
          .glass-input-signup input {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            padding: 0.75rem !important;
            border-radius: 10px !important;
            width: 100% !important;
            font-size: 0.95rem !important;
            transition: all 0.3s ease !important;
          }
          .glass-input-signup input::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
            opacity: 1 !important;
          }
          .glass-input-signup input:focus {
            outline: none !important;
            border-color: rgba(16, 185, 129, 0.5) !important;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3) !important;
            background: rgba(255, 255, 255, 0.15) !important;
          }
          .glass-input-signup label {
            color: rgba(255, 255, 255, 0.9) !important;
            font-weight: 600 !important;
            margin-bottom: 0.5rem !important;
            display: block !important;
            font-size: 0.9rem !important;
          }
        `}
      </style>
      <SignupBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '520px',
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
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <motion.h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #4f46e5 100%)',
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
              🎉 Join Us Today
            </motion.h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.05rem',
              margin: 0
            }}>
              Create your account and start booking amazing hotels
            </p>
          </motion.div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {/* Username */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div className="glass-input-signup">
              <label htmlFor="username">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.username && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>{errors.username}</p>}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div className="glass-input-signup">
              <label htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.email && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>{errors.email}</p>}
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div className="glass-input-signup">
              <label htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.password && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>{errors.password}</p>}
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '0.75rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>Password Strength:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: strengthInfo.color }}>
                    {strengthInfo.label}
                  </span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength / 6) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: '100%',
                      borderRadius: '10px',
                      backgroundColor: strengthInfo.color,
                      boxShadow: `0 0 10px ${strengthInfo.color}`
                    }}
                  />
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Use 8+ characters with uppercase, lowercase, numbers & symbols
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div className="glass-input-signup">
              <label htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.confirmPassword && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>{errors.confirmPassword}</p>}
          </motion.div>

          {/* First Name & Last Name in Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="glass-input-signup">
                <label htmlFor="firstName">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.firstName && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>{errors.firstName}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="glass-input-signup">
                <label htmlFor="lastName">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.lastName && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>{errors.lastName}</p>}
            </motion.div>
          </div>

          {/* Phone (Optional) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <div className="glass-input-signup">
              <label htmlFor="phone">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.phone && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ff6b6b' }}>{errors.phone}</p>}
          </motion.div>

          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p style={{ fontSize: '0.9rem', color: '#ff6b6b', margin: 0, fontWeight: '600' }}>⚠️ {submitError}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p style={{ fontSize: '0.9rem', color: '#10b981', margin: 0, fontWeight: '600' }}>✅ {submitSuccess}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading 
                ? 'rgba(100, 100, 100, 0.5)' 
                : 'linear-gradient(135deg, #10b981, #06b6d4)',
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: loading ? 'none' : '0 10px 30px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              marginBottom: '1.5rem'
            }}
          >
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </motion.button>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', margin: 0 }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#06b6d4',
                  fontWeight: '600',
                  textDecoration: 'none',
                  borderBottom: '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderBottom = '1px solid #06b6d4';
                  e.target.style.color = '#10b981';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderBottom = '1px solid transparent';
                  e.target.style.color = '#06b6d4';
                }}
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
