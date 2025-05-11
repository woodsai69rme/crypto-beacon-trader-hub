
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', checkWindowSize);
    checkWindowSize();

    return () => window.removeEventListener('resize', checkWindowSize);
  }, [breakpoint]);

  return isMobile;
}
