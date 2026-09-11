import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "rider",
  "business_owner",
  "volunteer",
  "admin",
]);

export const trailDifficultyEnum = pgEnum("trail_difficulty", [
  "Easy",
  "Moderate",
  "Difficult",
]);

export const trailStatusEnum = pgEnum("trail_status", [
  "open",
  "caution",
  "closed",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "approved",
  "rejected",
]);

export const businessStatusEnum = pgEnum("business_status", [
  "pending",
  "approved",
  "rejected",
]);

export const users = pgTable("cea_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("rider"),
  phone: text("phone"),
  city: text("city").default("Chico"),
  bio: text("bio"),
  memberSince: timestamp("member_since").defaultNow(),
  isActiveMember: boolean("is_active_member").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trails = pgTable("cea_trails", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  parkArea: text("park_area").notNull(),
  difficulty: trailDifficultyEnum("difficulty").notNull().default("Easy"),
  lengthMiles: numeric("length_miles").notNull(),
  elevationGainFt: integer("elevation_gain_ft").default(0),
  surface: text("surface").default("Dirt / decomposed granite"),
  description: text("description").notNull(),
  parkingInfo: text("parking_info"),
  facilities: jsonb("facilities").$type<string[]>().default([]),
  stagingLat: numeric("staging_lat").notNull(),
  stagingLng: numeric("staging_lng").notNull(),
  status: trailStatusEnum("status").notNull().default("open"),
  horseWater: boolean("horse_water").default(false),
  trailerParking: boolean("trailer_parking").default(false),
  restrooms: boolean("restrooms").default(false),
  shadeLevel: text("shade_level").default("Partial"),
  bestSeason: text("best_season").default("Fall – Spring"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trailReports = pgTable("cea_trail_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  trailId: uuid("trail_id").references(() => trails.id, { onDelete: "cascade" }),
  reporterId: uuid("reporter_id").references(() => users.id, {
    onDelete: "set null",
  }),
  reporterName: text("reporter_name").notNull(),
  condition: text("condition").notNull(),
  hazardType: text("hazard_type"),
  description: text("description").notNull(),
  locationDetail: text("location_detail"),
  rideDate: timestamp("ride_date").defaultNow(),
  status: reportStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("cea_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull().default("Ride"),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),
  location: text("location").notNull(),
  cost: text("cost").default("Free for members"),
  capacity: integer("capacity").default(40),
  rsvpCount: integer("rsvp_count").default(0),
  imageNote: text("image_note"),
  isPublished: boolean("is_published").default(true),
  requiresRsvp: boolean("requires_rsvp").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventRsvps = pgTable("cea_event_rsvps", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  guests: integer("guests").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsPosts = pgTable("cea_news", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull().default("Club News"),
  author: text("author").default("CEA Board"),
  isPublished: boolean("is_published").default(true),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const businesses = pgTable("cea_businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
  city: text("city").default("Chico, CA"),
  isMember: boolean("is_member").default(true),
  isFeatured: boolean("is_featured").default(false),
  status: businessStatusEnum("status").notNull().default("approved"),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  services: jsonb("services").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resources = pgTable("cea_resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("Guide"),
  fileUrl: text("file_url"),
  fileType: text("file_type").default("PDF"),
  fileSize: text("file_size").default("—"),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memberships = pgTable("cea_memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  type: text("type").notNull().default("Individual"),
  status: text("status").notNull().default("pending"),
  amount: numeric("amount").default("35"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("cea_contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull().default("General"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Trail = typeof trails.$inferSelect;
export type TrailReport = typeof trailReports.$inferSelect;
export type CeaEvent = typeof events.$inferSelect;
export type NewsPost = typeof newsPosts.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type Resource = typeof resources.$inferSelect;
