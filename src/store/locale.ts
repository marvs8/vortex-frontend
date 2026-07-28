import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const SUPPORTED_LOCALES = ["en", "es", "fr", "de", "ja"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "en";

export type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "vortex-locale",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
