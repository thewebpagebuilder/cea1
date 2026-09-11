import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";
import { getEvents } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events",
  description: "CEA rides, clinics, volunteer work days, meetings, and shows in Chico, CA.",
};

const TYPE_STYLES: Record<string, string> = {
  Ride: "bg-forest-800 text-cream",
  Clinic: "bg-saddle-700 text-cream",
  Volunteer: "bg-gold text-charcoal",
  Meeting: "bg-charcoal text-cream",
  Social: "bg-forest-500 text-cream",
  Show: "bg-saddle-500 text-cream",
};

export default async function EventsPage() {
  const events = await getEvents({ upcomingOnly: false });
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => new Date((e as { startAt: Date }).startAt) >= now);
  const past = events.filter((e) => new Date((e as { startAt: Date }).startAt) < now).reverse();

  const Card = ({ e }: { e: (typeof events)[number] }) => {
    const ev = e as unknown as {
      slug: string;
      title: string;
      eventType: string;
      startAt: Date;
      location: string;
      cost: string | null;
      description: string;
      rsvpCount: number | null;
      capacity: number | null;
    };
    return (
      <article className="lift flex h-full flex-col rounded-xl border border-sand bg-white p-5">
        <p className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${TYPE_STYLES[ev.eventType] ?? "bg-forest-800 text-cream"}`}
          >
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
        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-stone-warm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {ev.location}
        </p>
        <p className="mt-2 line-clamp-2 text-[15px] text-stone-warm">{ev.description}</p>
        <div className="mt-3 flex items-center justify-between border-t border-sand pt-3 text-sm">
          <span className="font-semibold text-saddle-700">{ev.cost}</span>
          <span className="text-[13px] text-stone-warm">
            {ev.rsvpCount ?? 0}/{ev.capacity ?? "—"} RSVPs
          </span>
        </div>
        <Link
          href={`/events/${ev.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline"
        >
          Details & RSVP <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </article>
    );
  };

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Community · Calendar
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">Events</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Poker rides, schooling shows, desensitization clinics, trail work days, and monthly
            meetings. Most events are free for members and welcoming to newcomers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker={`${upcoming.length} upcoming`}
            title="Upcoming events"
            lede="RSVPs help our volunteers plan parking, lunch, and loaner helmets."
          />
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e, i) => (
            <Reveal key={(e as { id: string }).id} delay={(i % 3) * 70}>
              <Card e={e} />
            </Reveal>
          ))}
          {upcoming.length === 0 && (
            <p className="rounded-xl border border-dashed border-sand bg-parchment/60 p-8 text-center text-stone-warm md:col-span-3">
              New season calendar is being finalized — check back soon or join the newsletter at a
              monthly meeting.
            </p>
          )}
        </div>

        {past.length > 0 && (
          <>
            <div className="mt-12">
              <SectionHeading kicker="Archive" title="Past events" />
            </div>
            <div className="mt-6 grid gap-4 opacity-80 md:grid-cols-2 lg:grid-cols-3">
              {past.slice(0, 3).map((e) => (
                <Card key={(e as { id: string }).id} e={e} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
