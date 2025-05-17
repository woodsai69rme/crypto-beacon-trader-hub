
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

export default createNumberRangeRule;
