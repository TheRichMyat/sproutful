"use client";

// Result screen — DESIGN.md §6.3.
//
// Reads { studentId, topIntelligence, scores } from StudentFlowContext (set
// by the quiz screen after a successful `submit`). If the context is empty
// — e.g. the URL was opened directly or the tab was refreshed — we bounce
// back to /s/[code] so the student can take the quiz again.
//
// This pass is visual polish only — data flow, scoring, context reading and
// navigation are intentionally unchanged.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  Award,
  ArrowRight,
  Download,
  Loader2,
  Sparkles,
  Sprout,
  Star,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { Illustration } from "@/components/Illustration";
import { LanguageToggle } from "@/components/LanguageToggle";
import { StrengthWheel } from "@/components/StrengthWheel";
import { useStudentFlow, type StudentInfo } from "@/context/student-flow";
import { useLanguage } from "@/context/language";
import { UI } from "@/lib/i18n";
import {
  INTELLIGENCES,
  INTELLIGENCE_ORDER,
} from "@/lib/intelligences";
import type { IntelligenceKey } from "@/lib/questions";
import type { Scores } from "@/lib/scoring";

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function ResultScreen() {
  const { code, student, result, reset } = useStudentFlow();
  const { t, lang } = useLanguage();
  const router = useRouter();
  const isMy = lang === "my";

  useEffect(() => {
    if (!result) router.replace(`/s/${code}`);
  }, [result, code, router]);

  const topKey = useMemo(
    () => (result ? findTopKey(result.scores) : null),
    [result],
  );

  // PDF generation state.
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!result || !topKey) return <RedirectingState />;

  const topScore = result.scores[topKey];

  function handleContinue() {
    reset();
    router.push(`/s/${code}`);
  }

  async function handleDownload() {
    if (!result || isPreparing) return;
    setIsPreparing(true);
    setDownloadError(null);
    try {
      // Dynamic imports keep these heavy libs out of the initial bundle —
      // they're only fetched when the student actually clicks Download.
      const [{ jsPDF }, html2canvasMod] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);
      const html2canvas = html2canvasMod.default;

      const node = reportRef.current;
      if (!node) throw new Error("Report layout not mounted");

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#FAF6EE",
        useCORS: true,
        logging: false,
      });

      // A4 portrait. jspdf takes mm; html2canvas gives pixels at the node's
      // CSS size × scale. The off-screen report is rendered at 794 px wide
      // ≈ 210 mm at 96 dpi, so width-fit is the natural mapping.
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const imgW = canvas.width;
      const imgH = canvas.height;
      const scale = Math.min(pageW / imgW, pageH / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const x = (pageW - drawW) / 2;
      // Anchor the image to the top of the A4 page (with a tiny top margin)
      // instead of centring vertically — otherwise the report sits in the
      // middle with a big blank band above the logo.
      const y = Math.min(6, Math.max(0, pageH - drawH));

      pdf.addImage(canvas, "PNG", x, y, drawW, drawH, undefined, "FAST");
      // Output a Blob and trigger the download via an anchor click — same
      // pattern as the dashboard CSV export. Avoids jspdf's internal save(),
      // which uses a download path that some envs (e.g. headless capture)
      // intercept inconsistently.
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Sproutful-${result.studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setDownloadError(t(UI.result_pdf_err));
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <ConfettiBackground />
      <CornerArt />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 sm:px-10"
      >
        <Header studentId={result.studentId} />

        <motion.div
          variants={itemVariants}
          className={
            "text-center md:mt-1 " + (isMy ? "mt-6" : "mt-5")
          }
        >
          <h1 className="relative inline-block font-display text-3xl font-bold text-brand sm:text-4xl">
            <Sparkles
              className="absolute -left-7 -top-2 h-5 w-5 text-primary/70"
              aria-hidden
            />
            {t(UI.result_title)}
            <Star
              className="absolute -right-7 top-1 h-4 w-4 text-[#F4B740]"
              aria-hidden
              fill="#F4B740"
              strokeWidth={0}
            />
          </h1>
          <p
            className={
              "mt-1 font-body text-sm text-body sm:text-base " +
              (isMy ? "leading-loose" : "")
            }
          >
            {t(UI.result_subline)}
          </p>
        </motion.div>

        <main
          className={
            "grid flex-1 grid-cols-1 items-center py-3 md:grid-cols-[1fr_1.1fr] md:gap-10 " +
            // Burmese text is taller; give the card and wheel more room to
            // breathe on mobile. EN keeps its original gap-6.
            (isMy ? "gap-9 md:py-4" : "gap-6")
          }
        >
          {/* Mobile order: character/card first, wheel below. Desktop order:
              wheel on the left, card on the right. */}
          <motion.div
            variants={itemVariants}
            className={
              "order-2 md:order-1 " +
              (isMy
                ? "flex flex-col items-center"
                : "flex items-center justify-center")
            }
          >
            {/* Myanmar labels are long phrases that overlap the wheel on a
                narrow screen, so render the wheel without surrounding labels
                and list the names in a clean legend below instead. */}
            <StrengthWheel
              scores={result.scores}
              showLabels={!isMy}
              className={isMy ? "max-w-[300px]" : "max-w-[400px]"}
            />
            {isMy ? <WheelLegend scores={result.scores} /> : null}
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 md:order-2">
            <TopStrengthCard topKey={topKey} score={topScore} />
          </motion.div>
        </main>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-2 pb-4"
        >
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isPreparing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-brand bg-surface px-5 font-body font-bold text-brand shadow-sm transition-colors hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPreparing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  <span>{t(UI.result_preparing)}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" aria-hidden />
                  <span>{t(UI.result_download)}</span>
                </>
              )}
            </button>
            <PrimaryButton onClick={handleContinue}>
              {t(UI.result_continue)}
            </PrimaryButton>
          </div>
          {downloadError ? (
            <p role="alert" className="font-body text-xs text-primary">
              {downloadError}
            </p>
          ) : null}
        </motion.div>
      </motion.div>

      {/* Off-screen A4-sized layout captured by html2canvas-pro when the
          student clicks Download Report. Kept rendered (not unmounted) so
          the click → capture loop has no race; positioned far off-screen
          + aria-hidden so it's invisible and ignored by assistive tech. */}
      <PrintableReport
        refEl={reportRef}
        student={student}
        result={result}
        topKey={topKey}
        topScore={topScore}
      />
    </div>
  );
}

// ---------- Header ----------

function Header({ studentId }: { studentId: string }) {
  const { t } = useLanguage();
  return (
    <motion.header
      variants={itemVariants}
      className="flex items-center justify-between py-4 md:py-5"
    >
      <Logo />
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <span
          className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs font-semibold text-body shadow-card"
          aria-label={t(UI.result_student_id_aria)}
        >
          {studentId}
        </span>
      </div>
    </motion.header>
  );
}

// ---------- Top strength card (celebratory) ----------

function TopStrengthCard({
  topKey,
  score,
}: {
  topKey: IntelligenceKey;
  score: number;
}) {
  const { t, lang } = useLanguage();
  const isMy = lang === "my";
  const intel = INTELLIGENCES[topKey];
  const Icon = intel.icon;

  // PNG path: `body_smart` → `/illustrations/characters/body.png`.
  const charSrc = `/illustrations/characters/${topKey.replace(/_smart$/, "")}.png`;

  // If the asset hasn't been dropped in (or 404s for any reason), fall back
  // to the tinted lucide icon + Award ribbon so the card never breaks.
  const [imgFailed, setImgFailed] = useState(false);
  // Reset if the top intelligence ever changes (e.g. a fresh quiz).
  useEffect(() => setImgFailed(false), [topKey]);

  return (
    <div className="flex w-full flex-col items-center">
      {/* Hero: character image (or fallback) — pops above the card via a
          negative bottom margin so its bottom 56px overlaps the card top. */}
      {!imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={charSrc}
          alt=""
          onError={() => setImgFailed(true)}
          className="relative z-10 -mb-16 h-[180px] w-auto select-none object-contain drop-shadow-[0_10px_18px_rgba(30,41,59,0.10)] sm:h-[210px]"
        />
      ) : (
        <div
          className="relative z-10 -mb-14 flex h-[136px] w-[136px] items-center justify-center rounded-full shadow-card"
          style={{ backgroundColor: hexWithAlpha(intel.color, 0.22) }}
          aria-hidden
        >
          <Icon className="h-14 w-14" style={{ color: intel.color }} />
          {/* Small award/ribbon accent for the fallback case. */}
          <div
            className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full shadow-card"
            style={{ backgroundColor: intel.color }}
          >
            <Award className="h-5 w-5 text-white" />
          </div>
        </div>
      )}

      {/* The card itself. pt-[72px] reserves vertical space below where the
          character image overlaps, so heading and body text are never
          hidden behind the illustration. */}
      <div
        className={
          "w-full rounded-card border border-border bg-surface px-5 text-center shadow-card sm:pt-[92px] " +
          // Burmese needs more interior breathing room top and bottom.
          (isMy ? "pb-6 pt-[82px]" : "pb-5 pt-[78px]")
        }
      >
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-body">
          {t(UI.result_top_strength)}
        </p>
        <h2
          className={
            "font-display text-2xl font-bold leading-tight sm:text-[28px] " +
            (isMy ? "mt-2.5" : "mt-1.5")
          }
          style={{ color: intel.color }}
        >
          {t(intel.label)}
        </h2>
        <div
          className={
            "inline-flex items-baseline gap-1 rounded-full bg-surface-soft px-3 py-1 font-display text-base font-bold text-ink " +
            (isMy ? "mt-3" : "mt-2")
          }
        >
          {score.toFixed(1)}
          <span className="font-body text-xs font-semibold text-body">
            / 5.0
          </span>
        </div>
        <p
          className={
            "font-body text-sm text-body " +
            // Looser line-height + a bigger gap for the dense Burmese block.
            (isMy ? "mt-4 leading-loose" : "mt-3 leading-relaxed")
          }
        >
          {t(intel.description)}
        </p>
        <div
          className={
            "flex items-center justify-center gap-2 rounded-full bg-surface-soft px-3 " +
            (isMy ? "mt-5 py-2.5" : "mt-4 py-2")
          }
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
          <span
            className={
              "font-body text-xs font-semibold text-brand " +
              (isMy ? "leading-relaxed" : "")
            }
          >
            {t(UI.result_keep_growing)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- Wheel legend (used for long Myanmar labels on mobile) ----------

function WheelLegend({ scores }: { scores: Scores }) {
  const { t } = useLanguage();
  return (
    <div className="mt-5 grid w-full max-w-[340px] grid-cols-2 gap-x-4 gap-y-2.5">
      {INTELLIGENCE_ORDER.map((key) => {
        const intel = INTELLIGENCES[key];
        const Icon = intel.icon;
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: hexWithAlpha(intel.color, 0.16) }}
              aria-hidden
            >
              <Icon className="h-3.5 w-3.5" style={{ color: intel.color }} />
            </span>
            <span className="min-w-0 flex-1 font-body text-[11px] font-semibold leading-snug text-ink">
              {t(intel.label)}
            </span>
            <span
              className="shrink-0 font-display text-xs font-bold"
              style={{ color: intel.color }}
            >
              {scores[key].toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Primary button ----------

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-body font-bold text-white shadow-card transition-colors hover:bg-primary-hover"
    >
      <span>{children}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </button>
  );
}

// ---------- Atmosphere: confetti + corner plants ----------

// Hand-picked positions — feels scattered but stays out of the wheel labels,
// score pills, and the top-strength card. All purely decorative.
type Confetti =
  | { kind: "dot"; x: string; y: string; size: number; color: string; opacity: number }
  | { kind: "sparkle"; x: string; y: string; size: number; color: string; opacity: number; rotate?: number }
  | { kind: "star"; x: string; y: string; size: number; color: string; opacity: number; rotate?: number };

const CONFETTI: Confetti[] = [
  // Top band
  { kind: "sparkle", x: "12%",  y: "11%", size: 16, color: "#F4B740", opacity: 0.55 },
  { kind: "star",    x: "22%",  y: "20%", size: 11, color: "#9B7EDE", opacity: 0.55 },
  { kind: "dot",     x: "30%",  y: "12%", size: 6,  color: "#3BA6A0", opacity: 0.45 },
  { kind: "dot",     x: "65%",  y: "11%", size: 7,  color: "#EF6F61", opacity: 0.40 },
  { kind: "sparkle", x: "75%",  y: "18%", size: 14, color: "#5B8DEF", opacity: 0.50 },
  { kind: "star",    x: "88%",  y: "13%", size: 10, color: "#F0915A", opacity: 0.55, rotate: 15 },
  { kind: "dot",     x: "92%",  y: "23%", size: 5,  color: "#6CC07A", opacity: 0.45 },

  // Middle / sides
  { kind: "sparkle", x: "4%",   y: "44%", size: 14, color: "#7FB069", opacity: 0.45 },
  { kind: "dot",     x: "6%",   y: "62%", size: 5,  color: "#9B7EDE", opacity: 0.40 },
  { kind: "star",    x: "96%",  y: "45%", size: 12, color: "#F4B740", opacity: 0.50 },
  { kind: "sparkle", x: "97%",  y: "62%", size: 13, color: "#3BA6A0", opacity: 0.45, rotate: 10 },

  // Bottom band (above the corner-plant placeholders, not overlapping buttons)
  { kind: "dot",     x: "18%",  y: "82%", size: 6,  color: "#EF6F61", opacity: 0.40 },
  { kind: "star",    x: "30%",  y: "88%", size: 10, color: "#5B8DEF", opacity: 0.45 },
  { kind: "sparkle", x: "70%",  y: "88%", size: 13, color: "#F0915A", opacity: 0.50 },
  { kind: "dot",     x: "82%",  y: "82%", size: 5,  color: "#7FB069", opacity: 0.45 },
];

function ConfettiBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {CONFETTI.map((c, i) => {
        const common = {
          position: "absolute" as const,
          left: c.x,
          top: c.y,
          transform:
            "translate(-50%, -50%)" +
            ("rotate" in c && c.rotate ? ` rotate(${c.rotate}deg)` : ""),
          opacity: c.opacity,
          color: c.color,
        };
        if (c.kind === "dot") {
          return (
            <span
              key={i}
              style={{
                ...common,
                width: c.size,
                height: c.size,
                borderRadius: "9999px",
                backgroundColor: c.color,
              }}
            />
          );
        }
        if (c.kind === "sparkle") {
          return (
            <Sparkles
              key={i}
              size={c.size}
              style={common}
              strokeWidth={1.8}
            />
          );
        }
        return (
          <Star
            key={i}
            size={c.size}
            style={common}
            fill={c.color}
            strokeWidth={0}
          />
        );
      })}
    </div>
  );
}

function CornerArt() {
  return (
    <>
      <div className="pointer-events-none absolute bottom-3 left-3 z-0 hidden md:block">
        <Illustration
          src="corner-plant-left.png"
          alt=""
          width={360}
          height={360}
          real
        />
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 z-0 hidden md:block">
        <Illustration
          src="corner-plant-right.png"
          alt=""
          width={360}
          height={360}
          real
        />
      </div>
    </>
  );
}

function RedirectingState() {
  const { t } = useLanguage();
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 text-body">
        <Loader2 className="h-7 w-7 animate-spin text-brand" aria-hidden />
        <p className="font-body text-sm">{t(UI.result_redirecting)}</p>
      </div>
    </main>
  );
}

// ---------- Printable A4 report (off-screen, captured by html2canvas-pro) ----------

const REPORT_W = 794;     // ≈ A4 width at 96 dpi (210 mm)
const REPORT_PAD = 40;

function PrintableReport({
  refEl,
  student,
  result,
  topKey,
  topScore,
}: {
  refEl: React.RefObject<HTMLDivElement | null>;
  student: StudentInfo | null;
  result: { studentId: string; topIntelligence: string; scores: Scores };
  topKey: IntelligenceKey;
  topScore: number;
}) {
  const { t } = useLanguage();
  const topIntel = INTELLIGENCES[topKey];
  const charSrc = `/illustrations/characters/${topKey.replace(
    /_smart$/,
    "",
  )}.png`;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: -20000,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <div
        ref={refEl}
        style={{
          width: REPORT_W,
          background: "#FAF6EE",
          padding: REPORT_PAD,
          boxSizing: "border-box",
          color: "#1E293B",
          fontFamily:
            "var(--font-body), 'Nunito', system-ui, sans-serif",
          lineHeight: 1.35,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: 16,
            borderBottom: "1px solid #E7E0D2",
          }}
        >
          <Sprout color="#2A6F6B" size={30} strokeWidth={2.25} />
          <span
            style={{
              marginLeft: 8,
              fontFamily:
                "var(--font-display), 'Baloo 2', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#2A6F6B",
            }}
          >
            Sproutful
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: 1.2,
            }}
          >
            {t(UI.pdf_report_title)}
          </span>
        </div>

        {/* Student info */}
        <div style={{ marginTop: 18 }}>
          <ReportEyebrow>{t(UI.pdf_section_student)}</ReportEyebrow>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.6fr 0.9fr 0.9fr",
              gap: 16,
              marginTop: 8,
            }}
          >
            <ReportField label={t(UI.pdf_name)} value={student?.name ?? "—"} />
            <ReportField
              label={t(UI.pdf_student_id)}
              value={result.studentId}
              mono
            />
            <ReportField label={t(UI.pdf_year)} value={student?.year ?? "—"} />
            <ReportField label={t(UI.pdf_class)} value={student?.class ?? "—"} />
          </div>
        </div>

        {/* Top strength + wheel */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {/* Top strength card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E0D2",
              borderRadius: 18,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={charSrc}
              alt=""
              crossOrigin="anonymous"
              style={{
                height: 140,
                width: "auto",
                objectFit: "contain",
              }}
            />
            <ReportEyebrow style={{ marginTop: 8 }}>
              {t(UI.pdf_top_strength)}
            </ReportEyebrow>
            <div
              style={{
                marginTop: 2,
                fontFamily:
                  "var(--font-display), 'Baloo 2', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                lineHeight: 1.1,
                color: topIntel.color,
              }}
            >
              {t(topIntel.label)}
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily:
                  "var(--font-display), 'Baloo 2', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#1E293B",
              }}
            >
              {topScore.toFixed(1)}{" "}
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>
                / 5.0
              </span>
            </div>
            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: 12,
                color: "#475569",
              }}
            >
              {t(topIntel.description)}
            </p>
          </div>

          {/* Wheel — re-use the on-screen component, sized for print. */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E0D2",
              borderRadius: 18,
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 320 }}>
              <StrengthWheel scores={result.scores} compact />
            </div>
          </div>
        </div>

        {/* All 8 scores */}
        <div style={{ marginTop: 20 }}>
          <ReportEyebrow>{t(UI.pdf_all_intelligences)}</ReportEyebrow>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 18px",
            }}
          >
            {INTELLIGENCE_ORDER.map((k) => {
              const intel = INTELLIGENCES[k];
              const Icon = intel.icon;
              return (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    background: "#FFFFFF",
                    border: "1px solid #E7E0D2",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 26,
                      width: 26,
                      borderRadius: 999,
                      background: hexWithAlpha(intel.color, 0.18),
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={14} color={intel.color} />
                  </div>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1E293B",
                    }}
                  >
                    {t(intel.label)}
                  </span>
                  <span
                    style={{
                      fontFamily:
                        "var(--font-display), 'Baloo 2', system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: intel.color,
                    }}
                  >
                    {result.scores[k].toFixed(1)}
                    <span
                      style={{
                        marginLeft: 2,
                        fontSize: 10,
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      / 5.0
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 12,
            borderTop: "1px solid #E7E0D2",
            textAlign: "center",
            fontSize: 11,
            color: "#475569",
          }}
        >
          {t(UI.pdf_footer)}
        </div>
      </div>
    </div>
  );
}

function ReportEyebrow({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 10,
        fontWeight: 700,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: 1.2,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function ReportField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 14,
          fontWeight: 700,
          color: "#1E293B",
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            : "var(--font-body), 'Nunito', system-ui, sans-serif",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ---------- Utils ----------

function findTopKey(scores: Scores): IntelligenceKey {
  let bestKey: IntelligenceKey = INTELLIGENCE_ORDER[0];
  let best = -Infinity;
  for (const k of INTELLIGENCE_ORDER) {
    if (scores[k] > best) {
      best = scores[k];
      bestKey = k;
    }
  }
  return bestKey;
}

function hexWithAlpha(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
