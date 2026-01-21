// /utils/scroll/smoothScroll.ts
export const smoothScroll = (
  element: HTMLElement,
  distance: number,
  duration: number = 1500,
): void => {
  let start = element.scrollLeft;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    const run = easeInOutQuad(timeElapsed, start, distance, duration);
    element.scrollLeft = run;

    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

// Optional: Export easing functions separately
export const easingFunctions = {
  easeInOutQuad: (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  },
  easeOutCubic: (t: number, b: number, c: number, d: number) => {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  },
  // Add more easing functions as needed
};
