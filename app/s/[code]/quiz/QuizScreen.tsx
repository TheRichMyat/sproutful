"use client";

// Quiz screen — DESIGN.md §6.2.
//
// Shows one of the 56 statements at a time with a 1–5 scale. All answers are
// held in component state; nothing is sent to the backend until the student
// finishes question 56. At that point we compute the 8 scores locally, POST
// `submit`, save the returned student_id + top_intelligence to context, and
// navigate to /s/[code]/result.
//
// If the student lands here without filling the start form (empty context —
// e.g. they opened /quiz directly or refreshed), we redirect back to
// /s/[code].

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Illustration } from "@/components/Illustration";
import { useStudentFlow } from "@/context/student-flow";
import { QUESTIONS, type IntelligenceKey } from "@/lib/questions";
import { INTELLIGENCES, type Intelligence } from "@/lib/intelligences";
import { computeScores } from "@/lib/scoring";
import { submitQuiz } from "@/lib/api";

const TOTAL = QUESTIONS.length;

export function QuizScreen() {
  const { code, student, setResult } = useStudentFlow();
  const router = useRouter();

  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(TOTAL).fill(null),
  );
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Empty context (someone opened /quiz directly) → bounce to start.
  useEffect(() => {
    if (!student) router.replace(`/s/${code}`);
  }, [student, code, router]);

  const question = QUESTIONS[index];
  const intel: Intelligence = INTELLIGENCES[question.key as IntelligenceKey];
  const selected = answers[index];
  const isLast = index === TOTAL - 1;
  const canAdvance = selected !== null && !submitting;

  const pick = useCallback(
    (v: number) => {
      setAnswers((prev) => {
        const next = prev.slice();
        next[index] = v;
        return next;
      });
    },
    [index],
  );

  const goBack = useCallback(() => {
    if (index === 0 || submitting) return;
    setDirection(-1);
    setIndex((i) => i - 1);
  }, [index, submitting]);

  const advance = useCallback(async () => {
    if (!canAdvance || !student) return;
    if (!isLast) {
      setDirection(1);
      setIndex((i) => i + 1);
      return;
    }
    // Final question — score and submit.
    setSubmitting(true);
    setError(null);
    try {
      const scores = computeScores(answers as readonly number[]);
      const res = await submitQuiz(code, student, scores);
      if (res.ok) {
        setResult({
          studentId: res.student_id,
          topIntelligence: res.top_intelligence,
          scores,
        });
        router.push(`/s/${code}/result`);
        return; // leave submitting=true so the button stays disabled during nav
      }
      setError("We couldn't save your answers. Please try again.");
    } catch {
      setError(
        "We couldn't save your answers. Check your connection and try again.",
      );
    }
    setSubmitting(false);
  }, [answers, canAdvance, code, isLast, router, setResult, student]);

  if (!student) return <RedirectingState />;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <CornerArt />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 sm:px-10">
        <Header n={index + 1} total={TOTAL} />

        <main className="flex flex-1 items-center justify-center pb-6">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction === 1 ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 1 ? -24 : 24 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <QuestionCard
                  intel={intel}
                  text={question.text}
                  selected={selected}
                  onPick={pick}
                  disabled={submitting}
                />
              </motion.div>
            </AnimatePresence>

            <div className="relative mt-5 flex items-center justify-center">
              <div className="absolute left-0">
                <BackButton
                  onClick={goBack}
                  disabled={index === 0 || submitting}
                />
              </div>
              <NextButton
                onClick={advance}
                disabled={!canAdvance}
                isLast={isLast}
                submitting={submitting}
              />
            </div>

            {error ? (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mt-4 text-center font-body text-sm text-primary"
              >
                {error}
              </motion.p>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------- Header (logo + centered progress) ----------

function Header({ n, total }: { n: number; total: number }) {
  const pct = (n / total) * 100;
  return (
    <header className="flex flex-col gap-3 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 md:py-5">
      <div className="md:justify-self-start">
        <Logo />
      </div>
      <div className="w-full md:w-[min(28rem,80vw)] md:justify-self-center">
        <div className="text-center font-body text-sm font-semibold text-body">
          Question {n} of {total}
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
      <div className="hidden md:block md:justify-self-end" />
    </header>
  );
}

// ---------- Question card ----------

function QuestionCard({
  intel,
  text,
  selected,
  onPick,
  disabled,
}: {
  intel: Intelligence;
  text: string;
  selected: number | null;
  onPick: (v: number) => void;
  disabled: boolean;
}) {
  const Icon = intel.icon;
  return (
    <div className="rounded-card bg-surface px-6 py-8 shadow-card sm:px-10 sm:py-10">
      <div className="flex flex-col items-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: hexWithAlpha(intel.color, 0.14) }}
          aria-hidden
        >
          <Icon className="h-8 w-8" style={{ color: intel.color }} />
        </div>
        <h2 className="mt-5 max-w-xl text-balance text-center font-display text-2xl font-bold leading-snug text-brand sm:text-3xl">
          {text}
        </h2>
        <ScaleButtons
          selected={selected}
          onPick={onPick}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function ScaleButtons({
  selected,
  onPick,
  disabled,
}: {
  selected: number | null;
  onPick: (v: number) => void;
  disabled: boolean;
}) {
  const values = useMemo(() => [1, 2, 3, 4, 5] as const, []);
  return (
    <div
      className="mt-7 grid grid-cols-5 items-start gap-3 sm:gap-4"
      role="radiogroup"
      aria-label="Rate from 1 (not at all) to 5 (exactly like me)"
    >
      {values.map((v) => (
        <div key={v} className="flex flex-col items-center">
          <button
            type="button"
            role="radio"
            aria-checked={selected === v}
            aria-label={`${v} of 5`}
            disabled={disabled}
            onClick={() => onPick(v)}
            className={
              "flex h-12 w-12 items-center justify-center rounded-full border-2 font-display text-lg font-bold transition-colors sm:h-16 sm:w-16 sm:text-2xl " +
              (selected === v
                ? "border-primary bg-primary text-white shadow-card"
                : "border-border bg-surface text-ink hover:border-primary/50") +
              (disabled ? " cursor-not-allowed opacity-60" : "")
            }
          >
            {v}
          </button>
          <span className="mt-2 text-center font-body text-[10px] leading-tight text-body sm:text-xs">
            {v === 1 ? "Not at all" : v === 5 ? "Exactly like me" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------- Buttons ----------

function BackButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Previous question"
      className="flex h-11 w-11 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-30"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden />
    </button>
  );
}

function NextButton({
  onClick,
  disabled,
  isLast,
  submitting,
}: {
  onClick: () => void;
  disabled: boolean;
  isLast: boolean;
  submitting: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-body font-bold text-white shadow-card transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {submitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          <span>Saving…</span>
        </>
      ) : (
        <>
          <span>{isLast ? "See My Results" : "Next"}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </>
      )}
    </button>
  );
}

// ---------- Decoration + transient states ----------

function CornerArt() {
  return (
    <>
      <div className="pointer-events-none absolute bottom-3 left-3 z-0 hidden md:block">
        <Illustration
          src="corner-plant-left.png"
          alt=""
          width={120}
          height={120}
          real
        />
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 z-0 hidden md:block">
        <Illustration
          src="corner-plant-right.png"
          alt=""
          width={120}
          height={120}
          real
        />
      </div>
    </>
  );
}

function RedirectingState() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 text-body">
        <Loader2 className="h-7 w-7 animate-spin text-brand" aria-hidden />
        <p className="font-body text-sm">Taking you back to the start…</p>
      </div>
    </main>
  );
}

// ---------- Utils ----------

/** Convert "#RRGGBB" + alpha 0..1 to an "rgba(...)" string. */
function hexWithAlpha(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
