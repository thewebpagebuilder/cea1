import Link from "next/link";
import { ArrowUpRight, Layers, LayoutTemplate, Map as MapIcon, Building2, Home } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";

export const metadata = {
  title: "Site Map & Information Architecture",
  description: "Every CEA page in one view, plus component specifications for key templates.",
};

const IA: { section: string; href: string; pages: { label: string; href: string; note: string }[] }[] = [
  {
    section: "Home",
    href: "/",
    pages: [{ label: "Homepage", href: "/", note: "Hero, conditions, trails, events, directory, news" }],
  },
  {
    section: "Trails",
    href: "/trails",
    pages: [
      { label: "Interactive Trail Guide", href: "/trails", note: "Leaflet map + filters + trail cards" },
      { label: "Trail Detail", href: "/trails/yahi-trail", note: "Template × 6 trails: staging, reports" },
      { label: "Trail Conditions", href: "/trail-conditions", note: "Report feed + accessible submit modal" },
      { label: "Maps & Resources", href: "/resources", note: "Grouped downloads replacing raw links" },
    ],
  },
  {
    section: "Directory",
    href: "/directory",
    pages: [
      { label: "Business Directory", href: "/directory", note: "Search + category + member filters" },
      { label: "Business Profile", href: "/directory", note: "Template: contact, services, related" },
      { label: "List Your Business", href: "/directory/submit", note: "Submission → volunteer review" },
    ],
  },
  {
    section: "Events & News",
    href: "/events",
    pages: [
      { label: "Events", href: "/events", note: "Upcoming + archive, type badges" },
      { label: "Event Detail + RSVP", href: "/events", note: "Template: details + RSVP form" },
      { label: "Club News", href: "/news", note: "Featured story + archive grid" },
      { label: "News Story", href: "/news", note: "Template: long-form + related" },
      { label: "Volunteer", href: "/volunteer", note: "Roles + work-day CTA + interest form" },
    ],
  },
  {
    section: "Membership",
    href: "/membership",
    pages: [
      { label: "Membership & Benefits", href: "/membership", note: "Plans + where dues go" },
      { label: "Join CEA", href: "/membership/join", note: "Application → payment instructions" },
      { label: "Roles & Permissions", href: "/roles", note: "Visitor → Admin matrix" },
    ],
  },
  {
    section: "About",
    href: "/about",
    pages: [
      { label: "Mission & History", href: "/about", note: "Pillars + 1976–today timeline" },
      { label: "Board & Contacts", href: "/about/board", note: "Volunteer leads with emails" },
      { label: "Contact", href: "/contact", note: "Topic-routed message form" },
    ],
  },
  {
    section: "Accounts",
    href: "/login",
    pages: [
      { label: "Log in", href: "/login", note: "Email + password, role-aware redirect" },
      { label: "Create account", href: "/register", note: "Rider or business-owner signup" },
      { label: "Member dashboard", href: "/dashboard", note: "RSVPs, reports, membership" },
      { label: "Volunteer admin", href: "/admin", note: "Moderation + publishing CMS" },
    ],
  },
];

const SPECS = [
  {
    icon: Home,
    title: "Homepage",
    layout: "Dark forest hero (dual CTA + live open-trail stat) → quick-link grid → conditions strip → 3 trail cards → 3 event cards → 3 directory cards → dues CTA band → news + volunteer sidebar.",
    details: [
      "Hero reserves space for stats row — no CLS on data load.",
      "All imagery uses labeled authentic-photo placeholders (no stock).",
      "Reveal-on-scroll limited to opacity/transform; disabled under prefers-reduced-motion.",
    ],
  },
  {
    icon: MapIcon,
    title: "Interactive Trail Guide",
    layout: "Dark sub-hero → Leaflet map (CARTO Voyager tiles) with status/facility/difficulty filters → accessible trailhead list → legend → trail cards with latest report excerpt.",
    details: [
      "Custom DivIcon markers color-coded by status; popups link to detail pages.",
      "List view mirrors map 1:1 for screen readers and keyboard users.",
      "Filters announce result counts via aria-live; scroll-wheel zoom off to prevent traps.",
    ],
  },
  {
    icon: Building2,
    title: "Business Directory",
    layout: "Dark sub-hero with 'List your business' CTA → search + category + members-only filter bar → featured-first card grid with contact rows.",
    details: [
      "Cards lift on hover (translateY −3px + shadow); layout never shifts.",
      "Member badge + featured ring distinguish supporters without pay-to-rank confusion.",
      "Empty state routes to submission form — every dead end is a doorway.",
    ],
  },
];

export default function SitemapPage() {
  const total = IA.reduce((n, s) => n + s.pages.length, 0);
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Deliverable · Information Architecture
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">
            Site map & component specs
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            {total} core pages across 7 sections — plus high-fidelity specifications for the three
            flagship templates below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="Information architecture"
            title="Every page, one view"
            lede="Dropdowns in the header mirror these sections exactly: Trails, Directory, Events, Membership, About."
          />
        </Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {IA.map((s, i) => (
            <Reveal key={s.section} delay={(i % 3) * 60}>
              <nav
                aria-label={`Site map — ${s.section}`}
                className="h-full rounded-xl border border-sand bg-white p-5"
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-saddle-700">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  {s.section}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {s.pages.map((p) => (
                    <li key={p.href + p.label} className="border-l-2 border-sand pl-3">
                      <Link
                        href={p.href}
                        className="inline-flex items-center gap-1 text-[15px] font-bold text-charcoal hover:text-forest-800 hover:underline"
                      >
                        {p.label}
                        <ArrowUpRight className="h-3.5 w-3.5 text-stone-warm" aria-hidden="true" />
                      </Link>
                      <span className="block text-[13px] text-stone-warm">{p.note}</span>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-sand bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="High-fidelity specs"
              title="Flagship template specifications"
              lede="What each key page contains, how it behaves, and which accessibility rules it follows — the handover-ready blueprint."
            />
          </Reveal>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {SPECS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <article className="h-full rounded-xl border border-sand bg-cream p-6">
                  <s.icon className="h-7 w-7 text-forest-700" aria-hidden="true" />
                  <h2 className="display-serif mt-3 text-2xl font-semibold">{s.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink">
                    <strong>Layout: </strong>
                    {s.layout}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {s.details.map((d) => (
                      <li key={d} className="flex gap-2 text-sm leading-relaxed text-stone-warm">
                        <LayoutTemplate className="mt-0.5 h-4 w-4 shrink-0 text-saddle-700" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 rounded-xl border border-sand bg-parchment p-5 text-[15px] leading-relaxed">
              <strong>Ownership & portability:</strong> all content lives in CEA-owned PostgreSQL
              tables (see <code className="rounded bg-white px-1.5 py-0.5 text-[13px]">src/db/schema.ts</code>),
              edited through the built-in volunteer admin at{" "}
              <Link href="/admin" className="font-bold text-forest-700 underline">
                /admin
              </Link>{" "}
              — no SaaS lock-in, no per-seat CMS fees. Export is a single{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-[13px]">pg_dump</code>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
