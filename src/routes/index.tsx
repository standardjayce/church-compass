import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-sanctuary.jpg";
import { denominations } from "@/data/churches";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ChurchCard } from "@/components/church-card";
import { MapPin, Church, Search } from "lucide-react";
import { getChurches } from "@/lib/churchQueries";
import type { Church } from "@/types/church";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Church Compass — Find a church that feels like home" },
      {
        name: "description",
        content:
          "Search churches by location, denomination, worship style, service times, kids ministry, language, and more. Find your church home.",
      },
      { property: "og:title", content: "Church Compass — Find a church that feels like home" },
      { property: "og:description", content: "Search churches by location, denomination, worship style, and more." },
    ],
  }),
  component: Index,
});

function Index() {
  const [featured, setFeatured] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { churches } = await getChurches({ featured: true, limit: 3 });
      setFeatured(churches);
      setLoading(false);
    };
    fetchFeatured();
  }, []);
  return (
    <div className="bg-cream text-emerald-deep selection:bg-gold/30 min-h-screen">
      <SiteNav />

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-[44ch]">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-none text-balance mb-6">
                Church Compass
              </h1>
              <p className="text-xl md:text-2xl text-emerald-deep/80 text-pretty leading-relaxed mb-4 font-light">
                Find a church that feels like home.
              </p>
              <p className="text-base text-emerald-deep/60 text-pretty leading-relaxed mb-10 max-w-[52ch]">
                Search by location, denomination, worship style, service times, kids ministry, language, and more.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/directory"
                  className="h-11 px-5 bg-emerald-deep text-cream text-sm font-medium flex items-center gap-2 rounded-sm ring-1 ring-emerald-deep hover:bg-emerald-mid transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Find Churches Near Me
                </Link>
                <Link
                  to="/about"
                  className="h-11 px-5 bg-transparent text-emerald-deep text-sm font-medium border border-emerald-deep/20 rounded-sm hover:border-emerald-deep transition-colors flex items-center gap-2"
                >
                  <Church className="w-4 h-4" />
                  Claim Your Church Profile
                </Link>
              </div>
            </div>

            <div className="w-full aspect-[4/3] lg:aspect-[16/10] outline-1 -outline-offset-1 outline-black/5 rounded-[min(1vw,12px)] overflow-hidden">
              <img
                src={heroImg}
                alt="Warm light in a welcoming church sanctuary"
                width={1920}
                height={832}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search bar strip */}
      <section className="py-8 border-y border-emerald-deep/5 bg-white/60">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-deep/30" />
            <input
              type="text"
              placeholder="Search by city, denomination, or church name..."
              className="w-full h-12 pl-12 pr-4 bg-white border border-emerald-deep/10 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-deep/40 self-center mr-2">
              Popular:
            </span>
            {denominations.slice(1, 6).map((d) => (
              <Link
                key={d}
                to="/directory"
                search={{ denom: d }}
                className="px-3 py-1 rounded-full border border-emerald-deep/10 text-xs hover:border-gold hover:text-gold transition-colors"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Churches */}
      <section className="py-20 md:py-28 bg-emerald-deep text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">For Churches</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                Help new people discover your church.
              </h2>
              <p className="text-cream/70 leading-relaxed max-w-[48ch]">
                Thousands of people are searching for a church home every week. Claim your profile, share your story, and connect with families looking for a church just like yours.
              </p>
              <Link
                to="/about"
                className="inline-block h-11 px-6 bg-gold text-emerald-deep text-sm font-medium rounded-sm hover:bg-gold-soft transition-colors leading-[2.75rem]"
              >
                Claim Your Profile
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { stat: "12,000+", label: "monthly searches" },
                { stat: "3x", label: "more profile views" },
                { stat: "87%", label: "visitor follow-up rate" },
                { stat: "Free", label: "to get started" },
              ].map((item) => (
                <div key={item.label} className="bg-cream/5 border border-cream/10 rounded-sm p-6 text-center">
                  <p className="font-serif text-3xl text-gold mb-1">{item.stat}</p>
                  <p className="text-xs uppercase tracking-widest text-cream/50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Featured</p>
              <h2 className="font-serif text-4xl text-balance max-w-[24ch]">
                Churches people love
              </h2>
            </div>
            <Link
              to="/directory"
              className="text-sm font-medium text-gold border-b border-gold/30 pb-1 hover:border-gold transition-colors"
            >
              View all listings
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-emerald-deep/60">Loading featured churches...</div>
          ) : featured.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-12">
              {featured.map((c) => (
                <ChurchCard key={c.slug} church={c} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-emerald-deep/60">No featured churches yet.</div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-emerald-deep/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-[40ch] mb-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">How it works</p>
            <h2 className="font-serif text-4xl mb-6">Three steps to finding home</h2>
            <p className="text-emerald-deep/70 text-pretty max-w-[56ch]">
              Finding a church shouldn’t be hard. We make it simple, personal, and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                n: 1,
                t: "Tell us what matters",
                d: "Search by location, denomination, worship style, service times, kids ministry, language, and more.",
              },
              {
                n: 2,
                t: "Explore your matches",
                d: "Browse detailed church profiles with photos, service info, and what to expect on your first visit.",
              },
              {
                n: 3,
                t: "Visit with confidence",
                d: "Know before you go. Every profile includes dress code, service length, and visitor tips.",
              },
            ].map((s) => (
              <div key={s.n} className="space-y-4">
                <div className="size-8 flex items-center justify-center border border-gold/40 rounded-full font-serif text-gold bg-white">
                  {s.n}
                </div>
                <h4 className="text-lg font-medium font-serif">{s.t}</h4>
                <p className="text-sm text-emerald-deep/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid place-items-center">
          <div className="max-w-[40ch] text-center">
            <div className="h-12 w-px bg-gold mx-auto mb-10" />
            <blockquote className="font-serif text-3xl md:text-4xl text-emerald-deep/90 leading-tight mb-8">
              “Church Compass helped us find a church where our whole family feels welcome. We went from searching to belonging in one Sunday.”
            </blockquote>
            <cite className="not-italic text-xs uppercase tracking-widest text-gold font-semibold">
              The Martinez Family, Austin TX
            </cite>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
