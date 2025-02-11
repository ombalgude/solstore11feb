// Viewport and responsive utilities
export const getViewportSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const isMobile = () => 
  typeof window !== 'undefined' && window.innerWidth < 768;

export const isTablet = () =>
  typeof window !== 'undefined' && 
  window.innerWidth >= 768 && 
  window.innerWidth < 1024;

export const isDesktop = () =>
  typeof window !== 'undefined' && window.innerWidth >= 1024;

export const getBreakpoint = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

export const useViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const calculateResponsiveValue = (
  mobileValue: number,
  desktopValue: number,
  currentWidth: number = typeof window !== 'undefined' ? window.innerWidth : 0
) => {
  const minWidth = 320; // Mobile breakpoint
  const maxWidth = 1920; // Desktop breakpoint

  if (currentWidth <= minWidth) return mobileValue;
  if (currentWidth >= maxWidth) return desktopValue;

  const percentage = (currentWidth - minWidth) / (maxWidth - minWidth);
  return mobileValue + (desktopValue - mobileValue) * percentage;
};