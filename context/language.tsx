"use client";

// Site-wide language state (EN / MY).
//
// Mounted once at the root layout so every screen — student start, quiz,
// result, and the school dashboard — shares the same choice. The selection is
// remembered for the browser session via `sessionStorage` (NOT localStorage,
// per the data rules), so it survives the start → quiz → result navigation and
// a refresh, but resets when the tab is closed.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { pick, type Bilingual, type Lang } from "@/lib/i18n";

const STORAGE_KEY = "sproutful.lang";

type LanguageValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Resolve a bilingual value for the active language (EN fallback). */
  t: (value: { en: string; my?: string | null }) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start as "en" so the server-rendered HTML and the first client render
  // match (avoids hydration mismatch); then adopt any stored choice.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored === "my" || stored === "en") setLangState(stored);
    } catch {
      // sessionStorage may be unavailable (private mode); default to en.
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore write failures
    }
  }, []);

  const t = useCallback(
    (value: { en: string; my?: string | null }) => pick(value, lang),
    [lang],
  );

  const value = useMemo<LanguageValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useLanguage must be used inside <LanguageProvider> (mounted in app/layout.tsx).",
    );
  }
  return ctx;
}

// Re-export for convenience so screens can import the type from one place.
export type { Bilingual, Lang };
