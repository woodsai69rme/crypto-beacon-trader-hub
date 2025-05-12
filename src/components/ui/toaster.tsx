
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()
  const { colorScheme } = useTheme()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className={cn(
              colorScheme === "neon-future" && "backdrop-blur-md border-cyan-500/30",
              colorScheme === "sunset-gradient" && "border-orange-500/30",
              colorScheme === "matrix-code" && "border-green-500/30",
              colorScheme === "cyber-pulse" && "border-purple-500/30"
            )}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className={cn(
                  colorScheme === "neon-future" && "text-cyan-400",
                  colorScheme === "sunset-gradient" && "text-orange-400",
                  colorScheme === "matrix-code" && "text-green-400",
                  colorScheme === "cyber-pulse" && "text-purple-400"
                )}>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
