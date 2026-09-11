import Link from "next/link";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/primitives";
import DirectoryGrid, { type Biz } from "@/components/DirectoryGrid";
import { getBusinesses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Business Directory",
  description:
    "Trusted Chico-area equestrian businesses: boarding, training, farriers, vets, tack, hauling, and more.",
};

export default async function DirectoryPage() {
  const rows = await getBusinesses({ approvedOnly: true });
  const businesses: Biz[] = rows.map((b) => {
    const x = b as unknown as Biz & { id: string };
    return {
      id: x.id,
      slug: x.slug,
      name: x.name,
      category: x.category,
      description: x.description,
      phone: x.phone,
      email: x.email,
      website: x.website,
      address: x.address,
      city: x.city,
      isMember: x.isMember,
      isFeatured: x.isFeatured,
    };
  });

  return (
    <>
      <section className="border-b border-sand bg-forest-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-200">
                Community · Directory
              </p>
              <h1 className="display-serif mt-2 text-4xl font-semibold sm:text-5xl">
                Equestrian Business Directory
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
                The farriers, vets, boarding barns, and tack shops our members actually use.
                Listings marked <strong className="text-cream">CEA Member</strong> support the
                trails you ride.
              </p>
            </div>
            <Link
              href="/directory/submit"
              className="inline-flex items-center gap-2 rounded-lg bg-cream px-5 py-3 text-sm font-bold text-forest-900 hover:bg-white"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              List your business
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-label="Business listings">
        <Reveal>
          <DirectoryGrid businesses={businesses} />
        </Reveal>
      </section>
    </>
  );
}
