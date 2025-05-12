import { useEffect, useState } from "react";

const useIsMobile = (query = '(max-width: 1024px)') => {
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return isMobile;
};

export default useIsMobile;
