import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Ticket, Users } from "lucide-react";
import { Reveal, PhotoPlaceholder, ActionForm, Field, fieldCls } from "@/components/primitives";
import { getEventBySlug, getEvents } from "@/lib/queries";
import { rsvpAction } from "@/lib/actions";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);
  if (!ev) return { title: "Event not found" };
  return { title: `${(ev as { title: string }).title} — Events` };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);
  if (!ev) notFound();
  const e = ev as unknown as {
    id: string;
    title: string;
    eventType: string;
    startAt: Date;
    endAt: Date | null;
    location: string;
    cost: string | null;
    capacity: number | null;
    rsvpCount: number | null;
    description: string;
    imageNote: string | null;
    requiresRsvp: boolean | null;
  };
  const others = (await getEvents({ upcomingOnly: true, limit: 4 })).filter(
    (x) => (x as { slug: string }).slug !== slug
  );

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saddle-200 hover:text-cream hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All events
          </Link>
          <p className="mt-4 inline-flex rounded-md bg-cream/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
            {e.eventType}
          </p>
          <h1 className="display-serif mt-2 max-w-3xl text-4xl font-semibold">{e.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-cream/85">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" /> {formatDateTime(e.startAt)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {e.location}
            </span>
            <span className="flex items-center gap-2">
              <Ticket className="h-4 w-4" aria-hidden="true" /> {e.cost}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <PhotoPlaceholder
                label={
                  e.imageNote ??
                  "Authentic, high-quality photo of this CEA community event"
                }
                aspect="aspect-[16/9]"
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="cea-prose mt-6 rounded-xl border border-sand bg-white p-6">
                <h2 className="display-serif mb-3 text-2xl font-semibold">About this event</h2>
                <p>{e.description}</p>
                <div className="mt-5 grid gap-3 rounded-lg bg-parchment p-4 text-[15px] sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-forest-700" aria-hidden="true" />
                    <span>
                      <strong>{e.rsvpCount ?? 0}</strong> of {e.capacity ?? "—"} spots claimed
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-forest-700" aria-hidden="true" />
                    {e.requiresRsvp ? "RSVP requested" : "Drop-ins welcome"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={80}>
              <aside className="rounded-xl border border-sand bg-white p-6" aria-label="RSVP">
                <h2 className="display-serif text-2xl font-semibold">Reserve your spot</h2>
                <p className="mt-1.5 text-[15px] text-stone-warm">
                  Free to RSVP — pay at the event if there&apos;s a fee. Members get priority when
                  clinics fill.
                </p>
                <ActionForm
                  action={rsvpAction}
                  submitLabel="Confirm RSVP"
                  className="mt-5 grid gap-4"
                >
                  <input type="hidden" name="eventId" value={e.id} />
                  <Field label="Full name" required>
                    <input name="name" required autoComplete="name" className={fieldCls} placeholder="Your name" />
                  </Field>
                  <Field label="Email" required>
                    <input name="email" type="email" required autoComplete="email" className={fieldCls} placeholder="you@example.com" />
                  </Field>
                  <Field label="Extra guests (not counting you)" hint="Kids on leadline count as guests.">
                    <input name="guests" type="number" min={0} max={10} defaultValue={0} className={fieldCls} />
                  </Field>
                </ActionForm>
              </aside>
            </Reveal>

            {others.length > 0 && (
              <Reveal delay={140}>
                <aside className="mt-5 rounded-xl border border-sand bg-parchment p-5">
                  <h2 className="font-bold">More upcoming events</h2>
                  <ul className="mt-3 space-y-2.5">
                    {others.slice(0, 3).map((o) => {
                      const x = o as unknown as { slug: string; title: string; startAt: Date };
                      return (
                        <li key={x.slug}>
                          <Link
                            href={`/events/${x.slug}`}
                            className="block rounded-lg bg-white p-3 text-[15px] font-semibold hover:text-forest-800 hover:underline"
                          >
                            {x.title}
                            <span className="block text-[13px] font-normal text-stone-warm">
                              {formatDateTime(x.startAt)}
                            </span>
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
