export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-saddle-700">Legal</p>
      <h1 className="display-serif mt-1 text-4xl font-semibold">Privacy policy</h1>
      <div className="cea-prose mt-6 rounded-xl border border-sand bg-white p-6 sm:p-8">
        <p>
          The Chico Equestrian Association collects only what it needs to run the club: your name,
          email, RSVPs, trail reports, and membership details. We never sell data, never share it
          with advertisers, and only show your name publicly where you explicitly submit content
          (trail reports, directory listings).
        </p>
        <p>
          Account data lives in CEA-owned PostgreSQL hosting. You can request export or deletion
          anytime by emailing info@chicoequestrianassociation.com. Photos you submit may appear in
          the newsletter with credit unless you opt out.
        </p>
        <p>
          This site uses a single first-party session cookie to keep you logged in. No tracking
          pixels, no ad networks, no data brokers.
        </p>
      </div>
    </section>
  );
}
