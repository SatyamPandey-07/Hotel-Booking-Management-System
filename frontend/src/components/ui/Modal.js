import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium'
}) => {
  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'small': return { maxWidth: '400px' };
      case 'large': return { maxWidth: '800px' };
      default: return { maxWidth: '600px' };
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          width: '90%',
          ...getSizeClass()
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--gray-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--gray-400)',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid var(--gray-200)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-sm)'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;