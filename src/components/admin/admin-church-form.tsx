import { useState } from "react";
import type { Church, GivingMethod } from "@/types/church";
import { ArrowLeft, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface AdminChurchFormProps {
  church: Church | null;
  onClose: () => void;
  onSave: () => void;
}

export function AdminChurchForm({ church, onClose, onSave }: AdminChurchFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [givingMethods, setGivingMethods] = useState<GivingMethod[]>(church?.giving_methods || []);
  const [newGivingMethod, setNewGivingMethod] = useState<GivingMethod>({
    name: "",
    description: "",
    url: "",
    app_name: "",
  });
  const [formData, setFormData] = useState({
    name: church?.name || "",
    slug: church?.slug || "",
    description: church?.description || "",
    address: church?.address || "",
    city: church?.city || "",
    state: church?.state || "",
    zip: church?.zip || "",
    phone: church?.phone || "",
    email: church?.email || "",
    website: church?.website || "",
    denomination: church?.denomination || "",
    worship_style: church?.worship_style || "",
    profile_image_url: church?.profile_image_url || "",
    featured: church?.featured || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleGivingMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGivingMethod({
      ...newGivingMethod,
      [name]: value,
    });
  };

  const addGivingMethod = () => {
    if (!newGivingMethod.name.trim()) {
      setError("Giving method name is required");
      return;
    }
    setGivingMethods([...givingMethods, { ...newGivingMethod }]);
    setNewGivingMethod({ name: "", description: "", url: "", app_name: "" });
    setError("");
  };

  const removeGivingMethod = (index: number) => {
    setGivingMethods(givingMethods.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        giving_methods: givingMethods,
      };

      if (church?.id) {
        const { error: updateError } = await supabase
          .from("churches")
          .update(dataToSave)
          .eq("id", church.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("churches").insert([dataToSave]);

        if (insertError) throw insertError;
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save church");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onClose} className="flex items-center gap-2 text-emerald-deep hover:text-gold">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-2xl font-serif">{church ? "Edit Church" : "Add New Church"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Church Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="church-name"
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              maxLength={2}
              placeholder="CA"
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">ZIP</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Denomination</label>
            <input
              type="text"
              name="denomination"
              value={formData.denomination}
              onChange={handleChange}
              placeholder="Baptist, Methodist, etc."
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Worship Style</label>
            <input
              type="text"
              name="worship_style"
              value={formData.worship_style}
              onChange={handleChange}
              placeholder="Contemporary, Traditional, etc."
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profile Image URL</label>
          <input
            type="url"
            name="profile_image_url"
            value={formData.profile_image_url}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Featured on homepage</span>
          </label>
        </div>

        <div className="border-t border-emerald-deep/10 pt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>Ways to Give</span>
          </h3>

          {givingMethods.length > 0 && (
            <div className="space-y-3 mb-6">
              {givingMethods.map((method, index) => (
                <div key={index} className="p-3 bg-emerald-deep/5 border border-emerald-deep/10 rounded-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-emerald-deep">{method.name}</p>
                      {method.description && <p className="text-sm text-emerald-deep/70">{method.description}</p>}
                      {method.app_name && <p className="text-xs text-emerald-deep/60">App: {method.app_name}</p>}
                      {method.url && <p className="text-xs text-gold break-all">{method.url}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGivingMethod(index)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 p-4 border border-emerald-deep/10 rounded-sm bg-emerald-deep/5">
            <div>
              <label className="block text-sm font-medium mb-2">Giving Method Name</label>
              <input
                type="text"
                name="name"
                value={newGivingMethod.name}
                onChange={handleGivingMethodChange}
                placeholder="e.g., Online Giving Portal, Venmo, PayPal"
                className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={newGivingMethod.description || ""}
                onChange={handleGivingMethodChange}
                placeholder="e.g., Secure online giving for one-time or recurring gifts"
                className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  name="url"
                  value={newGivingMethod.url || ""}
                  onChange={handleGivingMethodChange}
                  placeholder="https://..."
                  className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">App Name</label>
                <input
                  type="text"
                  name="app_name"
                  value={newGivingMethod.app_name || ""}
                  onChange={handleGivingMethodChange}
                  placeholder="e.g., Venmo @churchname, PayPal"
                  className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addGivingMethod}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-emerald-deep border border-emerald-deep/20 hover:border-gold rounded-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Giving Method
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-emerald-deep text-cream rounded-sm hover:bg-emerald-mid disabled:opacity-50 font-medium"
          >
            {loading ? "Saving..." : "Save Church"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-emerald-deep/20 rounded-sm hover:border-gold text-emerald-deep font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
