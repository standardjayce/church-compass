import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { denominations } from "@/data/churches";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ChurchCard } from "@/components/church-card";
import { getChurches } from "@/lib/churchQueries";
import type { Church } from "@/types/church";

const searchSchema = z.object({
  denom: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/directory")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Church Directory — Church Compass" },
      {
        name: "description",
        content:
          "Browse churches by tradition, city, and worship style. Filter the directory to find a community that fits.",
      },
      { property: "og:title", content: "Church Directory — Church Compass" },
      { property: "og:description", content: "Browse churches by tradition, city, and worship style." },
    ],
  }),
  component: Directory,
});

function Directory() {
  const { denom, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const activeDenom = denom ?? "All";

  useEffect(() => {
    const fetchChurches = async () => {
      setLoading(true);
      const { churches: data } = await getChurches({ limit: 100 });
      setChurches(data);
      setLoading(false);
    };
    fetchChurches();
  }, []);

  const filtered = churches.filter((c) => {
    const matchDenom = activeDenom === "All" || c.denomination === activeDenom;
    const matchQuery =
      !query.trim() ||
      `${c.name} ${c.city} ${c.denomination} ${c.worship_style || ""}`
        .toLowerCase()
        .includes(query.toLowerCase());
    return matchDenom && matchQuery;
  });

  return (
    <div className="bg-cream text-emerald-deep min-h-screen">
      <SiteNav />

      <section className="py-20 md:py-28 border-b border-emerald-deep/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">The Directory</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-none max-w-[18ch] mb-8">
            Every church, considered.
          </h1>
          <p className="text-emerald-deep/70 max-w-[56ch] text-pretty">
            A curated index of communities across the country. Filter by
            tradition or search by city to find the one that fits.
          </p>
        </div>
      </section>

      <section className="py-10 border-b border-emerald-deep/5 sticky top-16 bg-cream/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="flex flex-wrap gap-2">
            {denominations.map((d) => {
              const isActive = activeDenom === d;
              return (
                <button
                  key={d}
                  onClick={() =>
                    navigate({
                      search: (s: { denom?: string; q?: string }) => ({
                        ...s,
                        denom: d === "All" ? undefined : d,
                      }),
                    })
                  }
                  className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                    isActive
                      ? "bg-emerald-deep text-cream border-emerald-deep"
                      : "border-emerald-deep/10 hover:border-gold"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or name..."
            className="bg-transparent border-b border-emerald-deep/20 py-2 text-sm focus:outline-none focus:border-gold w-64"
          />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="py-24 text-center">
              <p className="text-emerald-deep/60">Loading churches...</p>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-widest text-emerald-deep/40 mb-10">
                {filtered.length} {filtered.length === 1 ? "church" : "churches"}
              </p>
              {filtered.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="font-serif text-2xl mb-4">No matches yet.</p>
                  <p className="text-sm text-emerald-deep/60 mb-8">
                    Try adjusting your filters or take the quiz for a personalized match.
                  </p>
                  <Link
                    to="/quiz"
                    className="inline-block px-6 py-3 bg-emerald-deep text-cream text-sm rounded-sm hover:bg-emerald-mid"
                  >
                    Take the quiz
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-12">
                  {filtered.map((c) => (
                    <ChurchCard key={c.slug} church={c} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}