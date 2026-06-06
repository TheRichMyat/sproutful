// Wraps every /s/[code]/* screen with the student-flow context so the start
// form's answers (and the code itself) survive the hops to /quiz and /result.

import { StudentFlowProvider } from "@/context/student-flow";

export default async function StudentFlowLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <StudentFlowProvider code={code}>{children}</StudentFlowProvider>;
}
