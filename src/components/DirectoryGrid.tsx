"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Phone, Globe, MapPin } from "lucide-react";
import { Reveal } from "./primitives";
import { BUSINESS_CATEGORIES } from "@/lib/utils";

export type Biz = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  isMember: boolean | null;
  isFeatured: boolean | null;
};

export default function DirectoryGrid({ businesses }: { businesses: Biz[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [membersOnly, setMembersOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses
      .filter((b) => {
        if (category !== "all" && b.category !== category) return false;
        if (membersOnly && !b.isMember) return false;
        if (!q) return true;
        return (
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          (b.city ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false));
  }, [businesses, query, category, membersOnly]);

  return (
    <div>
      <div className="rounded-xl border border-sand bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search businesses</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-warm"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, service, or town…"
              className="w-full rounded-lg border border-sand bg-cream py-2.5 pl-10 pr-3 text-[15px] placeholder:text-stone-warm/70 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              aria-label="Search businesses"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-sand bg-cream px-3 py-2.5 text-[15px]"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-sand bg-cream px-4 py-2.5 text-sm font-semibold">
            <input
              type="checkbox"
              checked={membersOnly}
              onChange={(e) => setMembersOnly(e.target.checked)}
              className="h-4 w-4 accent-[#1b4332]"
            />
            CEA members only
          </label>
        </div>
      </div>

      <p className="mt-4 text-sm text-stone-warm" role="status" aria-live="polite">
        Showing {filtered.length} of {businesses.length} businesses
        {(query || category !== "all" || membersOnly) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setMembersOnly(false);
            }}
            className="ml-3 font-semibold text-forest-700 underline underline-offset-2"
          >
            Clear search
          </button>
        )}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b, i) => (
          <Reveal key={b.id} delay={(i % 3) * 70}>
            <article
              className={`lift flex h-full flex-col rounded-xl border bg-white p-5 ${
                b.isFeatured ? "border-saddle-500/50 ring-1 ring-saddle-500/30" : "border-sand"
              }`}
            >
              <p className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-saddle-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-saddle-800">
                  {b.category}
                </span>
                {b.isFeatured && (
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    ★ Featured
                  </span>
                )}
              </p>
              <h2 className="display-serif mt-3 text-xl font-semibold leading-snug">
                <Link href={`/directory/${b.slug}`} className="hover:text-forest-800 hover:underline">
                  {b.name}
                </Link>
              </h2>
              {b.isMember && (
                <p className="mt-1.5 flex items-center gap-1 text-[13px] font-semibold text-forest-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> CEA Member Business
                </p>
              )}
              <p className="mt-2 line-clamp-3 flex-1 text-[15px] leading-relaxed text-stone-warm">
                {b.description}
              </p>
              <div className="mt-4 space-y-1.5 border-t border-sand pt-3 text-sm">
                {b.phone && (
                  <p className="flex items-center gap-2 font-semibold text-charcoal">
                    <Phone className="h-4 w-4 text-stone-warm" aria-hidden="true" />
                    <a href={`tel:${b.phone}`} className="hover:underline">
                      {b.phone}
                    </a>
                  </p>
                )}
                {(b.address || b.city) && (
                  <p className="flex items-center gap-2 text-stone-warm">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {[b.address, b.city].filter(Boolean).join(" · ")}
                  </p>
                )}
                {b.website && (
                  <p className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-stone-warm" aria-hidden="true" />
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-forest-700 hover:underline"
                    >
                      Visit website
                    </a>
                  </p>
                )}
              </div>
              <Link
                href={`/directory/${b.slug}`}
                className="mt-3 text-sm font-bold text-forest-700 hover:underline"
                aria-label={`View details for ${b.name}`}
              >
                View details →
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-sand bg-parchment/60 p-10 text-center">
          <p className="display-serif text-xl font-semibold">No matches found</p>
          <p className="mt-1 text-[15px] text-stone-warm">
            Try a different search — or{" "}
            <Link href="/directory/submit" className="font-bold text-forest-700 underline">
              suggest a business
            </Link>{" "}
            we should invite.
          </p>
        </div>
      )}
    </div>
  );
}
