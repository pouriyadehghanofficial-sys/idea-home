import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface ViewportContextType {
  viewport: ViewportMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const ViewportContext = createContext<ViewportContextType>({
  viewport: 'desktop',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

export interface ViewportProviderProps {
  children: React.ReactNode;
  forcedViewport?: ViewportMode;
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  children,
  forcedViewport,
}) => {
  const [detectedViewport, setDetectedViewport] = useState<ViewportMode>(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    if (forcedViewport) return;
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDetectedViewport('mobile');
      else if (width < 1024) setDetectedViewport('tablet');
      else setDetectedViewport('desktop');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [forcedViewport]);

  const activeViewport = forcedViewport || detectedViewport;

  const value: ViewportContextType = {
    viewport: activeViewport,
    isMobile: activeViewport === 'mobile',
    isTablet: activeViewport === 'tablet',
    isDesktop: activeViewport === 'desktop',
  };

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = (): ViewportContextType => {
  return useContext(ViewportContext);
};
