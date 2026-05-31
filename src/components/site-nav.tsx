import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-emerald-deep/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl md:text-2xl tracking-tight text-emerald-deep">
          Church Compass
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase text-emerald-deep">
          <Link to="/directory" className="hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>
            Find a Church
          </Link>
          <Link to="/quiz" className="hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>
            Match Quiz
          </Link>
          <Link to="/about" className="hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>
            About
          </Link>
        </div>
        <Link
          to="/directory"
          className="h-9 px-4 bg-emerald-deep text-cream text-sm font-medium rounded-sm ring-1 ring-emerald-deep hover:bg-emerald-mid transition-colors flex items-center"
        >
          Find a Church
        </Link>
      </div>
    </nav>
  );
}