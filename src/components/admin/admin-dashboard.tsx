import { useState } from "react";
import { LogOut, Plus, Inbox, CheckSquare, BarChart3 } from "lucide-react";
import { AdminChurches } from "./admin-churches";
import { AdminClaims } from "./admin-claims";
import { AdminMessages } from "./admin-messages";
import { AdminStats } from "./admin-stats";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"churches" | "claims" | "messages" | "stats">("churches");

  const tabs = [
    { id: "churches", label: "Churches", icon: Plus },
    { id: "claims", label: "Claims", icon: CheckSquare },
    { id: "messages", label: "Messages", icon: Inbox },
    { id: "stats", label: "Statistics", icon: BarChart3 },
  ] as const;

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl mb-2">Admin Dashboard</h1>
            <p className="text-emerald-deep/60">Manage your church directory</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 border border-emerald-deep/20 rounded-sm hover:border-gold hover:text-gold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-emerald-deep/10 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-emerald-deep text-emerald-deep"
                    : "border-transparent text-emerald-deep/60 hover:text-emerald-deep"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "churches" && <AdminChurches />}
          {activeTab === "claims" && <AdminClaims />}
          {activeTab === "messages" && <AdminMessages />}
          {activeTab === "stats" && <AdminStats />}
        </div>
      </div>
    </div>
  );
}
