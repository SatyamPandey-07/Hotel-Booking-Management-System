import React from 'react';

function DatePicker({ label, value, onChange, min, max, required, error, ...props }) {
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const dateValue = e.target.value;
    
    if (onChange) {
      onChange({
        target: {
          name: props.name,
          value: dateValue
        }
      });
    }
  };

  return (
    <div className="form-group">
      {label && (
        <label>
          {label}
          {required && <span style={{ color: 'var(--danger-color)' }}> *</span>}
        </label>
      )}
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={handleChange}
        min={min ? formatDateForInput(min) : undefined}
        max={max ? formatDateForInput(max) : undefined}
        required={required}
        style={{
          borderColor: error ? 'var(--danger-color)' : undefined
        }}
        {...props}
      />
      {error && (
        <div style={{
          color: 'var(--danger-color)',
          fontSize: '0.875rem',
          marginTop: 'var(--spacing-xs)'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default DatePicker;