"use client";

// School dashboard — DESIGN.md §6.4.
//
// On mount we POST `results` with the route's dashboard_code. While the call
// is in flight we show a soft loading state. If the response is { ok:false }
// or the call errors we render a friendly "Link not found" page (mirroring
// the student start). On success we render the top nav + centered content
// (heading, search, table, pagination, footer banner).
//
// All filtering and pagination happens client-side over the returned rows
// (§6.4). Search is case-insensitive on student name + ID. Export Report
// downloads the *filtered* set as a CSV.

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Download,
  Loader2,
  Search,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { fetchResults, type ResultRow } from "@/lib/api";
import {
  INTELLIGENCES,
  INTELLIGENCE_ORDER,
} from "@/lib/intelligences";
import type { IntelligenceKey } from "@/lib/questions";

const PAGE_SIZE = 10;

type ViewState =
  | { kind: "loading" }
  | { kind: "ok"; schoolName: string; results: ResultRow[] }
  | { kind: "not-found" };

export function Dashboard({ code }: { code: string }) {
  const [state, setState] = useState<ViewState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchResults(code);
        if (cancelled) return;
        if (res.ok) {
          setState({
            kind: "ok",
            schoolName: res.school_name,
            results: res.results,
          });
        } else {
          setState({ kind: "not-found" });
        }
      } catch {
        if (!cancelled) setState({ kind: "not-found" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (state.kind === "loading") return <DashboardLoading />;
  if (state.kind === "not-found") return <LinkNotFound />;

  return (
    <DashboardShell
      schoolName={state.schoolName}
      results={state.results}
    />
  );
}

// ---------- Shell with sidebar + main ----------

function DashboardShell({
  schoolName,
  results,
}: {
  schoolName: string;
  results: ResultRow[];
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Reset to first page whenever the query changes.
  useEffect(() => {
    setPage(1);
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return results;
    return results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.student_id.toLowerCase().includes(q),
    );
  }, [query, results]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const pageRows = filtered.slice(start, end);

  const handleExport = useCallback(() => {
    const csv = toCSV(filtered);
    const stamp = new Date().toISOString().slice(0, 10);
    const safeName = schoolName.replace(/[^\w-]+/g, "-");
    downloadCSV(csv, `${safeName}-student-results-${stamp}.csv`);
  }, [filtered, schoolName]);

  return (
    // h-screen + overflow-hidden lock the outer box to exactly the viewport
    // so the table can scroll internally and the nav / pagination / footer
    // stay put.
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <TopNav schoolName={schoolName} />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* min-h-0 lets flex-1 actually claim a bounded height instead of
            growing to fit content (browser default is min-height: auto on
            flex items). The inner div centers everything in a comfortable
            max width so it doesn't sprawl on big monitors. */}
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 px-6 pb-4 pt-4">
          <TitleSection schoolName={schoolName} />

          <Toolbar
            query={query}
            onQuery={setQuery}
            onExport={handleExport}
            canExport={filtered.length > 0}
          />

          {results.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-auto rounded-card border border-border bg-surface shadow-card">
                {pageRows.length > 0 ? (
                  <ResultsTable rows={pageRows} />
                ) : (
                  <div className="flex h-full min-h-[160px] items-center justify-center px-6 py-10 text-center font-body text-sm text-body">
                    No students match &ldquo;{query}&rdquo;.
                  </div>
                )}
              </div>

              <PaginationRow
                start={total === 0 ? 0 : start + 1}
                end={end}
                total={total}
                page={safePage}
                totalPages={totalPages}
                onPage={setPage}
              />

              <FooterBanner />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ---------- Top nav ----------

function TopNav({ schoolName }: { schoolName: string }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
        <Logo />
        <SchoolChip schoolName={schoolName} />
      </div>
    </header>
  );
}

// ---------- Title section (sits below the nav) ----------

function TitleSection({ schoolName }: { schoolName: string }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">
        Student Results
      </h1>
      <p className="mt-0.5 font-body text-sm text-body">
        {`${schoolName} — View and analyse your students' multiple intelligences results.`}
      </p>
    </div>
  );
}

function SchoolChip({ schoolName }: { schoolName: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 shadow-sm">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white"
        aria-hidden
      >
        <User className="h-3.5 w-3.5" />
      </div>
      <div className="pr-2 leading-tight">
        <div className="font-display text-xs font-bold text-ink">
          {schoolName}
        </div>
        <div className="font-body text-[10px] font-semibold uppercase tracking-wider text-body">
          School
        </div>
      </div>
    </div>
  );
}

// ---------- Toolbar (search + export) ----------

function Toolbar({
  query,
  onQuery,
  onExport,
  canExport,
}: {
  query: string;
  onQuery: (q: string) => void;
  onExport: () => void;
  canExport: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onQuery(e.target.value)
          }
          placeholder="Search by student name or ID"
          className="w-full rounded-input border border-border bg-surface py-2.5 pl-9 pr-3 font-body text-sm text-ink placeholder:text-body/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
      <button
        type="button"
        onClick={onExport}
        disabled={!canExport}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 font-body text-sm font-bold text-white shadow-card transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" aria-hidden />
        Export Report
      </button>
    </div>
  );
}

// ---------- Results table ----------

// Column widths (px). Sum = 1156. The page content is centered in a
// max-w-7xl (1280px) container with px-6 padding on each side, giving
// 1232px of usable table-card width — so this leaves ~76px of breathing
// room. Below the table's natural width the outer `overflow-x-auto` kicks
// in and the Student column is sticky so the name/ID stays visible while
// scrolling.
const COL_W = {
  student: 220,
  year: 72,
  class: 72,
  score: 76, // × 8
  top: 180,
} as const;

function ResultsTable({ rows }: { rows: ResultRow[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <colgroup>
          <col style={{ width: COL_W.student }} />
          <col style={{ width: COL_W.year }} />
          <col style={{ width: COL_W.class }} />
          {INTELLIGENCE_ORDER.map((k) => (
            <col key={k} style={{ width: COL_W.score }} />
          ))}
          <col style={{ width: COL_W.top }} />
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-surface-soft/60 text-left">
            <Th sticky>Student</Th>
            <ThCenter>Year</ThCenter>
            <ThCenter>Class</ThCenter>
            {INTELLIGENCE_ORDER.map((key) => {
              const intel = INTELLIGENCES[key];
              const Icon = intel.icon;
              const short = intel.label.replace(/\s*Smart$/i, "");
              return (
                <th
                  key={key}
                  className="px-1 py-2 text-center align-bottom"
                  title={intel.label}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: intel.color }}
                      aria-hidden
                    />
                    <span className="font-body text-[10px] font-semibold uppercase leading-tight tracking-wide text-body">
                      {short}
                    </span>
                  </div>
                </th>
              );
            })}
            <ThCenter>Top Strength</ThCenter>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ResultRowView key={row.student_id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  sticky,
}: {
  children: React.ReactNode;
  sticky?: boolean;
}) {
  return (
    <th
      className={
        "px-3 py-2.5 align-middle text-left font-body text-[11px] font-semibold uppercase tracking-wider text-body" +
        (sticky ? " sticky left-0 z-20 bg-surface-soft/95" : "")
      }
    >
      {children}
    </th>
  );
}
function ThCenter({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-2 py-2.5 align-middle text-center font-body text-[11px] font-semibold uppercase tracking-wider text-body">
      {children}
    </th>
  );
}

function ResultRowView({ row }: { row: ResultRow }) {
  const topKey = topKeyOf(row);
  const topIntel = INTELLIGENCES[topKey];
  const TopIcon = topIntel.icon;
  return (
    <tr className="border-b border-border last:border-0">
      {/* Sticky-left so the name/ID stays visible when horizontal scroll
          kicks in on narrow viewports. */}
      <td className="sticky left-0 z-10 bg-surface px-3 py-2">
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} color={topIntel.color} />
          <div className="leading-tight">
            <div className="font-body text-sm font-semibold text-ink">
              {row.name}
            </div>
            <div className="font-mono text-[10px] text-body">
              {row.student_id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-2 py-2 text-center font-body text-sm text-body">
        {row.year}
      </td>
      <td className="px-2 py-2 text-center font-body text-sm text-body">
        {row.class}
      </td>
      {INTELLIGENCE_ORDER.map((key) => (
        <td key={key} className="px-1 py-2 text-center">
          <ScoreChip
            value={row[key]}
            color={INTELLIGENCES[key].color}
            isTop={key === topKey}
          />
        </td>
      ))}
      <td className="px-2 py-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: hexWithAlpha(topIntel.color, 0.18) }}
            aria-hidden
          >
            <TopIcon
              className="h-3.5 w-3.5"
              style={{ color: topIntel.color }}
            />
          </div>
          <div className="min-w-0 leading-tight">
            <div
              className="truncate font-display text-xs font-bold"
              style={{ color: topIntel.color }}
              title={topIntel.label}
            >
              {topIntel.label}
            </div>
            <div className="font-body text-[11px] font-semibold text-body">
              {row[topKey].toFixed(1)}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function ScoreChip({
  value,
  color,
  isTop,
}: {
  value: number;
  color: string;
  isTop: boolean;
}) {
  return (
    <span
      className="relative inline-flex h-6 w-11 items-center justify-center rounded-full font-display text-[11px] font-bold"
      style={{ backgroundColor: hexWithAlpha(color, 0.16), color }}
      title={isTop ? "Top strength" : undefined}
    >
      {value.toFixed(1)}
      {isTop ? (
        <Star
          className="absolute -right-1 -top-1 h-2.5 w-2.5"
          style={{ color }}
          fill="currentColor"
          strokeWidth={0}
          aria-label="Top strength"
        />
      ) : null}
    </span>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold text-white shadow-sm"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}

// ---------- Pagination row ----------

function PaginationRow({
  start,
  end,
  total,
  page,
  totalPages,
  onPage,
}: {
  start: number;
  end: number;
  total: number;
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between font-body text-xs text-body">
      <span>
        Showing <span className="font-semibold text-ink">{start}</span> to{" "}
        <span className="font-semibold text-ink">{end}</span> of{" "}
        <span className="font-semibold text-ink">{total}</span>{" "}
        {total === 1 ? "student" : "students"}
      </span>
      <div className="flex items-center gap-1">
        <PagerButton
          ariaLabel="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </PagerButton>
        <span className="px-2 font-semibold text-ink">
          {page} / {totalPages}
        </span>
        <PagerButton
          ariaLabel="Next page"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </PagerButton>
      </div>
    </div>
  );
}

function PagerButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-body transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

// ---------- Footer banner ----------

function FooterBanner() {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 shadow-sm">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft"
        aria-hidden
      >
        <Sparkles className="h-4 w-4 text-brand" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-bold text-ink">
          Every child has a unique blend of strengths.
        </div>
        <div className="font-body text-xs text-body">
          Use these insights to guide and support their learning journey.
        </div>
      </div>
    </div>
  );
}

// ---------- Transient states ----------

function DashboardLoading() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 text-body">
        <Loader2 className="h-7 w-7 animate-spin text-brand" aria-hidden />
        <p className="font-body text-sm">Loading student results…</p>
      </div>
    </main>
  );
}

function LinkNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-md rounded-card bg-surface p-10 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft">
          <Compass className="h-6 w-6 text-brand" aria-hidden />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Link not found
        </h1>
        <p className="mt-2 font-body text-body">
          This dashboard link doesn&apos;t look right. Please check the URL or
          ask the Sproutful operator for the correct link.
        </p>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-card border border-dashed border-border bg-surface p-10 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft">
          <Users className="h-6 w-6 text-brand" aria-hidden />
        </div>
        <h2 className="font-display text-lg font-bold text-ink">
          No students have taken the assessment yet
        </h2>
        <p className="mt-1 font-body text-sm text-body">
          Share your school&apos;s student link with your students to start
          collecting results. They&apos;ll appear here as soon as they finish.
        </p>
      </div>
    </div>
  );
}

// ---------- Utils ----------

function topKeyOf(row: ResultRow): IntelligenceKey {
  let best: IntelligenceKey = INTELLIGENCE_ORDER[0];
  let bestScore = -Infinity;
  for (const k of INTELLIGENCE_ORDER) {
    if (row[k] > bestScore) {
      bestScore = row[k];
      best = k;
    }
  }
  return best;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
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

// CSV ------------------------------------------------------------------------

function toCSV(rows: ResultRow[]): string {
  const header = [
    "student_id",
    "name",
    "year",
    "class",
    ...INTELLIGENCE_ORDER,
    "top_intelligence",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    const cells: (string | number)[] = [
      r.student_id,
      r.name,
      r.year,
      r.class,
      ...INTELLIGENCE_ORDER.map((k) => r[k].toFixed(1)),
      r.top_intelligence,
    ];
    lines.push(cells.map(csvEscape).join(","));
  }
  return lines.join("\n");
}

function csvEscape(v: string | number): string {
  const s = String(v);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function downloadCSV(text: string, filename: string) {
  // BOM so Excel opens UTF-8 correctly.
  const blob = new Blob(["﻿" + text], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
