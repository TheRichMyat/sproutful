"use client";

// StrengthWheel — DESIGN.md §7.
//
// Self-contained, responsive radial chart. Draws 8 equal 45° wedges clockwise
// from the top, one per intelligence (Word → Logic → Music → Picture → Body →
// People → Self → Nature). Each wedge fills outward to (score/5) * maxRadius
// — the math is the single source of truth; visuals only describe it.
//
// Visuals (polish pass):
//   • Each wedge gets a radial gradient — lightened intel colour at the centre
//     and the full colour at the rim — so high scores look richer at the tip.
//   • Faint concentric grid rings at 1..5 sit behind for scale.
//   • Cream-coloured spokes act as thin separators between wedges.
//   • Wedge tips and outer ring have slightly rounded joins.
//   • The whole wheel casts a soft drop shadow (CSS, on the wrapper).
//   • Score pills (white) and the centre Sprout disc are lifted with an SVG
//     drop-shadow filter so they read clearly on top.
//
// The wheel is drawn live from `scores` — never a static image.

import { LogoMark } from "@/components/Logo";
import { useLanguage } from "@/context/language";
import {
  INTELLIGENCES,
  INTELLIGENCE_ORDER,
  type Intelligence,
} from "@/lib/intelligences";
import type { IntelligenceKey } from "@/lib/questions";

type Props = {
  scores: Record<IntelligenceKey, number>;
  className?: string;
  /**
   * Opt-in tighter labels for small renders (e.g. the PDF report). Uses the
   * single-word intelligence name ("Word" instead of "Word Smart"), a smaller
   * label font, and pushes the label radius further out so labels don't
   * overlap each other or the score pills. Default off — on-screen wheel
   * stays exactly as it was.
   */
  compact?: boolean;
};

// Geometry, in SVG units. The viewBox is square; CSS sizes the container.
const SVG = 600;
const CX = SVG / 2;
const CY = SVG / 2;
const MAX_R = 175;
const RINGS = [1, 2, 3, 4, 5] as const;
const LABEL_R_DEFAULT = 248;
const LABEL_R_COMPACT = 286;
const PILL_OFFSET = 18;
const MIN_PILL_R = 60;
const CENTER_R = 32;

function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}

/** Polar → cartesian where 0° is straight up and angle increases clockwise. */
function pt(angleDeg: number, r: number) {
  const a = deg2rad(angleDeg - 90);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function wedgePath(startA: number, endA: number, r: number) {
  if (r <= 0) return "";
  const p1 = pt(startA, r);
  const p2 = pt(endA, r);
  // sweep=1 = clockwise in SVG user space (y-down).
  return `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`;
}

/** Mix `hex` with white by factor t (0..1). Returns "rgb(r, g, b)". */
function lighten(hex: string, t: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lr = Math.round(r + (255 - r) * t);
  const lg = Math.round(g + (255 - g) * t);
  const lb = Math.round(b + (255 - b) * t);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

export function StrengthWheel({
  scores,
  className,
  compact = false,
}: Props) {
  const labelR = compact ? LABEL_R_COMPACT : LABEL_R_DEFAULT;
  return (
    <div
      className={
        "relative aspect-square w-full [filter:drop-shadow(0_18px_28px_rgba(30,41,59,0.08))] " +
        (className ?? "")
      }
      role="img"
      aria-label="Strength wheel showing scores for the 8 intelligences"
    >
      <svg
        viewBox={`0 0 ${SVG} ${SVG}`}
        className="h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          {/* One radial gradient per intelligence: lightened at centre, full
              intel colour at the rim. userSpaceOnUse so all gradients share
              the wheel centre + maxRadius. */}
          {INTELLIGENCE_ORDER.map((key) => {
            const c = INTELLIGENCES[key].color;
            return (
              <radialGradient
                key={`grad-${key}`}
                id={`grad-${key}`}
                gradientUnits="userSpaceOnUse"
                cx={CX}
                cy={CY}
                r={MAX_R}
              >
                <stop offset="0%" stopColor={lighten(c, 0.65)} />
                <stop offset="60%" stopColor={lighten(c, 0.18)} />
                <stop offset="100%" stopColor={c} />
              </radialGradient>
            );
          })}

          {/* Soft drop shadow for the score pills and centre disc. */}
          <filter
            id="wheel-soft-shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
            <feOffset dx="0" dy="2" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.22" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint concentric grid rings at 1..5. */}
        <g>
          {RINGS.map((n) => (
            <circle
              key={n}
              cx={CX}
              cy={CY}
              r={(n / 5) * MAX_R}
              fill="none"
              stroke="var(--color-border)"
              strokeOpacity={n === 5 ? 0.55 : 0.28}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Filled wedges with radial gradients. A subtle outline on each wedge
            (same intel color, low opacity) sharpens the rim and slightly
            rounds the tip joins via strokeLinejoin. */}
        <g>
          {INTELLIGENCE_ORDER.map((key, i) => {
            const intel = INTELLIGENCES[key];
            const score = clamp(scores[key] ?? 0, 0, 5);
            const r = (score / 5) * MAX_R;
            const startA = i * 45;
            const endA = startA + 45;
            if (r <= 0) return null;
            return (
              <path
                key={`wedge-${key}`}
                d={wedgePath(startA, endA, r)}
                fill={`url(#grad-${key})`}
                stroke={intel.color}
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Cream separators between wedges (thicker than the grid). They sit on
            top of the wedges so each slice reads as its own shape. */}
        <g>
          {INTELLIGENCE_ORDER.map((_, i) => {
            const a = i * 45;
            const p = pt(a, MAX_R + 1);
            return (
              <line
                key={`sep-${i}`}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke="var(--color-bg)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Outer ring drawn on top, crisp. */}
        <circle
          cx={CX}
          cy={CY}
          r={MAX_R}
          fill="none"
          stroke="var(--color-border)"
          strokeOpacity={0.7}
          strokeWidth={1.5}
        />

        {/* Score pills, just past each wedge's outer end, lifted with shadow. */}
        <g filter="url(#wheel-soft-shadow)">
          {INTELLIGENCE_ORDER.map((key, i) => {
            const score = clamp(scores[key] ?? 0, 0, 5);
            const filled = (score / 5) * MAX_R;
            const r = Math.max(MIN_PILL_R, filled) + PILL_OFFSET;
            const midA = i * 45 + 22.5;
            const { x, y } = pt(midA, r);
            return (
              <g
                key={`pill-${key}`}
                transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}
              >
                <rect
                  x={-30}
                  y={-14}
                  width={60}
                  height={28}
                  rx={14}
                  ry={14}
                  fill="var(--color-surface)"
                  stroke="var(--color-border)"
                  strokeWidth={1}
                />
                <text
                  x={-6}
                  y={5}
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontSize={15}
                  fontWeight={700}
                  fill="var(--color-ink)"
                >
                  {score.toFixed(1)}
                </text>
                <text
                  x={9}
                  y={5}
                  textAnchor="start"
                  fontFamily="var(--font-body)"
                  fontSize={8}
                  fontWeight={600}
                  fill="var(--color-body)"
                >
                  /5.0
                </text>
              </g>
            );
          })}
        </g>

        {/* Centre disc — white with a soft shadow, on top of everything. */}
        <g filter="url(#wheel-soft-shadow)">
          <circle
            cx={CX}
            cy={CY}
            r={CENTER_R}
            fill="var(--color-surface)"
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        </g>
      </svg>

      {/* Centre Sprout mark (HTML overlay so we reuse <LogoMark />). */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <LogoMark size={28} />
      </div>

      {/* Labels: name + lucide icon outside each wedge, in its colour. */}
      {INTELLIGENCE_ORDER.map((key, i) => (
        <WheelLabel
          key={`lab-${key}`}
          intel={INTELLIGENCES[key]}
          angleDeg={i * 45 + 22.5}
          labelRadius={labelR}
          compact={compact}
        />
      ))}
    </div>
  );
}

function WheelLabel({
  intel,
  angleDeg,
  labelRadius,
  compact,
}: {
  intel: Intelligence;
  angleDeg: number;
  labelRadius: number;
  compact: boolean;
}) {
  const { t } = useLanguage();
  const { x, y } = pt(angleDeg, labelRadius);
  // Percentages keep labels in place when the SVG scales with the container.
  const pctX = (x / SVG) * 100;
  const pctY = (y / SVG) * 100;
  const Icon = intel.icon;
  // Compact mode drops the "Smart" suffix so labels are narrow enough to
  // stay clear of adjacent labels and the score pills at small render sizes.
  // (The regex only matches English; Myanmar labels render in full.)
  const full = t(intel.label);
  const text = compact ? full.replace(/\s*Smart$/i, "") : full;
  return (
    <div
      className={
        "pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap " +
        (compact ? "" : "gap-1.5")
      }
      style={{ left: `${pctX}%`, top: `${pctY}%`, color: intel.color }}
    >
      <Icon
        className={compact ? "h-3 w-3 shrink-0" : "h-4 w-4 shrink-0"}
        aria-hidden
      />
      <span
        className={
          "font-display font-bold leading-none " +
          (compact ? "text-[9px]" : "text-[11px] sm:text-xs")
        }
      >
        {text}
      </span>
    </div>
  );
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export default StrengthWheel;
