import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: '16px', height: '16px', borderWidth: '2px' };
      case 'large':
        return { width: '32px', height: '32px', borderWidth: '4px' };
      default:
        return { width: '20px', height: '20px', borderWidth: '3px' };
    }
  };

  return (
    <div 
      className={`loading ${className}`}
      style={getSizeStyle()}
    />
  );
};

export default LoadingSpinner;