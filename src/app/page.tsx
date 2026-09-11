import Link from "next/link";
import {
  ArrowRight,
  Map as MapIcon,
  CalendarDays,
  Building2,
  ShieldCheck,
  HeartHandshake,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { Reveal, SectionHeading, PhotoPlaceholder, ConditionDot } from "@/components/primitives";
import { QuickLinkCards } from "@/components/chrome";
import { getTrails, getEvents, getBusinesses, getNews, getApprovedReports } from "@/lib/queries";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trails, events, businesses, news, reports] = await Promise.all([
    getTrails(),
    getEvents({ upcomingOnly: true, limit: 3 }),
    getBusinesses({ approvedOnly: true }),
    getNews(3),
    getApprovedReports(),
  ]);
  const featured = businesses.filter((b) => (b as { isFeatured?: boolean }).isFeatured).slice(0, 3);
  const openCount = trails.filter((t) => (t as { status: string }).status === "open").length;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="border-b border-sand bg-forest-950 text-cream" aria-label="Introduction">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-3.5 py-1.5 text-[13px] font-semibold text-saddle-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Volunteer-run nonprofit · Est. 1976
            </p>
            <h1 className="display-serif mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
              Keep Chico&apos;s trails open to horses.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
              The Chico Equestrian Association stewards equestrian access to Bidwell Park —
              maintaining trails, publishing honest footing reports, and welcoming riders of every
              age and level.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/membership/join"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cream px-7 py-3.5 text-[15px] font-bold text-forest-900 transition-colors hover:bg-white"
              >
                Become a Member
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/trails"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-cream/40 px-7 py-3.5 text-[15px] font-bold text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                <MapIcon className="h-4 w-4" aria-hidden="true" />
                Explore Trails
              </Link>
            </div>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-cream/15 pt-6">
              {[
                { k: `${trails.length}`, v: "Trails stewarded" },
                { k: `${openCount}/${trails.length}`, v: "Open today" },
                { k: `${businesses.length}+`, v: "Local businesses" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="sr-only">{s.v}</dt>
                  <dd className="display-serif text-2xl font-semibold text-cream sm:text-3xl">{s.k}</dd>
                  <dd className="mt-0.5 text-[13px] text-cream/70">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:pl-4">
            <div className="overflow-hidden rounded-2xl border border-cream/20 bg-forest-900 p-2.5">
              <PhotoPlaceholder
                label="Authentic, high-quality photo of local equestrians riding Bidwell Park trails at golden hour"
                aspect="aspect-[4/3.4]"
                className="border-cream/10 bg-forest-800 [&_figcaption_span:last-child]:text-cream [&_figcaption_span:first-child]:text-saddle-200"
              />
              <div className="flex items-center justify-between gap-3 px-3 py-3">
                <p className="flex items-center gap-2 text-[13px] text-cream/80">
                  <ConditionDot status="open" />
                  <span>
                    <strong className="text-cream">{openCount} trails open</strong> · updated by
                    riders this week
                  </span>
                </p>
                <Link
                  href="/trail-conditions"
                  className="shrink-0 text-[13px] font-bold text-saddle-200 underline underline-offset-2 hover:text-cream"
                >
                  View reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUICK LINKS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-label="Quick links">
        <Reveal>
          <QuickLinkCards />
        </Reveal>
      </section>

      {/* ============ TRAIL CONDITIONS STRIP ============ */}
      <section className="border-y border-sand bg-parchment" aria-label="Latest trail conditions">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                kicker="Ride-ready intel"
                title="Latest trail conditions"
                lede="Submitted by riders, reviewed by volunteers. Always check before you haul."
              />
              <div className="flex gap-2">
                <Link
                  href="/trail-conditions"
                  className="rounded-lg border border-forest-800 px-4 py-2.5 text-sm font-bold text-forest-800 transition-colors hover:bg-forest-50"
                >
                  All reports
                </Link>
                <Link
                  href="/trail-conditions#report"
                  className="rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-900"
                >
                  Submit a report
                </Link>
              </div>
            </div>
          </Reveal>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {reports.slice(0, 3).map((r, i) => (
              <Reveal key={(r.report as { id: string }).id} delay={i * 80}>
                <article className="lift h-full rounded-xl border border-sand bg-white p-5">
                  <p className="flex items-center gap-2 text-[13px] font-semibold capitalize text-stone-warm">
                    <ConditionDot status={(r.report as { condition: string }).condition} />
                    {(r.report as { condition: string }).condition}
                    <span aria-hidden="true">·</span>
                    <span className="font-normal">
                      {(r.trail as { name: string } | null)?.name ?? "General"}
                    </span>
                  </p>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink">
                    &ldquo;{(r.report as { description: string }).description}&rdquo;
                  </p>
                  <p className="mt-3 text-[13px] text-stone-warm">
                    — {(r.report as { reporterName: string }).reporterName} ·{" "}
                    {formatDate((r.report as { createdAt: Date }).createdAt)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRAILS PREVIEW ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-label="Trail guide preview">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              kicker="Bidwell Park"
              title="An honest guide to every horse trail"
              lede="Parking that fits your rig, water sources, shade, and real footing notes — not generic park copy."
            />
            <Link
              href="/trails"
              className="inline-flex items-center gap-1.5 rounded-lg border border-forest-800 px-4 py-2.5 text-sm font-bold text-forest-800 transition-colors hover:bg-forest-50"
            >
              Open interactive guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trails.slice(0, 3).map((t, i) => {
            const trail = t as {
              slug: string;
              name: string;
              parkArea: string;
              difficulty: string;
              lengthMiles: string;
              status: string;
              description: string;
            };
            return (
              <Reveal key={trail.slug} delay={i * 80}>
                <article className="lift flex h-full flex-col overflow-hidden rounded-xl border border-sand bg-white">
                  <PhotoPlaceholder
                    label={`Authentic photo of ${trail.name} — ${trail.parkArea}`}
                    aspect="aspect-[16/9]"
                    className="rounded-none border-0 border-b border-sand"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-warm">
                      <ConditionDot status={trail.status} />
                      <span className="capitalize">{trail.status}</span>
                      <span aria-hidden="true">·</span> {trail.parkArea}
                    </p>
                    <h3 className="display-serif mt-1.5 text-xl font-semibold">
                      <Link href={`/trails/${trail.slug}`} className="hover:text-forest-800 hover:underline">
                        {trail.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-[13px] font-semibold text-saddle-700">
                      {trail.lengthMiles} mi · {trail.difficulty}
                    </p>
                    <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-stone-warm">
                      {trail.description}
                    </p>
                    <Link
                      href={`/trails/${trail.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline"
                    >
                      Trail details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ EVENTS ============ */}
      <section className="border-y border-sand bg-white" aria-label="Upcoming events">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                kicker="Gather & ride"
                title="Upcoming events"
                lede="Poker rides, clinics, work days, and meetings — the heartbeat of CEA."
              />
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 rounded-lg border border-forest-800 px-4 py-2.5 text-sm font-bold text-forest-800 transition-colors hover:bg-forest-50"
              >
                Full calendar <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {events.map((e, i) => {
              const ev = e as {
                slug: string;
                title: string;
                eventType: string;
                startAt: Date;
                location: string;
                cost: string | null;
              };
              return (
                <Reveal key={ev.slug} delay={i * 80}>
                  <article className="lift flex h-full flex-col rounded-xl border border-sand bg-cream p-5">
                    <p className="flex items-center gap-2">
                      <span className="rounded-md bg-forest-800 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cream">
                        {ev.eventType}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-stone-warm">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDateTime(ev.startAt)}
                      </span>
                    </p>
                    <h3 className="display-serif mt-3 text-xl font-semibold leading-snug">
                      <Link href={`/events/${ev.slug}`} className="hover:text-forest-800 hover:underline">
                        {ev.title}
                      </Link>
                    </h3>
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-stone-warm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {ev.location}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-saddle-700">{ev.cost}</p>
                    <Link
                      href={`/events/${ev.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline"
                    >
                      Details & RSVP <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DIRECTORY ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-label="Business directory preview">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              kicker="Shop local, ride local"
              title="Trusted equestrian businesses"
              lede="Member-supported farriers, vets, boarding, and tack — the people who keep Chico's horses thriving."
            />
            <Link
              href="/directory"
              className="inline-flex items-center gap-1.5 rounded-lg border border-forest-800 px-4 py-2.5 text-sm font-bold text-forest-800 transition-colors hover:bg-forest-50"
            >
              Browse directory <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {(featured.length > 0 ? featured : businesses.slice(0, 3)).map((b, i) => {
            const biz = b as {
              slug: string;
              name: string;
              category: string;
              description: string;
              phone: string | null;
              isMember: boolean | null;
            };
            return (
              <Reveal key={biz.slug} delay={i * 80}>
                <article className="lift h-full rounded-xl border border-sand bg-white p-5">
                  <p className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-saddle-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-saddle-800">
                      {biz.category}
                    </span>
                    {biz.isMember && (
                      <span className="flex items-center gap-1 text-[13px] font-semibold text-forest-700">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> CEA Member
                      </span>
                    )}
                  </p>
                  <h3 className="display-serif mt-3 text-xl font-semibold">
                    <Link href={`/directory/${biz.slug}`} className="hover:text-forest-800 hover:underline">
                      {biz.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-stone-warm">
                    {biz.description}
                  </p>
                  {biz.phone && (
                    <p className="mt-3 text-sm font-semibold text-charcoal">{biz.phone}</p>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ MEMBERSHIP CTA ============ */}
      <section className="border-y border-sand bg-forest-800 text-cream" aria-label="Membership">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
              Membership from $35/year
            </p>
            <h2 className="display-serif mt-2 text-3xl font-semibold sm:text-4xl">
              Your dues keep the gates open.
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                "Funds trail signs, mounting blocks & footing repairs",
                "Member pricing on clinics, shows & the Poker Ride",
                "A vote on park-access advocacy and ride calendar",
                "Directory listing for business members",
              ].map((li) => (
                <li key={li} className="flex items-start gap-2.5 text-[16px] text-cream/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-saddle-200" aria-hidden="true" />
                  {li}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/membership/join"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cream px-7 py-3 text-[15px] font-bold text-forest-900 transition-colors hover:bg-white"
              >
                Join CEA today <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-cream/40 px-7 py-3 text-[15px] font-bold text-cream transition-colors hover:bg-cream/10"
              >
                Compare plans
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <PhotoPlaceholder
              label="Authentic, high-quality photo of CEA community event — members, families, and horses gathered"
              aspect="aspect-[4/3]"
              className="border-cream/20 bg-forest-900 [&_figcaption_span:last-child]:text-cream [&_figcaption_span:first-child]:text-saddle-200"
            />
          </Reveal>
        </div>
      </section>

      {/* ============ NEWS + VOLUNTEER ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-label="News and volunteering">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <SectionHeading kicker="From the barn" title="Club news" />
                <Link href="/news" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-forest-700 hover:underline">
                  All news <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <div className="mt-6 space-y-4">
              {news.map((n, i) => {
                const post = n as {
                  slug: string;
                  title: string;
                  excerpt: string;
                  category: string;
                  publishedAt: Date;
                };
                return (
                  <Reveal key={post.slug} delay={i * 60}>
                    <article className="lift rounded-xl border border-sand bg-white p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-saddle-700">
                        {post.category} · {formatDate(post.publishedAt)}
                      </p>
                      <h3 className="display-serif mt-1.5 text-lg font-semibold leading-snug">
                        <Link href={`/news/${post.slug}`} className="hover:text-forest-800 hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[15px] text-stone-warm">{post.excerpt}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <div className="space-y-5">
            <Reveal delay={100}>
              <aside className="rounded-xl border border-saddle-200 bg-saddle-50 p-6">
                <HeartHandshake className="h-8 w-8 text-saddle-700" aria-hidden="true" />
                <h3 className="display-serif mt-3 text-2xl font-semibold">No horse? No problem.</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">
                  Half our volunteers don&apos;t ride — they clear trails, check in riders, design
                  flyers, and welcome newcomers. Two hours a month keeps this club running.
                </p>
                <Link
                  href="/volunteer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-saddle-700 px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-saddle-800"
                >
                  Volunteer with CEA <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </aside>
            </Reveal>
            <Reveal delay={160}>
              <aside className="rounded-xl border border-sand bg-white p-6">
                <Users className="h-8 w-8 text-forest-700" aria-hidden="true" />
                <h3 className="display-serif mt-3 text-2xl font-semibold">New to the area?</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-warm">
                  Start with a sunset social ride — loaner helmets, friendly pace, potluck after.
                  The fastest way to meet Chico&apos;s horse community.
                </p>
                <Link
                  href="/events"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline"
                >
                  Find your first ride <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <p className="mt-4 flex items-center gap-2 border-t border-sand pt-4 text-[13px] text-stone-warm">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Member meetings · First Thursday monthly
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[13px] text-stone-warm">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  Chico Creek Nature Center, Oak Room
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
