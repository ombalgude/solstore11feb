// Scroll management utilities
export const scrollToTop = (smooth: boolean = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

export const scrollToElement = (
  elementId: string,
  offset: number = 0,
  smooth: boolean = true
) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
};

export const useInfiniteScroll = (
  callback: () => void,
  threshold: number = 100
) => {
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        if (scrollHeight - scrollTop <= clientHeight + threshold) {
          callback();
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  return handleScroll;
};

export const disableScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = 'var(--scrollbar-width)';
};

export const enableScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};