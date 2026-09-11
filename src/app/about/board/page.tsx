import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";
import { initials } from "@/lib/utils";

export const metadata = {
  title: "Board & Contacts",
  description: "CEA board members, committee leads, and how to reach the right volunteer.",
};

const BOARD = [
  { name: "Diane Kowalski", role: "President", focus: "Park liaison & advocacy", email: "president@example.org" },
  { name: "Marcus Webb", role: "Vice President", focus: "Events & Poker Ride", email: "vp@example.org" },
  { name: "Priya Natarajan", role: "Secretary", focus: "Minutes & membership records", email: "secretary@example.org" },
  { name: "Tom Beckett", role: "Treasurer", focus: "Dues, budget & insurance", email: "treasurer@example.org" },
  { name: "Mara Ellison", role: "Trail Chair", focus: "Trail crew & condition review", email: "trails@example.org" },
  { name: "Jordan Meyers", role: "Youth Chair", focus: "Scholarships & junior rides", email: "youth@example.org" },
  { name: "Sofia Reyes", role: "Directory Chair", focus: "Business listings & sponsors", email: "directory@example.org" },
  { name: "Ruth Callahan", role: "Member-at-Large", focus: "Newcomer welcome & socials", email: "welcome@example.org" },
];

export default function BoardPage() {
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            About · Leadership
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">Board & contacts</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Every board member is an unpaid volunteer — and every one of them answers email.
            Elections happen each November; any member in good standing can run.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="2026 board"
            title="Your volunteers"
            lede="Reach the right person directly — no contact-form black hole."
          />
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BOARD.map((m, i) => (
            <Reveal key={m.email} delay={(i % 4) * 60}>
              <article className="lift h-full rounded-xl border border-sand bg-white p-5 text-center">
                <span
                  aria-hidden="true"
                  className="display-serif mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-800 text-xl font-semibold text-cream"
                >
                  {initials(m.name)}
                </span>
                <h2 className="display-serif mt-3 text-lg font-semibold leading-tight">{m.name}</h2>
                <p className="text-sm font-bold text-forest-700">{m.role}</p>
                <p className="mt-1 text-[13px] text-stone-warm">{m.focus}</p>
                <a
                  href={`mailto:${m.email}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-saddle-700 hover:underline"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Email {m.name.split(" ")[0]}
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-8 grid gap-4 rounded-2xl border border-sand bg-parchment p-6 sm:p-8 md:grid-cols-2">
            <div>
              <h2 className="display-serif text-2xl font-semibold">Monthly meetings</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">
                First Thursday of every month, 6:30pm at the Chico Creek Nature Center (Oak Room).
                Open to all — members vote, guests are welcomed, and the rangers join us quarterly.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2.5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-forest-800 px-5 py-3 text-sm font-bold text-cream hover:bg-forest-900"
              >
                Contact the board <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/resources"
                className="rounded-lg border border-forest-800 px-5 py-3 text-center text-sm font-bold text-forest-800 hover:bg-white"
              >
                Bylaws & governance docs
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
