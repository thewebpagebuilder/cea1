import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Reveal, ActionForm, Field, fieldCls } from "@/components/primitives";
import { submitBusinessAction } from "@/lib/actions";
import { BUSINESS_CATEGORIES } from "@/lib/utils";

export const metadata = {
  title: "List Your Business",
  description: "Submit your equestrian business to the CEA Directory. Member businesses are featured.",
};

export default function SubmitBusinessPage() {
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saddle-200 hover:text-cream hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Directory
          </Link>
          <h1 className="display-serif mt-3 text-4xl font-semibold sm:text-5xl">List your business</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Reach Chico&apos;s horse community. Listings are reviewed by a volunteer (usually within
            a few days) — CEA business members get the member badge and priority placement.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="rounded-xl border border-sand bg-white p-6 sm:p-8">
              <h2 className="display-serif text-2xl font-semibold">Business details</h2>
              <ActionForm action={submitBusinessAction} submitLabel="Submit for review" className="mt-5 grid gap-4">
                <Field label="Business name" required>
                  <input name="name" required className={fieldCls} placeholder="e.g., Bidwell Boarding Stable" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Category" required>
                    <select name="category" className={fieldCls} defaultValue="Boarding">
                      {BUSINESS_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Phone">
                    <input name="phone" type="tel" className={fieldCls} placeholder="(530) 555-0100" />
                  </Field>
                </div>
                <Field label="Description" required hint="Services, specialties, service area — 2–4 sentences.">
                  <textarea name="description" required rows={4} className={fieldCls} placeholder="What do you offer, and who is it best for?" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email">
                    <input name="email" type="email" className={fieldCls} placeholder="hello@example.com" />
                  </Field>
                  <Field label="Website">
                    <input name="website" type="url" className={fieldCls} placeholder="https://…" />
                  </Field>
                </div>
                <Field label="Address / service area">
                  <input name="address" className={fieldCls} placeholder="e.g., Upper Park Rd — or 'Mobile, serves Chico'" />
                </Field>
              </ActionForm>
            </div>
          </Reveal>
          <div className="space-y-5">
            <Reveal delay={80}>
              <aside className="rounded-xl border border-saddle-200 bg-saddle-50 p-6">
                <h2 className="display-serif text-xl font-semibold">How review works</h2>
                <ol className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink">
                  {[
                    "You submit — takes about 3 minutes.",
                    "A volunteer checks details and confirms you're a real local business.",
                    "Your listing goes live with a 'New' note in the next newsletter.",
                  ].map((s, i) => (
                    <li key={s} className="flex gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saddle-700 text-[13px] font-bold text-cream">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </aside>
            </Reveal>
            <Reveal delay={140}>
              <aside className="rounded-xl border border-sand bg-white p-6">
                <h2 className="font-bold">Business membership ($75/yr)</h2>
                <ul className="mt-2 space-y-2 text-[15px] text-stone-warm">
                  {["CEA Member badge + priority placement", "Featured rotation on the homepage", "Poker Ride sponsor recognition"].map((li) => (
                    <li key={li} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
                      {li}
                    </li>
                  ))}
                </ul>
                <Link href="/membership/join" className="mt-4 inline-block rounded-lg bg-forest-800 px-4 py-2 text-sm font-bold text-cream hover:bg-forest-900">
                  Join as a business
                </Link>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
