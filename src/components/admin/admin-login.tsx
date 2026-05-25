import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = onLogin(password);
    if (success) {
      setPassword("");
    } else {
      setError("Invalid password");
    }

    setLoading(false);
  };

  return (
    <div className="bg-cream text-emerald-deep min-h-screen flex flex-col">
      <SiteNav />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-emerald-deep" />
            </div>
            <h1 className="font-serif text-4xl mb-2">Admin Access</h1>
            <p className="text-emerald-deep/60">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={loading}
                className="w-full h-12 px-4 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full h-12 bg-emerald-deep text-cream font-medium rounded-sm hover:bg-emerald-mid transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-emerald-deep/50 mt-8">
            For development: use "admin123"
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
