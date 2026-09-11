import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading, PhotoPlaceholder } from "@/components/primitives";

export const metadata = {
  title: "Membership",
  description: "Join the Chico Equestrian Association. Individual, family, business, youth, and lifetime memberships.",
};

const PLANS = [
  {
    name: "Individual",
    price: "$35",
    per: "/year",
    desc: "For one adult rider.",
    perks: ["Vote at general meetings", "Member pricing on clinics & shows", "Poker Ride early entry", "Trail-work priority invites"],
  },
  {
    name: "Family",
    price: "$50",
    per: "/year",
    desc: "Two adults + youth in one household.",
    perks: ["Everything in Individual × household", "Youth scholarship eligibility", "Free youth auditor seats at clinics", "Family listed in newsletter"],
    highlight: true,
  },
  {
    name: "Business",
    price: "$75",
    per: "/year",
    desc: "Directory listing + member badge.",
    perks: ["Featured directory listing", "Homepage rotation eligibility", "Poker Ride sponsor recognition", "2 Individual-equivalent votes"],
  },
  {
    name: "Youth",
    price: "$15",
    per: "/year",
    desc: "Riders 8–17 with a sponsor member.",
    perks: ["Scholarship eligibility", "Youth clinic pricing", "Mentored first ride", "Volunteer hours tracking"],
  },
];

export default function MembershipPage() {
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            Join · Support · Belong
          </p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">
            Membership keeps the gates open
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Dues are our largest funding source: every dollar goes to signs, footing, mounting
            blocks, insurance, and advocacy for equestrian access.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="Plans"
            title="Choose your membership"
            lede="All plans run January–December. Join after October and your dues cover the following year too."
          />
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <article
                className={`lift flex h-full flex-col rounded-xl border p-6 ${
                  p.highlight ? "border-forest-700 bg-forest-800 text-cream" : "border-sand bg-white"
                }`}
              >
                {p.highlight && (
                  <p className="mb-2 inline-flex w-fit rounded-full bg-cream/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saddle-200">
                    Most popular
                  </p>
                )}
                <h2 className="display-serif text-2xl font-semibold">{p.name}</h2>
                <p className="mt-1">
                  <span className="display-serif text-4xl font-semibold">{p.price}</span>
                  <span className={p.highlight ? "text-cream/70" : "text-stone-warm"}>{p.per}</span>
                </p>
                <p className={`mt-1 text-sm ${p.highlight ? "text-cream/80" : "text-stone-warm"}`}>{p.desc}</p>
                <ul className="mt-4 flex-1 space-y-2 text-[15px]">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? "text-saddle-200" : "text-forest-700"}`}
                        aria-hidden="true"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/membership/join"
                  className={`mt-5 rounded-lg px-4 py-2.5 text-center text-sm font-bold transition-colors ${
                    p.highlight
                      ? "bg-cream text-forest-900 hover:bg-white"
                      : "bg-forest-800 text-cream hover:bg-forest-900"
                  }`}
                >
                  Join as {p.name}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-6 rounded-xl border border-saddle-200 bg-saddle-50 p-6 text-center">
            <p className="display-serif text-xl font-semibold">Lifetime membership · $500 once</p>
            <p className="mx-auto mt-1 max-w-xl text-[15px] text-ink">
              For the devoted. Lifetime members are recognized on the Horseshoe Lake staging kiosk
              and never pay dues again.
            </p>
            <Link href="/membership/join" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-forest-700 hover:underline">
              Become a lifetime member <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-sand bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              kicker="Where dues go"
              title="$35 buys more than you think"
              lede="We're all volunteers — no salaries, no office. Here's what last year's dues funded."
            />
            <ul className="mt-6 space-y-3">
              {[
                ["$4,200", "Trail signs, junction markers & mounting blocks"],
                ["$2,800", "Footing rock + tools for 6 volunteer work days"],
                ["$1,900", "Insurance for rides, clinics & shows"],
                ["$1,000", "Youth scholarships (4 × $250)"],
              ].map(([amt, what]) => (
                <li key={what} className="flex items-center gap-4 rounded-lg border border-sand bg-cream p-3.5">
                  <span className="display-serif w-24 shrink-0 text-xl font-semibold text-forest-800">{amt}</span>
                  <span className="text-[15px]">{what}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <PhotoPlaceholder
              label="Authentic, high-quality photo of CEA-funded trail improvements — signs and mounting block at staging"
              aspect="aspect-[4/3.2]"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="rounded-2xl bg-forest-950 p-8 text-center text-cream sm:p-12">
            <h2 className="display-serif text-3xl font-semibold">Ready to ride with us?</h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/85">
              Join online in two minutes, or bring the printable form to any meeting. Either way,
              your first sunset social ride is on us.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/membership/join"
                className="rounded-lg bg-cream px-7 py-3 text-[15px] font-bold text-forest-900 hover:bg-white"
              >
                Join CEA now
              </Link>
              <Link
                href="/roles"
                className="rounded-lg border border-cream/40 px-7 py-3 text-[15px] font-bold text-cream hover:bg-cream/10"
              >
                How roles work
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
