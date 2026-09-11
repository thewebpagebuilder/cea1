import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Flag,
  Store,
  CalendarPlus,
  Newspaper,
  FolderPlus,
  Map as MapIcon,
  Users,
  Inbox,
  BadgeCheck,
  LayoutDashboard,
} from "lucide-react";
import { Reveal } from "@/components/primitives";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import {
  getPendingReports,
  getDashboardStats,
  getAllUsers,
  getContactMessages,
  getMemberships,
  getTrails,
  getBusinesses,
  getEvents,
} from "@/lib/queries";
import {
  moderateReportFormAction,
  moderateBusinessFormAction,
  updateTrailStatusFormAction,
  updateUserRoleFormAction,
  createEventAction,
  createNewsAction,
  createResourceAction,
} from "@/lib/actions";
import { ActionForm, Field, fieldCls, ConditionDot } from "@/components/primitives";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Volunteer Admin" };

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "reports", label: "Trail reports" },
  { id: "businesses", label: "Businesses" },
  { id: "events", label: "Events" },
  { id: "news", label: "News" },
  { id: "trails", label: "Trail status" },
  { id: "memberships", label: "Memberships" },
  { id: "messages", label: "Inbox" },
  { id: "users", label: "Users" },
];

export default async function AdminPage() {
  const session = await getSession().catch(() => null);
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "admin" && session.role !== "volunteer") redirect("/dashboard");
  const isAdmin = session.role === "admin";

  const [stats, reportRows, trails, businesses, events, users, messages, memberships] =
    await Promise.all([
      getDashboardStats(),
      getPendingReports(),
      getTrails(),
      getBusinesses({ approvedOnly: false }),
      getEvents({ upcomingOnly: false }),
      getAllUsers(),
      getContactMessages(),
      getMemberships(),
    ]);

  const pendingReports = reportRows.filter((r) => (r.report as { status: string }).status === "pending");
  const pendingBiz = businesses.filter((b) => (b as { status: string }).status === "pending");

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saddle-200">
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
            {ROLE_LABELS[session.role]} · {session.name}
          </p>
          <h1 className="display-serif mt-3 text-4xl font-semibold">Volunteer admin</h1>
          <p className="mt-2 max-w-2xl text-cream/85">
            No code, no training course. Review reports, approve listings, and publish content —
            everything saves instantly to CEA&apos;s own database.
          </p>
        </div>
      </section>

      {/* Sticky section nav */}
      <nav
        aria-label="Admin sections"
        className="sticky top-[68px] z-40 border-b border-sand bg-cream/95 backdrop-blur-sm"
      >
        <div className="nice-scroll mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-ink hover:bg-parchment hover:text-forest-800"
            >
              {s.label}
              {s.id === "reports" && pendingReports.length > 0 && (
                <span className="ml-1.5 rounded-full bg-red-700 px-1.5 py-0.5 text-[11px] text-white">
                  {pendingReports.length}
                </span>
              )}
              {s.id === "businesses" && pendingBiz.length > 0 && (
                <span className="ml-1.5 rounded-full bg-red-700 px-1.5 py-0.5 text-[11px] text-white">
                  {pendingBiz.length}
                </span>
              )}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
        {/* OVERVIEW */}
        <section id="overview" aria-label="Overview" className="scroll-mt-32">
          <Reveal>
            <h2 className="display-serif text-2xl font-semibold">At a glance</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
              {[
                { k: String(stats.members), v: "Accounts", href: "#users" },
                { k: String(pendingReports.length), v: "Reports to review", href: "#reports" },
                { k: String(pendingBiz.length), v: "Listings to review", href: "#businesses" },
                { k: String(events.length), v: "Events", href: "#events" },
                { k: String(stats.businesses), v: "Businesses live", href: "#businesses" },
              ].map((s) => (
                <a
                  key={s.v}
                  href={s.href}
                  className="rounded-xl border border-sand bg-white p-4 transition-colors hover:border-forest-600"
                >
                  <span className="display-serif text-3xl font-semibold text-forest-800">{s.k}</span>
                  <span className="block text-sm text-stone-warm">{s.v}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </section>

        {/* REPORTS */}
        <section id="reports" aria-label="Trail report moderation" className="scroll-mt-32">
          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Flag className="h-5 w-5 text-forest-700" aria-hidden="true" />
              Trail reports — {pendingReports.length} pending
            </h2>
            <p className="mt-1 text-[15px] text-stone-warm">
              Approve honest, specific reports. Reject spam or duplicates. Approved reports appear
              instantly on the trail and conditions pages.
            </p>
          </Reveal>
          <ul className="mt-4 space-y-3">
            {reportRows.slice(0, 12).map((r) => {
              const rep = r.report as unknown as {
                id: string;
                reporterName: string;
                condition: string;
                hazardType: string | null;
                description: string;
                locationDetail: string | null;
                status: string;
                createdAt: Date;
              };
              const trail = r.trail as unknown as { name: string } | null;
              return (
                <li
                  key={rep.id}
                  className={`rounded-xl border bg-white p-5 ${
                    rep.status === "pending" ? "border-gold/60 ring-1 ring-gold/30" : "border-sand"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <ConditionDot status={rep.condition} />
                    <strong className="capitalize">{rep.condition}</strong>
                    <span className="text-stone-warm">· {trail?.name ?? "—"}</span>
                    {rep.hazardType && (
                      <span className="rounded bg-red-700 px-1.5 py-0.5 text-xs font-bold text-white">
                        {rep.hazardType}
                      </span>
                    )}
                    <span
                      className={`ml-auto rounded px-2 py-0.5 text-xs font-bold uppercase ${
                        rep.status === "pending"
                          ? "bg-amber-100 text-amber-900"
                          : rep.status === "approved"
                            ? "bg-forest-50 text-forest-800"
                            : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px]">{rep.description}</p>
                  <p className="mt-1 text-[13px] text-stone-warm">
                    {rep.locationDetail && <>📍 {rep.locationDetail} · </>}— {rep.reporterName} ·{" "}
                    {formatDate(rep.createdAt)}
                  </p>
                  {rep.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <form action={moderateReportFormAction}>
                        <input type="hidden" name="id" value={rep.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button
                          type="submit"
                          className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-bold text-cream hover:bg-forest-900"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={moderateReportFormAction}>
                        <input type="hidden" name="id" value={rep.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button
                          type="submit"
                          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-100"
                        >
                          Reject
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              );
            })}
            {reportRows.length === 0 && (
              <li className="rounded-xl border border-dashed border-sand bg-parchment/60 p-6 text-center text-stone-warm">
                No reports in the database yet — seed data will appear here after the first sync.
              </li>
            )}
          </ul>
        </section>

        {/* BUSINESSES */}
        <section id="businesses" aria-label="Business moderation" className="scroll-mt-32">
          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Store className="h-5 w-5 text-forest-700" aria-hidden="true" />
              Business listings — {pendingBiz.length} pending
            </h2>
            <p className="mt-1 text-[15px] text-stone-warm">
              Verify the business is real and local before approving. &ldquo;Approve + feature&rdquo;
              rotates it onto the homepage.
            </p>
          </Reveal>
          <ul className="mt-4 space-y-3">
            {businesses.slice(0, 14).map((b) => {
              const biz = b as unknown as {
                id: string;
                slug: string;
                name: string;
                category: string;
                description: string;
                phone: string | null;
                status: string;
                isFeatured: boolean | null;
              };
              return (
                <li
                  key={biz.id}
                  className={`rounded-xl border bg-white p-5 ${
                    biz.status === "pending" ? "border-gold/60 ring-1 ring-gold/30" : "border-sand"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{biz.name}</strong>
                    <span className="rounded bg-saddle-100 px-2 py-0.5 text-xs font-bold text-saddle-800">
                      {biz.category}
                    </span>
                    {biz.isFeatured && (
                      <span className="text-xs font-bold text-gold">★ Featured</span>
                    )}
                    <span className="ml-auto rounded bg-parchment px-2 py-0.5 text-xs font-bold uppercase">
                      {biz.status}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-stone-warm">{biz.description}</p>
                  {biz.phone && <p className="mt-1 text-sm font-semibold">{biz.phone}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {biz.status !== "approved" && (
                      <>
                        <form action={moderateBusinessFormAction}>
                          <input type="hidden" name="id" value={biz.id} />
                          <input type="hidden" name="status" value="approved" />
                          <button type="submit" className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-bold text-cream hover:bg-forest-900">
                            Approve
                          </button>
                        </form>
                        <form action={moderateBusinessFormAction}>
                          <input type="hidden" name="id" value={biz.id} />
                          <input type="hidden" name="status" value="approved" />
                          <input type="hidden" name="featured" value="true" />
                          <button type="submit" className="rounded-lg bg-saddle-700 px-4 py-2 text-sm font-bold text-cream hover:bg-saddle-800">
                            Approve + feature
                          </button>
                        </form>
                        <form action={moderateBusinessFormAction}>
                          <input type="hidden" name="id" value={biz.id} />
                          <input type="hidden" name="status" value="rejected" />
                          <button type="submit" className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-100">
                            Reject
                          </button>
                        </form>
                      </>
                    )}
                    <Link
                      href={`/directory/${biz.slug}`}
                      className="rounded-lg border border-sand px-4 py-2 text-sm font-bold text-forest-700 hover:bg-forest-50"
                    >
                      View live
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* EVENTS + NEWS + RESOURCES */}
        <section id="events" aria-label="Publish events" className="scroll-mt-32">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-xl border border-sand bg-white p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <CalendarPlus className="h-5 w-5 text-forest-700" aria-hidden="true" />
                  Publish an event
                </h2>
                <ActionForm action={createEventAction} submitLabel="Publish event" className="mt-4 grid gap-3">
                  <Field label="Title" required>
                    <input name="title" required className={fieldCls} placeholder="e.g., Sunset Social Ride" />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Type">
                      <select name="eventType" className={fieldCls} defaultValue="Ride">
                        {["Ride", "Clinic", "Volunteer", "Meeting", "Social", "Show"].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Start date & time" required>
                      <input name="startAt" type="datetime-local" required className={fieldCls} />
                    </Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Location" required>
                      <input name="location" required className={fieldCls} placeholder="Trailhead or venue" />
                    </Field>
                    <Field label="Cost">
                      <input name="cost" defaultValue="Free for members" className={fieldCls} />
                    </Field>
                  </div>
                  <Field label="Description" required>
                    <textarea name="description" required rows={3} className={fieldCls} placeholder="What, who it's for, what to bring…" />
                  </Field>
                </ActionForm>
              </div>
            </Reveal>
            <div id="news" className="scroll-mt-32">
              <Reveal delay={60}>
                <div className="rounded-xl border border-sand bg-white p-6">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Newspaper className="h-5 w-5 text-forest-700" aria-hidden="true" />
                    Publish a news post
                  </h2>
                  <ActionForm action={createNewsAction} submitLabel="Publish post" className="mt-4 grid gap-3">
                    <Field label="Title" required>
                      <input name="title" required className={fieldCls} placeholder="Post headline" />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Category">
                        <select name="category" className={fieldCls} defaultValue="Club News">
                          {["Club News", "Trail Work", "Park Access", "Scholarships", "Riding Tips", "Events"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Excerpt" required>
                        <input name="excerpt" required className={fieldCls} placeholder="One-sentence summary" />
                      </Field>
                    </div>
                    <Field label="Body" required hint="Blank line between paragraphs.">
                      <textarea name="body" required rows={4} className={fieldCls} placeholder="Full story…" />
                    </Field>
                  </ActionForm>
                  <h3 className="mt-6 flex items-center gap-2 font-bold">
                    <FolderPlus className="h-4 w-4 text-forest-700" aria-hidden="true" />
                    Add a resource
                  </h3>
                  <ActionForm action={createResourceAction} submitLabel="Add resource" className="mt-3 grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title" required>
                        <input name="title" required className={fieldCls} placeholder="e.g., Spring ride waiver" />
                      </Field>
                      <Field label="Category">
                        <select name="category" className={fieldCls} defaultValue="Guide">
                          {["Trail Map", "Guide", "Form", "Safety", "Governance"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <Field label="Description" required>
                      <input name="description" required className={fieldCls} placeholder="What is this file?" />
                    </Field>
                  </ActionForm>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* TRAIL STATUS */}
        <section id="trails" aria-label="Trail status controls" className="scroll-mt-32">
          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <MapIcon className="h-5 w-5 text-forest-700" aria-hidden="true" />
              Trail open / caution / closed
            </h2>
            <p className="mt-1 text-[15px] text-stone-warm">
              One click updates the map, trail cards, and homepage stat instantly.
            </p>
          </Reveal>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {trails.map((t) => {
              const trail = t as unknown as { id: string; slug: string; name: string; status: string };
              const isSeed = trail.id.startsWith("seed-");
              return (
                <div key={trail.slug} className="flex flex-wrap items-center gap-3 rounded-xl border border-sand bg-white p-4">
                  <span className="flex items-center gap-2 font-bold">
                    <ConditionDot status={trail.status} />
                    {trail.name}
                  </span>
                  {isSeed ? (
                    <span className="ml-auto text-[13px] text-stone-warm">
                      Sync database to enable status control
                    </span>
                  ) : (
                    <form action={updateTrailStatusFormAction} className="ml-auto flex gap-1.5">
                      <input type="hidden" name="id" value={trail.id} />
                      {(["open", "caution", "closed"] as const).map((s) => (
                        <button
                          key={s}
                          type="submit"
                          name="status"
                          value={s}
                          aria-pressed={trail.status === s}
                          className={`rounded-lg px-3 py-1.5 text-[13px] font-bold capitalize ${
                            trail.status === s
                              ? "bg-forest-800 text-cream"
                              : "border border-sand text-stone-warm hover:bg-parchment"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* MEMBERSHIPS */}
        <section id="memberships" aria-label="Membership applications" className="scroll-mt-32">
          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BadgeCheck className="h-5 w-5 text-forest-700" aria-hidden="true" />
              Membership applications ({memberships.length})
            </h2>
          </Reveal>
          <div className="nice-scroll mt-4 overflow-x-auto rounded-xl border border-sand bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-sand bg-parchment/60 text-[13px] uppercase tracking-wider text-stone-warm">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                </tr>
              </thead>
              <tbody>
                {memberships.slice(0, 20).map((m) => (
                  <tr key={m.id} className="border-b border-sand last:border-0">
                    <td className="px-4 py-2.5 font-semibold">
                      {m.fullName}
                      <span className="block text-[13px] font-normal text-stone-warm">{m.email}</span>
                    </td>
                    <td className="px-4 py-2.5">{m.type}</td>
                    <td className="px-4 py-2.5 capitalize">{m.status}</td>
                    <td className="px-4 py-2.5 text-stone-warm">{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
                {memberships.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-stone-warm">
                      No applications yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* INBOX */}
        <section id="messages" aria-label="Contact inbox" className="scroll-mt-32">
          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Inbox className="h-5 w-5 text-forest-700" aria-hidden="true" />
              Inbox ({messages.length})
            </h2>
          </Reveal>
          <ul className="mt-4 space-y-2.5">
            {messages.slice(0, 10).map((m) => (
              <li key={m.id} className="rounded-xl border border-sand bg-white p-4">
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  <strong>{m.name}</strong>
                  <span className="text-stone-warm">{m.email}</span>
                  <span className="rounded bg-parchment px-2 py-0.5 text-xs font-bold">{m.topic}</span>
                  <span className="ml-auto text-[13px] text-stone-warm">{formatDateTime(m.createdAt)}</span>
                </p>
                <p className="mt-1.5 text-[15px]">{m.message}</p>
              </li>
            ))}
            {messages.length === 0 && (
              <li className="rounded-xl border border-dashed border-sand bg-parchment/60 p-6 text-center text-stone-warm">
                Inbox zero. Enjoy it while it lasts.
              </li>
            )}
          </ul>
        </section>

        {/* USERS */}
        <section id="users" aria-label="User management" className="scroll-mt-32">
          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Users className="h-5 w-5 text-forest-700" aria-hidden="true" />
              Users ({users.length}){!isAdmin && " — admins only can change roles"}
            </h2>
          </Reveal>
          <div className="nice-scroll mt-4 overflow-x-auto rounded-xl border border-sand bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-sand bg-parchment/60 text-[13px] uppercase tracking-wider text-stone-warm">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  {isAdmin && <th className="px-4 py-3">Change role</th>}
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 30).map((u) => (
                  <tr key={u.id} className="border-b border-sand last:border-0">
                    <td className="px-4 py-2.5 font-semibold">
                      {u.name}
                      <span className="block text-[13px] font-normal text-stone-warm">{u.email}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-forest-50 px-2 py-0.5 text-xs font-bold text-forest-800">
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-stone-warm">{formatDate(u.createdAt)}</td>
                    {isAdmin && (
                      <td className="px-4 py-2.5">
                        <form action={updateUserRoleFormAction} className="flex gap-1.5">
                          <input type="hidden" name="id" value={u.id} />
                          <select name="role" defaultValue={u.role} className="rounded-lg border border-sand bg-cream px-2 py-1.5 text-[13px]" aria-label={`Role for ${u.name}`}>
                            <option value="rider">Rider</option>
                            <option value="business_owner">Business owner</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button type="submit" className="rounded-lg bg-forest-800 px-3 py-1.5 text-[13px] font-bold text-cream">
                            Save
                          </button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-stone-warm">
                      No users yet — register the first admin via /register, then promote in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
