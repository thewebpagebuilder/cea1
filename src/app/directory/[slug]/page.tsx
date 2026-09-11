import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Phone, Mail, Globe, MapPin, Tag } from "lucide-react";
import { Reveal, PhotoPlaceholder } from "@/components/primitives";
import { getBusinessBySlug, getBusinesses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getBusinessBySlug(slug);
  if (!b) return { title: "Business not found" };
  return { title: `${(b as { name: string }).name} — Directory` };
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await getBusinessBySlug(slug);
  if (!b) notFound();
  const biz = b as unknown as {
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
    services: string[] | null;
  };
  const others = (await getBusinesses({ approvedOnly: true }))
    .filter((x) => (x as { slug: string }).slug !== slug)
    .filter((x) => (x as { category: string }).category === biz.category)
    .slice(0, 3);

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saddle-200 hover:text-cream hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Directory
          </Link>
          <p className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-cream/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
              {biz.category}
            </span>
            {biz.isMember && (
              <span className="flex items-center gap-1.5 rounded-md bg-cream px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-forest-900">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> CEA Member
              </span>
            )}
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold">{biz.name}</h1>
          <p className="mt-2 text-cream/80">{[biz.address, biz.city].filter(Boolean).join(" · ")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <PhotoPlaceholder
                label={`Authentic photo of ${biz.name} — facility, horses, and team`}
                aspect="aspect-[16/9]"
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="mt-6 rounded-xl border border-sand bg-white p-6">
                <h2 className="display-serif text-2xl font-semibold">About</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-ink">{biz.description}</p>
                {biz.services && biz.services.length > 0 && (
                  <>
                    <h3 className="mt-5 flex items-center gap-2 font-bold">
                      <Tag className="h-4 w-4 text-forest-700" aria-hidden="true" /> Services
                    </h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {biz.services.map((s) => (
                        <li
                          key={s}
                          className="rounded-md bg-forest-50 px-3 py-1.5 text-sm font-semibold text-forest-800"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal delay={80}>
              <aside className="rounded-xl border border-sand bg-white p-6" aria-label="Contact this business">
                <h2 className="display-serif text-xl font-semibold">Contact</h2>
                <ul className="mt-4 space-y-3 text-[15px]">
                  {biz.phone && (
                    <li className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-stone-warm" aria-hidden="true" />
                      <a href={`tel:${biz.phone}`} className="font-bold hover:underline">
                        {biz.phone}
                      </a>
                    </li>
                  )}
                  {biz.email && (
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 shrink-0 text-stone-warm" aria-hidden="true" />
                      <a href={`mailto:${biz.email}`} className="font-semibold text-forest-700 hover:underline">
                        {biz.email}
                      </a>
                    </li>
                  )}
                  {biz.website && (
                    <li className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 shrink-0 text-stone-warm" aria-hidden="true" />
                      <a
                        href={biz.website}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-forest-700 hover:underline"
                      >
                        Visit website
                      </a>
                    </li>
                  )}
                  {(biz.address || biz.city) && (
                    <li className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-warm" aria-hidden="true" />
                      {[biz.address, biz.city].filter(Boolean).join(", ")}
                    </li>
                  )}
                </ul>
                <p className="mt-5 rounded-lg bg-parchment p-3.5 text-[13px] leading-relaxed text-stone-warm">
                  Mention you found them in the CEA Directory — it shows local businesses that
                  supporting equestrian access matters.
                </p>
              </aside>
            </Reveal>
            {others.length > 0 && (
              <Reveal delay={140}>
                <aside className="mt-5 rounded-xl border border-sand bg-parchment p-5">
                  <h2 className="font-bold">More {biz.category.toLowerCase()} options</h2>
                  <ul className="mt-3 space-y-2">
                    {others.map((o) => {
                      const x = o as unknown as { slug: string; name: string; city: string | null };
                      return (
                        <li key={x.slug}>
                          <Link
                            href={`/directory/${x.slug}`}
                            className="block rounded-lg bg-white p-3 text-[15px] font-semibold hover:text-forest-800 hover:underline"
                          >
                            {x.name}
                            <span className="block text-[13px] font-normal text-stone-warm">{x.city}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </aside>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
