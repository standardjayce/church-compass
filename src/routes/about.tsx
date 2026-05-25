import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Church Compass" },
      {
        name: "description",
        content:
          "Church Compass is a thoughtful guide to finding spiritual community — built for the curious, the devout, and the seeking.",
      },
      { property: "og:title", content: "Our Story — Church Compass" },
      { property: "og:description", content: "A thoughtful guide to spiritual community." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="bg-cream text-emerald-deep min-h-screen">
      <SiteNav />
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">Our Story</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-none mb-12 text-balance">
            A bridge to spiritual community.
          </h1>
          <div className="space-y-8 text-lg text-emerald-deep/80 leading-relaxed font-light">
            <p>
              Church Compass began with a simple question: where do you go when you’re
              looking for somewhere to belong, but don’t know where to start?
            </p>
            <p>
              We curate churches the way a thoughtful friend would — paying
              attention to the texture of a community, not just its label. Every
              listing is vetted for hospitality, theological clarity, and
              accessibility for newcomers.
            </p>
            <p>
              We are non-denominational by design. Our goal is not to recruit
              you to a particular tradition, but to help you find the one that
              already feels like home.
            </p>
          </div>
          <div className="mt-16">
            <Link
              to="/quiz"
              className="inline-block h-11 px-6 bg-emerald-deep text-cream text-sm rounded-sm hover:bg-emerald-mid leading-[2.75rem]"
            >
              Take the quiz
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}