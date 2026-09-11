import Link from "next/link";
import { ArrowRight, Footprints, Droplets, Tent, Info } from "lucide-react";
import { Reveal, SectionHeading, PhotoPlaceholder, ConditionDot } from "@/components/primitives";
import TrailMapLoader from "@/components/TrailMapLoader";
import { getTrails, getApprovedReports } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import type { MapTrail } from "@/components/TrailMap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Interactive Trail Guide",
  description:
    "Equestrian trail guide for Bidwell Park: interactive map, trailer parking, horse water, difficulty, and current conditions.",
};

export default async function TrailsPage() {
  const [trails, reports] = await Promise.all([getTrails(), getApprovedReports()]);
  const mapTrails: MapTrail[] = trails.map((t) => {
    const x = t as unknown as Record<string, string | number | boolean | string[] | null>;
    return {
      id: String(x.id),
      slug: String(x.slug),
      name: String(x.name),
      parkArea: String(x.parkArea),
      difficulty: String(x.difficulty),
      lengthMiles: String(x.lengthMiles),
      stagingLat: String(x.stagingLat),
      stagingLng: String(x.stagingLng),
      status: String(x.status),
      trailerParking: Boolean(x.trailerParking),
      horseWater: Boolean(x.horseWater),
      restrooms: Boolean(x.restrooms),
      facilities: (x.facilities as string[]) ?? [],
    };
  });

  const latestByTrail = new Map<string, (typeof reports)[number]>();
  reports.forEach((r) => {
    const slug = (r.trail as { slug?: string } | null)?.slug;
    if (slug && !latestByTrail.has(slug)) latestByTrail.set(slug, r);
  });

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Trails · Bidwell Park
          </p>
          <h1 className="display-serif mt-2 max-w-3xl text-4xl font-semibold sm:text-5xl">
            Interactive Trail Guide
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Every horse-legal trail in Bidwell Park — with trailer staging that fits your rig,
            water sources, shade, and honest footing notes from riders who were there this week.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-label="Trail map">
        <Reveal>
          <TrailMapLoader trails={mapTrails} />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-sm leading-relaxed text-ink">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-saddle-700" aria-hidden="true" />
            <p>
              <strong>Know before you haul:</strong> gate hours change seasonally and creek
              crossings rise fast after rain. Always check{" "}
              <Link href="/trail-conditions" className="font-bold text-forest-700 underline underline-offset-2">
                Trail Conditions
              </Link>{" "}
              the morning of your ride.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6" aria-label="All trails">
        <Reveal>
          <SectionHeading
            kicker="Every trail, honestly described"
            title="Trail cards"
            lede="Difficulty is rated for an average horse-and-rider pair. Green horses and re-riders: start with Yahi and Upper Park Road."
          />
        </Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {trails.map((t, i) => {
            const trail = t as unknown as {
              slug: string;
              name: string;
              parkArea: string;
              difficulty: string;
              lengthMiles: string;
              status: string;
              description: string;
              facilities: string[];
              horseWater: boolean;
              trailerParking: boolean;
              restrooms: boolean;
            };
            const latest = latestByTrail.get(trail.slug);
            return (
              <Reveal key={trail.slug} delay={(i % 2) * 80}>
                <article className="lift flex h-full flex-col overflow-hidden rounded-xl border border-sand bg-white">
                  <PhotoPlaceholder
                    label={`Authentic photo of ${trail.name} trail tread and surroundings`}
                    aspect="aspect-[16/8]"
                    className="rounded-none border-0 border-b border-sand"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-warm">
                      <span className="flex items-center gap-1.5">
                        <ConditionDot status={trail.status} />
                        <span className="capitalize">{trail.status}</span>
                      </span>
                      <span aria-hidden="true">·</span> {trail.parkArea}
                      <span aria-hidden="true">·</span> {trail.lengthMiles} mi
                      <span aria-hidden="true">·</span> {trail.difficulty}
                    </p>
                    <h2 className="display-serif mt-2 text-2xl font-semibold">
                      <Link href={`/trails/${trail.slug}`} className="hover:text-forest-800 hover:underline">
                        {trail.name}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-stone-warm">
                      {trail.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[13px] font-semibold">
                      {trail.trailerParking && (
                        <span className="flex items-center gap-1 rounded-md bg-forest-50 px-2 py-1 text-forest-800">
                          <Tent className="h-3.5 w-3.5" aria-hidden="true" /> Trailer parking
                        </span>
                      )}
                      {trail.horseWater && (
                        <span className="flex items-center gap-1 rounded-md bg-forest-50 px-2 py-1 text-forest-800">
                          <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> Horse water
                        </span>
                      )}
                      {trail.difficulty === "Easy" && (
                        <span className="flex items-center gap-1 rounded-md bg-saddle-50 px-2 py-1 text-saddle-800">
                          <Footprints className="h-3.5 w-3.5" aria-hidden="true" /> Beginner-friendly
                        </span>
                      )}
                    </div>
                    {latest && (
                      <p className="mt-3 rounded-lg bg-parchment px-3 py-2 text-[13px] leading-relaxed text-ink">
                        <strong>Latest report</strong> ({formatDate((latest.report as { createdAt: Date }).createdAt)}):{" "}
                        {(latest.report as { description: string }).description.slice(0, 120)}
                        {(latest.report as { description: string }).description.length > 120 ? "…" : ""}
                      </p>
                    )}
                    <Link
                      href={`/trails/${trail.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline"
                    >
                      Full trail details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
