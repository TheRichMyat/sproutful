// /s/[code]/quiz — the 56-question flow (DESIGN.md §6.2).
// All interactivity lives in the client component below; this server page
// just renders it. The route's `code` and the student's start-form answers
// are read from StudentFlowContext (see ../layout.tsx).

import { QuizScreen } from "./QuizScreen";

export default function Page() {
  return <QuizScreen />;
}
