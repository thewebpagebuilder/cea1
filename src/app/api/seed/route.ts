import { db } from "@/db";
import {
  users,
  trails,
  trailReports,
  events,
  newsPosts,
  businesses,
  resources,
} from "@/db/schema";
import {
  SEED_TRAILS,
  SEED_BUSINESSES,
  SEED_EVENTS,
  SEED_NEWS,
  SEED_RESOURCES,
  SEED_REPORTS,
} from "@/lib/seed-data";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const existing = await db.select().from(trails);
    if (existing.length > 0) {
      return Response.json({ ok: true, seeded: false, message: "Already seeded." });
    }

    // Users: admin + volunteer + sample rider
    const adminHash = await hashPassword("admin1234");
    const [admin, volunteer, rider] = await db
      .insert(users)
      .values([
        {
          name: "CEA Admin",
          email: "admin@cea.local",
          passwordHash: adminHash,
          role: "admin",
          isActiveMember: true,
        },
        {
          name: "Robin Volunteer",
          email: "volunteer@cea.local",
          passwordHash: await hashPassword("volunteer1234"),
          role: "volunteer",
          isActiveMember: true,
        },
        {
          name: "Jordan Rider",
          email: "rider@cea.local",
          passwordHash: await hashPassword("rider1234"),
          role: "rider",
          isActiveMember: true,
        },
      ])
      .returning();

    // Trails
    const insertedTrails = await db.insert(trails).values(SEED_TRAILS).returning();
    const bySlug = new Map(insertedTrails.map((t) => [t.slug, t]));

    // Reports
    for (const r of SEED_REPORTS) {
      const trail = bySlug.get(r.trailSlug);
      await db.insert(trailReports).values({
        trailId: trail?.id ?? null,
        reporterId: rider.id,
        reporterName: r.reporterName,
        condition: r.condition,
        hazardType: r.hazardType || null,
        description: r.description,
        locationDetail: r.locationDetail,
        status: r.status,
      });
    }
    // One pending report for the admin demo
    const yahi = bySlug.get("yahi-trail");
    await db.insert(trailReports).values({
      trailId: yahi?.id ?? null,
      reporterId: null,
      reporterName: "Casey R. (guest)",
      condition: "fair",
      hazardType: null,
      description:
        "Five-Mile crossing running higher than yesterday after the overnight rain — knee-deep on my 15h mare. Still passable but walk it.",
      locationDetail: "Five-Mile crossing",
      status: "pending",
    });

    // Events / news / businesses / resources
    await db.insert(events).values(SEED_EVENTS);
    await db.insert(newsPosts).values(SEED_NEWS);
    await db.insert(businesses).values(
      SEED_BUSINESSES.map((b) => ({ ...b, ownerId: null }))
    );
    // One pending business for the admin demo
    await db.insert(businesses).values({
      slug: "meadowlark-tack-repair",
      name: "Meadowlark Tack Repair",
      category: "Tack & Feed",
      description:
        "Leather cleaning, restitching, and zipper replacement. Drop-off in Chico, 1-week turnaround.",
      phone: "(530) 555-0155",
      email: "hello@meadowlark.example",
      website: "",
      address: "Chico, CA",
      city: "Chico, CA",
      isMember: false,
      isFeatured: false,
      status: "pending",
      ownerId: null,
      services: ["Leather repair", "Cleaning"],
    });
    await db.insert(resources).values(SEED_RESOURCES);

    return Response.json({
      ok: true,
      seeded: true,
      admin: admin.email,
      volunteer: volunteer.email,
      message: "Seeded. Admin login: admin@cea.local / admin1234",
    });
  } catch (e) {
    console.error(e);
    return Response.json(
      { ok: false, message: e instanceof Error ? e.message : "Seed failed" },
      { status: 500 }
    );
  }
}
