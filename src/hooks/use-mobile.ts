
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Initial check
    checkScreenWidth();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenWidth);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, [breakpoint]);
  
  return isMobile;
}
