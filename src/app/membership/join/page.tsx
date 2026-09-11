import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal, ActionForm, Field, fieldCls } from "@/components/primitives";
import { membershipAction } from "@/lib/actions";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join CEA",
  description: "Become a member of the Chico Equestrian Association. Individual, family, business, youth, lifetime.",
};

const TYPES = [
  { value: "Individual", label: "Individual — $35/yr" },
  { value: "Family", label: "Family — $50/yr" },
  { value: "Business", label: "Business — $75/yr (includes directory listing)" },
  { value: "Youth", label: "Youth (8–17) — $15/yr" },
  { value: "Lifetime", label: "Lifetime — $500 once" },
];

export default async function JoinPage() {
  const session = await getSession().catch(() => null);
  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saddle-200 hover:text-cream hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Membership plans
          </Link>
          <h1 className="display-serif mt-3 text-4xl font-semibold">Join CEA</h1>
          <p className="mt-3 text-lg text-cream/85">
            Two minutes, no payment today — we&apos;ll email dues instructions, or you can pay at
            any meeting or ride.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="rounded-xl border border-sand bg-white p-6 sm:p-8">
            <ActionForm action={membershipAction} submitLabel="Submit membership application" className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    name="fullName"
                    required
                    defaultValue={session?.name ?? ""}
                    autoComplete="name"
                    className={fieldCls}
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={session?.email ?? ""}
                    autoComplete="email"
                    className={fieldCls}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              <Field label="Membership type" required hint="Business membership includes a directory listing — submit it after joining.">
                <select name="type" className={fieldCls} defaultValue="Individual">
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="rounded-lg bg-parchment p-4 text-sm leading-relaxed text-ink">
                <p>
                  <strong>What happens next:</strong> a volunteer confirms your application within a
                  few days, then emails payment options (check, cash at meetings, or card link).
                  Your member benefits start immediately — no need to wait.
                </p>
              </div>
            </ActionForm>
            {!session && (
              <p className="mt-5 border-t border-sand pt-5 text-sm text-stone-warm">
                Tip:{" "}
                <Link href="/register" className="font-bold text-forest-700 underline">
                  create a free rider account
                </Link>{" "}
                first to track RSVPs and reports — or just apply as a guest above.
              </p>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
