import React from 'react';

const Alert = ({ 
  children, 
  type = 'info', 
  onClose,
  className = '',
  ...props 
}) => {
  const getAlertClass = () => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      default: return 'alert-info';
    }
  };

  return (
    <div className={`alert ${getAlertClass()} ${className}`} {...props}>
      <div className="flex-between">
        <div>{children}</div>
        {onClose && (
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.25rem', 
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;