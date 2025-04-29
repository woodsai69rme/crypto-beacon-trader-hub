
import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the current screen size is mobile
 * @param breakpoint The breakpoint to consider mobile (default: 768px)
 * @returns Boolean indicating if the screen is mobile size
 */
export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < breakpoint);

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};
