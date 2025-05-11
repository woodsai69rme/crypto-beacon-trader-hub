
import { toast } from "@/components/ui/use-toast";

export type ErrorLevel = "error" | "warning" | "info";

interface ErrorOptions {
  level?: ErrorLevel;
  context?: string;
  retry?: boolean;
  retryFn?: () => void;
  details?: Record<string, any>;
  showToast?: boolean;
  toastTitle?: string;
  logToConsole?: boolean;
}

/**
 * Enhanced error handling function with configurable options
 * @param error The error object or message
 * @param options Configuration options for error handling
 * @returns The original error for chaining
 */
export const handleError = (
  error: unknown,
  options: ErrorOptions = {}
) => {
  const {
    level = "error",
    context,
    retry = false,
    retryFn,
    details,
    showToast = true,
    toastTitle,
    logToConsole = true
  } = options;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  const contextPrefix = context ? `[${context}] ` : "";
  const fullMessage = `${contextPrefix}${errorMessage}`;
  
  // Log to console for debugging if enabled
  if (logToConsole) {
    if (level === "error") {
      console.error(fullMessage, { error, ...details });
    } else if (level === "warning") {
      console.warn(fullMessage, { error, ...details });
    } else {
      console.info(fullMessage, { error, ...details });
    }
  }
  
  // Show user-facing toast notification if enabled
  if (showToast) {
    toast({
      title: toastTitle || (level === "error" ? "Error" : level === "warning" ? "Warning" : "Information"),
      description: fullMessage,
      variant: level === "error" ? "destructive" : "default",
      action: retry && retryFn ? {
        label: "Retry",
        onClick: retryFn
      } : undefined
    });
  }
  
  return error;
};

/**
 * Tries to execute a function with error handling
 * @param fn The function to execute
 * @param options Error handling options
 * @returns The result of the function or undefined if it fails
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  options: ErrorOptions = {}
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, options);
    return undefined;
  }
}

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
    
    handleError(new Error(message), {
      level: "warning",
      context,
      toastTitle: "Validation Error"
    });
    
    return true;
  }
  
  return false;
};
