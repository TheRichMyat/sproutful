/*
 * The bare `/` is intentionally a tiny placeholder — Sproutful isn't a public
 * sign-up site (DESIGN.md §2). Real entry is via `/s/[code]` or `/d/[code]`.
 */
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-brand">Sproutful</h1>
        <p className="mt-2 text-body">Discover the spark within.</p>
      </div>
    </main>
  );
}
