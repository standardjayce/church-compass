import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ChurchClaim } from "@/types/church";
import { CheckCircle, XCircle } from "lucide-react";

export function AdminClaims() {
  const [claims, setClaims] = useState<ChurchClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("church_claims")
      .select("*")
      .order("created_at", { ascending: false });
    setClaims(data || []);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await supabase
      .from("church_claims")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", id);
    loadClaims();
  };

  const handleReject = async (id: string) => {
    await supabase
      .from("church_claims")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", id);
    loadClaims();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif">Church Claims</h2>

      {loading ? (
        <p className="text-emerald-deep/60">Loading claims...</p>
      ) : claims.length === 0 ? (
        <p className="text-emerald-deep/60">No church claims yet</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="p-4 bg-white border border-emerald-deep/10 rounded-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-emerald-deep">{claim.claimant_name}</h3>
                  <p className="text-sm text-emerald-deep/60">{claim.claimant_role}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    claim.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : claim.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              <div className="text-sm">
                <p>
                  <span className="text-emerald-deep/60">Email:</span> {claim.claimant_email}
                </p>
                {claim.claimant_phone && (
                  <p>
                    <span className="text-emerald-deep/60">Phone:</span> {claim.claimant_phone}
                  </p>
                )}
                {claim.message && (
                  <p className="mt-2">
                    <span className="text-emerald-deep/60">Message:</span> {claim.message}
                  </p>
                )}
              </div>

              {claim.status === "pending" && (
                <div className="flex gap-2 pt-3 border-t border-emerald-deep/5">
                  <button
                    onClick={() => handleApprove(claim.id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(claim.id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
