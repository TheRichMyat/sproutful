"use client";

// Student start screen — DESIGN.md §6.1.
//
// On mount: call `resolve` with the route's student code to fetch the school
// name. While that's in flight we show a soft loading state. If the code is
// invalid or the call errors, we render a friendly "Link not found" page.
// Otherwise we render the hero + Name / Year / Class form. Submitting stores
// the answers in StudentFlowContext and navigates to /s/[code]/quiz.

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Compass,
  GraduationCap,
  Loader2,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { Illustration } from "@/components/Illustration";
import { useStudentFlow } from "@/context/student-flow";
import { resolveStudentCode } from "@/lib/api";
import { CLASS_OPTIONS, YEAR_OPTIONS } from "@/config/options";

type ResolveState =
  | { kind: "loading" }
  | { kind: "ok"; schoolName: string }
  | { kind: "not-found" };

export function StudentStart() {
  const { code, setStudent } = useStudentFlow();
  const router = useRouter();

  const [state, setState] = useState<ResolveState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await resolveStudentCode(code);
        if (cancelled) return;
        if (res.ok) setState({ kind: "ok", schoolName: res.school_name });
        else setState({ kind: "not-found" });
      } catch {
        if (!cancelled) setState({ kind: "not-found" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (state.kind === "loading") return <LinkLoading />;
  if (state.kind === "not-found") return <LinkNotFound />;

  return (
    <StartContent
      schoolName={state.schoolName}
      onSubmit={(student) => {
        setStudent(student);
        router.push(`/s/${code}/quiz`);
      }}
    />
  );
}

// ---------- States ----------

function LinkLoading() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 text-body">
        <Loader2 className="h-7 w-7 animate-spin text-brand" aria-hidden />
        <p className="font-body text-sm">Getting things ready…</p>
      </div>
    </main>
  );
}

function LinkNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md rounded-card bg-surface p-10 text-center shadow-card"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft">
          <Compass className="h-6 w-6 text-brand" aria-hidden />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Link not found
        </h1>
        <p className="mt-2 text-body">
          This link doesn&apos;t look right. Please ask your school for the correct
          link and try again.
        </p>
      </motion.div>
    </main>
  );
}

// ---------- Main content ----------

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

type StartContentProps = {
  schoolName: string;
  onSubmit: (s: { name: string; year: string; class: string }) => void;
};

function StartContent({ schoolName, onSubmit }: StartContentProps) {
  // The page is sized to a single desktop viewport: nav row, hero
  // (vertically centered in the remaining space), then the form card
  // pulled up so it overlaps the hero's lower edge.
  //
  // Desktop fit: to make the whole page sit comfortably in one screen at
  // 100% browser zoom, we render it at 125% size and then scale it down to
  // 0.8 — the exact effect of viewing the page at 80% browser zoom. The
  // outer wrapper is locked to the real viewport (h-screen + overflow-hidden)
  // so the scaled-down 125vw×125vh inner becomes precisely 100vw×100vh with
  // nothing clipped. Mobile is untouched (md:-scoped only) and scrolls
  // normally.
  return (
    <div className="flex min-h-screen flex-1 flex-col md:block md:h-screen md:min-h-0 md:flex-none md:overflow-hidden">
      <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden md:h-[125vh] md:w-[125vw] md:min-h-0 md:flex-none md:origin-top-left md:[transform:scale(0.8)]">
        <CornerArt />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 sm:px-10"
        >
          <Header />

          <section className="flex flex-1 items-center pb-6 pt-6 md:pb-2 md:pt-0">
            <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
              <Hero schoolName={schoolName} />
              <motion.div
                variants={itemVariants}
                className="flex justify-center md:justify-end"
              >
                <Illustration
                  src="hero.png"
                  alt="Children playing together"
                  width={560}
                  height={360}
                  className="w-full max-w-[560px]"
                  priority
                  real
                />
              </motion.div>
            </div>
          </section>

          <motion.div
            variants={itemVariants}
            className="relative z-20 -mt-10 pb-4 md:-mt-14 md:pb-3"
          >
            <StartFormCard onSubmit={onSubmit} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <motion.header
      variants={itemVariants}
      className="flex items-center justify-between py-4 md:py-3"
    >
      <Logo />
      <nav className="hidden items-center gap-7 font-body text-sm text-body sm:flex">
        <a href="#about" className="hover:text-ink">About Sproutful</a>
        <a href="#how" className="hover:text-ink">How It Works</a>
        <a href="#benefits" className="hover:text-ink">Benefits</a>
      </nav>
    </motion.header>
  );
}

function Hero({ schoolName }: { schoolName: string }) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col">
      <p className="font-body text-xs font-semibold uppercase tracking-wider text-brand">
        Welcome, {schoolName} students
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-[3.5rem]">
        <span className="block">Discover.</span>
        <span className="block">Understand.</span>
        <span className="block text-primary">Grow.</span>
      </h1>
      <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-body sm:text-base">
        Uncover your unique strengths through Multiple Intelligences and learn
        in the way that&apos;s best for you.
      </p>
    </motion.div>
  );
}

// ---------- Form ----------

function StartFormCard({ onSubmit }: { onSubmit: StartContentProps["onSubmit"] }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [klass, setKlass] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const isValid = useMemo(
    () => name.trim().length > 0 && year !== "" && klass !== "",
    [name, year, klass],
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    onSubmit({ name: name.trim(), year, class: klass });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-card bg-surface p-5 shadow-card sm:p-6 md:py-5"
    >
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_auto]">
        <Field
          label="Name"
          icon={<User className="h-4 w-4 text-brand" aria-hidden />}
          error={showErrors && name.trim() === "" ? "Enter your name" : undefined}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-input border border-border bg-surface px-4 py-3 font-body text-ink placeholder:text-body/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </Field>

        <Field
          label="Year"
          icon={<Calendar className="h-4 w-4 text-brand" aria-hidden />}
          error={showErrors && year === "" ? "Pick a year" : undefined}
        >
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full appearance-none rounded-input border border-border bg-surface px-4 py-3 font-body text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="">Select your year</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>

        <Field
          label="Class"
          icon={<GraduationCap className="h-4 w-4 text-brand" aria-hidden />}
          error={showErrors && klass === "" ? "Pick a class" : undefined}
        >
          <select
            value={klass}
            onChange={(e) => setKlass(e.target.value)}
            className="w-full appearance-none rounded-input border border-border bg-surface px-4 py-3 font-body text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="">Select your class</option>
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <PrimaryButton type="submit" disabled={!isValid && showErrors}>
          Start My Journey
        </PrimaryButton>
      </div>

      <hr className="my-5 border-t border-border md:my-4" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Callout
          icon={<Sparkles className="h-5 w-5 text-brand" aria-hidden />}
          title="Personalized Insights"
          body="Understand your unique strengths."
        />
        <Callout
          icon={<Compass className="h-5 w-5 text-brand" aria-hidden />}
          title="Learn Your Way"
          body="Find the path that fits you best."
        />
        <Callout
          icon={<TrendingUp className="h-5 w-5 text-brand" aria-hidden />}
          title="Grow With Confidence"
          body="Build on what makes you, you."
        />
      </div>
    </form>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 font-body text-sm font-semibold text-ink">
        {icon}
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block font-body text-xs text-primary">{error}</span>
      ) : null}
    </label>
  );
}

function Callout({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-soft">
        {icon}
      </div>
      <div>
        <div className="font-display text-base font-bold text-ink">{title}</div>
        <p className="font-body text-sm text-body">{body}</p>
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-body font-bold text-white shadow-card transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>{children}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </button>
  );
}

// ---------- Corner decorations ----------

function CornerArt() {
  // Absolute + behind the content (z-0 vs the main column's z-10) so the
  // plants are purely decorative and never push page height. The parent
  // sets `overflow-hidden`, so anything that sticks out is clipped.
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
