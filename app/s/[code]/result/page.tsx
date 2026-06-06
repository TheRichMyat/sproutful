// /s/[code]/result — student result (DESIGN.md §6.3).
// All interactivity lives in the client component; this server page just
// renders it. The student id, top_intelligence, and 8 scores are read from
// StudentFlowContext (see ../layout.tsx), which the quiz screen populated
// after a successful submit.

import { ResultScreen } from "./ResultScreen";

export default function Page() {
  return <ResultScreen />;
}
