import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const checkDevice = () => {
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasTouch = navigator.maxTouchPoints > 1;
      const ua = navigator.userAgent;
      const width = window.innerWidth;

      const isIPad =
        /iPad/.test(ua) || (hasTouch && /Mac/.test(ua) && width >= 768);

      if (isIPad) {
        setDeviceType("tablet");
      } else if (!hasCoarsePointer && !hasTouch) {
        setDeviceType("desktop");
      } else if (width< 768) {
        setDeviceType("mobile");
      } else {
        setDeviceType("tablet");
      }
    };

    checkDevice();

    const mql = window.matchMedia("(pointer: coarse)");
    mql.addEventListener("change", checkDevice);
    window.addEventListener("resize", checkDevice);

    return () => {
      mql.removeEventListener("change", checkDevice);
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return deviceType;
}
