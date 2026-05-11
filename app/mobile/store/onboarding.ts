/**
 * Onboarding state — simple in-memory store.
 * In production, persist with AsyncStorage or expo-secure-store.
 */
import { useState, useCallback } from 'react';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  studentId: string | null;
}

interface OnboardingActions {
  completeOnboarding: (data: { studentId: string }) => void;
  resetOnboarding: () => void;
}

// Module-level state (simple singleton — replace with Zustand/Jotai if needed)
let _state: OnboardingState = {
  hasCompletedOnboarding: false,
  studentId: null,
};

const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((fn) => fn());
}

export function useOnboardingStore(): OnboardingState & OnboardingActions {
  const [, forceUpdate] = useState(0);

  const subscribe = useCallback(() => {
    const handler = () => forceUpdate((n) => n + 1);
    _listeners.add(handler);
    return () => _listeners.delete(handler);
  }, []);

  const completeOnboarding = useCallback((data: { studentId: string }) => {
    _state = { hasCompletedOnboarding: true, studentId: data.studentId };
    notify();
  }, []);

  const resetOnboarding = useCallback(() => {
    _state = { hasCompletedOnboarding: false, studentId: null };
    notify();
  }, []);

  return {
    ..._state,
    completeOnboarding,
    resetOnboarding,
  };
}
