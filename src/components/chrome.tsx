"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Map as MapIcon,
  CalendarDays,
  Building2,
  HeartHandshake,
  Newspaper,
  FolderOpen,
  Users,
  Info,
  Phone,
  Mail,
  MapPin,
  Globe,
  AtSign,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

/* ================= Header ================= */

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; desc: string }[];
};

const NAV: NavItem[] = [
  {
    label: "Trails",
    href: "/trails",
    children: [
      { label: "Interactive Trail Guide", href: "/trails", desc: "Map, parking & facilities" },
      { label: "Trail Conditions", href: "/trail-conditions", desc: "Recent reports + submit" },
      { label: "Resources & Maps", href: "/resources", desc: "Printable maps & safety" },
    ],
  },
  {
    label: "Directory",
    href: "/directory",
    children: [
      { label: "Business Directory", href: "/directory", desc: "Boarding, farriers, vets…" },
      { label: "List Your Business", href: "/directory/submit", desc: "Join the directory" },
      { label: "Member Benefits", href: "/membership", desc: "Why members get listed" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "All Events", href: "/events", desc: "Rides, clinics & meetings" },
      { label: "Club News", href: "/news", desc: "Announcements & stories" },
      { label: "Volunteer", href: "/volunteer", desc: "Trail days & committees" },
    ],
  },
  {
    label: "Membership",
    href: "/membership",
    children: [
      { label: "Join CEA", href: "/membership/join", desc: "Individual, family, business" },
      { label: "Benefits", href: "/membership", desc: "What membership funds" },
      { label: "Roles & Permissions", href: "/roles", desc: "Rider → Admin explained" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Mission", href: "/about", desc: "History & stewardship" },
      { label: "Board & Contacts", href: "/about/board", desc: "Who leads CEA" },
      { label: "Contact Us", href: "/contact", desc: "Questions & media" },
      { label: "Site Map", href: "/sitemap", desc: "Every page, one view" },
    ],
  },
];

function HorseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={className}>
      <circle cx="22" cy="22" r="20.5" fill="#1b4332" />
      <circle cx="22" cy="22" r="20.5" fill="none" stroke="#ddb892" strokeWidth="1.4" />
      {/* stylized horse-head + horseshoe */}
      <path
        d="M29 9c-4.5 0-8 1.8-9.8 5.2L14 24l3.2 1.4 1.6-2.6 2 6.4 4.6 4.8c1 .8 2.4.4 2.9-.8l4.2-10.4c1.4-3.4.3-7.4-3.5-8.8"
        fill="none"
        stroke="#fdfbf6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27.4" cy="16.4" r="1.3" fill="#ddb892" />
      <path
        d="M14.5 29.5c2 3.4 5 5 7.5 5s5.5-1.6 7.5-5"
        fill="none"
        stroke="#ddb892"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header({ session }: { session: SessionUser | null }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Utility bar */}
      <div className="bg-forest-950 text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-6">
          <p className="flex items-center gap-2 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-saddle-200" aria-hidden="true" />
            <span className="truncate">
              Preserving equestrian access to Bidwell Park since 1976 · Chico, California
            </span>
          </p>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/trail-conditions" className="hover:text-saddle-200 hover:underline">
              Trail Conditions
            </Link>
            <Link href="/contact" className="hover:text-saddle-200 hover:underline">
              Contact
            </Link>
            {session ? (
              <Link
                href={session.role === "admin" || session.role === "volunteer" ? "/admin" : "/dashboard"}
                className="font-semibold text-saddle-200 hover:underline"
              >
                {session.role === "admin" ? "Admin" : "My Account"}
              </Link>
            ) : (
              <Link href="/login" className="font-semibold text-saddle-200 hover:underline">
                Member login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main sticky header */}
      <header
        className={cn(
          "sticky top-0 z-[60] border-b bg-cream/95 backdrop-blur-sm transition-shadow",
          scrolled ? "border-sand shadow-[0_6px_20px_-12px_rgba(28,26,22,0.35)]" : "border-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Chico Equestrian Association — home">
            <HorseMark className="h-11 w-11 shrink-0" />
            <span className="leading-tight">
              <span className="display-serif block text-[19px] font-semibold text-charcoal">
                Chico Equestrian
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-forest-800">
                Association
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  onFocus={() => setOpenMenu(item.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold transition-colors",
                    pathname.startsWith(item.href)
                      ? "text-forest-800"
                      : "text-ink hover:bg-parchment hover:text-forest-800"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openMenu === item.label && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className="dropdown-panel absolute left-0 top-full w-72 pt-1"
                  data-open={openMenu === item.label}
                >
                  <ul className="overflow-hidden rounded-xl border border-sand bg-white p-1.5 shadow-[0_20px_45px_-18px_rgba(28,26,22,0.4)]">
                    {item.children?.map((c) => (
                      <li key={c.href + c.label}>
                        <Link
                          href={c.href}
                          onClick={() => setOpenMenu(null)}
                          className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-forest-50"
                        >
                          <span className="block text-[15px] font-semibold text-charcoal">
                            {c.label}
                          </span>
                          <span className="block text-[13px] text-stone-warm">{c.desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/membership/join"
              className="rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-900"
            >
              Become a Member
            </Link>
            <Link
              href="/trails"
              className="rounded-lg border border-forest-800 px-4 py-2.5 text-sm font-bold text-forest-800 transition-colors hover:bg-forest-50"
            >
              Explore Trails
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="rounded-lg border border-sand bg-white p-2.5 text-charcoal lg:hidden"
            aria-expanded={drawer}
            aria-controls="mobile-drawer"
            aria-label={drawer ? "Close menu" : "Open menu"}
            onClick={() => setDrawer(!drawer)}
          >
            {drawer ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        aria-hidden={!drawer}
        className={cn(
          "fixed inset-0 z-[70] bg-charcoal/50 transition-opacity lg:hidden",
          drawer ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setDrawer(false)}
      />
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-open={drawer}
        className="drawer fixed inset-y-0 right-0 z-[71] flex w-[86vw] max-w-sm flex-col bg-cream shadow-2xl lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <span className="flex items-center gap-2">
            <HorseMark className="h-9 w-9" />
            <span className="display-serif text-lg font-semibold">CEA Menu</span>
          </span>
          <button
            type="button"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
            className="rounded-lg border border-sand bg-white p-2"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
          {NAV.map((item) => (
            <div key={item.label} className="mb-1 overflow-hidden rounded-xl border border-sand bg-white">
              <button
                type="button"
                aria-expanded={mobileExpanded === item.label}
                onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-bold text-charcoal"
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-stone-warm transition-transform",
                    mobileExpanded === item.label && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
              {mobileExpanded === item.label && (
                <ul className="border-t border-sand bg-parchment/50 px-2 py-2">
                  {item.children?.map((c) => (
                    <li key={c.href + c.label}>
                      <Link
                        href={c.href}
                        className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-white"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
        <div className="border-t border-sand p-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/membership/join"
              className="rounded-lg bg-forest-800 px-4 py-3 text-center text-sm font-bold text-cream"
            >
              Become a Member
            </Link>
            <Link
              href="/trails"
              className="rounded-lg border border-forest-800 px-4 py-3 text-center text-sm font-bold text-forest-800"
            >
              Explore Trails
            </Link>
          </div>
          {session ? (
            <Link
              href={session.role === "admin" || session.role === "volunteer" ? "/admin" : "/dashboard"}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-parchment px-4 py-2.5 text-sm font-semibold text-charcoal"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              {session.role === "admin" ? "Admin dashboard" : "My account"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-parchment px-4 py-2.5 text-sm font-semibold text-charcoal"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Member login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= Footer ================= */

export function Footer() {
  return (
    <footer className="bg-forest-950 text-cream" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2.5">
              <HorseMark className="h-10 w-10" />
              <span className="leading-tight">
                <span className="display-serif block text-lg font-semibold">Chico Equestrian</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-saddle-200">
                  Association
                </span>
              </span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/80">
              A volunteer-run nonprofit preserving equestrian access to Bidwell Park — through
              stewardship, education, and community since 1976.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                aria-label="CEA on Facebook"
                className="rounded-lg border border-cream/20 p-2.5 transition-colors hover:bg-cream/10"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="CEA on Instagram"
                className="rounded-lg border border-cream/20 p-2.5 transition-colors hover:bg-cream/10"
              >
                <AtSign className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="mailto:info@chicoequestrianassociation.com"
                aria-label="Email CEA"
                className="rounded-lg border border-cream/20 p-2.5 transition-colors hover:bg-cream/10"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer — ride">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">Ride</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link className="hover:underline" href="/trails">Interactive Trail Guide</Link></li>
              <li><Link className="hover:underline" href="/trail-conditions">Trail Conditions</Link></li>
              <li><Link className="hover:underline" href="/events">Events Calendar</Link></li>
              <li><Link className="hover:underline" href="/news">Club News</Link></li>
              <li><Link className="hover:underline" href="/resources">Maps & Resources</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer — community">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">Community</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link className="hover:underline" href="/membership">Membership</Link></li>
              <li><Link className="hover:underline" href="/membership/join">Join CEA</Link></li>
              <li><Link className="hover:underline" href="/directory">Business Directory</Link></li>
              <li><Link className="hover:underline" href="/volunteer">Volunteer</Link></li>
              <li><Link className="hover:underline" href="/roles">Roles & Permissions</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer — about">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">About</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link className="hover:underline" href="/about">Mission & History</Link></li>
              <li><Link className="hover:underline" href="/about/board">Board & Contacts</Link></li>
              <li><Link className="hover:underline" href="/contact">Contact Us</Link></li>
              <li><Link className="hover:underline" href="/sitemap">Site Map</Link></li>
              <li><Link className="hover:underline" href="/admin">Volunteer Admin</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/15 pt-6 text-[13px] text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Chico Equestrian Association · A 501(c)(3) nonprofit · Chico, CA</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/sitemap" className="hover:underline">Information Architecture</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function QuickLinkCards() {
  const cards = [
    { href: "/trails", icon: MapIcon, title: "Trail Guide", desc: "Map, parking & footing" },
    { href: "/trail-conditions", icon: ShieldCheck, title: "Conditions", desc: "Ride-ready reports" },
    { href: "/events", icon: CalendarDays, title: "Events", desc: "Rides, clinics, meetings" },
    { href: "/directory", icon: Building2, title: "Directory", desc: "Trusted local pros" },
    { href: "/news", icon: Newspaper, title: "News", desc: "Club announcements" },
    { href: "/resources", icon: FolderOpen, title: "Resources", desc: "Maps, forms, guides" },
    { href: "/volunteer", icon: HeartHandshake, title: "Volunteer", desc: "Trail days & crews" },
    { href: "/about", icon: Users, title: "About CEA", desc: "Mission since 1976" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.href + c.title}
          href={c.href}
          className="lift group rounded-xl border border-sand bg-white p-4"
        >
          <c.icon className="h-5 w-5 text-forest-700" aria-hidden="true" />
          <span className="mt-2 block text-[15px] font-bold text-charcoal group-hover:text-forest-800">
            {c.title}
          </span>
          <span className="block text-[13px] text-stone-warm">{c.desc}</span>
        </Link>
      ))}
    </div>
  );
}

export { Info, Phone, Users, MapIcon };
