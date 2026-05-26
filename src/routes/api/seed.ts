import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/seed")({
  component: SeedPage,
});

function SeedPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Database Seeding API</h1>
      <p>This endpoint is for development only.</p>
      <button 
        onclick="fetch('/api/seed', { method: 'POST' }).then(r => r.json()).then(d => alert(JSON.stringify(d, null, 2)))"
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Seed Database
      </button>
    </div>
  );
}
