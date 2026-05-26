import { useState } from "react";
import { submitContactMessage } from "@/lib/churchQueries";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import type { Church } from "@/types/church";

interface ContactFormProps {
  church: Church;
}

export function ContactForm({ church }: ContactFormProps) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { message: msg, error: msgError } = await submitContactMessage({
        church_id: church.id,
        sender_name: formData.senderName || null,
        sender_email: formData.senderEmail || null,
        sender_phone: formData.senderPhone || null,
        message: formData.message,
      });

      if (msgError) {
        setError("Failed to send message. Please try again.");
      } else if (msg) {
        setSubmitted(true);
        setFormData({
          senderName: "",
          senderEmail: "",
          senderPhone: "",
          message: "",
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-emerald-deep/10 rounded-sm p-8 space-y-6">
      <div className="flex items-start gap-3">
        <Mail className="w-6 h-6 text-emerald-deep flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-serif text-2xl text-emerald-deep mb-1">Get in touch</h3>
          <p className="text-sm text-emerald-deep/60">Send a message directly to {church.name}</p>
        </div>
      </div>

      {submitted && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-sm flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Message sent!</p>
            <p className="text-xs text-green-700">We'll pass it along to the church.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="senderPhone"
            value={formData.senderPhone}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full h-10 px-3 border border-emerald-deep/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Tell us about your visit, ask a question, or share feedback..."
            rows={5}
            className="w-full px-3 py-2 border border-emerald-deep/20 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || submitted}
          className="w-full h-10 bg-emerald-deep text-cream font-medium text-sm rounded-sm hover:bg-emerald-mid transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : submitted ? "Message sent!" : "Send message"}
        </button>

        <p className="text-xs text-emerald-deep/50 text-center">
          Your information will be shared with {church.name} to help them respond to your message.
        </p>
      </form>
    </div>
  );
}
