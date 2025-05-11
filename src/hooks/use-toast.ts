
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function toast({ 
  title, 
  description,
  variant = "default", 
  duration = 3000,
  action
}: ToastProps) {
  const toastVariants = {
    default: { className: "" },
    destructive: { className: "bg-destructive text-destructive-foreground" },
    success: { className: "bg-green-600 text-white" },
  };
  
  return sonnerToast(title, {
    description,
    duration,
    className: toastVariants[variant].className,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  });
}

// Create a fake toasts array for the toaster component
const toasts: { id: string; title?: string; description?: string; action?: any }[] = [];

export const useToast = () => {
  return {
    toast,
    toasts, // Add this to fix the toaster component
  };
};

export default useToast;
