
import { handleError } from "./errorHandling";
import { toast } from "@/components/ui/use-toast";

export type ValidationRule = {
  validator: (value: any) => boolean;
  message: string;
};

/**
 * Enhanced validateFormFields with custom validation rules
 */
export const validateFormFields = (
  fields: Record<string, any>, 
  requiredFields: string[] = [],
  validationRules: Record<string, ValidationRule[]> = {}
) => {
  // First check for required fields
  const missingFields = requiredFields.filter(field => {
    const value = fields[field];
    return value === undefined || value === null || value === "";
  });
  
  if (missingFields.length > 0) {
    const error = `Required fields missing: ${missingFields.join(", ")}`;
    handleError(error, "warning", "Form Validation");
    return false;
  }
  
  // Then apply custom validation rules
  for (const [field, rules] of Object.entries(validationRules)) {
    // Skip validation if field isn't present or is empty and not required
    if (
      (fields[field] === undefined || fields[field] === null || fields[field] === "") && 
      !requiredFields.includes(field)
    ) {
      continue;
    }
    
    for (const rule of rules) {
      if (!rule.validator(fields[field])) {
        handleError(`${field}: ${rule.message}`, "warning", "Form Validation");
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    handleError("Invalid email format", "warning", "Form Validation");
    return false;
  }
  return true;
};

/**
 * Validates password with customizable requirements
 */
export const validatePassword = (
  password: string,
  options = { 
    minLength: 8, 
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false
  }
): boolean => {
  if (password.length < options.minLength) {
    handleError(`Password must be at least ${options.minLength} characters`, "warning", "Form Validation");
    return false;
  }
  
  if (options.requireUppercase && !/[A-Z]/.test(password)) {
    handleError("Password must include at least one uppercase letter", "warning", "Form Validation");
    return false;
  }
  
  if (options.requireLowercase && !/[a-z]/.test(password)) {
    handleError("Password must include at least one lowercase letter", "warning", "Form Validation");
    return false;
  }
  
  if (options.requireNumber && !/\d/.test(password)) {
    handleError("Password must include at least one number", "warning", "Form Validation");
    return false;
  }
  
  if (options.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    handleError("Password must include at least one special character", "warning", "Form Validation");
    return false;
  }
  
  return true;
};

/**
 * Validates a number is within range
 */
export const validateNumberRange = (
  value: number, 
  min?: number, 
  max?: number
): boolean => {
  if (min !== undefined && value < min) {
    handleError(`Value must be at least ${min}`, "warning", "Form Validation");
    return false;
  }
  
  if (max !== undefined && value > max) {
    handleError(`Value must not exceed ${max}`, "warning", "Form Validation");
    return false;
  }
  
  return true;
};

/**
 * Validates a string length
 */
export const validateStringLength = (
  value: string,
  minLength?: number,
  maxLength?: number
): boolean => {
  if (minLength !== undefined && value.length < minLength) {
    handleError(`Text must be at least ${minLength} characters`, "warning", "Form Validation");
    return false;
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    handleError(`Text must not exceed ${maxLength} characters`, "warning", "Form Validation");
    return false;
  }
  
  return true;
};

/**
 * Validates a date range
 */
export const validateDateRange = (
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean => {
  if (minDate && date < minDate) {
    handleError(`Date must be on or after ${minDate.toLocaleDateString()}`, "warning", "Form Validation");
    return false;
  }
  
  if (maxDate && date > maxDate) {
    handleError(`Date must be on or before ${maxDate.toLocaleDateString()}`, "warning", "Form Validation");
    return false;
  }
  
  return true;
};

/**
 * Create a standard validation rule for number ranges
 */
export const createNumberRangeRule = (min?: number, max?: number): ValidationRule => ({
  validator: (value: number) => validateNumberRange(value, min, max),
  message: [
    min !== undefined ? `must be at least ${min}` : '',
    max !== undefined ? `must not exceed ${max}` : ''
  ].filter(Boolean).join(' and ')
});

/**
 * Create a standard validation rule for string lengths
 */
export const createStringLengthRule = (minLength?: number, maxLength?: number): ValidationRule => ({
  validator: (value: string) => validateStringLength(value, minLength, maxLength),
  message: [
    minLength !== undefined ? `must be at least ${minLength} characters` : '',
    maxLength !== undefined ? `must not exceed ${maxLength} characters` : ''
  ].filter(Boolean).join(' and ')
});

/**
 * Create a standard validation rule for matching values
 */
export const createMatchingValueRule = (matchField: string, matchValue: any): ValidationRule => ({
  validator: (value: any) => value === matchValue,
  message: `must match ${matchField}`
});

/**
 * Create a standard validation rule for email format
 */
export const createEmailRule = (): ValidationRule => ({
  validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: "must be a valid email address"
});
