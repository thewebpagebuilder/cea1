"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormHTMLAttributes,
} from "react";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Scroll reveal: subtle fade-in-up, no layout shift ---------- */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "figure";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Tag polymorphism without extra runtime cost
  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
      data-tag={Tag}
    >
      {children}
    </div>
  );
}

/* ---------- Section heading: serif + kicker ---------- */
export function SectionHeading({
  kicker,
  title,
  lede,
  align = "left",
  tone = "dark",
}: {
  kicker: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  tone?: "dark" | "light" | "cream";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        tone === "light" && "text-cream",
        tone === "cream" && "text-charcoal"
      )}
    >
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-[0.18em]",
          tone === "light" ? "text-saddle-200" : "text-saddle-700"
        )}
      >
        {kicker}
      </p>
      <h2
        className={cn(
          "display-serif mt-2 text-3xl font-semibold leading-tight sm:text-4xl",
          tone === "light" ? "text-cream" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-3 text-base leading-relaxed",
            tone === "light" ? "text-cream/85" : "text-stone-warm"
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* ---------- Authentic-photo placeholder (per brief: no stock) ---------- */
export function PhotoPlaceholder({
  label,
  aspect = "aspect-[4/3]",
  className,
  icon = true,
}: {
  label: string;
  aspect?: string;
  className?: string;
  icon?: boolean;
}) {
  return (
    <figure
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-sand bg-parchment",
        aspect,
        className
      )}
    >
      {/* subtle topographic pattern via SVG, no gradients */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 300"
      >
        <g fill="none" stroke="#b08968" strokeOpacity="0.35" strokeWidth="1">
          <path d="M-20 60 C 80 40, 140 90, 220 70 S 360 50, 430 80" />
          <path d="M-20 110 C 90 90, 150 140, 230 120 S 370 100, 430 130" />
          <path d="M-20 160 C 100 140, 160 190, 240 170 S 380 150, 430 180" />
          <path d="M-20 210 C 110 190, 170 240, 250 220 S 390 200, 430 230" />
          <path d="M-20 260 C 120 240, 180 290, 260 270 S 400 250, 430 280" />
        </g>
        <g fill="#1b4332" fillOpacity="0.08">
          <circle cx="90" cy="70" r="26" />
          <circle cx="310" cy="220" r="34" />
        </g>
      </svg>
      <figcaption className="relative z-10 mx-auto flex max-w-[26ch] flex-col items-center gap-2 px-6 text-center">
        {icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-saddle-200 bg-cream">
            <Camera className="h-5 w-5 text-saddle-700" aria-hidden="true" />
          </span>
        )}
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-saddle-700">
          Authentic photo
        </span>
        <span className="display-serif text-base font-medium leading-snug text-charcoal">
          {label}
        </span>
      </figcaption>
    </figure>
  );
}

/* ---------- Accessible modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setRendered(true);
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => panelRef.current?.focus(), 30);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
        clearTimeout(t);
      };
    } else {
      const t = setTimeout(() => setRendered(false), 220);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  if (!rendered) return null;
  return (
    <div
      className="modal-backdrop fixed inset-0 z-[80] flex items-end justify-center bg-charcoal/60 p-0 sm:items-center sm:p-6"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "modal-panel max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-sand bg-cream p-6 shadow-2xl outline-none sm:rounded-2xl sm:p-8",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="display-serif text-2xl font-semibold text-charcoal">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full border border-sand bg-white p-2 text-stone-warm transition-colors hover:bg-parchment hover:text-charcoal"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- Form wrapper that runs a server action with feedback ---------- */
export function ActionForm({
  action,
  children,
  className,
  onSuccess,
  submitLabel,
  ...rest
}: Omit<FormHTMLAttributes<HTMLFormElement>, "action"> & {
  action: (form: FormData) => Promise<{ ok: boolean; message: string; redirect?: string }>;
  onSuccess?: () => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className={className}
      {...rest}
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setState(null);
        const form = e.currentTarget;
        try {
          const result = await action(new FormData(form));
          setState({ ok: result.ok, message: result.message });
          if (result.ok) {
            form.reset();
            onSuccess?.();
            if (result.redirect) {
              setTimeout(() => router.push(result.redirect as string), 600);
            } else {
              router.refresh();
            }
          }
        } catch {
          setState({ ok: false, message: "Something went wrong. Please try again." });
        } finally {
          setPending(false);
        }
      }}
    >
      {children}
      {state && (
        <div
          role={state.ok ? "status" : "alert"}
          className={cn(
            "mt-4 rounded-lg border px-4 py-3 text-sm font-medium",
            state.ok
              ? "border-forest-600/30 bg-forest-50 text-forest-800"
              : "border-red-300 bg-red-50 text-red-900"
          )}
        >
          {state.message}
        </div>
      )}
      {submitLabel && (
        <button
          type="submit"
          disabled={pending}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-forest-800 px-6 py-3 text-sm font-bold uppercase tracking-wider text-cream transition-colors hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Please wait…" : submitLabel}
        </button>
      )}
    </form>
  );
}

/* ---------- Shared field styles ---------- */
export const fieldCls =
  "w-full rounded-lg border border-sand bg-white px-3.5 py-2.5 text-[15px] text-charcoal placeholder:text-stone-warm/70 shadow-sm focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/20";

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-charcoal">
        {label} {required && <span className="text-saddle-700" aria-hidden="true">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone-warm">{hint}</span>}
    </label>
  );
}

export function ConditionDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-forest-600",
    excellent: "bg-forest-600",
    good: "bg-forest-500",
    caution: "bg-amber-500",
    fair: "bg-amber-500",
    poor: "bg-orange-600",
    hazard: "bg-red-700",
    closed: "bg-stone-500",
  };
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-2.5 w-2.5 rounded-full", map[status] ?? "bg-stone-400")}
    />
  );
}
