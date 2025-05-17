
/**
 * Creates a validation rule for number ranges
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @param errorMessage Error message to display when validation fails
 * @returns Validation rule function
 */
export const createNumberRangeRule = (min: number, max: number, errorMessage: string) => {
  return (value: number) => {
    if (value < min || value > max) {
      return errorMessage;
    }
    return true;
  };
};

/**
 * Validates form fields against specified rules
 * @param value The value to validate
 * @param rules Array of validation rules to apply
 * @returns String error message or true if validation passes
 */
export const validateFormFields = (value: any, rules: ((value: any) => string | true)[]) => {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      return result;
    }
  }
  return true;
};

export default createNumberRangeRule;
