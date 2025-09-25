import React from 'react';

const Select = ({ 
  label, 
  options = [], 
  error, 
  required = false,
  placeholder = 'Select an option',
  className = '',
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label>
          {label}
          {required && <span style={{ color: 'var(--danger-color)', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <select
        className={`${error ? 'error' : ''} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div style={{ 
          color: 'var(--danger-color)', 
          fontSize: '0.75rem', 
          marginTop: 'var(--spacing-xs)' 
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Select;