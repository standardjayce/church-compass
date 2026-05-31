import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { ChurchWaysToGive } from "@/components/church-ways-to-give";
import { getChurchBySlug } from "@/lib/churchQueries";

export const Route = createFileRoute("/church/$slug")({
  loader: async ({ params }) => {
    const { church, error } = await getChurchBySlug(params.slug);
    if (!church || error) throw notFound();
    return { church };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.church;
    if (!c)
      return {
        meta: [{ title: "Church — Church Compass" }],
      };
    return {
      meta: [
        { title: `${c.name} — Church Compass` },
        { name: "description", content: c.description || "" },
        { property: "og:title", content: `${c.name} — Church Compass` },
        { property: "og:description", content: c.description || "" },
        ...(c.profile_image_url
          ? [
              { property: "og:image", content: c.profile_image_url },
              { name: "twitter:image", content: c.profile_image_url },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
  component: ChurchDetail,
});

function NotFound() {
  return (
    <div className="bg-cream text-emerald-deep min-h-screen">
      <SiteNav />
      <section className="py-32 text-center max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-5xl mb-6">We couldn&apos;t find that church.</h1>
        <p className="text-emerald-deep/60 mb-10">It may have moved, or never existed in our index.</p>
        <Link to="/directory" className="text-gold border-b border-gold/40 pb-1">Back to directory</Link>
      </section>
      <SiteFooter />
    </div>
  );
}

function ErrorView() {
  return (
    <div className="bg-cream text-emerald-deep min-h-screen flex items-center justify-center">
      <p className="text-sm text-emerald-deep/60">Something went wrong loading this page.</p>
    </div>
  );
}

function ChurchDetail() {
  const { church } = Route.useLoaderData();
  return (
    <div className="bg-cream text-emerald-deep min-h-screen">
      <SiteNav />
      <article className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <Link to="/directory" className="text-xs uppercase tracking-widest text-emerald-deep/50 hover:text-gold">
            ← Directory
          </Link>
          {church.worship_style && (
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mt-12 mb-6">{church.worship_style}</p>
          )}
          <h1 className="font-serif text-5xl md:text-7xl leading-none mb-6">{church.name}</h1>
          <p className="text-emerald-deep/70 text-lg max-w-[56ch] mb-12">{church.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-emerald-deep/10 mb-16 text-sm">
            <Stat label="Tradition" value={church.denomination || "Not specified"} />
            {church.worship_style && <Stat label="Style" value={church.worship_style} />}
            <Stat label="City" value={`${church.city}, ${church.state}`} />
            {church.address && <Stat label="Address" value={church.address} />}
          </div>

          {church.profile_image_url && (
            <div className="aspect-[16/10] overflow-hidden rounded-[min(1vw,12px)]">
              <img src={church.profile_image_url} alt={church.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="mt-16 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6 text-emerald-deep/80 leading-relaxed">
              <h2 className="font-serif text-3xl text-emerald-deep">What to expect on a first visit</h2>
              <p>
                Arrive a few minutes early. You&apos;ll be welcomed without pressure
                to introduce yourself. Dress is unfussy — somewhere between
                weekend brunch and a quiet dinner.
              </p>
              <p>
                Services last about 75 minutes. Coffee and conversation follow
                for those who want to stay. There is no expectation to give,
                join, or commit to anything on your first visit.
              </p>
            </div>
            <aside className="bg-emerald-deep text-cream p-8 rounded-[min(1vw,12px)] space-y-4 h-fit">
              <p className="text-xs uppercase tracking-widest text-gold">Plan your visit</p>
              <p className="font-serif text-2xl leading-tight">Sundays · 10:00 AM</p>
              <p className="text-sm text-cream/70">{church.city}</p>
              <button className="mt-4 w-full h-10 bg-gold text-emerald-deep text-sm font-medium rounded-sm hover:bg-gold-soft transition-colors">
                Request an introduction
              </button>
              <div className="pt-4 border-t border-cream/20">
                <p className="text-xs uppercase tracking-widest text-cream/60 mb-2">Church leaders?</p>
                <Link
                  to="/claim"
                  className="block text-center h-10 border border-gold text-gold text-sm font-medium rounded-sm hover:bg-gold/10 transition-colors flex items-center justify-center"
                >
                  Claim this profile
                </Link>
              </div>
            </aside>
          </div>

          {church.giving_methods && church.giving_methods.length > 0 && (
            <div className="mt-20 pt-20 border-t border-emerald-deep/10">
              <ChurchWaysToGive givingMethods={church.giving_methods} />
            </div>
          )}

          <div className="mt-20 pt-20 border-t border-emerald-deep/10">
            <ContactForm church={church} />
          </div>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-emerald-deep/40 mb-2">{label}</p>
      <p className="font-serif text-xl">{value}</p>
    </div>
  );
}
