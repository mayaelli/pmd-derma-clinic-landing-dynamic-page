"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, Eye, EyeOff, Trash2, RefreshCw, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  created_at: string;
  patient_name: string;
  is_anonymous: boolean;
  rating: number;
  treatment_tag: string;
  comment: string;
  is_published: boolean;
}

export function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "hidden">("all");
  const supabase = createClient();

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_published: !currentStatus })
      .eq("id", id);

    if (!error) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_published: !currentStatus } : r))
      );
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === "published") return r.is_published;
    if (filter === "hidden") return !r.is_published;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#F2ECE4] shadow-xs">
        <div className="flex gap-2">
          {(["all", "published", "hidden"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === tab
                ? "bg-[#C88482] text-white shadow-xs"
                : "bg-[#FDFBF7] text-[#333D29] border border-[#F2ECE4] hover:bg-[#F3EFEA]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={fetchReviews}
          className="flex items-center gap-2 text-xs font-medium text-[#333D29] bg-[#FDFBF7] border border-[#F2ECE4] px-3 py-1.5 rounded-lg hover:bg-[#F3EFEA]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C88482]" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Reviews Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F2ECE4] p-12 text-center text-[#738285]">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C88482]" />
          <p className="text-xs font-medium">No reviews found in this view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${r.is_published
                ? "bg-white border-[#F2ECE4] shadow-xs"
                : "bg-[#FDFBF7] border-dashed border-[#CBD5E1]"
                }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-xs text-[#333D29]">
                      {r.is_anonymous ? "Anonymous Patient" : r.patient_name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-100"
                            }`}
                        />
                      ))}
                      {r.treatment_tag && (
                        <span className="ml-2 text-[9px] bg-[#F3EFEA] text-[#8C6253] px-2 py-0.5 rounded-full font-medium">
                          {r.treatment_tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePublish(r.id, r.is_published)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors ${r.is_published
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      title={r.is_published ? "Click to unpublish" : "Click to publish"}
                    >
                      {r.is_published ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                      <span>{r.is_published ? "Published" : "Hidden"}</span>
                    </button>

                    <button
                      onClick={() => deleteReview(r.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#556365] leading-relaxed mt-2 whitespace-pre-wrap italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#F2ECE4] flex justify-between items-center text-[10px] text-[#908A94]">
                <span>Submitted: {new Date(r.created_at).toLocaleDateString()}</span>
                {r.is_anonymous && <span className="font-medium text-[#C88482]">Anonymous</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}