import { Heart, ExternalLink } from "lucide-react";
import type { GivingMethod } from "@/types/church";

interface ChurchWaysToGiveProps {
  givingMethods: GivingMethod[];
}

export function ChurchWaysToGive({ givingMethods }: ChurchWaysToGiveProps) {
  if (!givingMethods || givingMethods.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-gold" />
        <h2 className="text-2xl font-serif text-emerald-deep">Ways to Give</h2>
      </div>

      <div className="grid gap-4">
        {givingMethods.map((method, index) => (
          <div
            key={index}
            className="p-4 border border-emerald-deep/10 rounded-sm hover:border-gold/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-emerald-deep mb-1">{method.name}</h3>
                {method.description && (
                  <p className="text-sm text-emerald-deep/70 mb-2">{method.description}</p>
                )}
                {method.app_name && (
                  <p className="text-xs text-emerald-deep/60">App: {method.app_name}</p>
                )}
              </div>
              {method.url && (
                <a
                  href={method.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 ml-4 text-sm text-gold hover:text-gold-soft bg-gold/10 rounded-sm transition-colors"
                >
                  Give
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-emerald-deep/50">
        Support this church's ministry and mission through these giving options.
      </p>
    </section>
  );
}
