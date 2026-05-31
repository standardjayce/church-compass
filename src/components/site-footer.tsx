import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="py-24 border-t border-emerald-deep/10 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-6">
            <span className="font-serif text-3xl text-emerald-deep">Church Compass</span>
            <p className="text-sm text-emerald-deep/60 max-w-[30ch]">
              Find a church that feels like home.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-emerald-deep">Find a Church</h5>
              <ul className="text-sm space-y-2 text-emerald-deep/70">
                <li><Link to="/directory" className="hover:text-gold">By City</Link></li>
                <li><Link to="/directory" className="hover:text-gold">By Tradition</Link></li>
                <li><Link to="/directory" className="hover:text-gold">All Listings</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-emerald-deep">Resources</h5>
              <ul className="text-sm space-y-2 text-emerald-deep/70">
                <li><Link to="/quiz" className="hover:text-gold">Match Quiz</Link></li>
                <li><Link to="/about" className="hover:text-gold">Our Story</Link></li>
                <li><Link to="/about" className="hover:text-gold">For Churches</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-emerald-deep">Company</h5>
              <ul className="text-sm space-y-2 text-emerald-deep/70">
                <li><Link to="/about" className="hover:text-gold">About</Link></li>
                <li><a href="#" className="hover:text-gold">Privacy</a></li>
                <li><a href="#" className="hover:text-gold">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-emerald-deep/5 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[10px] uppercase tracking-widest text-emerald-deep/40">© 2026 Church Compass</p>
          <p className="text-[10px] uppercase tracking-widest text-emerald-deep/40">Find a church that feels like home</p>
        </div>
      </div>
    </footer>
  );
}