
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * SidebarContext
 * -----------------------------------------------------------------------------------------------*/

interface SidebarContextValue {
  isOpen: boolean;
  toggle(): void;
  setIsOpen(isOpen: boolean): void;
  baseWidth: number;
  collapsedWidth: number;
  isHovering: boolean;
  setIsHovering(isHovering: boolean): void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * SidebarProvider
 * -----------------------------------------------------------------------------------------------*/

interface SidebarProviderProps {
  children: React.ReactNode;
  /**
   * Width of the sidebar in expanded state
   * @default 240
   */
  width?: number;
  /**
   * Width of the sidebar in collapsed state
   * @default 60
   */
  collapsedWidth?: number;
  /**
   * Initial state of the sidebar
   * @default true
   */
  defaultIsOpen?: boolean;
  /**
   * Control the sidebar state externally
   */
  isOpen?: boolean;
  /**
   * Callback when the sidebar state changes
   */
  onOpenChange?: (isOpen: boolean) => void;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(
  (
    {
      children,
      width = 240,
      collapsedWidth = 60,
      defaultIsOpen = true,
      isOpen: isOpenProp,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [isHovering, setIsHovering] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(defaultIsOpen);

    const isControlled = isOpenProp !== undefined;

    React.useEffect(() => {
      if (isControlled) {
        setIsOpen(isOpenProp);
      }
    }, [isControlled, isOpenProp]);

    function toggle() {
      const newValue = !isOpen;
      if (!isControlled) {
        setIsOpen(newValue);
      }
      onOpenChange?.(newValue);
    }

    return (
      <SidebarContext.Provider
        value={{
          isOpen: isOpen,
          toggle,
          setIsOpen: (state) => {
            if (!isControlled) {
              setIsOpen(state);
            }
            onOpenChange?.(state);
          },
          baseWidth: width,
          collapsedWidth,
          isHovering,
          setIsHovering,
        }}
      >
        <div
          ref={ref}
          className="h-full grid [grid-template-areas:'sidebar_main'] [grid-template-columns:auto_1fr]"
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

/* -------------------------------------------------------------------------------------------------
 * Sidebar
 * -----------------------------------------------------------------------------------------------*/

const sidebarVariants = cva(
  "grid [grid-template-rows:auto_1fr_auto] h-full bg-background overflow-hidden transition-all border-r [grid-area:sidebar]",
  {
    variants: {
      collapsed: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const { isOpen, baseWidth, collapsedWidth, setIsHovering } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn(
          sidebarVariants({
            collapsed: !isOpen,
            className,
          })
        )}
        style={{
          width: isOpen ? baseWidth : collapsedWidth,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

/* -------------------------------------------------------------------------------------------------
 * SidebarHeader
 * -----------------------------------------------------------------------------------------------*/

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn("py-2", className)}
        {...props}
      >
        {isOpen ? children : null}
      </div>
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";

/* -------------------------------------------------------------------------------------------------
 * SidebarContent
 * -----------------------------------------------------------------------------------------------*/

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-auto pb-2", className)}
        {...props}
      />
    );
  }
);
SidebarContent.displayName = "SidebarContent";

/* -------------------------------------------------------------------------------------------------
 * SidebarFooter
 * -----------------------------------------------------------------------------------------------*/

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn("py-2", className)}
        {...props}
      >
        {isOpen ? children : null}
      </div>
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";

/* -------------------------------------------------------------------------------------------------
 * SidebarGroup
 * -----------------------------------------------------------------------------------------------*/

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("py-2", className)} {...props}>
        {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
        {children}
      </div>
    );
  }
);
SidebarGroup.displayName = "SidebarGroup";

/* -------------------------------------------------------------------------------------------------
 * SidebarGroupLabel
 * -----------------------------------------------------------------------------------------------*/

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, ...props }, ref) => {
  const { isOpen, isHovering } = useSidebar();

  if (!isOpen && !isHovering) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "text-xs font-medium px-2 text-foreground/70",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

/* -------------------------------------------------------------------------------------------------
 * SidebarGroupContent
 * -----------------------------------------------------------------------------------------------*/

interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});
SidebarGroupContent.displayName = "SidebarGroupContent";

/* -------------------------------------------------------------------------------------------------
 * SidebarTrigger
 * -----------------------------------------------------------------------------------------------*/

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, ...props }, ref) => {
  const { toggle } = useSidebar();

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center h-8 w-8 border rounded-md hover:bg-accent",
        className
      )}
      onClick={toggle}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2.5c0 .414.336.75.75.75h2.5a.75.75 0 000-1.5h-1.75v-1.75zM4.25 6.75A.75.75 0 015 6h.249a.75.75 0 01.75.75v.25a.75.75 0 01-.75.75H5a.75.75 0 01-.75-.75v-.25zM5.75 13.75a.75.75 0 00-1.5 0v2.5c0 .414.336.75.75.75h2.5a.75.75 0 000-1.5h-1.75v-1.75zM11.75 8a.75.75 0 01-.75.75h-.25a.75.75 0 01-.75-.75v-.25a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v.25zM14.25 6.75a.75.75 0 00-1.5 0v.25c0 .414.336.75.75.75h.25a.75.75 0 00.75-.75v-.25zM11.75 17a.75.75 0 01-.75.75h-.25a.75.75 0 01-.75-.75v-.25a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v.25zM14.25 13.75a.75.75 0 00-.75.75v.25c0 .414.336.75.75.75h.25a.75.75 0 00.75-.75v-.25a.75.75 0 00-.75-.75h-.25z" />
      </svg>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

/* -------------------------------------------------------------------------------------------------
 * SidebarMenu
 * -----------------------------------------------------------------------------------------------*/

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1 px-2",
        className
      )}
      {...props}
    />
  );
});
SidebarMenu.displayName = "SidebarMenu";

/* -------------------------------------------------------------------------------------------------
 * SidebarMenuItem
 * -----------------------------------------------------------------------------------------------*/

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});
SidebarMenuItem.displayName = "SidebarMenuItem";

/* -------------------------------------------------------------------------------------------------
 * SidebarMenuButton
 * -----------------------------------------------------------------------------------------------*/

const menuButtonVariants = cva(
  "group flex items-center gap-2 rounded-md p-2 w-full hover:bg-accent text-sm transition-colors",
  {
    variants: {
      active: {
        true: "bg-accent text-accent-foreground",
        false: "text-foreground/70 hover:text-accent-foreground",
      },
      compact: {
        true: "py-2 justify-center !px-0",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      compact: false,
    },
  }
);

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuButtonVariants> {
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, active, asChild = false, ...props }, ref) => {
  const { isOpen, isHovering } = useSidebar();
  const compact = !isOpen && !isHovering;

  const Comp = asChild ? "span" : "button";

  return (
    // @ts-ignore: The component type gets messed up by asChild
    <Comp
      ref={ref}
      className={cn(
        menuButtonVariants({
          active,
          compact,
          className,
        })
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};
