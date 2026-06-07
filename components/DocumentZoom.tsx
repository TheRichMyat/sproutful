"use client";

// Sets a CSS zoom on the <html> element while this component is mounted, and
// restores the previous value when it unmounts. Use this on a screen that
// should look as if the browser were zoomed out at a given level — the
// effect is identical to the user pressing Ctrl+- to that zoom level.
//
// Why CSS `zoom` (rather than `transform: scale`)? When applied to <html>, it
// also adjusts how `vh` / `vw` are computed for children, so layouts that
// use `h-screen` continue to fill the visible viewport. `transform: scale`
// doesn't — it shrinks the element but leaves the original layout box behind.
//
// Renders nothing.

import { useEffect } from "react";

export function DocumentZoom({ value }: { value: number }) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.zoom;
    html.style.zoom = String(value);
    return () => {
      html.style.zoom = prev;
    };
  }, [value]);
  return null;
}

export default DocumentZoom;
