import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ContactMessage } from "@/types/church";
import { Mail, Trash2 } from "lucide-react";

export function AdminMessages() {
  const [messages, setMessages] = useState<(ContactMessage & { church_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*, churches(name)")
      .order("created_at", { ascending: false })
      .limit(50);

    const messages = data?.map((msg: any) => ({
      ...msg,
      church_name: msg.churches?.name,
    })) || [];

    setMessages(messages);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    loadMessages();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif">Contact Messages</h2>

      {loading ? (
        <p className="text-emerald-deep/60">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-emerald-deep/60">No messages yet</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="p-4 bg-white border border-emerald-deep/10 rounded-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-deep mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-emerald-deep">{message.sender_name || "Anonymous"}</h3>
                    <p className="text-sm text-emerald-deep/60">
                      {message.church_name && `For: ${message.church_name}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm">
                {message.sender_email && (
                  <p>
                    <span className="text-emerald-deep/60">Email:</span> {message.sender_email}
                  </p>
                )}
                {message.sender_phone && (
                  <p>
                    <span className="text-emerald-deep/60">Phone:</span> {message.sender_phone}
                  </p>
                )}
              </div>

              <p className="text-sm leading-relaxed border-t border-emerald-deep/5 pt-3">{message.message}</p>

              <p className="text-xs text-emerald-deep/40">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
