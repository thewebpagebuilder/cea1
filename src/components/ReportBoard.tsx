"use client";

import { useMemo, useState } from "react";
import { Plus, Flag } from "lucide-react";
import { Modal, ActionForm, Field, fieldCls, ConditionDot } from "./primitives";
import { submitReportAction } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type ReportRow = {
  report: {
    id: string;
    trailId: string | null;
    reporterName: string;
    condition: string;
    hazardType: string | null;
    description: string;
    locationDetail: string | null;
    createdAt: Date | string;
  };
  trail: { id: string; slug: string; name: string } | null;
};

export default function ReportBoard({
  reports,
  trails,
}: {
  reports: ReportRow[];
  trails: { id: string; slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [trailFilter, setTrailFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (trailFilter !== "all" && r.trail?.slug !== trailFilter) return false;
      if (conditionFilter !== "all" && r.report.condition !== conditionFilter) return false;
      return true;
    });
  }, [reports, trailFilter, conditionFilter]);

  return (
    <div id="report">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-sand bg-white p-4">
        <label className="min-w-[180px] flex-1">
          <span className="mb-1 block text-[13px] font-semibold">Trail</span>
          <select
            value={trailFilter}
            onChange={(e) => setTrailFilter(e.target.value)}
            className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm"
            aria-label="Filter reports by trail"
          >
            <option value="all">All trails</option>
            {trails.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-[160px] flex-1">
          <span className="mb-1 block text-[13px] font-semibold">Condition</span>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm"
            aria-label="Filter reports by condition"
          >
            <option value="all">All conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="hazard">Hazard</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-900"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Submit report
        </button>
      </div>

      <p className="mt-4 text-sm text-stone-warm" role="status" aria-live="polite">
        Showing {filtered.length} of {reports.length} approved reports. New reports appear after
        volunteer review (usually within a day).
      </p>

      <ul className="mt-4 space-y-3">
        {filtered.map((r) => (
          <li
            key={r.report.id}
            className="rounded-xl border border-sand bg-white p-5 transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(28,26,22,0.35)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-bold capitalize",
                  r.report.condition === "hazard" || r.report.condition === "closed"
                    ? "border-red-200 bg-red-50 text-red-900"
                    : r.report.condition === "fair" || r.report.condition === "poor"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-forest-600/25 bg-forest-50 text-forest-800"
                )}
              >
                <ConditionDot status={r.report.condition} />
                {r.report.condition}
              </span>
              <span className="text-sm font-bold text-charcoal">
                {r.trail?.name ?? "General park report"}
              </span>
              {r.report.hazardType && (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-700 px-2 py-0.5 text-[12px] font-bold text-white">
                  <Flag className="h-3 w-3" aria-hidden="true" /> {r.report.hazardType}
                </span>
              )}
              <span className="ml-auto text-[13px] text-stone-warm">
                {formatDate(r.report.createdAt)}
              </span>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink">{r.report.description}</p>
            <p className="mt-2 text-[13px] text-stone-warm">
              {r.report.locationDetail && <>📍 {r.report.locationDetail} · </>}—{" "}
              {r.report.reporterName}
            </p>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-sand bg-parchment/60 p-8 text-center text-[15px] text-stone-warm">
            No reports match these filters yet. Rode recently?{" "}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-bold text-forest-700 underline"
            >
              Be the first to report.
            </button>
          </li>
        )}
      </ul>

      <Modal open={open} onClose={() => setOpen(false)} title="Submit a trail report" wide>
        <p className="mb-5 text-[15px] leading-relaxed text-stone-warm">
          Honest, specific reports keep riders safe. Mention water depth, exact location, and
          whether you rode through or turned around.
        </p>
        <ActionForm
          action={submitReportAction}
          submitLabel="Submit for review"
          onSuccess={() => setTimeout(() => setOpen(false), 900)}
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Trail" required>
              <select name="trailId" required className={fieldCls} defaultValue="">
                <option value="" disabled>
                  Select a trail…
                </option>
                {trails.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Your name" required>
              <input
                name="reporterName"
                required
                className={fieldCls}
                placeholder="e.g., Jordan M. (member)"
                autoComplete="name"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Overall condition" required>
              <select name="condition" className={fieldCls} defaultValue="good">
                <option value="excellent">Excellent — hero footing</option>
                <option value="good">Good — ride as normal</option>
                <option value="fair">Fair — ride with care</option>
                <option value="poor">Poor — consider waiting</option>
                <option value="hazard">Hazard — danger on trail</option>
                <option value="closed">Closed / impassable</option>
              </select>
            </Field>
            <Field label="Hazard type (if any)">
              <select name="hazardType" className={fieldCls} defaultValue="">
                <option value="">None</option>
                <option>Downed tree</option>
                <option>Flooding / deep crossing</option>
                <option>Washout / slide</option>
                <option>Bees / wildlife</option>
                <option>Gate closure</option>
                <option>Other</option>
              </select>
            </Field>
          </div>
          <Field label="Where exactly?" hint="e.g., Mile 2 north of Five-Mile, east descent">
            <input name="locationDetail" className={fieldCls} placeholder="Trail section or landmark" />
          </Field>
          <Field label="What did you find?" required hint="Water depth, footing, blowdown — specifics help.">
            <textarea
              name="description"
              required
              rows={4}
              className={fieldCls}
              placeholder="Creek crossing ankle-deep and clear; one muddy patch near mile 2, easily walked around…"
            />
          </Field>
        </ActionForm>
      </Modal>
    </div>
  );
}
