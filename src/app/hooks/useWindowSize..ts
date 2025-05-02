import { useState, useEffect } from 'react';

interface WindowSize {
  isMobile: boolean | undefined;
  isLaptop: boolean | undefined;
}

const useWindowSize = (): WindowSize => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [isLaptop, setIsLaptop] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 680);
      setIsLaptop(width > 680 && width <= 1280);
    };

    handleResize(); // 최초 렌더링 시에도 호출
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, isLaptop };
};

export default useWindowSize;
