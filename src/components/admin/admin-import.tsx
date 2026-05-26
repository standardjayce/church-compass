import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Upload, AlertCircle } from "lucide-react";

export function AdminImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importedCount, setImportedCount] = useState(0);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        throw new Error("CSV file must contain header row and data rows");
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const churches = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

        if (values.length < 5) continue;

        const church: any = {};
        headers.forEach((header, index) => {
          const value = values[index];

          // Parse boolean values
          if (value === "true") {
            church[header] = true;
          } else if (value === "false") {
            church[header] = false;
          }
          // Parse JSON arrays (for service_times, gallery_urls, etc.)
          else if (value.startsWith("{") || value.startsWith("[")) {
            try {
              church[header] = JSON.parse(value);
            } catch {
              church[header] = value;
            }
          }
          // Parse numbers (latitude, longitude, etc.)
          else if (!isNaN(Number(value)) && value !== "") {
            church[header] = Number(value);
          } else {
            church[header] = value || null;
          }
        });

        // Ensure required fields have proper values
        if (!church.name || !church.city || !church.state) {
          console.warn(`Skipping row ${i + 1}: missing required fields`);
          continue;
        }

        churches.push(church);
      }

      if (churches.length === 0) {
        throw new Error("No valid churches found in CSV");
      }

      // Insert in batches to avoid hitting limits
      const batchSize = 50;
      let totalInserted = 0;

      for (let i = 0; i < churches.length; i += batchSize) {
        const batch = churches.slice(i, i + batchSize);
        const { data, error: insertError } = await supabase
          .from("churches")
          .insert(batch)
          .select();

        if (insertError) {
          console.error(`Batch insert error:`, insertError);
          throw insertError;
        }

        totalInserted += data?.length || 0;
      }

      setImportedCount(totalInserted);
      setSuccess(`Successfully imported ${totalInserted} churches!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import CSV");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-6 h-6 text-emerald-deep" />
        <h2 className="text-2xl font-serif">Import Churches</h2>
      </div>

      <div className="max-w-2xl">
        <div className="p-8 border-2 border-dashed border-emerald-deep/20 rounded-sm bg-emerald-deep/5 text-center">
          <label className="block cursor-pointer">
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-emerald-deep mx-auto opacity-50" />
              <div>
                <p className="font-medium text-emerald-deep mb-1">Choose a CSV file to import</p>
                <p className="text-sm text-emerald-deep/60">
                  Expected columns: name, slug, description, address, city, state, zip, country, latitude,
                  longitude, phone, email, website, denomination, church_network, worship_style, service_times,
                  ministries, languages, kids_ministry, youth_ministry, college_ministry, small_groups,
                  online_service, online_service_url, accessibility, parking_info, profile_image_url,
                  gallery_urls, verified, claimed, featured, active
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileImport}
                disabled={loading}
                className="block w-full text-sm text-emerald-deep/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-emerald-deep file:text-cream hover:file:bg-emerald-mid disabled:opacity-50"
              />
            </div>
          </label>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-sm flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-sm">
            <p className="text-green-600 font-medium text-sm">{success}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-sm">
          <h3 className="font-medium text-emerald-deep mb-2">How to import:</h3>
          <ol className="text-sm text-emerald-deep/70 space-y-1 list-decimal list-inside">
            <li>Prepare a CSV file with the required columns</li>
            <li>Click the upload area or select a CSV file</li>
            <li>The churches will be imported into the database</li>
            <li>Check the Churches tab to see the imported data</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
