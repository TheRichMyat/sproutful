// Backend client — DESIGN.md §10.
//
// One Google Apps Script Web App serves every school. It reads the operator's
// Registry (§1.5) to resolve a `code` to that school's data Sheet.
//
// CORS note (§10): Apps Script can't send custom CORS headers, so we POST with
// `Content-Type: text/plain;charset=utf-8` and JSON as a string body. Do NOT
// switch this to `application/json` — that triggers a failing preflight.

import type { Scores } from "./scoring";
import type { IntelligenceKey } from "./questions";

export type StudentInfo = {
  name: string;
  year: string;
  class: string;
};

export type ResolveResponse =
  | { ok: true; school_name: string }
  | { ok: false };

export type SubmitResponse =
  | { ok: true; student_id: string; top_intelligence: string }
  | { ok: false };

export type ResultRow = {
  student_id: string;
  name: string;
  year: string;
  class: string;
  top_intelligence: string;
} & Record<IntelligenceKey, number>;

export type ResultsResponse =
  | { ok: true; school_name: string; results: ResultRow[] }
  | { ok: false };

type Payload =
  | { action: "resolve"; student_code: string }
  | {
      action: "submit";
      student_code: string;
      student: StudentInfo;
      scores: Scores;
    }
  | { action: "results"; dashboard_code: string };

/**
 * POST a JSON payload to the backend. Throws if the env var is missing or the
 * network call fails; otherwise returns the parsed JSON response.
 */
export async function callBackend<T>(payload: Payload): Promise<T> {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_URL is not set. Add it to .env.local — see DESIGN.md §10.",
    );
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as T;
}

// Convenience wrappers ---------------------------------------------------------

export function resolveStudentCode(student_code: string) {
  return callBackend<ResolveResponse>({ action: "resolve", student_code });
}

export function submitQuiz(
  student_code: string,
  student: StudentInfo,
  scores: Scores,
) {
  return callBackend<SubmitResponse>({
    action: "submit",
    student_code,
    student,
    scores,
  });
}

export function fetchResults(dashboard_code: string) {
  return callBackend<ResultsResponse>({ action: "results", dashboard_code });
}
