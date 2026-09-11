import Link from "next/link";
import { Shovel, ClipboardCheck, Megaphone, HandHeart, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading, PhotoPlaceholder, ActionForm, Field, fieldCls } from "@/components/primitives";
import { contactAction } from "@/lib/actions";

export const metadata = {
  title: "Volunteer",
  description: "Volunteer with CEA: trail work days, event crews, outreach, and committees. No horse required.",
};

const ROLES = [
  {
    icon: Shovel,
    title: "Trail crew",
    time: "4 hrs/mo · seasonal",
    desc: "Loppers, rock, and good company. Clear blowdown, armor footing, install signs. Tools + lunch provided.",
  },
  {
    icon: ClipboardCheck,
    title: "Event crew",
    time: "3 hrs/event",
    desc: "Check in riders, run poker stops, time trail classes. The friendliest way to meet everyone.",
  },
  {
    icon: Megaphone,
    title: "Outreach & content",
    time: "2 hrs/mo · remote ok",
    desc: "Write news recaps, photograph rides, moderate trail reports, keep the directory fresh.",
  },
  {
    icon: HandHeart,
    title: "Committees",
    time: "1 meeting/mo",
    desc: "Youth, shows, membership, park liaison. Shape where CEA goes next — no experience needed.",
  },
];

export default function VolunteerPage() {
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Give back · No horse required
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">
            Volunteers run everything
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            CEA has no paid staff. Two hours a month — on the trail or from your couch — keeps
            signs up, reports reviewed, and rides welcoming.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="Find your fit"
            title="Four ways to help"
            lede="Every role includes a buddy for your first shift and community-service letters on request."
          />
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {ROLES.map((r, i) => (
            <Reveal key={r.title} delay={(i % 2) * 80}>
              <article className="lift h-full rounded-xl border border-sand bg-white p-6">
                <r.icon className="h-7 w-7 text-forest-700" aria-hidden="true" />
                <h2 className="display-serif mt-3 text-2xl font-semibold">{r.title}</h2>
                <p className="text-[13px] font-bold uppercase tracking-wider text-saddle-700">{r.time}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-warm">{r.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-sand bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <PhotoPlaceholder
              label="Authentic, high-quality photo of CEA trail crew volunteers at work in Bidwell Park"
              aspect="aspect-[4/3]"
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading
              kicker="Next work day"
              title="Guardian Trail — April 4, 8:30am"
              lede="We need 30 hands to armor the rocky chute before spring rains. Gloves, tools, and lunch provided. Minors welcome with a parent."
            />
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-bold text-cream hover:bg-forest-900"
              >
                RSVP to the work day <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/resources"
                className="rounded-lg border border-forest-800 px-5 py-2.5 text-sm font-bold text-forest-800 hover:bg-forest-50"
              >
                Volunteer waiver (PDF)
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="rounded-xl border border-sand bg-white p-6 sm:p-8">
            <h2 className="display-serif text-2xl font-semibold">Raise your hand</h2>
            <p className="mt-1.5 text-[15px] text-stone-warm">
              Tell us what sounds fun and when you&apos;re free — the volunteer coordinator replies
              within a few days.
            </p>
            <ActionForm action={contactAction} submitLabel="Send volunteer interest" className="mt-5 grid gap-4">
              <input type="hidden" name="topic" value="Volunteering" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>
                  <input name="name" required autoComplete="name" className={fieldCls} placeholder="Your name" />
                </Field>
                <Field label="Email" required>
                  <input name="email" type="email" required autoComplete="email" className={fieldCls} placeholder="you@example.com" />
                </Field>
              </div>
              <Field label="What sounds good?" required hint="e.g., Trail crew on Saturdays; happy to photograph the Poker Ride.">
                <textarea name="message" required rows={4} className={fieldCls} placeholder="Interests, availability, anything we should know…" />
              </Field>
            </ActionForm>
          </div>
        </Reveal>
      </section>
    </>
  );
}
