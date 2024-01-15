import { useRef, useEffect } from 'react';

export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): typeof callback => {
  const timeout = useRef<number | null>(null);

  const clearTimer = () => {
    if (!timeout.current) return;
    clearTimeout(timeout.current);
    timeout.current = null;
  };

  const call = (...args: any[]) => {
    clearTimer();
    timeout.current = setTimeout(() => callback(...args), delay) as unknown as number;
  };

  useEffect(() => {
    return clearTimer();
  }, []);

  return call as T;
};
