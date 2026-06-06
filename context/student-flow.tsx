"use client";

// Holds the per-school code (from the URL), the student's start-form answers,
// and the quiz result so they survive the /s/[code]/* → /s/[code]/quiz →
// /s/[code]/result hops without round-tripping through the URL.
//
// Lives in React state only — DESIGN.md §2 forbids long-term localStorage
// persistence of student data. State resets when the tab closes, which is
// what we want.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Scores } from "@/lib/scoring";

export type StudentInfo = {
  name: string;
  year: string;
  class: string;
};

/** Result returned by the backend on quiz submit + the local 8 scores. */
export type QuizResult = {
  studentId: string;
  topIntelligence: string;
  scores: Scores;
};

type StudentFlowValue = {
  /** The school's student code from the /s/[code] URL segment. */
  code: string;
  student: StudentInfo | null;
  setStudent: (s: StudentInfo) => void;
  result: QuizResult | null;
  setResult: (r: QuizResult) => void;
  reset: () => void;
};

const StudentFlowContext = createContext<StudentFlowValue | null>(null);

export function StudentFlowProvider({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) {
  const [student, setStudentState] = useState<StudentInfo | null>(null);
  const [result, setResultState] = useState<QuizResult | null>(null);

  const setStudent = useCallback((s: StudentInfo) => setStudentState(s), []);
  const setResult = useCallback((r: QuizResult) => setResultState(r), []);
  const reset = useCallback(() => {
    setStudentState(null);
    setResultState(null);
  }, []);

  const value = useMemo<StudentFlowValue>(
    () => ({ code, student, setStudent, result, setResult, reset }),
    [code, student, setStudent, result, setResult, reset],
  );

  return (
    <StudentFlowContext.Provider value={value}>
      {children}
    </StudentFlowContext.Provider>
  );
}

export function useStudentFlow(): StudentFlowValue {
  const ctx = useContext(StudentFlowContext);
  if (!ctx) {
    throw new Error(
      "useStudentFlow must be used inside <StudentFlowProvider>. " +
        "Did you forget the app/s/[code]/layout.tsx wrapper?",
    );
  }
  return ctx;
}
