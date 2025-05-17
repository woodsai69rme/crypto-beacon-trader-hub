
/**
 * Validates that all required form fields are present
 * @param formData The form data object to validate
 * @param requiredFields Array of field names that are required
 * @returns Boolean indicating if the form data is valid
 */
export const validateFormFields = (formData: any, requiredFields: string[], customValidations?: Record<string, Function[]>): boolean => {
  if (!formData) return false;
  
  for (const field of requiredFields) {
    const value = formData[field];
    
    // Check for undefined, null, empty string
    if (value === undefined || value === null || value === '') {
      console.error(`Required field "${field}" is missing or empty`);
      return false;
    }
    
    // For numeric fields, ensure they're valid numbers
    if (typeof value === 'number' && isNaN(value)) {
      console.error(`Field "${field}" must be a valid number`);
      return false;
    }
    
    // Apply custom validations if provided
    if (customValidations && customValidations[field]) {
      const validationFunctions = customValidations[field];
      for (const validate of validationFunctions) {
        if (!validate(value)) {
          return false;
        }
      }
    }
  }
  
  return true;
};

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password strength
 * @param password The password to validate
 * @returns Boolean indicating if the password meets strength requirements
 */
export const validatePasswordStrength = (password: string): boolean => {
  // At least 8 characters, with at least one uppercase letter, one lowercase letter, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates that a number is within a specified range
 * @param value The number to validate
 * @param min The minimum allowed value (inclusive)
 * @param max The maximum allowed value (inclusive)
 * @returns Boolean indicating if the value is within range
 */
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Creates a validation rule for number ranges
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns A function that validates if a value is within the specified range
 */
export const createNumberRangeRule = (min: number, max: number) => {
  return (value: number) => {
    const isValid = validateNumberRange(value, min, max);
    if (!isValid) {
      console.error(`Value ${value} must be between ${min} and ${max}`);
    }
    return isValid;
  };
};

export default {
  validateFormFields,
  validateEmail,
  validatePasswordStrength,
  validateNumberRange,
  createNumberRangeRule
};
