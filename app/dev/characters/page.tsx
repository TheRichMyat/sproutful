// Throwaway dev page — eyeball all 8 character PNGs at once.
// Not linked from anywhere; safe to delete when no longer useful.

import { INTELLIGENCES, INTELLIGENCE_ORDER } from "@/lib/intelligences";

export const metadata = { title: "Characters · dev" };

export default function CharactersPreviewPage() {
  return (
    <main className="flex flex-1 flex-col bg-bg px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-display text-2xl font-bold text-ink">
          Character illustrations
        </h1>
        <p className="mt-1 font-body text-sm text-body">
          All 8 character PNGs from{" "}
          <code className="font-mono text-xs">/illustrations/characters/</code>.
          Dev preview only.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {INTELLIGENCE_ORDER.map((key) => {
            const intel = INTELLIGENCES[key];
            const slug = key.replace(/_smart$/, "");
            const src = `/illustrations/characters/${slug}.png`;
            return (
              <div
                key={key}
                className="flex flex-col items-center rounded-card border border-border bg-surface p-4 shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={intel.label.en}
                  className="h-44 w-auto object-contain"
                />
                <div className="mt-3 text-center">
                  <div
                    className="font-display text-base font-bold"
                    style={{ color: intel.color }}
                  >
                    {intel.label.en}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-body">
                    {src}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
