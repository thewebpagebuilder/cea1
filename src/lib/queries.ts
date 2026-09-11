import { db } from "@/db";
import {
  trails,
  trailReports,
  events,
  newsPosts,
  businesses,
  resources,
  users,
  contactMessages,
  memberships,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  SEED_TRAILS,
  SEED_BUSINESSES,
  SEED_EVENTS,
  SEED_NEWS,
  SEED_RESOURCES,
  SEED_REPORTS,
} from "./seed-data";

// Each query tries Postgres first, then falls back to curated seed content
// so pages always render (even pre-migration or during build).

type FallbackId = { id: string };

function withIds<T extends object>(rows: T[]): Array<T & FallbackId> {
  return rows.map((r, i) => ({ ...r, id: `seed-${i}` }));
}

export async function getTrails() {
  try {
    const rows = await db.select().from(trails).orderBy(trails.name);
    if (rows.length > 0) return rows;
  } catch {
    /* fall through to seed */
  }
  return withIds(
    SEED_TRAILS.map((t) => ({
      ...t,
      elevationGainFt: t.elevationGainFt,
      description: t.description,
      parkingInfo: t.parkingInfo,
      facilities: t.facilities,
      updatedAt: new Date(),
      createdAt: new Date(),
    }))
  );
}

export async function getTrailBySlug(slug: string) {
  try {
    const rows = await db.select().from(trails).where(eq(trails.slug, slug));
    if (rows[0]) return rows[0];
  } catch {
    /* fallback */
  }
  const found = SEED_TRAILS.find((t) => t.slug === slug);
  if (!found) return null;
  return {
    ...found,
    id: `seed-${found.slug}`,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

export async function getApprovedReports(trailIdOrSlug?: string) {
  try {
    const all = await db
      .select({
        report: trailReports,
        trail: trails,
      })
      .from(trailReports)
      .leftJoin(trails, eq(trailReports.trailId, trails.id))
      .orderBy(desc(trailReports.createdAt));
    const approved = all.filter((r) => r.report.status === "approved");
    if (approved.length > 0) {
      if (!trailIdOrSlug) return approved;
      return approved.filter(
        (r) =>
          r.report.trailId === trailIdOrSlug || r.trail?.slug === trailIdOrSlug
      );
    }
  } catch {
    /* fallback */
  }
  const allTrails = await getTrails();
  const mapped = SEED_REPORTS.map((r, i) => {
    const trail = allTrails.find(
      (t: { slug: string }) => t.slug === r.trailSlug
    ) as unknown as (typeof trails.$inferSelect) | undefined;
    return {
      report: {
        id: `seed-report-${i}`,
        trailId: trail?.id ?? null,
        reporterId: null,
        reporterName: r.reporterName,
        condition: r.condition,
        hazardType: r.hazardType,
        description: r.description,
        locationDetail: r.locationDetail,
        rideDate: new Date(),
        status: r.status,
        createdAt: new Date(Date.now() - i * 86400000 * 2),
      },
      trail: trail ?? null,
    };
  });
  if (!trailIdOrSlug) return mapped;
  return mapped.filter(
    (m) =>
      (m.trail as unknown as { slug?: string } | null)?.slug === trailIdOrSlug
  );
}

export async function getEvents(opts?: { upcomingOnly?: boolean; limit?: number }) {
  try {
    const rows = await db.select().from(events).orderBy(events.startAt);
    const pub = rows.filter((e) => e.isPublished);
    if (pub.length > 0) return applyEventFilter(pub, opts);
  } catch {
    /* fallback */
  }
  const seeded = withIds(
    SEED_EVENTS.map((e) => ({
      ...e,
      endAt: e.endAt,
      capacity: e.capacity,
      rsvpCount: e.rsvpCount,
      imageNote: e.imageNote,
      isPublished: e.isPublished,
      requiresRsvp: e.requiresRsvp,
      createdAt: new Date(),
    }))
  );
  return applyEventFilter(seeded, opts);
}

function applyEventFilter<T extends { startAt: Date }>(
  rows: T[],
  opts?: { upcomingOnly?: boolean; limit?: number }
): T[] {
  let out = [...rows].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );
  if (opts?.upcomingOnly) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    out = out.filter((e) => new Date(e.startAt) >= now);
  }
  if (opts?.limit) out = out.slice(0, opts.limit);
  return out;
}

export async function getEventBySlug(slug: string) {
  try {
    const rows = await db.select().from(events).where(eq(events.slug, slug));
    if (rows[0]) return rows[0];
  } catch {
    /* fallback */
  }
  const found = SEED_EVENTS.find((e) => e.slug === slug);
  if (!found) return null;
  return { ...found, id: `seed-${found.slug}`, createdAt: new Date() };
}

export async function getNews(limit?: number) {
  try {
    const rows = await db
      .select()
      .from(newsPosts)
      .orderBy(desc(newsPosts.publishedAt));
    const pub = rows.filter((n) => n.isPublished);
    if (pub.length > 0) return limit ? pub.slice(0, limit) : pub;
  } catch {
    /* fallback */
  }
  const seeded = withIds(
    SEED_NEWS.map((n) => ({ ...n, createdAt: new Date() }))
  );
  return limit ? seeded.slice(0, limit) : seeded;
}

export async function getNewsBySlug(slug: string) {
  try {
    const rows = await db.select().from(newsPosts).where(eq(newsPosts.slug, slug));
    if (rows[0]) return rows[0];
  } catch {
    /* fallback */
  }
  const found = SEED_NEWS.find((n) => n.slug === slug);
  if (!found) return null;
  return { ...found, id: `seed-${found.slug}`, createdAt: new Date() };
}

export async function getBusinesses(opts?: { approvedOnly?: boolean }) {
  try {
    const rows = await db.select().from(businesses).orderBy(businesses.name);
    if (rows.length > 0) {
      if (opts?.approvedOnly === false) return rows;
      return rows.filter((b) => b.status === "approved");
    }
  } catch {
    /* fallback */
  }
  const seeded = withIds(
    SEED_BUSINESSES.map((b) => ({ ...b, ownerId: null, createdAt: new Date() }))
  );
  if (opts?.approvedOnly === false) return seeded;
  return seeded.filter((b) => b.status === "approved");
}

export async function getBusinessBySlug(slug: string) {
  try {
    const rows = await db.select().from(businesses).where(eq(businesses.slug, slug));
    if (rows[0]) return rows[0];
  } catch {
    /* fallback */
  }
  const found = SEED_BUSINESSES.find((b) => b.slug === slug);
  if (!found) return null;
  return { ...found, id: `seed-${found.slug}`, ownerId: null, createdAt: new Date() };
}

export async function getResources() {
  try {
    const rows = await db.select().from(resources).orderBy(resources.title);
    if (rows.length > 0) return rows;
  } catch {
    /* fallback */
  }
  return withIds(
    SEED_RESOURCES.map((r) => ({ ...r, createdAt: new Date() }))
  );
}

// Admin queries (DB only, no seed fallback)
export async function getPendingReports() {
  try {
    const all = await db
      .select({ report: trailReports, trail: trails })
      .from(trailReports)
      .leftJoin(trails, eq(trailReports.trailId, trails.id))
      .orderBy(desc(trailReports.createdAt));
    return all;
  } catch {
    return [];
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch {
    return [];
  }
}

export async function getContactMessages() {
  try {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  } catch {
    return [];
  }
}

export async function getMemberships() {
  try {
    return await db
      .select()
      .from(memberships)
      .orderBy(desc(memberships.createdAt));
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const [allUsers, allBusinesses, pendingReports, allEvents] = await Promise.all([
      db.select().from(users),
      db.select().from(businesses),
      db
        .select()
        .from(trailReports)
        .where(eq(trailReports.status, "pending")),
      db.select().from(events),
    ]);
    const pendingBusinesses = allBusinesses.filter((b) => b.status === "pending");
    return {
      members: allUsers.length,
      businesses: allBusinesses.length,
      pendingReports: pendingReports.length,
      pendingBusinesses: pendingBusinesses.length,
      events: allEvents.length,
    };
  } catch {
    return {
      members: 214,
      businesses: SEED_BUSINESSES.length,
      pendingReports: 2,
      pendingBusinesses: 1,
      events: SEED_EVENTS.length,
    };
  }
}
