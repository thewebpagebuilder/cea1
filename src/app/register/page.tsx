import Link from "next/link";
import { Reveal, ActionForm, Field, fieldCls } from "@/components/primitives";
import { registerAction } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  const session = await getSession().catch(() => null);
  if (session) redirect("/dashboard");
  return (
    <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <Reveal>
        <div className="rounded-2xl border border-sand bg-white p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-700">
            Free forever
          </p>
          <h1 className="display-serif mt-1 text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-[15px] text-stone-warm">
            One-click RSVPs, trail reports with your name on them, and a dashboard that tracks it
            all.
          </p>
          <ActionForm action={registerAction} submitLabel="Create account" className="mt-6 grid gap-4">
            <Field label="Full name" required>
              <input name="name" required autoComplete="name" className={fieldCls} placeholder="Your name" />
            </Field>
            <Field label="Email" required>
              <input name="email" type="email" required autoComplete="email" className={fieldCls} placeholder="you@example.com" />
            </Field>
            <Field label="Password" required hint="At least 8 characters.">
              <input name="password" type="password" required minLength={8} autoComplete="new-password" className={fieldCls} placeholder="Choose a password" />
            </Field>
            <Field label="I am a…">
              <select name="role" className={fieldCls} defaultValue="rider">
                <option value="rider">Rider / member</option>
                <option value="business_owner">Business owner (directory listing)</option>
              </select>
            </Field>
          </ActionForm>
          <p className="mt-6 border-t border-sand pt-5 text-center text-sm text-stone-warm">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-forest-700 underline">
              Log in
            </Link>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
