// Sproutful brand mark — DESIGN.md §6 (top-left on every screen) and §7 (center
// of the Strength Wheel).
//
// `<Logo />`     — full lockup: sprout icon + "Sproutful" wordmark.
// `<LogoMark />` — just the icon, sized for the wheel center.
//
// The mark is a lucide `Sprout` for now; the human will swap in a real logo
// later by editing only this file.

import Link from "next/link";
import { Sprout } from "lucide-react";

type LogoProps = {
  /** Wraps the lockup in a Link to `/` when true (default for top-of-page use). */
  asLink?: boolean;
  className?: string;
};

export function Logo({ asLink = true, className }: LogoProps) {
  const inner = (
    <span
      className={
        "inline-flex items-center gap-2 font-display text-xl font-bold text-brand " +
        (className ?? "")
      }
    >
      <LogoMark size={28} />
      <span>Sproutful</span>
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link href="/" aria-label="Sproutful — home" className="inline-flex">
      {inner}
    </Link>
  );
}

type LogoMarkProps = {
  /** Pixel size of the icon (the mark is square). */
  size?: number;
  className?: string;
};

export function LogoMark({ size = 24, className }: LogoMarkProps) {
  return (
    <Sprout
      size={size}
      strokeWidth={2.25}
      className={"text-brand " + (className ?? "")}
      aria-hidden="true"
    />
  );
}

export default Logo;
