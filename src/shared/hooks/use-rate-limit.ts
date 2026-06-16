import { useState, useEffect, useCallback } from 'react';
import { useRateLimitStore } from '../stores/rate-limit.store';

export const useRateLimit = (key: string, durationSeconds: number = 60) => {
  const startCooldown = useRateLimitStore((s) => s.startCooldown);
  const clearCooldown = useRateLimitStore((s) => s.clearCooldown);
  const expiresAt = useRateLimitStore((s) => s.cooldowns[key]);

  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (!expiresAt || expiresAt <= Date.now()) {
      setSecondsRemaining(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining <= 0) clearCooldown(key);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, key, clearCooldown]);

  const start = useCallback(() => {
    startCooldown(key, durationSeconds * 1000);
  }, [key, durationSeconds, startCooldown]);

  const reset = useCallback(() => {
    clearCooldown(key);
    setSecondsRemaining(0);
  }, [key, clearCooldown]);

  return {
    isLimited: secondsRemaining > 0,
    secondsRemaining,
    startCooldown: start,
    reset,
  };
};
