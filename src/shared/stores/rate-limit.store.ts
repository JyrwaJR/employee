import { create } from 'zustand';

type RateLimitState = {
  cooldowns: Record<string, number>;
  startCooldown: (key: string, durationMs: number) => void;
  clearCooldown: (key: string) => void;
};

export const useRateLimitStore = create<RateLimitState>()((set) => ({
  cooldowns: {},
  startCooldown: (key, durationMs) => {
    const expiresAt = Date.now() + durationMs;
    set((state) => {
      const now = Date.now();
      const cleaned = Object.fromEntries(
        Object.entries(state.cooldowns).filter(([, v]) => v > now)
      );
      return { cooldowns: { ...cleaned, [key]: expiresAt } };
    });
  },
  clearCooldown: (key) => {
    set((state) => {
      const { [key]: _, ...rest } = state.cooldowns;
      return { cooldowns: rest };
    });
  },
}));
