// Placeholder for art the human hasn't dropped in yet. Renders a labeled grey
// box at the requested size; once the real file lands at `public/illustrations/{src}`
// it will be picked up with no other code changes.
//
// Usage:
//   <Illustration src="hero.png" alt="..." width={520} height={420} />

import Image from "next/image";

type IllustrationProps = {
  /** Filename inside /public/illustrations/, e.g. "hero.png". */
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** When the real asset exists, this can be flipped to render it. */
  real?: boolean;
  priority?: boolean;
};

export function Illustration({
  src,
  alt,
  width,
  height,
  className,
  real = false,
  priority,
}: IllustrationProps) {
  const path = `/illustrations/${src}`;

  if (real) {
    return (
      <Image
        src={path}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={
        "flex items-center justify-center rounded-[20px] border border-dashed border-border bg-surface-soft text-body " +
        (className ?? "")
      }
      style={{ width, height }}
    >
      <div className="px-3 text-center">
        <div className="font-display text-sm font-semibold opacity-70">
          Illustration
        </div>
        <div className="mt-1 font-mono text-xs opacity-60">{path}</div>
      </div>
    </div>
  );
}

export default Illustration;
