import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "cea_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "cea-dev-secret-change-in-production-32chars"
);

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "rider" | "business_owner" | "volunteer" | "admin";
  isActiveMember: boolean;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as SessionUser["role"],
      isActiveMember: Boolean(payload.isActiveMember),
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function canModerate(role: SessionUser["role"] | undefined): boolean {
  return role === "admin" || role === "volunteer";
}

export function isAdmin(role: SessionUser["role"] | undefined): boolean {
  return role === "admin";
}

export const ROLE_LABELS: Record<SessionUser["role"], string> = {
  rider: "Registered Rider",
  business_owner: "Business Owner",
  volunteer: "Volunteer Moderator",
  admin: "CEA Admin",
};

export const ROLE_DESCRIPTIONS: Record<SessionUser["role"], string> = {
  rider:
    "Members and registered riders. Can RSVP to events, submit trail condition reports, and access member resources.",
  business_owner:
    "Directory listing owners. Everything a rider can do, plus submit and manage their own business listing.",
  volunteer:
    "Trusted volunteers. Can moderate trail reports, help check in events, and update content drafts.",
  admin:
    "Board-authorized admins. Full access: publish content, approve businesses, manage users and memberships.",
};
