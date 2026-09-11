import { ShieldCheck, AlertTriangle, Droplets } from "lucide-react";
import { Reveal } from "@/components/primitives";
import ReportBoard, { type ReportRow } from "@/components/ReportBoard";
import { getTrails, getApprovedReports } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trail Conditions",
  description:
    "Current Bidwell Park trail conditions reported by riders and reviewed by CEA volunteers. Submit your own report.",
};

export default async function TrailConditionsPage() {
  const [trails, reports] = await Promise.all([getTrails(), getApprovedReports()]);
  const trailOpts = trails.map((t) => {
    const x = t as unknown as { id: string; slug: string; name: string };
    return { id: x.id, slug: x.slug, name: x.name };
  });
  const rows: ReportRow[] = reports.map((r) => ({
    report: {
      id: (r.report as { id: string }).id,
      trailId: (r.report as { trailId: string | null }).trailId,
      reporterName: (r.report as { reporterName: string }).reporterName,
      condition: (r.report as { condition: string }).condition,
      hazardType: (r.report as { hazardType: string | null }).hazardType,
      description: (r.report as { description: string }).description,
      locationDetail: (r.report as { locationDetail: string | null }).locationDetail,
      createdAt: (r.report as { createdAt: Date }).createdAt,
    },
    trail: r.trail
      ? {
          id: (r.trail as { id: string }).id,
          slug: (r.trail as { slug: string }).slug,
          name: (r.trail as { name: string }).name,
        }
      : null,
  }));

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Trails · Conditions
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">
            Trail Conditions
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Rider-submitted, volunteer-reviewed. Check here the morning you haul — and pay it
            forward with your own report on the way home.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Reviewed by volunteers",
                desc: "Every report is checked before publishing. Hazards are fast-tracked.",
              },
              {
                icon: Droplets,
                title: "Winter rule of thumb",
                desc: "Rims drain in a day; Annie Bidwell needs 3–4 dry days after rain.",
              },
              {
                icon: AlertTriangle,
                title: "Emergency?",
                desc: "Call 911, then give dispatch the nearest junction marker number.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-sand bg-white p-4">
                <c.icon className="h-5 w-5 text-forest-700" aria-hidden="true" />
                <p className="mt-2 text-[15px] font-bold">{c.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-warm">{c.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6" aria-label="Condition reports">
        <Reveal delay={60}>
          <ReportBoard reports={rows} trails={trailOpts} />
        </Reveal>
      </section>
    </>
  );
}
