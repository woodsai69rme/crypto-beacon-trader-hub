
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: 
            "group-[.toast]:border-green-500/30 group-[.toast]:bg-green-500/10",
          error:
            "group-[.toast]:border-red-500/30 group-[.toast]:bg-red-500/10",
          warning:
            "group-[.toast]:border-yellow-500/30 group-[.toast]:bg-yellow-500/10",
          info:
            "group-[.toast]:border-blue-500/30 group-[.toast]:bg-blue-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
