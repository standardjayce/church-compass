import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token && isValidAdminToken(token)) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (password: string) => {
    if (validateAdminPassword(password)) {
      const token = generateAdminToken();
      localStorage.setItem("admin_token", token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="bg-cream text-emerald-deep min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="bg-cream text-emerald-deep min-h-screen">
      <SiteNav />
      <AdminDashboard onLogout={handleLogout} />
      <SiteFooter />
    </div>
  );
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

function generateAdminToken(): string {
  return "admin_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

function isValidAdminToken(token: string): boolean {
  return typeof token === "string" && token.startsWith("admin_");
}
