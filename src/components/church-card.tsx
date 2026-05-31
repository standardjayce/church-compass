import { Link } from "@tanstack/react-router";
import type { Church } from "@/types/church";
import { Star } from "lucide-react";

export function ChurchCard({ church }: { church: Church }) {
  const imageUrl = church.profile_image_url || "https://images.unsplash.com/photo-1438747668470-552f029e1994?w=1024&h=1280&fit=crop";
  const tagline = church.worship_style || "Community";

  return (
    <Link to="/church/$slug" params={{ slug: church.slug }} className="group block">
      <div className="w-full aspect-[4/5] bg-emerald-deep/5 outline-1 -outline-offset-1 outline-black/5 rounded-[min(1vw,12px)] overflow-hidden mb-6 relative">
        <img
          src={imageUrl}
          alt={church.name}
          width={1024}
          height={1280}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {church.featured && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-gold text-emerald-deep px-3 py-1.5 rounded-full text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            Featured
          </div>
        )}
      </div>
      <div className="space-y-2">
        <span className="text-xs font-medium uppercase tracking-widest text-gold">{tagline}</span>
        <h3 className="font-serif text-2xl text-emerald-deep group-hover:text-emerald-mid transition-colors">
          {church.name}
        </h3>
        <p className="text-sm text-emerald-deep/70 max-w-[40ch]">{church.description}</p>
        <p className="text-xs text-emerald-deep/50 pt-1">
          {church.denomination} · {church.city}
        </p>
      </div>
    </Link>
  );
}