"use client";

import dynamic from "next/dynamic";
import type { MapTrail } from "./TrailMap";

const TrailMap = dynamic(() => import("./TrailMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[480px] items-center justify-center rounded-xl border border-sand bg-parchment"
      role="status"
      aria-label="Loading trail map"
    >
      <p className="text-sm font-semibold text-stone-warm">Loading trail map…</p>
    </div>
  ),
});

export default function TrailMapLoader({ trails }: { trails: MapTrail[] }) {
  return <TrailMap trails={trails} />;
}
