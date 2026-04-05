import { useState } from 'react';

export const useDelay = (ms: number = 1000) => {
  const [isDelayed, setIsDelayed] = useState(false);

  const trigger = () => {
    setIsDelayed(true);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsDelayed(false);
        resolve();
      }, ms);
    });
  };

  return {
    trigger,
    isDelayed,
  };
};
