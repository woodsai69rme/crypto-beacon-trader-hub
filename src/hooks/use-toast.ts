
import { toast as sonnerToast, type Toast } from "sonner";

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

export const useToast = () => {
  return {
    toast,
  };
};

export default useToast;
