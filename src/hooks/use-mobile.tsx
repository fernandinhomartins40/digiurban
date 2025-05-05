
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : undefined
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return !!isMobile;
}
