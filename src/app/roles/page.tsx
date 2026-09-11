import Link from "next/link";
import { Eye, UserCheck, Store, ShieldCheck, ArrowRight, Check, Minus } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";

export const metadata = {
  title: "Roles & Permissions",
  description: "How CEA accounts work: Visitor, Registered Rider, Business Owner, Volunteer, and CEA Admin.",
};

const ROLES = [
  {
    icon: Eye,
    name: "Visitor",
    tag: "No account",
    desc: "Anyone on the internet. Can browse everything public and RSVP as a guest — but reports and listings need a name attached.",
    color: "bg-stone-200 text-charcoal",
  },
  {
    icon: UserCheck,
    name: "Registered Rider",
    tag: "Free account",
    desc: "Members and regulars. RSVP with one click, submit trail reports, track everything in a dashboard.",
    color: "bg-forest-800 text-cream",
  },
  {
    icon: Store,
    name: "Business Owner",
    tag: "Free + optional $75/yr",
    desc: "Everything a rider can do, plus submit and update their own directory listing. Member badge with business dues.",
    color: "bg-saddle-700 text-cream",
  },
  {
    icon: ShieldCheck,
    name: "Volunteer & CEA Admin",
    tag: "Board-granted",
    desc: "Volunteers moderate reports and help publish. Admins manage users, memberships, and all content. Granted by the board — never self-serve.",
    color: "bg-charcoal text-cream",
  },
];

const MATRIX: { cap: string; vals: [boolean, boolean, boolean, boolean] }[] = [
  { cap: "Browse trails, events, news, directory", vals: [true, true, true, true] },
  { cap: "RSVP to events (guest or 1-click)", vals: [true, true, true, true] },
  { cap: "Submit trail condition reports", vals: [false, true, true, true] },
  { cap: "Member dashboard (RSVPs, reports)", vals: [false, true, true, true] },
  { cap: "Submit + manage own business listing", vals: [false, false, true, true] },
  { cap: "Review trail reports (approve/reject)", vals: [false, false, false, true] },
  { cap: "Approve business listings", vals: [false, false, false, true] },
  { cap: "Publish events, news, resources", vals: [false, false, false, true] },
  { cap: "Update trail open/caution/closed status", vals: [false, false, false, true] },
  { cap: "Manage users & grant roles", vals: [false, false, false, true] },
];

const COLS = ["Visitor", "Rider", "Business", "Staff"];

export default function RolesPage() {
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Accounts · Permissions
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">
            Roles & permissions
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Four levels, one principle: <em>everyone can participate; only trusted volunteers can
            publish.</em> No code, no gatekeeping — just clear lanes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="The ladder"
            title="From first-time visitor to board admin"
          />
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => (
            <Reveal key={r.name} delay={i * 70}>
              <article className="lift h-full rounded-xl border border-sand bg-white p-6">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${r.color}`}>
                  <r.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {r.tag}
                </span>
                <h2 className="display-serif mt-3 text-xl font-semibold">{r.name}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-warm">{r.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-sand bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="Permission matrix"
              title="Who can do what"
              align="center"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="nice-scroll mt-7 overflow-x-auto rounded-xl border border-sand">
              <table className="w-full min-w-[560px] border-collapse bg-white text-left text-[15px]">
                <thead>
                  <tr className="bg-forest-950 text-cream">
                    <th scope="col" className="px-5 py-3.5 font-semibold">
                      Capability
                    </th>
                    {COLS.map((c) => (
                      <th key={c} scope="col" className="px-4 py-3.5 text-center font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row, i) => (
                    <tr key={row.cap} className={i % 2 === 1 ? "bg-parchment/60" : ""}>
                      <th scope="row" className="px-5 py-3 text-left font-medium">
                        {row.cap}
                      </th>
                      {row.vals.map((v, j) => (
                        <td key={j} className="px-4 py-3 text-center">
                          {v ? (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest-50">
                              <Check className="h-4 w-4 text-forest-700" aria-hidden="true" />
                              <span className="sr-only">Allowed</span>
                            </span>
                          ) : (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stone-100">
                              <Minus className="h-4 w-4 text-stone-400" aria-hidden="true" />
                              <span className="sr-only">Not allowed</span>
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-forest-800 px-6 py-3 text-sm font-bold text-cream hover:bg-forest-900"
              >
                Create a free rider account <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/volunteer"
                className="rounded-lg border border-forest-800 px-6 py-3 text-center text-sm font-bold text-forest-800 hover:bg-forest-50"
              >
                Become a volunteer moderator
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
