"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

export type MapTrail = {
  id: string;
  slug: string;
  name: string;
  parkArea: string;
  difficulty: string;
  lengthMiles: string | number;
  stagingLat: string | number;
  stagingLng: string | number;
  status: string;
  trailerParking: boolean | null;
  horseWater: boolean | null;
  restrooms: boolean | null;
  facilities: string[] | null;
};

function FitBounds({ trails }: { trails: MapTrail[] }) {
  const map = useMap();
  useEffect(() => {
    if (trails.length === 0) return;
    const bounds = L.latLngBounds(
      trails.map((t) => [Number(t.stagingLat), Number(t.stagingLng)] as [number, number])
    );
    map.fitBounds(bounds.pad(0.25));
  }, [trails, map]);
  return null;
}

function markerIcon(status: string): L.DivIcon {
  const color =
    status === "open" ? "#1b4332" : status === "caution" ? "#b7791f" : "#6b645a";
  return L.divIcon({
    className: "cea-marker",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;background:${color};border:2.5px solid #fdfbf6;box-shadow:0 2px 8px rgba(28,26,22,.4)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fdfbf6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17c4-1 5-4 5-8V5l3-2 4 5 4 3v6"/><circle cx="9" cy="17" r="1.4" fill="#fdfbf6"/></svg></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });
}

export default function TrailMap({ trails }: { trails: MapTrail[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [facilityFilter, setFacilityFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    return trails.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (difficultyFilter !== "all" && t.difficulty !== difficultyFilter) return false;
      if (facilityFilter === "trailer" && !t.trailerParking) return false;
      if (facilityFilter === "water" && !t.horseWater) return false;
      if (facilityFilter === "restrooms" && !t.restrooms) return false;
      return true;
    });
  }, [trails, statusFilter, facilityFilter, difficultyFilter]);

  if (!mounted) {
    return (
      <div
        className="flex h-[480px] items-center justify-center rounded-xl border border-sand bg-parchment"
        role="status"
        aria-label="Loading trail map"
      >
        <p className="text-sm font-semibold text-stone-warm">Loading trail map…</p>
      </div>
    );
  }

  const center: [number, number] =
    filtered.length > 0
      ? [Number(filtered[0].stagingLat), Number(filtered[0].stagingLng)]
      : [39.75, -121.74];

  return (
    <div>
      {/* Filters — keyboard accessible fieldset */}
      <fieldset className="mb-4 rounded-xl border border-sand bg-white p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-saddle-700">
          Filter trailheads
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-charcoal">Trail status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm"
              aria-label="Filter by trail status"
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="caution">Caution</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-charcoal">Facilities</span>
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm"
              aria-label="Filter by facilities"
            >
              <option value="all">All facilities</option>
              <option value="trailer">Trailer parking</option>
              <option value="water">Horse water</option>
              <option value="restrooms">Restrooms</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-charcoal">Difficulty</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm"
              aria-label="Filter by difficulty"
            >
              <option value="all">All levels</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Difficult">Difficult</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-[13px] text-stone-warm" role="status" aria-live="polite">
          Showing {filtered.length} of {trails.length} trailheads
          {(statusFilter !== "all" || facilityFilter !== "all" || difficultyFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setFacilityFilter("all");
                setDifficultyFilter("all");
              }}
              className="ml-3 font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-900"
            >
              Clear filters
            </button>
          )}
        </p>
      </fieldset>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div
          className="overflow-hidden rounded-xl border border-sand"
          role="application"
          aria-label="Interactive map of Bidwell Park equestrian trailheads"
        >
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: 480, width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <FitBounds trails={filtered} />
            {filtered.map((t) => (
              <Marker
                key={t.id}
                position={[Number(t.stagingLat), Number(t.stagingLng)]}
                icon={markerIcon(t.status)}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-warm">
                      {t.parkArea}
                    </p>
                    <p className="text-[15px] font-bold text-charcoal">{t.name}</p>
                    <p className="mt-1 text-[13px] text-stone-warm">
                      {String(t.lengthMiles)} mi · {t.difficulty} ·{" "}
                      <span className="font-semibold capitalize">{t.status}</span>
                    </p>
                    <Link
                      href={`/trails/${t.slug}`}
                      className="mt-2 inline-block text-[13px] font-bold text-forest-700 underline underline-offset-2"
                    >
                      View trail details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Accessible list alternative to the map (WCAG: no raw map text, full list) */}
        <div className="rounded-xl border border-sand bg-white">
          <h3 className="border-b border-sand px-4 py-3 text-sm font-bold uppercase tracking-wider text-charcoal">
            Trailheads ({filtered.length})
          </h3>
          <ul className="max-h-[432px] divide-y divide-sand overflow-y-auto">
            {filtered.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/trails/${t.slug}`}
                  className="block px-4 py-3 transition-colors hover:bg-forest-50"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        t.status === "open"
                          ? "bg-forest-600"
                          : t.status === "caution"
                            ? "bg-amber-500"
                            : "bg-stone-500"
                      )}
                    />
                    <span className="text-[15px] font-bold text-charcoal">{t.name}</span>
                  </span>
                  <span className="mt-0.5 block pl-4 text-[13px] text-stone-warm">
                    {String(t.lengthMiles)} mi · {t.difficulty} · {t.parkArea}
                  </span>
                </Link>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-sm text-stone-warm">
                No trailheads match these filters. Try clearing a filter.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-stone-warm">
        <span className="font-bold uppercase tracking-wider text-charcoal">Legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-forest-800" aria-hidden="true" /> Open
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gold" aria-hidden="true" /> Caution
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-stone-500" aria-hidden="true" /> Closed
        </span>
        <span className="ml-auto hidden sm:inline">Map data © OpenStreetMap contributors</span>
      </div>
    </div>
  );
}
