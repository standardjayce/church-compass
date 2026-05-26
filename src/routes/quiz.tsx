import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ChurchCard } from "@/components/church-card";
import { getChurches } from "@/lib/churchQueries";
import type { Church } from "@/types/church";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Church Compass Quiz — Find your church match" },
      {
        name: "description",
        content:
          "Answer five short questions about your values and worship style. Get a personalized list of churches that fit.",
      },
      { property: "og:title", content: "Church Compass Quiz" },
      { property: "og:description", content: "Get a personalized church match in five questions." },
    ],
  }),
  component: Quiz,
});

type Answer = { tradition: string; style: string; size: string; focus: string; pace: string };

const questions = [
  {
    key: "tradition" as const,
    prompt: "Which tradition speaks to you most?",
    options: ["Liturgical & ancient", "Anglican / Episcopal", "Non-Denominational", "Reformed / Presbyterian", "Open to anything", "Not sure what these mean"],
  },
  {
    key: "style" as const,
    prompt: "How do you imagine the worship?",
    options: ["Choral & contemplative", "Traditional hymns", "Modern band", "Quiet and spoken"],
  },
  {
    key: "size" as const,
    prompt: "What size community feels right?",
    options: ["Small", "Mid-Size", "Large", "It doesn’t matter"],
  },
  {
    key: "focus" as const,
    prompt: "What matters most outside Sunday morning?",
    options: ["Justice & service", "Arts & beauty", "Family & youth", "Contemplation & study"],
  },
  {
    key: "pace" as const,
    prompt: "How do you want to be welcomed?",
    options: ["Quietly — let me observe", "Warmly — introduce me", "Somewhere in between"],
  },
];

function score(a: Partial<Answer>, churches: Church[]): Church[] {
  const denominationMap: Record<string, string[]> = {
    "Liturgical & ancient": ["Orthodox", "Anglican"],
    "Anglican / Episcopal": ["Anglican"],
    "Non-Denominational": ["Non-Denominational"],
    "Reformed / Presbyterian": ["Presbyterian"],
    "Open to anything": [],
    "Not sure what these mean": [],
  };

  return [...churches]
    .map((c) => {
      let s = 0;

      // Tradition scoring
      const allowedDenoms = denominationMap[a.tradition || ""] || [];
      if (allowedDenoms.length > 0 && allowedDenoms.includes(c.denomination || "")) s += 3;
      if (a.tradition === "Liturgical & ancient" && c.worship_style === "Liturgical") s += 2;
      if (a.tradition === "Open to anything") s += 1;
      if (a.tradition === "Not sure what these mean") s += 1;

      // Worship style scoring
      if (a.style === "Choral & contemplative" && c.worship_style === "Liturgical") s += 2;
      if (a.style === "Modern band" && c.worship_style === "Contemporary") s += 2;
      if (a.style === "Traditional hymns" && c.worship_style === "Traditional") s += 2;

      // Ministry focus scoring
      if (a.focus === "Family & youth" && (c.kids_ministry || c.youth_ministry)) s += 2;
      if (a.focus === "Justice & service" && c.description?.match(/justice|service|community|outreach/i)) s += 2;

      // Welcome pace
      if (a.pace === "It doesn’t matter") s += 1;

      return { c, s };
    })
    .sort((x, y) => y.s - x.s)
    .slice(0, 3)
    .map(({ c }) => c);
}

function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answer>>({});
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChurches = async () => {
      const { churches: data } = await getChurches({ limit: 100 });
      setChurches(data);
      setLoading(false);
    };
    fetchChurches();
  }, []);

  const done = step >= questions.length;
  const matches = useMemo(() => (done && !loading ? score(answers, churches) : []), [done, loading, answers, churches]);

  if (done) {
    return (
      <div className="bg-cream text-emerald-deep min-h-screen">
        <SiteNav />
        <section className="py-20 md:py-28 border-b border-emerald-deep/5">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">Your matches</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-none max-w-[20ch] mb-8">
              Three communities worth visiting.
            </h1>
            <p className="text-emerald-deep/70 max-w-[56ch]">
              Curated from your answers. Visit each profile to learn more about
              what to expect on a first Sunday.
            </p>
          </div>
        </section>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            {matches.map((c) => (
              <ChurchCard key={c.slug} church={c} />
            ))}
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-16 flex gap-4">
            <button
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
              className="h-11 px-6 border border-emerald-deep/20 text-sm rounded-sm hover:border-emerald-deep"
            >
              Retake the quiz
            </button>
            <Link
              to="/directory"
              className="h-11 px-6 bg-emerald-deep text-cream text-sm rounded-sm hover:bg-emerald-mid flex items-center"
            >
              Browse the full directory
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="bg-cream text-emerald-deep min-h-screen">
      <SiteNav />
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-deep/40">
              Question {step + 1} of {questions.length}
            </p>
            <div className="w-32 h-px bg-emerald-deep/10 relative">
              <div
                className="absolute inset-y-0 left-0 bg-gold transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-12 text-balance">
            {q.prompt}
          </h1>
          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setAnswers((a) => ({ ...a, [q.key]: opt }));
                  setStep((s) => s + 1);
                }}
                className="group w-full text-left px-6 py-5 border border-emerald-deep/10 rounded-sm hover:border-gold hover:bg-cream/60 transition-all flex justify-between items-center"
              >
                <span className="font-serif text-xl">{opt}</span>
                <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-10 text-xs uppercase tracking-widest text-emerald-deep/60 hover:text-emerald-deep"
            >
              ← Back
            </button>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}