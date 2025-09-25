import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Input = ({ 
  label, 
  error, 
  success,
  required = false,
  className = '',
  type = 'text',
  variant = 'default',
  size = 'medium',
  icon,
  placeholder,
  disabled = false,
  loading = false,
  floating = false,
  glow = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      setHasValue(!!inputRef.current.value);
    }
  }, [props.value]);

  const getVariantStyles = () => {
    const baseStyles = {
      width: '100%',
      border: '2px solid transparent',
      borderRadius: '12px',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backgroundColor: 'transparent',
      position: 'relative',
      zIndex: 1
    };

    const variants = {
      default: {
        ...baseStyles,
        background: 'rgba(255, 255, 255, 0.9)',
        border: `2px solid ${error ? '#ef4444' : success ? '#10b981' : isFocused ? '#4f46e5' : '#e5e7eb'}`,
        color: '#1f2937',
        boxShadow: isFocused 
          ? `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)'}` 
          : '0 2px 4px rgba(0, 0, 0, 0.05)'
      },
      glass: {
        ...baseStyles,
        background: 'rgba(255, 255, 255, 0.1)',
        border: `2px solid ${error ? '#ef4444' : success ? '#10b981' : isFocused ? '#4f46e5' : 'rgba(255, 255, 255, 0.2)'}`,
        color: 'white',
        backdropFilter: 'blur(20px)',
        boxShadow: isFocused 
          ? `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.2)' : success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)'}` 
          : '0 4px 16px rgba(0, 0, 0, 0.1)',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      filled: {
        ...baseStyles,
        background: '#f3f4f6',
        border: `2px solid ${error ? '#ef4444' : success ? '#10b981' : isFocused ? '#4f46e5' : 'transparent'}`,
        color: '#1f2937'
      }
    };

    return variants[variant] || variants.default;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: floating ? '1rem 1rem 0.5rem 1rem' : '0.75rem 1rem',
        fontSize: '0.75rem',
        minHeight: '36px'
      },
      medium: {
        padding: floating ? '1.25rem 1rem 0.5rem 1rem' : '0.875rem 1rem',
        fontSize: '0.875rem',
        minHeight: '44px'
      },
      large: {
        padding: floating ? '1.5rem 1.25rem 0.75rem 1.25rem' : '1rem 1.25rem',
        fontSize: '1rem',
        minHeight: '52px'
      }
    };

    return sizes[size] || sizes.medium;
  };

  const inputStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    paddingLeft: icon ? '3rem' : getSizeStyles().padding.split(' ')[3] || '1rem',
    paddingRight: (type === 'password' || error || success) ? '3rem' : getSizeStyles().padding.split(' ')[1] || '1rem',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    // Add placeholder color for glass variant
    ...(variant === 'glass' && {
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.6)'
      }
    })
  };

  const handleInputChange = (e) => {
    setHasValue(!!e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const actualType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`form-group ${className}`} style={{ position: 'relative', marginBottom: '1.5rem' }}>
      {/* Label */}
      {label && !floating && (
        <motion.label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: variant === 'glass' ? 'rgba(255, 255, 255, 0.9)' : '#374151',
            marginBottom: '0.5rem'
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && (
            <motion.span
              style={{ color: '#ef4444', marginLeft: '4px' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              *
            </motion.span>
          )}
        </motion.label>
      )}

      {/* Input Container */}
      <div style={{ position: 'relative' }}>
        {/* Glow effect */}
        {glow && isFocused && (
          <motion.div
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              borderRadius: '14px',
              zIndex: 0,
              opacity: 0.3
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          />
        )}

        {/* Left Icon */}
        {icon && (
          <motion.div
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isFocused ? '#4f46e5' : '#6b7280',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center'
            }}
            animate={{
              color: isFocused ? '#4f46e5' : '#6b7280',
              scale: isFocused ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Floating Label */}
        {floating && label && (
          <motion.label
            style={{
              position: 'absolute',
              left: icon ? '3rem' : '1rem',
              top: isFocused || hasValue ? '0.5rem' : '50%',
              transform: isFocused || hasValue ? 'translateY(0)' : 'translateY(-50%)',
              fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem',
              fontWeight: '500',
              color: isFocused 
                ? (error ? '#ef4444' : success ? '#10b981' : '#4f46e5')
                : (variant === 'glass' ? 'rgba(255, 255, 255, 0.7)' : '#6b7280'),
              backgroundColor: variant === 'glass' ? 'rgba(15, 15, 35, 0.8)' : 'white',
              padding: isFocused || hasValue ? '0 0.25rem' : '0',
              borderRadius: '4px',
              zIndex: 2,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
            animate={{
              top: isFocused || hasValue ? '0.5rem' : '50%',
              transform: isFocused || hasValue ? 'translateY(0)' : 'translateY(-50%)',
              fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem'
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {label}
            {required && (
              <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
            )}
          </motion.label>
        )}

        {/* Input */}
        <motion.input
          ref={inputRef}
          type={actualType}
          placeholder={floating ? '' : placeholder}
          disabled={disabled}
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleInputChange}
          whileFocus={{
            scale: glow ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Right Icons */}
        <div style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 2
        }}>
          {/* Loading Spinner */}
          {loading && (
            <motion.div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid #4f46e5',
                borderRadius: '50%'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Success Icon */}
          {success && !loading && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ color: '#10b981' }}
            >
              <CheckCircleIcon className="w-5 h-5" />
            </motion.div>
          )}

          {/* Error Icon */}
          {error && !loading && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ color: '#ef4444' }}
            >
              <ExclamationCircleIcon className="w-5 h-5" />
            </motion.div>
          )}

          {/* Password Toggle */}
          {type === 'password' && !loading && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0',
                display: 'flex',
                alignItems: 'center'
              }}
              whileHover={{ color: '#4f46e5', scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <ExclamationCircleIcon className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            style={{
              color: '#10b981',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <CheckCircleIcon className="w-4 h-4" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;