import { useState, useEffect } from "react";
import { getChurches } from "@/lib/churchQueries";
import type { Church } from "@/types/church";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminChurchForm } from "./admin-church-form";

export function AdminChurches() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChurch, setEditingChurch] = useState<Church | null>(null);

  useEffect(() => {
    loadChurches();
  }, []);

  const loadChurches = async () => {
    setLoading(true);
    const { churches: data } = await getChurches({ limit: 100 });
    setChurches(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingChurch(null);
    setShowForm(true);
  };

  const handleEdit = (church: Church) => {
    setEditingChurch(church);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingChurch(null);
  };

  const handleFormSave = async () => {
    await loadChurches();
    handleFormClose();
  };

  if (showForm) {
    return <AdminChurchForm church={editingChurch} onClose={handleFormClose} onSave={handleFormSave} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Churches</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-deep text-cream rounded-sm hover:bg-emerald-mid transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Church
        </button>
      </div>

      {loading ? (
        <p className="text-emerald-deep/60">Loading churches...</p>
      ) : churches.length === 0 ? (
        <p className="text-emerald-deep/60">No churches yet. Add one to get started!</p>
      ) : (
        <div className="grid gap-4">
          {churches.map((church) => (
            <div
              key={church.id}
              className="flex justify-between items-center p-4 bg-white border border-emerald-deep/10 rounded-sm"
            >
              <div>
                <h3 className="font-medium text-emerald-deep">{church.name}</h3>
                <p className="text-sm text-emerald-deep/60">
                  {church.city}, {church.state} • {church.denomination}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(church)}
                  className="p-2 text-emerald-deep hover:bg-emerald-deep/10 rounded transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
