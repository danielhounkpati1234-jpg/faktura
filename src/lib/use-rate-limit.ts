"use client";

import { useState, useEffect, useCallback } from "react";

interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
}

export function useRateLimit(key: string, maxAttempts = 5, lockoutMinutes = 15) {
  const storageKey = `faktura-rate-limit-${key}`;

  const [state, setState] = useState<RateLimitState>({ attempts: 0, lockedUntil: null });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: RateLimitState = JSON.parse(stored);
        if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
          localStorage.removeItem(storageKey);
        } else {
          setState(parsed);
        }
      }
    } catch {}
  }, [storageKey]);

  const isLocked = state.lockedUntil !== null && Date.now() < state.lockedUntil;

  const remainingMinutes = isLocked
    ? Math.ceil((state.lockedUntil! - Date.now()) / 60000)
    : 0;

  const recordFailure = useCallback(() => {
    setState((prev) => {
      const newAttempts = prev.attempts + 1;
      const newState: RateLimitState = {
        attempts: newAttempts,
        lockedUntil: newAttempts >= maxAttempts
          ? Date.now() + lockoutMinutes * 60000
          : prev.lockedUntil,
      };
      try { localStorage.setItem(storageKey, JSON.stringify(newState)); } catch {}
      return newState;
    });
  }, [storageKey, maxAttempts, lockoutMinutes]);

  const reset = useCallback(() => {
    setState({ attempts: 0, lockedUntil: null });
    try { localStorage.removeItem(storageKey); } catch {}
  }, [storageKey]);

  return { isLocked, remainingMinutes, attemptsLeft: maxAttempts - state.attempts, recordFailure, reset };
}
