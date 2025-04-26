
import { toast } from "@/components/ui/use-toast";

export type ErrorLevel = "error" | "warning" | "info";

/**
 * Handles and processes errors consistently across the application
 * @param error The error object or message
 * @param level The severity level
 * @param context Optional context information about where the error occurred
 * @returns The original error for chaining
 */
export const handleError = (error: unknown, level: ErrorLevel = "error", context?: string) => {
  const message = error instanceof Error ? error.message : String(error);
  const contextPrefix = context ? `[${context}] ` : "";
  
  // Log to console for debugging
  if (level === "error") {
    console.error(`${contextPrefix}${message}`, error);
  } else if (level === "warning") {
    console.warn(`${contextPrefix}${message}`, error);
  } else {
    console.info(`${contextPrefix}${message}`, error);
  }
  
  // Show user-facing toast notification
  toast({
    title: level === "error" ? "An error occurred" : level === "warning" ? "Warning" : "Information",
    description: `${contextPrefix}${message}`,
    variant: level === "error" ? "destructive" : "default",
  });
  
  return error;
};

/**
 * Validates that all required fields are present in a data object
 * @param data The data object to validate
 * @param requiredFields Array of field names that are required
 * @returns Object with validation result and list of missing fields
 */
export const validateRequiredFields = <T extends Record<string, any>>(
  data: T, 
  requiredFields: (keyof T)[]
): { valid: boolean; missing: string[] } => {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === "";
  }) as string[];
  
  return {
    valid: missing.length === 0,
    missing
  };
};

/**
 * Handles form validation errors in a consistent way
 * @param validationResult The result from validateRequiredFields
 * @param formName Optional name of the form for context
 * @returns true if validation failed and was handled, false if validation passed
 */
export const handleValidationError = (
  validationResult: ReturnType<typeof validateRequiredFields>,
  formName?: string
): boolean => {
  if (!validationResult.valid) {
    const context = formName ? `${formName} Form` : "Form Validation";
    const message = `Missing required fields: ${validationResult.missing.join(", ")}`;
    
    toast({
      title: "Validation Error",
      description: message,
      variant: "destructive",
    });
    
    console.warn(`[${context}] ${message}`);
    return true;
  }
  
  return false;
};
