export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return (
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const CONDITION_META: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  excellent: {
    label: "Excellent",
    dot: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
  good: {
    label: "Good",
    dot: "bg-green-600",
    badge: "bg-green-50 text-green-900 border-green-200",
  },
  fair: {
    label: "Fair — ride with care",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-900 border-amber-200",
  },
  poor: {
    label: "Poor",
    dot: "bg-orange-600",
    badge: "bg-orange-50 text-orange-900 border-orange-200",
  },
  hazard: {
    label: "Hazard reported",
    dot: "bg-red-600",
    badge: "bg-red-50 text-red-900 border-red-200",
  },
  closed: {
    label: "Closed",
    dot: "bg-stone-700",
    badge: "bg-stone-100 text-stone-900 border-stone-300",
  },
  open: {
    label: "Open",
    dot: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
  caution: {
    label: "Caution",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-900 border-amber-200",
  },
};

export const BUSINESS_CATEGORIES = [
  "Boarding",
  "Training",
  "Lessons",
  "Farrier",
  "Veterinary",
  "Tack & Feed",
  "Hauling",
  "Arena & Facilities",
  "Photography",
] as const;

export const TRAIL_AREAS = [
  "Lower Bidwell Park",
  "Middle Bidwell Park",
  "Upper Bidwell Park",
  "Horseshoe Lake Area",
  "South Rim",
] as const;
