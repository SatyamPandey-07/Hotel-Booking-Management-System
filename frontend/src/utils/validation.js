import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: []  // No attributes allowed
  });
};

/**
 * Sanitize HTML content (for rich text)
 * @param {string} html - HTML content
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title']
  });
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  const regex = /^\d{10}$/;
  return regex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {object} {isValid, message, strength}
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { isValid: false, message: 'Password must be at least 8 characters', strength: 'weak' };
  }
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { isValid: false, message: 'Password must contain uppercase, lowercase, and number', strength: 'weak' };
  }
  
  const strength = hasSpecialChar ? 'strong' : 'medium';
  return { isValid: true, message: 'Password is valid', strength };
};
