// /d/[code] — school dashboard (DESIGN.md §6.4).
// No login: the dashboard code in the URL IS the access (§11, §1.5).
// This server entry awaits params and passes `code` into the client
// component, which does the backend `results` call and renders everything.

import { Dashboard } from "./Dashboard";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <Dashboard code={code} />;
}
