const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const customValidators = {
  // Validate email
  email: (value) => {
    if (!value) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
    return null;
  },
  
  // Validate password
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (value.length > 50) return 'Password must be less than 50 characters';
    return null;
  },
  
  // Validate username
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    return null;
  },
  
  // Validate age
  age: (value) => {
    if (!value) return 'Age is required';
    const numValue = Number(value);
    if (isNaN(numValue)) return 'Age must be a number';
    if (!Number.isInteger(numValue)) return 'Age must be a whole number';
    if (numValue < 1) return 'Age must be at least 1';
    if (numValue > 120) return 'Age must be less than 120';
    return null;
  },
  
  // Validate required field
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) 
      return `${fieldName} is required`;
    return null;
  },
  
  // Validate min length
  minLength: (value, length, fieldName = 'This field') => {
    if (value && value.length < length) 
      return `${fieldName} must be at least ${length} characters`;
    return null;
  },
  
  // Validate max length
  maxLength: (value, length, fieldName = 'This field') => {
    if (value && value.length > length) 
      return `${fieldName} must be less than ${length} characters`;
    return null;
  },
  
  // Validate matching fields
  match: (value1, value2, fieldName = 'Fields') => {
    if (value1 !== value2) 
      return `${fieldName} do not match`;
    return null;
  },
};

// Validate login data (custom)
export const validateLogin = (username, password) => {
  const errors = {};
  
  const usernameError = customValidators.username(username?.trim());
  if (usernameError) errors.username = usernameError;
  
  const passwordError = customValidators.password(password?.trim());
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : null,
  };
};

// Validate registration data (custom)
export const validateRegister = (age, name, email, password) => {
  const errors = {};
  
  const ageError = customValidators.age(age);
  if (ageError) errors.age = ageError;
  
  const emailError = customValidators.email(email?.trim());
  if (emailError) errors.email = emailError;
  
  const passwordError = customValidators.password(password?.trim());
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : null,
  };
};

export default {
  // Custom validators
  customValidators,
  
  // Form validators
  validateLogin,
  validateRegister,
};