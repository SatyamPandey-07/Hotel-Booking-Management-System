import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  actions,
  variant = 'default',
  elevation = 'medium',
  hoverable = true,
  gradient = false,
  blur = false,
  glow = false,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: '16px',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    const variants = {
      default: {
        ...baseStyles,
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        backdropFilter: blur ? 'blur(20px)' : 'none'
      },
      glass: {
        ...baseStyles,
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)'
      },
      dark: {
        ...baseStyles,
        background: 'rgba(15, 15, 35, 0.95)',
        border: '1px solid rgba(79, 70, 229, 0.3)',
        color: 'white',
        backdropFilter: blur ? 'blur(20px)' : 'none'
      },
      gradient: {
        ...baseStyles,
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        backdropFilter: 'blur(20px)'
      },
      premium: {
        ...baseStyles,
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        border: 'none'
      }
    };

    return variants[variant] || variants.default;
  };

  const getElevationStyles = () => {
    const elevations = {
      none: { boxShadow: 'none' },
      low: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' },
      medium: { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' },
      high: { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)' },
      extreme: { boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)' }
    };

    return elevations[elevation] || elevations.medium;
  };

  const cardStyles = {
    ...getVariantStyles(),
    ...getElevationStyles(),
    ...(glow && isHovered ? {
      boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3), 0 0 0 1px rgba(79, 70, 229, 0.2)'
    } : {})
  };

  const hoverStyles = hoverable ? {
    scale: 1.02,
    y: -4,
    boxShadow: elevation === 'none' ? 'none' : '0 12px 40px rgba(0, 0, 0, 0.15)'
  } : {};

  return (
    <motion.div
      className={className}
      style={cardStyles}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hoverStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20
      }}
      {...props}
    >
      {/* Gradient overlay for premium variant */}
      {variant === 'premium' && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            borderRadius: '16px',
            pointerEvents: 'none'
          }}
          animate={{
            opacity: isHovered ? 1 : 0.5
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Shimmer effect */}
      {gradient && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
          animate={{
            left: isHovered ? '100%' : '-100%'
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Header */}
      {(title || actions) && (
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: title || subtitle ? '1.5rem' : '0',
            position: 'relative',
            zIndex: 2
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            {title && (
              <motion.h3
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: variant === 'dark' || variant === 'premium' ? 'white' : '#1f2937'
                }}
                whileHover={{ scale: 1.02 }}
              >
                {title}
              </motion.h3>
            )}
            {subtitle && (
              <motion.p
                style={{
                  margin: '0',
                  fontSize: '0.875rem',
                  color: variant === 'dark' || variant === 'premium' 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : '#6b7280',
                  lineHeight: '1.5'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {actions && (
            <motion.div
              style={{
                display: 'flex',
                gap: '0.5rem',
                position: 'relative',
                zIndex: 2
              }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {actions}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Glow effect */}
      {glow && (
        <motion.div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4, #10b981)',
            borderRadius: '18px',
            zIndex: -1,
            opacity: 0
          }}
          animate={{
            opacity: isHovered ? 0.3 : 0
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default Card;