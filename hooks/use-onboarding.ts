"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingStore {
  completed: boolean;
  setCompleted: () => void;
  reset: () => void;
}

export const useOnboarding = create<OnboardingStore>()(
  persist(
    (set) => ({
      completed: false,
      setCompleted: () => set({ completed: true }),
      reset: () => set({ completed: false }),
    }),
    { name: "teapulse-onboarding" }
  )
);
