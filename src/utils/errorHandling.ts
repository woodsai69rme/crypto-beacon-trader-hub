
import { toast } from "@/components/ui/use-toast";

export type ErrorLevel = "error" | "warning" | "info";

export const handleError = (error: unknown, level: ErrorLevel = "error", context?: string) => {
  const message = error instanceof Error ? error.message : String(error);
  const contextPrefix = context ? `[${context}] ` : "";
  
  console.error(`${contextPrefix}${message}`, error);
  
  toast({
    title: level === "error" ? "An error occurred" : level === "warning" ? "Warning" : "Information",
    description: `${contextPrefix}${message}`,
    variant: level === "error" ? "destructive" : "default",
  });
  
  return error;
};

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
