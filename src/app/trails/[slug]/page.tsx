import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Droplets, Tent, Toilet, Sun, CalendarDays } from "lucide-react";
import { Reveal, PhotoPlaceholder, ConditionDot } from "@/components/primitives";
import { getTrailBySlug, getApprovedReports } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trail = await getTrailBySlug(slug);
  if (!trail) return { title: "Trail not found" };
  const t = trail as unknown as { name: string; parkArea: string };
  return {
    title: `${t.name} — Trail Guide`,
    description: `Equestrian guide to ${t.name} in ${t.parkArea}: parking, water, difficulty, and current conditions.`,
  };
}

export default async function TrailDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trail = await getTrailBySlug(slug);
  if (!trail) notFound();
  const t = trail as unknown as {
    name: string;
    parkArea: string;
    difficulty: string;
    lengthMiles: string;
    elevationGainFt: number;
    surface: string;
    description: string;
    parkingInfo: string | null;
    facilities: string[];
    status: string;
    horseWater: boolean;
    trailerParking: boolean;
    restrooms: boolean;
    shadeLevel: string | null;
    bestSeason: string | null;
  };
  const reports = await getApprovedReports(slug);

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link
            href="/trails"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saddle-200 hover:text-cream hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Trail Guide
          </Link>
          <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            <ConditionDot status={t.status} />
            <span className="capitalize">{t.status}</span>
            <span aria-hidden="true">·</span> {t.parkArea}
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">{t.name}</h1>
          <p className="mt-3 text-lg text-cream/85">
            {t.lengthMiles} miles · {t.difficulty} · {t.elevationGainFt} ft gain
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <PhotoPlaceholder
                label={`Authentic, high-quality photo of ${t.name} — tread, footing, and surroundings in ${t.parkArea}`}
                aspect="aspect-[16/9]"
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="cea-prose mt-6 rounded-xl border border-sand bg-white p-6">
                <h2 className="display-serif mb-3 text-2xl font-semibold">About this trail</h2>
                <p>{t.description}</p>
                <dl className="mt-5 grid gap-4 border-t border-sand pt-5 text-[15px] sm:grid-cols-2">
                  <div>
                    <dt className="font-bold text-charcoal">Surface</dt>
                    <dd className="text-stone-warm">{t.surface}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-charcoal">Shade</dt>
                    <dd className="flex items-center gap-1.5 text-stone-warm">
                      <Sun className="h-4 w-4" aria-hidden="true" /> {t.shadeLevel}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-charcoal">Best season</dt>
                    <dd className="flex items-center gap-1.5 text-stone-warm">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" /> {t.bestSeason}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-charcoal">Facilities</dt>
                    <dd className="text-stone-warm">{(t.facilities ?? []).join(" · ") || "Primitive — pack it in/out"}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-6 rounded-xl border border-sand bg-parchment p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <MapPin className="h-5 w-5 text-forest-700" aria-hidden="true" />
                  Trailer staging & parking
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">
                  {t.parkingInfo ?? "No dedicated trailer lot — access on foot or via connecting trails."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[13px] font-semibold">
                  <span className={`flex items-center gap-1 rounded-md px-2 py-1 ${t.trailerParking ? "bg-forest-50 text-forest-800" : "bg-white text-stone-warm"}`}>
                    <Tent className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.trailerParking ? "Trailer parking" : "No trailer lot"}
                  </span>
                  <span className={`flex items-center gap-1 rounded-md px-2 py-1 ${t.horseWater ? "bg-forest-50 text-forest-800" : "bg-white text-stone-warm"}`}>
                    <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.horseWater ? "Horse water" : "Bring water"}
                  </span>
                  <span className={`flex items-center gap-1 rounded-md px-2 py-1 ${t.restrooms ? "bg-forest-50 text-forest-800" : "bg-white text-stone-warm"}`}>
                    <Toilet className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.restrooms ? "Restrooms" : "No restrooms"}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={80}>
              <aside className="rounded-xl border border-sand bg-white" aria-label={`Condition reports for ${t.name}`}>
                <div className="flex items-center justify-between gap-3 border-b border-sand px-5 py-4">
                  <h2 className="display-serif text-xl font-semibold">Condition reports</h2>
                  <Link
                    href="/trail-conditions#report"
                    className="rounded-lg bg-forest-800 px-3.5 py-2 text-[13px] font-bold text-cream hover:bg-forest-900"
                  >
                    + Report
                  </Link>
                </div>
                <ul className="divide-y divide-sand">
                  {reports.map((r) => (
                    <li key={(r.report as { id: string }).id} className="px-5 py-4">
                      <p className="flex items-center gap-2 text-[13px] font-semibold capitalize text-stone-warm">
                        <ConditionDot status={(r.report as { condition: string }).condition} />
                        {(r.report as { condition: string }).condition}
                        {(r.report as { hazardType: string | null }).hazardType && (
                          <span className="rounded bg-red-50 px-1.5 py-0.5 text-[12px] font-bold text-red-900">
                            {(r.report as { hazardType: string }).hazardType}
                          </span>
                        )}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
                        {(r.report as { description: string }).description}
                      </p>
                      {(r.report as { locationDetail: string | null }).locationDetail && (
                        <p className="mt-1 text-[13px] text-stone-warm">
                          📍 {(r.report as { locationDetail: string }).locationDetail}
                        </p>
                      )}
                      <p className="mt-1.5 text-[13px] text-stone-warm">
                        — {(r.report as { reporterName: string }).reporterName} ·{" "}
                        {formatDate((r.report as { createdAt: Date }).createdAt)}
                      </p>
                    </li>
                  ))}
                  {reports.length === 0 && (
                    <li className="px-5 py-6 text-[15px] text-stone-warm">
                      No recent reports for this trail.{" "}
                      <Link href="/trail-conditions#report" className="font-bold text-forest-700 underline">
                        Rode it? Tell the community.
                      </Link>
                    </li>
                  )}
                </ul>
                <div className="border-t border-sand px-5 py-4">
                  <Link href="/trail-conditions" className="text-sm font-bold text-forest-700 hover:underline">
                    View all trail reports →
                  </Link>
                </div>
              </aside>
            </Reveal>

            <Reveal delay={140}>
              <aside className="mt-5 rounded-xl border border-saddle-200 bg-saddle-50 p-5">
                <h2 className="font-bold text-charcoal">Ride it with CEA</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">
                  Group rides are the safest way to learn a new trail. Check the calendar for the
                  next guided ride here.
                </p>
                <Link
                  href="/events"
                  className="mt-3 inline-block rounded-lg bg-saddle-700 px-4 py-2 text-sm font-bold text-cream hover:bg-saddle-800"
                >
                  See upcoming rides
                </Link>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
