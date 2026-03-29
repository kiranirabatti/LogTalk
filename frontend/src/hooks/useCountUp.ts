import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to the target value.
 * Duration in ms. Uses easeOutExpo for a satisfying deceleration.
 */
const useCountUp = (target: number, duration: number = 800): number => {
  const [current, setCurrent] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;

    if (target === 0) return;

    const startTime = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return current;
};

export default useCountUp;
