import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, PhotoPlaceholder } from "@/components/primitives";
import { getNewsBySlug, getNews } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return { title: "Story not found" };
  return { title: `${(post as { title: string }).title} — Club News` };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();
  const p = post as unknown as {
    title: string;
    excerpt: string;
    body: string;
    category: string;
    author: string | null;
    publishedAt: Date;
  };
  const others = (await getNews(4)).filter((x) => (x as { slug: string }).slug !== slug);

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saddle-200 hover:text-cream hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All news
          </Link>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            {p.category} · {formatDate(p.publishedAt)} · By {p.author}
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold leading-tight">{p.title}</h1>
          <p className="mt-3 text-lg text-cream/85">{p.excerpt}</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Reveal>
          <PhotoPlaceholder
            label="Authentic, high-quality photo of local equestrians and community event related to this story"
            aspect="aspect-[16/8]"
          />
        </Reveal>
        <Reveal delay={60}>
          <div className="cea-prose mt-6 rounded-xl border border-sand bg-white p-6 text-[16px] sm:p-8">
            {p.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <div className="mt-6 rounded-lg bg-parchment p-4 text-[15px]">
              <p>
                <strong>Have a story idea?</strong> Member stories, trail reports with photos, and
                clinic recaps are always welcome.{" "}
                <Link href="/contact" className="font-bold text-forest-700 underline">
                  Send it to the newsletter team.
                </Link>
              </p>
            </div>
          </div>
        </Reveal>

        {others.length > 0 && (
          <nav className="mt-8" aria-label="More stories">
            <h2 className="display-serif text-2xl font-semibold">More stories</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.slice(0, 2).map((o) => {
                const x = o as unknown as { slug: string; title: string; excerpt: string };
                return (
                  <li key={x.slug}>
                    <Link
                      href={`/news/${x.slug}`}
                      className="lift block rounded-xl border border-sand bg-white p-5"
                    >
                      <span className="display-serif text-lg font-semibold">{x.title}</span>
                      <span className="mt-1 line-clamp-2 block text-sm text-stone-warm">{x.excerpt}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-forest-700">
                        Read <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </article>
    </>
  );
}
