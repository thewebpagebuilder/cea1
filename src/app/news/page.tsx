import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading, PhotoPlaceholder } from "@/components/primitives";
import { getNews } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Club News",
  description: "Announcements, trail-work recaps, and stories from the Chico Equestrian Association.",
};

export default async function NewsPage() {
  const posts = await getNews();
  const [lead, ...rest] = posts.map((p) => p as unknown as {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string | null;
    publishedAt: Date;
  });

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Community · Stories
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">Club News</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Trail-work recaps, park-access updates, scholarship announcements, and member stories —
            written by volunteers, for riders.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {lead && (
          <Reveal>
            <article className="lift grid overflow-hidden rounded-xl border border-sand bg-white md:grid-cols-2">
              <PhotoPlaceholder
                label="Authentic, high-quality photo from the featured CEA story"
                aspect="aspect-[16/10] md:aspect-auto md:h-full"
                className="rounded-none border-0 md:border-r md:border-sand"
              />
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-saddle-700">
                  Featured · {lead.category} · {formatDate(lead.publishedAt)}
                </p>
                <h2 className="display-serif mt-2 text-3xl font-semibold leading-tight">
                  <Link href={`/news/${lead.slug}`} className="hover:text-forest-800 hover:underline">
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-stone-warm">{lead.excerpt}</p>
                <p className="mt-3 text-sm text-stone-warm">By {lead.author}</p>
                <Link
                  href={`/news/${lead.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-bold text-cream hover:bg-forest-900"
                >
                  Read story <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        )}

        <div className="mt-10">
          <SectionHeading kicker="Archive" title="All stories" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 70}>
              <article className="lift flex h-full flex-col rounded-xl border border-sand bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-saddle-700">
                  {post.category} · {formatDate(post.publishedAt)}
                </p>
                <h3 className="display-serif mt-2 text-xl font-semibold leading-snug">
                  <Link href={`/news/${post.slug}`} className="hover:text-forest-800 hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-[15px] text-stone-warm">{post.excerpt}</p>
                <p className="mt-3 text-[13px] text-stone-warm">By {post.author}</p>
                <Link
                  href={`/news/${post.slug}`}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline"
                >
                  Read story <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
