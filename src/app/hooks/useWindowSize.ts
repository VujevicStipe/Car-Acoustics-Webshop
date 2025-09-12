"use client";
import { useState, useEffect } from "react";

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
};

type DeviceType = "desktop" | "tablet" | "mobile";

const useDeviceType = (): DeviceType => {
  const { width } = useWindowSize();

  if (width === undefined) {
    return "mobile";
  }

  if (width >= 1025) {
    return "desktop";
  } else if (width >= 768) {
    return "tablet";
  } else {
    return "mobile";
  }
};

export default useDeviceType;
