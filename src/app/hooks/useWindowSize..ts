import { useEffect, useState } from "react";

type WindowSize = {
  isMobile: boolean | undefined;
  isTablet: boolean | undefined;
  isLaptop: boolean | undefined;
  isDesktop: boolean | undefined;
};

const useWindowSize = (): WindowSize => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [isTablet, setIsTablet] = useState<boolean | undefined>(undefined);
  const [isLaptop, setIsLaptop] = useState<boolean | undefined>(undefined);
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setIsMobile(width <= 767);
      setIsTablet(width >= 768 && width <= 1023);
      setIsLaptop(width >= 1024 && width <= 1439);
      setIsDesktop(width >= 1440);
    };

    handleResize(); // 최초 렌더링 시 사이즈 계산
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, isTablet, isLaptop, isDesktop };
};

export default useWindowSize;
