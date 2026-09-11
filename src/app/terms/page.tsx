export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-700">Legal</p>
      <h1 className="display-serif mt-1 text-4xl font-semibold">Terms of use</h1>
      <div className="cea-prose mt-6 rounded-xl border border-sand bg-white p-6 sm:p-8">
        <p>
          Trail condition reports are volunteer observations, not professional assessments. Always
          ride within your ability, check conditions the day you haul, and follow all Bidwell Park
          rules and posted closures.
        </p>
        <p>
          By submitting reports, listings, or RSVPs you confirm the information is accurate to your
          knowledge. CEA volunteers may edit or remove content that is unsafe, inaccurate, or
          off-topic.
        </p>
        <p>
          Directory listings are community resources, not endorsements. CEA is not liable for
          transactions between members and listed businesses.
        </p>
      </div>
    </section>
  );
}
