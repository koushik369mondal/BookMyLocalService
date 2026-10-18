import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { providerService } from "@/services/providerService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Search, 
  ArrowLeft, 
  AlertCircle,
  Loader2
} from "lucide-react";
import ReviewCard from "@/components/reviews/ReviewCard";

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState({
    averageRating: 5.0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    responseRate: 100,
    recommendationRate: 100,
    reviewsList: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("all");

  // Dynamic replies active state maps
  const [replyInputs, setReplyInputs] = useState({});
  const [submittingReplyId, setSubmittingReplyId] = useState(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await providerService.getReviews();
      if (response.success && response.data) {
        setReviewsData({
          averageRating: response.data.averageRating !== undefined ? response.data.averageRating : 5.0,
          totalReviews: response.data.totalReviews || 0,
          distribution: response.data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          responseRate: response.data.responseRate !== undefined ? response.data.responseRate : 100,
          recommendationRate: response.data.recommendationRate !== undefined ? response.data.recommendationRate : 100,
          reviewsList: response.data.reviewsList || []
        });
      } else {
        setError(response.message || "Failed to load provider reviews.");
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError(err.message || "Failed to fetch provider reviews from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAddReplySubmit = async (reviewId) => {
    const text = replyInputs[reviewId];
    if (!text || !text.trim()) return;

    setSubmittingReplyId(reviewId);
    setError("");
    setSuccessMsg("");

    try {
      const response = await providerService.replyToReview(reviewId, text);
      if (response.success) {
        setSuccessMsg("Reply saved to database successfully.");
        setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
        setTimeout(() => setSuccessMsg(""), 2500);
        fetchReviews();
      } else {
        setError(response.message || "Failed to save review reply.");
      }
    } catch (err) {
      console.error("Save reply error:", err);
      setError(err.message || "Failed to save review reply.");
    } finally {
      setSubmittingReplyId(null);
    }
  };

  const reviewsList = reviewsData.reviewsList || [];
  const filteredReviews = reviewsList.filter((r) => {
    if (!r) return false;
    const name = r.name || "";
    const comment = r.comment || "";
    const serviceName = r.serviceName || "";
    const matchesSearch =
      name.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      comment.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      serviceName.toLowerCase().includes((searchQuery || "").toLowerCase());

    const rating = typeof r.rating === "number" ? r.rating : 5;
    const matchesStar = starFilter === "all" || Math.round(rating) === parseInt(starFilter, 10);
    return matchesSearch && matchesStar;
  });

  const distribution = reviewsData.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const totalReviews = reviewsData.totalReviews || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Customer ratings & reviews</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Monitor customer feedback, view satisfaction metrics, and reply to client reviews</p>
          </div>
          
          <Link to="/provider/dashboard">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>

        {/* FEEDBACK */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* RATINGS OVERVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SCORE CARD */}
          <div className="lg:col-span-4 card-chai p-6 text-center space-y-4 flex flex-col justify-center">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Average rating</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-bold text-white">
                {isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-neutral-400" /> : reviewsData.averageRating}
              </span>
              <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-xs text-neutral-400 font-normal">
              Based on {totalReviews} customer review{totalReviews === 1 ? "" : "s"}
            </p>
            <div className="pt-3 border-t border-white/10 flex justify-around text-xs text-neutral-200">
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Response rate</span>
                <span className="text-sm font-bold text-emerald-400">{reviewsData.responseRate}%</span>
              </div>
              <div className="border-r border-white/10" />
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Recommended</span>
                <span className="text-sm font-bold text-emerald-400">{reviewsData.recommendationRate}%</span>
              </div>
            </div>
          </div>

          {/* RATING BREAKDOWN BARS */}
          <div className="lg:col-span-8 card-chai p-6 space-y-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block border-b border-white/10 pb-2">Rating distribution</span>

            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || 0;
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs text-neutral-300">
                  <span className="w-12 flex items-center gap-1 shrink-0 font-medium">
                    {stars} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <Progress value={percent} className="h-2 flex-1" />
                  <span className="w-12 text-right text-[11px] text-neutral-400 shrink-0 font-mono">{count} ({percent}%)</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* REVIEWS FEED LIST */}
        <div className="card-chai p-6 space-y-6">
          <div className="pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Verified customer feedback</h2>
              <p className="text-xs text-neutral-400">Read and respond to completed service reviews</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Input
                  placeholder="Search comment, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 pl-8 text-xs"
                />
                <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-2.5 top-[50%] translate-y-[-50%]" />
              </div>

              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="h-9 text-xs font-medium border border-white/10 rounded-xl px-3 bg-neutral-900/60 text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-neutral-900 text-white">All stars</option>
                <option value="5" className="bg-neutral-900 text-white">5 stars</option>
                <option value="4" className="bg-neutral-900 text-white">4 stars</option>
                <option value="3" className="bg-neutral-900 text-white">3 stars</option>
                <option value="2" className="bg-neutral-900 text-white">2 stars</option>
                <option value="1" className="bg-neutral-900 text-white">1 star</option>
              </select>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="h-6 w-6 text-neutral-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-neutral-400">Loading customer reviews from database...</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="py-12 text-center">
                <MessageSquare className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">No reviews available yet</p>
                <p className="text-[11px] text-neutral-400 mt-1">Reviews submitted by verified customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((rev) => (
                  <ReviewCard
                    key={rev.id}
                    review={rev}
                    allowReply={true}
                    replyInput={replyInputs[rev.id] || ""}
                    onReplyInputChange={(val) =>
                      setReplyInputs((prev) => ({ ...prev, [rev.id]: val }))
                    }
                    onReplySubmit={handleAddReplySubmit}
                    isSubmittingReply={submittingReplyId === rev.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
