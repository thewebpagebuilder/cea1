import Link from "next/link";
import { Reveal, ActionForm, Field, fieldCls } from "@/components/primitives";
import { loginAction } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  const session = await getSession().catch(() => null);
  if (session) {
    redirect(session.role === "admin" || session.role === "volunteer" ? "/admin" : "/dashboard");
  }
  return (
    <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <Reveal>
        <div className="rounded-2xl border border-sand bg-white p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-700">
            Welcome back
          </p>
          <h1 className="display-serif mt-1 text-3xl font-semibold">Log in</h1>
          <p className="mt-2 text-[15px] text-stone-warm">
            Riders, business owners, volunteers, and admins all sign in here.
          </p>
          <ActionForm action={loginAction} submitLabel="Log in" className="mt-6 grid gap-4">
            <Field label="Email" required>
              <input name="email" type="email" required autoComplete="email" className={fieldCls} placeholder="you@example.com" />
            </Field>
            <Field label="Password" required>
              <input name="password" type="password" required autoComplete="current-password" className={fieldCls} placeholder="••••••••" />
            </Field>
          </ActionForm>
          <p className="mt-6 border-t border-sand pt-5 text-center text-sm text-stone-warm">
            New to CEA?{" "}
            <Link href="/register" className="font-bold text-forest-700 underline">
              Create a free account
            </Link>
          </p>
          <p className="mt-3 rounded-lg bg-parchment p-3 text-[13px] leading-relaxed text-stone-warm">
            Demo: after seeding, use <strong>admin@cea.local / admin1234</strong> for the admin
            tour, or register a fresh rider account.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
