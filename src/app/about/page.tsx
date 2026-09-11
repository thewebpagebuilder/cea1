import Link from "next/link";
import { ArrowRight, Leaf, GraduationCap, Users } from "lucide-react";
import { Reveal, SectionHeading, PhotoPlaceholder } from "@/components/primitives";

export const metadata = {
  title: "Our Mission",
  description: "CEA history and mission: preserving equestrian access to Bidwell Park since 1976.",
};

const TIMELINE = [
  ["1976", "Founded by 14 riders meeting at One-Mile to oppose a proposed horse ban on creekside trails."],
  ["1984", "First Poker Ride fundraiser — 60 riders, $800 raised for signage. Still our signature event."],
  ["1997", "CEA funds the Horseshoe Lake staging expansion: gravel, hitching rails, and horse water."],
  ["2011", "Trail crew formalized with the Park Division — 2,000+ volunteer hours logged since."],
  ["2022", "Wayfinding pilot co-designed with rangers: horse-height, non-reflective markers."],
  ["Today", "210+ member households, 9 trailhead kiosks maintained, and a waitlist-free welcome for every new rider."],
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
            About · Since 1976
          </p>
          <h1 className="display-serif mt-2 max-w-3xl text-4xl font-semibold sm:text-5xl">
            Riders keeping Bidwell Park open to horses
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            We&apos;re a volunteer-run 501(c)(3) nonprofit. Our mission: preserve and improve
            equestrian access to Bidwell Park through stewardship, education, and community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <PhotoPlaceholder
              label="Authentic, high-quality photo of the Chico equestrian community — group ride gathering in Bidwell Park"
              aspect="aspect-[4/3]"
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading
              kicker="What we do"
              title="Three commitments, fifty years running"
            />
            <ul className="mt-6 space-y-5">
              {[
                {
                  icon: Leaf,
                  t: "Stewardship",
                  d: "We maintain tread, signs, and staging areas in partnership with the Park Division — 300+ volunteer hours a year.",
                },
                {
                  icon: GraduationCap,
                  t: "Education",
                  d: "Clinics, footing reports, and etiquette outreach make shared trails safer for horses, hikers, and bikes alike.",
                },
                {
                  icon: Users,
                  t: "Community",
                  d: "Social rides, youth scholarships, and a business directory keep Chico's horse culture welcoming and local.",
                },
              ].map((x) => (
                <li key={x.t} className="flex gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-800">
                    <x.icon className="h-5 w-5 text-cream" aria-hidden="true" />
                  </span>
                  <span>
                    <strong className="display-serif text-lg">{x.t}</strong>
                    <span className="mt-0.5 block text-[15px] leading-relaxed text-stone-warm">{x.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-sand bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="History"
              title="Fifty years of showing up"
              align="center"
            />
          </Reveal>
          <ol className="relative mt-8 space-y-0 border-l-2 border-saddle-200 pl-0">
            {TIMELINE.map(([year, text], i) => (
              <Reveal key={year} delay={i * 40}>
                <li className="relative pb-7 pl-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-[3px] border-cream bg-forest-700"
                  />
                  <p className="display-serif text-xl font-semibold text-forest-800">{year}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-stone-warm">{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/about/board"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-forest-800 px-6 py-3 text-sm font-bold text-cream hover:bg-forest-900"
              >
                Meet the board <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/membership/join"
                className="rounded-lg border border-forest-800 px-6 py-3 text-center text-sm font-bold text-forest-800 hover:bg-forest-50"
              >
                Become part of the story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
