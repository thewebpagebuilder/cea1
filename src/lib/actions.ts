"use server";

import { db } from "@/db";
import {
  users,
  events,
  eventRsvps,
  trailReports,
  businesses,
  contactMessages,
  memberships,
  newsPosts,
  resources,
  trails,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  canModerate,
  isAdmin,
} from "./auth";
import { slugify } from "./utils";

type ActionResult = { ok: boolean; message: string; redirect?: string };

// ---------- Auth ----------

export async function registerAction(form: FormData): Promise<ActionResult> {
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const roleRaw = String(form.get("role") || "rider");
  const role =
    roleRaw === "business_owner" ? "business_owner" : ("rider" as const);

  if (!name || !email || !password)
    return { ok: false, message: "Name, email, and password are required." };
  if (password.length < 8)
    return { ok: false, message: "Password must be at least 8 characters." };

  try {
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing[0])
      return { ok: false, message: "An account with that email already exists." };

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash, role })
      .returning();
    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActiveMember: user.isActiveMember ?? false,
    });
    await setSessionCookie(token);
    return { ok: true, message: "Welcome to CEA!", redirect: "/dashboard" };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Could not create account. Please try again." };
  }
}

export async function loginAction(form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  if (!email || !password)
    return { ok: false, message: "Email and password are required." };
  try {
    const rows = await db.select().from(users).where(eq(users.email, email));
    const user = rows[0];
    if (!user) return { ok: false, message: "Invalid email or password." };
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return { ok: false, message: "Invalid email or password." };
    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActiveMember: user.isActiveMember ?? false,
    });
    await setSessionCookie(token);
    const dest = user.role === "admin" || user.role === "volunteer" ? "/admin" : "/dashboard";
    return { ok: true, message: `Welcome back, ${user.name.split(" ")[0]}!`, redirect: dest };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Login failed. Please try again." };
  }
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
}

// ---------- Events ----------

export async function rsvpAction(form: FormData): Promise<ActionResult> {
  const eventId = String(form.get("eventId") || "");
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const guests = Number(form.get("guests") || 0);
  if (!eventId || !name || !email)
    return { ok: false, message: "Name and email are required to RSVP." };
  try {
    const session = await getSession();
    await db.insert(eventRsvps).values({
      eventId,
      userId: session?.id ?? null,
      name,
      email,
      guests: Number.isFinite(guests) ? guests : 0,
    });
    await db
      .update(events)
      .set({ rsvpCount: sql`${events.rsvpCount} + 1` })
      .where(eq(events.id, eventId));
    revalidatePath("/events");
    return { ok: true, message: "You're on the list! See you on the trail." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "RSVP failed. Please try again or email us." };
  }
}

// ---------- Trail reports ----------

export async function submitReportAction(form: FormData): Promise<ActionResult> {
  const trailId = String(form.get("trailId") || "") || null;
  const reporterName = String(form.get("reporterName") || "").trim();
  const condition = String(form.get("condition") || "good");
  const hazardType = String(form.get("hazardType") || "").trim();
  const description = String(form.get("description") || "").trim();
  const locationDetail = String(form.get("locationDetail") || "").trim();
  if (!reporterName || !description)
    return { ok: false, message: "Your name and a description are required." };
  try {
    const session = await getSession();
    await db.insert(trailReports).values({
      trailId,
      reporterId: session?.id ?? null,
      reporterName,
      condition,
      hazardType: hazardType || null,
      description,
      locationDetail: locationDetail || null,
      status: "pending",
    });
    revalidatePath("/trail-conditions");
    revalidatePath("/trails");
    return {
      ok: true,
      message:
        "Thank you! Your report is pending volunteer review and will appear shortly.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Could not submit report. Please try again." };
  }
}

export async function moderateReportAction(
  id: string,
  status: "approved" | "rejected"
): Promise<ActionResult> {
  const session = await getSession();
  if (!canModerate(session?.role))
    return { ok: false, message: "Not authorized." };
  try {
    await db.update(trailReports).set({ status }).where(eq(trailReports.id, id));
    revalidatePath("/admin");
    revalidatePath("/trail-conditions");
    revalidatePath("/trails");
    return { ok: true, message: `Report ${status}.` };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Moderation failed." };
  }
}

// ---------- Businesses ----------

export async function submitBusinessAction(form: FormData): Promise<ActionResult> {
  const name = String(form.get("name") || "").trim();
  const category = String(form.get("category") || "Boarding");
  const description = String(form.get("description") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim();
  const website = String(form.get("website") || "").trim();
  const address = String(form.get("address") || "").trim();
  if (!name || !description)
    return { ok: false, message: "Business name and description are required." };
  try {
    const session = await getSession();
    const slug = `${slugify(name)}-${Date.now().toString(36)}`;
    await db.insert(businesses).values({
      slug,
      name,
      category,
      description,
      phone: phone || null,
      email: email || null,
      website: website || null,
      address: address || null,
      isMember: false,
      isFeatured: false,
      status: "pending",
      ownerId: session?.id ?? null,
      services: [],
    });
    revalidatePath("/directory");
    revalidatePath("/admin");
    return {
      ok: true,
      message: "Listing submitted! A volunteer will review it within a few days.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Submission failed. Please try again." };
  }
}

export async function moderateBusinessAction(
  id: string,
  status: "approved" | "rejected",
  featured?: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!canModerate(session?.role))
    return { ok: false, message: "Not authorized." };
  try {
    await db
      .update(businesses)
      .set({
        status,
        ...(typeof featured === "boolean" ? { isFeatured: featured } : {}),
      })
      .where(eq(businesses.id, id));
    revalidatePath("/admin");
    revalidatePath("/directory");
    return { ok: true, message: `Listing ${status}.` };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Moderation failed." };
  }
}

// ---------- Membership / contact ----------

export async function membershipAction(form: FormData): Promise<ActionResult> {
  const fullName = String(form.get("fullName") || "").trim();
  const email = String(form.get("email") || "").trim();
  const type = String(form.get("type") || "Individual");
  const amount =
    type === "Family" ? "50" : type === "Business" ? "75" : type === "Lifetime" ? "500" : "35";
  if (!fullName || !email)
    return { ok: false, message: "Name and email are required." };
  try {
    const session = await getSession();
    await db.insert(memberships).values({
      userId: session?.id ?? null,
      fullName,
      email,
      type,
      status: "pending",
      amount,
    });
    revalidatePath("/admin");
    return {
      ok: true,
      message:
        "Application received! We'll email payment instructions. Dues can also be paid at any meeting.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Application failed. Please try again." };
  }
}

export async function contactAction(form: FormData): Promise<ActionResult> {
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const topic = String(form.get("topic") || "General");
  const message = String(form.get("message") || "").trim();
  if (!name || !email || !message)
    return { ok: false, message: "Name, email, and message are required." };
  try {
    await db.insert(contactMessages).values({ name, email, topic, message });
    return {
      ok: true,
      message: "Message sent! A volunteer will reply within a few days.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Could not send message. Please try again." };
  }
}

// ---------- Admin: content ----------

export async function createEventAction(form: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!canModerate(session?.role)) return { ok: false, message: "Not authorized." };
  const title = String(form.get("title") || "").trim();
  const eventType = String(form.get("eventType") || "Ride");
  const startAt = String(form.get("startAt") || "");
  const location = String(form.get("location") || "").trim();
  const description = String(form.get("description") || "").trim();
  const cost = String(form.get("cost") || "Free for members");
  if (!title || !startAt || !location || !description)
    return { ok: false, message: "Title, date, location, and description are required." };
  try {
    await db.insert(events).values({
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      eventType,
      startAt: new Date(startAt),
      location,
      description,
      cost,
      isPublished: true,
      requiresRsvp: true,
    });
    revalidatePath("/admin");
    revalidatePath("/events");
    return { ok: true, message: "Event published." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Could not create event." };
  }
}

export async function createNewsAction(form: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!canModerate(session?.role)) return { ok: false, message: "Not authorized." };
  const title = String(form.get("title") || "").trim();
  const excerpt = String(form.get("excerpt") || "").trim();
  const body = String(form.get("body") || "").trim();
  const category = String(form.get("category") || "Club News");
  if (!title || !excerpt || !body)
    return { ok: false, message: "Title, excerpt, and body are required." };
  try {
    await db.insert(newsPosts).values({
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      excerpt,
      body,
      category,
      author: session?.name ?? "CEA Board",
      isPublished: true,
    });
    revalidatePath("/admin");
    revalidatePath("/news");
    return { ok: true, message: "News post published." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Could not publish post." };
  }
}

export async function createResourceAction(form: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!canModerate(session?.role)) return { ok: false, message: "Not authorized." };
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const category = String(form.get("category") || "Guide");
  const fileType = String(form.get("fileType") || "PDF");
  if (!title || !description)
    return { ok: false, message: "Title and description are required." };
  try {
    await db.insert(resources).values({
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      description,
      category,
      fileType,
      fileUrl: "#",
      fileSize: "—",
    });
    revalidatePath("/admin");
    revalidatePath("/resources");
    return { ok: true, message: "Resource added." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Could not add resource." };
  }
}

export async function updateTrailStatusAction(
  id: string,
  status: "open" | "caution" | "closed"
): Promise<ActionResult> {
  const session = await getSession();
  if (!canModerate(session?.role)) return { ok: false, message: "Not authorized." };
  try {
    await db.update(trails).set({ status }).where(eq(trails.id, id));
    revalidatePath("/admin");
    revalidatePath("/trails");
    return { ok: true, message: "Trail status updated." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Update failed." };
  }
}

export async function updateUserRoleAction(
  id: string,
  role: "rider" | "business_owner" | "volunteer" | "admin"
): Promise<ActionResult> {
  const session = await getSession();
  if (!isAdmin(session?.role)) return { ok: false, message: "Admins only." };
  try {
    await db.update(users).set({ role }).where(eq(users.id, id));
    revalidatePath("/admin");
    return { ok: true, message: "User role updated." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Update failed." };
  }
}

// ---------- Native-form wrappers (for the volunteer admin, no JS required) ----------

export async function moderateReportFormAction(form: FormData): Promise<void> {
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "") as "approved" | "rejected";
  if (id && (status === "approved" || status === "rejected")) {
    await moderateReportAction(id, status);
  }
}

export async function moderateBusinessFormAction(form: FormData): Promise<void> {
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "") as "approved" | "rejected";
  const featured = String(form.get("featured") || "") === "true";
  if (id && (status === "approved" || status === "rejected")) {
    await moderateBusinessAction(id, status, featured);
  }
}

export async function updateTrailStatusFormAction(form: FormData): Promise<void> {
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "") as "open" | "caution" | "closed";
  if (id && (status === "open" || status === "caution" || status === "closed")) {
    await updateTrailStatusAction(id, status);
  }
}

export async function updateUserRoleFormAction(form: FormData): Promise<void> {
  const id = String(form.get("id") || "");
  const role = String(form.get("role") || "") as
    | "rider"
    | "business_owner"
    | "volunteer"
    | "admin";
  if (id && ["rider", "business_owner", "volunteer", "admin"].includes(role)) {
    await updateUserRoleAction(id, role);
  }
}
