import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { providerService } from "@/services/providerService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Search, 
  ArrowLeft, 
  CornerDownRight, 
  AlertCircle,
  Loader2
} from "lucide-react";

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
        setSuccessMsg("Reply saved to database successfully!");
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
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Customer Ratings & Reviews</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Monitor customer feedback, view satisfaction metrics, and reply to client reviews</p>
            </div>
            
            <Link to="/provider/dashboard">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] border border-[#E8DCC3] text-white font-bold text-xs rounded-xl h-9.5 px-4 cursor-pointer shadow-2xs">
                <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
              </Button>
            </Link>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {successMsg && (
            <div className="p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{error}</span>
            </div>
          )}

          {/* RATINGS OVERVIEW GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SCORE CARD */}
            <Card className="lg:col-span-4 border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 text-center space-y-4 flex flex-col justify-center">
              <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Average Satisfaction Rating</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[#1F1D1A]">
                  {isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#C9A46A]" /> : reviewsData.averageRating}
                </span>
                <Star className="h-8 w-8 fill-[#C9A46A] text-[#C9A46A]" />
              </div>
              <p className="text-xs text-[#5A5146] font-semibold">
                Based on <strong>{totalReviews}</strong> customer review{totalReviews === 1 ? "" : "s"}
              </p>
              <div className="pt-2 border-t border-[#E8DCC3] flex justify-around text-xs font-bold text-[#1F1D1A]">
                <div>
                  <span className="text-[10px] font-bold text-[#7A7266] uppercase block">Response Rate</span>
                  <span className="text-sm font-black text-[#2B522B]">{reviewsData.responseRate}%</span>
                </div>
                <div className="border-r border-[#E8DCC3]"></div>
                <div>
                  <span className="text-[10px] font-bold text-[#7A7266] uppercase block">Recommended</span>
                  <span className="text-sm font-black text-[#2B522B]">{reviewsData.recommendationRate}%</span>
                </div>
              </div>
            </Card>

            {/* RATING BREAKDOWN BARS */}
            <Card className="lg:col-span-8 border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider block border-b border-[#E8DCC3] pb-2">Rating Distribution</span>

              {[5, 4, 3, 2, 1].map((stars) => {
                const count = distribution[stars] || 0;
                const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs font-bold text-[#1F1D1A]">
                    <span className="w-12 flex items-center gap-1 shrink-0">
                      {stars} <Star className="h-3.5 w-3.5 fill-[#C9A46A] text-[#C9A46A]" />
                    </span>
                    <Progress value={percent} className="h-2 flex-1 bg-[#FAF6F0]" />
                    <span className="w-12 text-right text-[11px] text-[#7A7266] shrink-0">{count} ({percent}%)</span>
                  </div>
                );
              })}
            </Card>

          </div>

          {/* REVIEWS FEED LIST */}
          <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6 space-y-6">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">Verified Customer Feedback</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Read and respond to completed service reviews</CardDescription>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Input
                    placeholder="Search comment, service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-48 pl-8 text-xs border-[#E8DCC3] focus-visible:ring-[#C9A46A] rounded-xl bg-[#FAF6F0]"
                  />
                  <Search className="h-3.5 w-3.5 text-[#7A7266] absolute left-2.5 top-[50%] translate-y-[-50%]" />
                </div>

                <select
                  value={starFilter}
                  onChange={(e) => setStarFilter(e.target.value)}
                  className="h-9 text-xs font-bold border border-[#E8DCC3] rounded-xl px-3 bg-[#FAF6F0] text-[#1F1D1A] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-2">
              {isLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-6 w-6 text-[#C9A46A] animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#5A5146]">Loading customer reviews from database...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="py-12 text-center">
                  <MessageSquare className="h-8 w-8 text-[#7A7266] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#1F1D1A]">No reviews available yet</p>
                  <p className="text-[11px] text-[#7A7266] mt-1">Reviews submitted by verified customers will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredReviews.map((rev) => (
                    <div key={rev.id} className="p-5 border border-[#E8DCC3] rounded-2xl bg-[#FAF6F0]/40 space-y-4 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-[#E8DCC3]">
                            <AvatarImage src={rev.avatar} alt={rev.name} />
                            <AvatarFallback className="bg-[#F0E7D5] text-[#1F1D1A] font-bold text-xs">
                              {rev.name ? rev.name.slice(0, 2).toUpperCase() : "CU"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-xs font-bold text-[#1F1D1A]">{rev.name}</h4>
                            <span className="text-[10px] text-[#7A7266] font-medium block">Service: {rev.serviceName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < Math.round(rev.rating || 5)
                                    ? "fill-[#C9A46A] text-[#C9A46A]"
                                    : "text-[#E8DCC3]"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#7A7266]">{rev.date}</span>
                        </div>
                      </div>

                      {rev.title && (
                        <h5 className="text-xs font-black text-[#1F1D1A] -mb-2 px-1">{rev.title}</h5>
                      )}
                      <p className="text-xs font-medium text-[#1F1D1A] leading-relaxed bg-white p-3 rounded-xl border border-[#E8DCC3]/60">
                        "{rev.comment}"
                      </p>

                      {/* EXISTING PROVIDER REPLY */}
                      {rev.reply ? (
                        <div className="pl-4 border-l-2 border-[#C9A46A] space-y-1 bg-[#F0E7D5]/40 p-3 rounded-r-xl">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#C9A46A] uppercase">
                            <CornerDownRight className="h-3 w-3" /> Provider Official Response
                          </div>
                          <p className="text-xs font-medium text-[#5A5146]">{rev.reply}</p>
                        </div>
                      ) : (
                        /* REPLY FORM */
                        <div className="space-y-2 pt-2">
                          <Input
                            placeholder="Write a public response to this review..."
                            value={replyInputs[rev.id] || ""}
                            onChange={(e) =>
                              setReplyInputs((prev) => ({ ...prev, [rev.id]: e.target.value }))
                            }
                            className="text-xs h-9 border-[#E8DCC3] focus-visible:ring-[#C9A46A] rounded-xl bg-white"
                          />
                          <Button
                            size="xs"
                            disabled={submittingReplyId === rev.id || !(replyInputs[rev.id] || "").trim()}
                            onClick={() => handleAddReplySubmit(rev.id)}
                            className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-[10px] uppercase rounded-xl h-8 px-4 border border-[#E8DCC3] cursor-pointer"
                          >
                            {submittingReplyId === rev.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Publish Reply"
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}
