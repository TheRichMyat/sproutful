// /s/[code] — student start (DESIGN.md §6.1).
// All interactivity lives in the client component; this server page just
// renders it. The route's `code` is provided via the layout's
// StudentFlowProvider (see ./layout.tsx).

import { StudentStart } from "./StudentStart";

export default function Page() {
  return <StudentStart />;
}
