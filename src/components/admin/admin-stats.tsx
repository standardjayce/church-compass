import { useState, useEffect } from "react";
import { getChurchStats } from "@/lib/churchQueries";
import { supabase } from "@/lib/supabaseClient";
import { BarChart3 } from "lucide-react";

export function AdminStats() {
  const [stats, setStats] = useState({
    totalChurches: 0,
    verifiedChurches: 0,
    claimedChurches: 0,
    pendingClaims: 0,
    totalMessages: 0,
    sponsoredListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    const churchStats = await getChurchStats();
    const { count: messagesCount } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true });
    const { count: sponsoredCount } = await supabase
      .from("sponsored_listings")
      .select("id", { count: "exact", head: true })
      .eq("active", true);

    setStats({
      ...churchStats,
      totalMessages: messagesCount || 0,
      sponsoredListings: sponsoredCount || 0,
    });

    setLoading(false);
  };

  if (loading) {
    return <p className="text-emerald-deep/60">Loading statistics...</p>;
  }

  const statCards = [
    { label: "Total Churches", value: stats.totalChurches, color: "bg-blue-50" },
    { label: "Verified Churches", value: stats.verifiedChurches, color: "bg-green-50" },
    { label: "Claimed Churches", value: stats.claimedChurches, color: "bg-purple-50" },
    { label: "Pending Claims", value: stats.pendingClaims, color: "bg-yellow-50" },
    { label: "Contact Messages", value: stats.totalMessages, color: "bg-pink-50" },
    { label: "Active Sponsored", value: stats.sponsoredListings, color: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-emerald-deep" />
        <h2 className="text-2xl font-serif">Statistics</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`p-6 rounded-sm border border-emerald-deep/10 ${card.color}`}
          >
            <p className="text-xs uppercase tracking-widest text-emerald-deep/60 mb-2">{card.label}</p>
            <p className="font-serif text-4xl text-emerald-deep">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-sm">
        <h3 className="font-medium text-emerald-deep mb-4">Quick Info</h3>
        <ul className="space-y-2 text-sm text-emerald-deep/70">
          <li>✓ {Math.round((stats.verifiedChurches / stats.totalChurches) * 100)}% of churches are verified</li>
          <li>✓ {Math.round((stats.claimedChurches / stats.totalChurches) * 100)}% of churches have claimed profiles</li>
          <li>✓ {stats.pendingClaims} church claims awaiting review</li>
          <li>✓ {stats.totalMessages} contact messages received</li>
        </ul>
      </div>
    </div>
  );
}
