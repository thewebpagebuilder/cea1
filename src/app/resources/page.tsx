import { FileText, Download, Map as MapIcon } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";
import { getResources } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Maps & Resources",
  description: "Printable trail maps, membership forms, safety guides, bylaws, and waivers.",
};

const CATEGORY_ICON: Record<string, typeof FileText> = {
  "Trail Map": MapIcon,
  Governance: FileText,
  Form: FileText,
  Safety: FileText,
  Guide: FileText,
};

export default async function ResourcesPage() {
  const files = await getResources();
  const groups = new Map<string, typeof files>();
  files.forEach((f) => {
    const cat = (f as { category: string }).category;
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(f);
  });

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Trails · Downloads
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">Maps & resources</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Print-before-you-ride maps, safety cards, forms, and governance docs — organized,
            dated, and free. No more hunting through raw link lists.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {[...groups.entries()].map(([cat, items], gi) => (
          <div key={cat} className={gi > 0 ? "mt-10" : ""}>
            <Reveal>
              <SectionHeading kicker={`${items.length} files`} title={cat} />
            </Reveal>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {items.map((f, i) => {
                const r = f as unknown as {
                  slug: string;
                  title: string;
                  description: string;
                  fileType: string | null;
                  fileSize: string | null;
                  downloadCount: number | null;
                };
                const Icon = CATEGORY_ICON[cat] ?? FileText;
                return (
                  <Reveal key={r.slug} delay={(i % 2) * 60}>
                    <article className="lift flex gap-4 rounded-xl border border-sand bg-white p-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest-800">
                        <Icon className="h-5 w-5 text-cream" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <strong className="text-[16px]">{r.title}</strong>
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-stone-warm">
                          {r.description}
                        </span>
                        <span className="mt-2.5 flex flex-wrap items-center gap-3 text-[13px] text-stone-warm">
                          <span className="rounded bg-parchment px-2 py-0.5 font-bold">
                            {r.fileType} · {r.fileSize}
                          </span>
                          <span>{r.downloadCount} downloads</span>
                          <span
                            className="inline-flex items-center gap-1 font-bold text-forest-700"
                            aria-label={`${r.title} (${r.fileType}) — file syncs from the admin library`}
                            role="note"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden="true" /> {r.fileType} on file
                          </span>
                        </span>
                      </span>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}

        <Reveal>
          <div className="mt-10 rounded-xl border border-saddle-200 bg-saddle-50 p-6 text-[15px] leading-relaxed">
            <p>
              <strong>Can&apos;t find it?</strong> Older newsletters and meeting minutes live in the
              archive — email{" "}
              <a href="mailto:info@chicoequestrianassociation.com" className="font-bold text-forest-700 underline">
                info@chicoequestrianassociation.com
              </a>{" "}
              and a volunteer will dig it up.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
