
import { handleError } from "./errorHandling";
import { toast } from "@/components/ui/use-toast";

export const validateFormFields = (fields: Record<string, any>, requiredFields: string[]) => {
  const missingFields = requiredFields.filter(field => !fields[field]);
  
  if (missingFields.length > 0) {
    const error = `Required fields missing: ${missingFields.join(", ")}`;
    handleError(error, "warning", "Form Validation");
    return false;
  }
  
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    handleError("Invalid email format", "warning", "Form Validation");
    return false;
  }
  return true;
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    handleError("Password must be at least 8 characters", "warning", "Form Validation");
    return false;
  }
  return true;
};

