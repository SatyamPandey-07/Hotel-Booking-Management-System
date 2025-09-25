import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  icon,
  ripple = true,
  glow = false,
  ...props 
}) => {
  const getVariantStyles = () => {
    const baseStyles = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      border: 'none',
      borderRadius: '12px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '600',
      fontSize: '0.875rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      outline: 'none',
      userSelect: 'none'
    };

    const variants = {
      primary: {
        ...baseStyles,
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        boxShadow: glow ? '0 8px 32px rgba(79, 70, 229, 0.4)' : '0 4px 16px rgba(79, 70, 229, 0.3)'
      },
      secondary: {
        ...baseStyles,
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: 'white',
        boxShadow: '0 4px 16px rgba(107, 114, 128, 0.3)'
      },
      success: {
        ...baseStyles,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
      },
      danger: {
        ...baseStyles,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
      },
      outline: {
        ...baseStyles,
        background: 'transparent',
        color: '#4f46e5',
        border: '2px solid #4f46e5',
        boxShadow: 'none'
      },
      ghost: {
        ...baseStyles,
        background: 'rgba(79, 70, 229, 0.1)',
        color: '#4f46e5',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        backdropFilter: 'blur(10px)'
      }
    };

    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: '0.5rem 1rem',
        fontSize: '0.75rem',
        minHeight: '32px'
      },
      medium: {
        padding: '0.75rem 1.5rem',
        fontSize: '0.875rem',
        minHeight: '40px'
      },
      large: {
        padding: '1rem 2rem',
        fontSize: '1rem',
        minHeight: '48px'
      }
    };

    return sizes[size] || sizes.medium;
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    opacity: disabled ? 0.6 : 1,
    transform: disabled ? 'scale(0.98)' : 'scale(1)'
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    // Ripple effect
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const rippleElement = document.createElement('span');
      rippleElement.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
      `;
      
      button.appendChild(rippleElement);
      
      setTimeout(() => {
        rippleElement.remove();
      }, 600);
    }
    
    if (onClick) onClick(e);
  };

  return (
    <>
      <motion.button
        type={type}
        onClick={handleClick}
        disabled={disabled || loading}
        className={className}
        style={buttonStyles}
        whileHover={!disabled ? { 
          scale: 1.02, 
          boxShadow: glow ? '0 12px 40px rgba(79, 70, 229, 0.5)' : '0 8px 24px rgba(0, 0, 0, 0.15)'
        } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <motion.div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              marginRight: children ? '0.5rem' : '0'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        {/* Icon */}
        {icon && !loading && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        
        {/* Button content */}
        <span style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </span>
        
        {/* Shimmer effect */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            zIndex: 1
          }}
          animate={{
            left: ['100%', '-100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 3
          }}
        />
      </motion.button>
      
      <style>{`
        @keyframes ripple {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Button;