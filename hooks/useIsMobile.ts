"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 1280) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    check(); // initial check
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, [breakpoint]);

  return isMobile;
}
