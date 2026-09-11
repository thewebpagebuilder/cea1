import { Mail, MapPin, Clock } from "lucide-react";
import { Reveal, ActionForm, Field, fieldCls } from "@/components/primitives";
import { contactAction } from "@/lib/actions";

export const metadata = {
  title: "Contact Us",
  description: "Contact the Chico Equestrian Association — questions, media, and trail issues.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">About · Contact</p>
          <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            A volunteer replies to every message — usually within a few days. For urgent trail
            hazards, submit a condition report instead: it gets fast-tracked.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <Reveal>
              <div className="rounded-xl border border-sand bg-white p-6">
                <h2 className="display-serif text-xl font-semibold">Other ways to reach us</h2>
                <ul className="mt-4 space-y-4 text-[15px]">
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                    <span>
                      <strong>Email</strong>
                      <br />
                      <a href="mailto:info@chicoequestrianassociation.com" className="text-forest-700 hover:underline">
                        info@chicoequestrianassociation.com
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                    <span>
                      <strong>In person</strong>
                      <br />
                      First Thursday monthly, 6:30pm — Chico Creek Nature Center, Oak Room.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                    <span>
                      <strong>Mail</strong>
                      <br />
                      CEA, PO Box 1234, Chico, CA 95927
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-xl border border-saddle-200 bg-saddle-50 p-6 text-[15px] leading-relaxed">
                <p>
                  <strong>Trail emergency?</strong> Call 911 first, then give dispatch the nearest
                  junction marker number. Non-emergency hazards (downed trees, washouts) belong in{" "}
                  <a href="/trail-conditions" className="font-bold text-forest-700 underline">
                    Trail Conditions
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={60}>
            <div className="rounded-xl border border-sand bg-white p-6 sm:p-8">
              <h2 className="display-serif text-2xl font-semibold">Send a message</h2>
              <ActionForm action={contactAction} submitLabel="Send message" className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" required>
                    <input name="name" required autoComplete="name" className={fieldCls} placeholder="Your name" />
                  </Field>
                  <Field label="Email" required>
                    <input name="email" type="email" required autoComplete="email" className={fieldCls} placeholder="you@example.com" />
                  </Field>
                </div>
                <Field label="Topic">
                  <select name="topic" className={fieldCls} defaultValue="General">
                    <option>General</option>
                    <option>Membership</option>
                    <option>Events</option>
                    <option>Trail issue</option>
                    <option>Directory</option>
                    <option>Media</option>
                    <option>Volunteering</option>
                  </select>
                </Field>
                <Field label="Message" required>
                  <textarea name="message" required rows={5} className={fieldCls} placeholder="How can we help?" />
                </Field>
              </ActionForm>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
