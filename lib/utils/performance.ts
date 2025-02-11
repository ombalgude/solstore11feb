// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const lazyLoad = async <T>(
  importFn: () => Promise<T>,
  fallback?: T
): Promise<T> => {
  try {
    return await importFn();
  } catch (error) {
    console.error('Lazy load error:', error);
    return fallback as T;
  }
};

export const measurePerformance = (
  name: string,
  fn: () => void
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.time(name);
    fn();
    console.timeEnd(name);
  } else {
    fn();
  }
};

export const optimizeImage = (url: string, width: number = 800): string => {
  if (url.includes('unsplash.com')) {
    return `${url}?w=${width}&auto=format&fit=crop&q=60`;
  }
  return url;
};