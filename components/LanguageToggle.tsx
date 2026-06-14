"use client";

// EN | MY language toggle. A small segmented pill that flips the site-wide
// language held in LanguageContext. Placed in the top nav of the student
// start, result, and dashboard screens.

import { useLanguage } from "@/context/language";
import type { Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "my", label: "MY" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={
        "inline-flex items-center rounded-full border border-border bg-surface p-0.5 " +
        (className ?? "")
      }
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLang(opt.value)}
            aria-pressed={active}
            className={
              "rounded-full px-2.5 py-1 font-body text-xs font-bold transition-colors " +
              (active
                ? "bg-brand text-white"
                : "text-body hover:text-ink")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageToggle;
