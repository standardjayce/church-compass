import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { submitChurchClaim } from "@/lib/churchQueries";
import { CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/claim")({
  head: () => ({
    meta: [
      { title: "Claim Your Church Profile — Church Compass" },
      {
        name: "description",
        content: "Verify and claim your church's profile. Update information and engage with your community.",
      },
      { property: "og:title", content: "Claim Your Church Profile — Church Compass" },
      { property: "og:description", content: "Claim and manage your church's profile." },
    ],
  }),
  component: ClaimPage,
});

function ClaimPage() {
  const [formData, setFormData] = useState({
    churchName: "",
    churchWebsite: "",
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    claimantRole: "Pastor",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { claim, error: claimError } = await submitChurchClaim({
        claimant_name: formData.claimantName,
        claimant_email: formData.claimantEmail,
        claimant_phone: formData.claimantPhone,
        claimant_role: formData.claimantRole,
        church_website: formData.churchWebsite,
        message: `Church: ${formData.churchName}\n\n${formData.message}`,
      });

      if (claimError) {
        setError("Failed to submit claim. Please try again.");
      } else if (claim) {
        setSubmitted(true);
        setFormData({
          churchName: "",
          churchWebsite: "",
          claimantName: "",
          claimantEmail: "",
          claimantPhone: "",
          claimantRole: "Pastor",
          message: "",
        });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream text-emerald-deep min-h-screen">
      <SiteNav />

      <div className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          {submitted ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-emerald-deep" />
              </div>
              <h1 className="font-serif text-5xl md:text-6xl mb-6">Claim submitted!</h1>
              <p className="text-lg text-emerald-deep/70 mb-8">
                Thank you for claiming your church. Our team will review your submission within 2-3 business days and verify your ownership.
              </p>
              <p className="text-sm text-emerald-deep/60 mb-12">
                We'll send a confirmation email to <strong>{formData.claimantEmail}</strong>
              </p>
              <a
                href="/directory"
                className="inline-block h-11 px-6 bg-emerald-deep text-cream text-sm font-medium rounded-sm hover:bg-emerald-mid leading-[2.75rem]"
              >
                Back to directory
              </a>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">Claim Your Profile</p>
                <h1 className="font-serif text-5xl md:text-6xl leading-none mb-6">
                  Verify your church.
                </h1>
                <p className="text-lg text-emerald-deep/70 max-w-[56ch]">
                  Claiming your profile helps you control your church's information, engage with your community, and grow your attendance.
                </p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-sm flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Church Name *</label>
                  <input
                    type="text"
                    name="churchName"
                    value={formData.churchName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your church's name"
                    className="w-full h-12 px-4 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Church Website</label>
                  <input
                    type="url"
                    name="churchWebsite"
                    value={formData.churchWebsite}
                    onChange={handleChange}
                    placeholder="https://yourchurch.org"
                    className="w-full h-12 px-4 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="claimantName"
                      value={formData.claimantName}
                      onChange={handleChange}
                      required
                      placeholder="Full name"
                      className="w-full h-12 px-4 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Role *</label>
                    <select
                      name="claimantRole"
                      value={formData.claimantRole}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option>Pastor</option>
                      <option>Lead Pastor</option>
                      <option>Associate Pastor</option>
                      <option>Church Administrator</option>
                      <option>Church Staff</option>
                      <option>Church Board Member</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="claimantEmail"
                      value={formData.claimantEmail}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full h-12 px-4 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="claimantPhone"
                      value={formData.claimantPhone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full h-12 px-4 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Information</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your church and why you're claiming this profile..."
                    rows={4}
                    className="w-full px-4 py-3 border border-emerald-deep/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-emerald-deep text-cream font-medium rounded-sm hover:bg-emerald-mid transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Claim Your Profile"}
                </button>

                <p className="text-xs text-emerald-deep/50 text-center">
                  By submitting, you confirm that you represent this church and have authority to claim this profile.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
