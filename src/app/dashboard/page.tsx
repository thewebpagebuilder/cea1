import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Flag, Building2, BadgeCheck, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/primitives";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import { db } from "@/db";
import { eventRsvps, events, trailReports, businesses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDateTime, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Dashboard" };

export default async function DashboardPage() {
  const session = await getSession().catch(() => null);
  if (!session) redirect("/login");

  let rsvps: { rsvp: typeof eventRsvps.$inferSelect; event: typeof events.$inferSelect | null }[] = [];
  let myReports: (typeof trailReports.$inferSelect)[] = [];
  let myBusinesses: (typeof businesses.$inferSelect)[] = [];
  try {
    const joined = await db
      .select({ rsvp: eventRsvps, event: events })
      .from(eventRsvps)
      .leftJoin(events, eq(eventRsvps.eventId, events.id))
      .orderBy(desc(eventRsvps.createdAt));
    rsvps = joined.filter((j) => j.rsvp.userId === session.id || j.rsvp.email === session.email).slice(0, 6);
    const reps = await db.select().from(trailReports).orderBy(desc(trailReports.createdAt));
    myReports = reps.filter((r) => r.reporterId === session.id).slice(0, 6);
    const biz = await db.select().from(businesses).orderBy(desc(businesses.createdAt));
    myBusinesses = biz.filter((b) => b.ownerId === session.id);
  } catch {
    /* show empty states */
  }

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="inline-flex rounded-full border border-cream/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saddle-200">
            {ROLE_LABELS[session.role]}
            {session.isActiveMember && " · Active member"}
          </p>
          <h1 className="display-serif mt-3 text-4xl font-semibold">
            Howdy, {session.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-cream/80">{session.email}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-xl border border-sand bg-white p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <CalendarDays className="h-5 w-5 text-forest-700" aria-hidden="true" />
                My RSVPs ({rsvps.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {rsvps.map(({ rsvp, event }) => (
                  <li key={rsvp.id} className="rounded-lg bg-parchment p-3 text-sm">
                    <strong>{event?.title ?? "Event"}</strong>
                    <span className="block text-stone-warm">
                      {event ? formatDateTime(event.startAt) : ""} · +{rsvp.guests} guests
                    </span>
                  </li>
                ))}
                {rsvps.length === 0 && (
                  <li className="text-[15px] text-stone-warm">
                    No RSVPs yet.{" "}
                    <Link href="/events" className="font-bold text-forest-700 underline">
                      Find a ride.
                    </Link>
                  </li>
                )}
              </ul>
              <Link href="/events" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline">
                Browse events <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="h-full rounded-xl border border-sand bg-white p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Flag className="h-5 w-5 text-forest-700" aria-hidden="true" />
                My trail reports ({myReports.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {myReports.map((r) => (
                  <li key={r.id} className="rounded-lg bg-parchment p-3 text-sm">
                    <strong className="capitalize">{r.condition}</strong>
                    <span
                      className={`ml-2 rounded px-1.5 py-0.5 text-xs font-bold ${
                        r.status === "approved"
                          ? "bg-forest-50 text-forest-800"
                          : r.status === "pending"
                            ? "bg-amber-50 text-amber-900"
                            : "bg-red-50 text-red-900"
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-stone-warm">{r.description}</span>
                    <span className="block text-[13px] text-stone-warm">{formatDate(r.createdAt)}</span>
                  </li>
                ))}
                {myReports.length === 0 && (
                  <li className="text-[15px] text-stone-warm">
                    No reports yet.{" "}
                    <Link href="/trail-conditions" className="font-bold text-forest-700 underline">
                      Rode recently? Tell us.
                    </Link>
                  </li>
                )}
              </ul>
              <Link href="/trail-conditions" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:underline">
                All conditions <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={140}>
              <div className="rounded-xl border border-sand bg-white p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Building2 className="h-5 w-5 text-forest-700" aria-hidden="true" />
                  My listings ({myBusinesses.length})
                </h2>
                {myBusinesses.length === 0 ? (
                  <p className="mt-2 text-[15px] text-stone-warm">
                    {session.role === "business_owner" ? (
                      <>
                        No listings yet.{" "}
                        <Link href="/directory/submit" className="font-bold text-forest-700 underline">
                          Submit yours.
                        </Link>
                      </>
                    ) : (
                      "Business owners can submit directory listings from their account."
                    )}
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {myBusinesses.map((b) => (
                      <li key={b.id} className="rounded-lg bg-parchment p-3 text-sm">
                        <strong>{b.name}</strong>
                        <span className="ml-2 rounded bg-white px-1.5 py-0.5 text-xs font-bold capitalize">
                          {b.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="rounded-xl border border-saddle-200 bg-saddle-50 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <BadgeCheck className="h-5 w-5 text-saddle-700" aria-hidden="true" />
                  Membership
                </h2>
                <p className="mt-2 text-[15px] text-ink">
                  {session.isActiveMember
                    ? "Your membership is active. Thank you for keeping the trails open!"
                    : "You don't have an active membership yet — dues fund every sign and mounting block."}
                </p>
                {!session.isActiveMember && (
                  <Link
                    href="/membership/join"
                    className="mt-3 inline-block rounded-lg bg-saddle-700 px-4 py-2 text-sm font-bold text-cream hover:bg-saddle-800"
                  >
                    Join CEA — from $35
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
