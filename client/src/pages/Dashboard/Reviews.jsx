import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Search, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  CornerDownRight, 
  AlertCircle,
  ThumbsUp,
  ChevronDown
} from "lucide-react";

// Mock Initial Reviews database
const initialReviews = [
  {
    id: 1,
    name: "Amanda Watson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    serviceName: "Deep Home Cleaning Service",
    rating: 5,
    comment: "Outstanding work by Sarah! She cleaned every nook and corner with high precision. Will definitely book again!",
    date: "2026-07-05",
    reply: "Thank you so much Amanda! It was a pleasure working with you. Hope to clean for you again soon!"
  },
  {
    id: 2,
    name: "Sarah Connor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    serviceName: "Sofa & Carpet Sanitization",
    rating: 4.8,
    comment: "Punctual, professional, and had all bio-safe supplies with her. Left the sofa looking brand new.",
    date: "2026-07-03",
    reply: ""
  },
  {
    id: 3,
    name: "Robert Garcia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    serviceName: "Window Washing Service",
    rating: 4.0,
    comment: "Good service, clean windows. Missed one small spot in the corner but corrected it when pointed out.",
    date: "2026-06-25",
    reply: ""
  },
  {
    id: 4,
    name: "Jessica Alba",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    serviceName: "Deep Home Cleaning Service",
    rating: 5,
    comment: "Highly recommend! Fast, thorough, and very courteous cleaning crew.",
    date: "2026-06-18",
    reply: "Appreciate the recommendation, Jessica! Glad we could help."
  }
];

export default function Reviews() {
  const navigate = useNavigate();

  // Reviews states
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Dynamic replies active state maps
  const [replyInputs, setReplyInputs] = useState({});
  const [editingReplyIds, setEditingReplyIds] = useState({});
  const [editTexts, setEditTexts] = useState({});

  // Skeleton loader simulator on filters
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [starFilter, sortBy]);

  // Reply Submit handler
  const handleAddReplySubmit = (reviewId) => {
    const text = replyInputs[reviewId];
    if (!text || text.trim() === "") return;

    setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, reply: text } : r));
    setReplyInputs(prev => ({ ...prev, [reviewId]: "" }));
  };

  // Reply Edit triggers
  const handleStartEdit = (reviewId, currentReply) => {
    setEditingReplyIds(prev => ({ ...prev, [reviewId]: true }));
    setEditTexts(prev => ({ ...prev, [reviewId]: currentReply }));
  };

  const handleSaveEdit = (reviewId) => {
    const text = editTexts[reviewId];
    if (!text || text.trim() === "") return;

    setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, reply: text } : r));
    setEditingReplyIds(prev => ({ ...prev, [reviewId]: false }));
  };

  // Reply Delete triggers
  const handleDeleteReply = (reviewId) => {
    setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, reply: "" } : r));
  };

  // Calculation for filters
  const filteredReviews = React.useMemo(() => {
    let result = [...reviewsList];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.comment.toLowerCase().includes(q) ||
        r.serviceName.toLowerCase().includes(q)
      );
    }

    if (starFilter !== "all") {
      const minStars = parseFloat(starFilter);
      result = result.filter(r => r.rating >= minStars && r.rating < minStars + 1);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

    return result;
  }, [reviewsList, searchQuery, starFilter, sortBy]);

  // Calculations for stats
  const totalCount = 142;
  const ratingAvg = 4.9;
  const responseRate = 98;
  const recommendRate = 100;

  // Star rating distribution
  const starsBreakdown = [
    { star: 5, percentage: 92 },
    { star: 4, percentage: 6 },
    { star: 3, percentage: 2 },
    { star: 2, percentage: 0 },
    { star: 1, percentage: 0 }
  ];

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Customer Feedbacks</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Verify ratings breakdown and reply to client testimonials</p>
            </div>
            
            <Link to="/provider/dashboard">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] border border-[#E8DCC3] rounded-xl text-white text-xs font-bold px-5 h-9.5 shadow-2xs cursor-pointer">
                <ArrowLeft className="h-4 w-4 text-white mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* STATS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Avg Rating */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Average Rating</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">{ratingAvg} <span className="text-xs text-[#7A7266] font-medium">/5</span></span>
              </div>
              <div className="p-3 bg-[#F0E7D5] text-[#C9A46A] rounded-2xl shrink-0 border border-[#E8DCC3]">
                <Star className="h-6 w-6 fill-[#C9A46A] text-[#C9A46A]" />
              </div>
            </Card>

            {/* Total reviews */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Total Reviews</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">{totalCount}</span>
              </div>
              <div className="p-3 bg-[#F0E7D5] text-[#C9A46A] rounded-2xl shrink-0 border border-[#E8DCC3]">
                <MessageSquare className="h-6 w-6" />
              </div>
            </Card>

            {/* Response Rate */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Response Rate</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">{responseRate}%</span>
              </div>
              <div className="p-3 bg-[#F0E7D5] text-[#C9A46A] rounded-2xl shrink-0 border border-[#E8DCC3]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </Card>

            {/* Recommended Rate */}
            <Card className="border border-[#E8DCC3] shadow-2xs bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Recommend Rate</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">{recommendRate}%</span>
              </div>
              <div className="p-3 bg-[#7DAB7D]/20 text-[#2B522B] rounded-2xl shrink-0 border border-[#7DAB7D]/30">
                <ThumbsUp className="h-6 w-6" />
              </div>
            </Card>

          </div>
        </section>

        {/* REVIEWS GRID LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: RATING DISTRIBUTION AND FILTERS */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* RATINGS DISTRIBUTION CARD */}
              <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block border-b border-[#E8DCC3] pb-2">Rating Distribution</span>
                
                <div className="space-y-3">
                  {starsBreakdown.map(item => (
                    <div key={item.star} className="flex items-center gap-3 text-xs font-bold text-[#5A5146]">
                      <span className="w-8 flex items-center justify-end gap-0.5 shrink-0">
                        {item.star} <Star className="h-3.5 w-3.5 fill-[#C9A46A] text-[#C9A46A]" />
                      </span>
                      
                      <Progress value={item.percentage} className="h-2 flex-1 rounded-full bg-[#F0E7D5] [&>div]:bg-[#C9A46A]" />
                      
                      <span className="w-10 text-right text-[#7A7266] font-medium shrink-0">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* FILTERING CONTROLS */}
              <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block mb-2 border-b border-[#E8DCC3] pb-2">Search & Filters</span>
                
                {/* Search */}
                <div className="space-y-1.5">
                  <Label htmlFor="searchQuery" className="text-[10px] font-bold text-[#7A7266]">Search reviews</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-[50%] translate-y-[-50%] text-[#7A7266]">
                      <Search className="h-4 w-4" />
                    </span>
                    <Input
                      id="searchQuery"
                      placeholder="Type keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                    />
                  </div>
                </div>

                {/* Rating filter */}
                <div className="space-y-1.5">
                  <Label htmlFor="starFilter" className="text-[10px] font-bold text-[#7A7266]">Star Rating</Label>
                  <div className="relative">
                    <select
                      id="starFilter"
                      value={starFilter}
                      onChange={(e) => setStarFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-[#E8DCC3] focus:outline-none focus:ring-2 focus:ring-[#C9A46A]/20 rounded-xl bg-white text-xs font-bold text-[#1F1D1A] cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="all">All Stars</option>
                      <option value="5">5 Stars only</option>
                      <option value="4">4 Stars only</option>
                      <option value="3">3 Stars only</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7A7266]">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-1.5">
                  <Label htmlFor="sortBy" className="text-[10px] font-bold text-[#7A7266]">Sort By</Label>
                  <div className="relative">
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-[#E8DCC3] focus:outline-none focus:ring-2 focus:ring-[#C9A46A]/20 rounded-xl bg-white text-xs font-bold text-[#1F1D1A] cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="newest">Newest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7A7266]">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

              </Card>

            </div>

            {/* RIGHT COLUMN: REVIEWS GRID LISTINGS */}
            <main className="lg:col-span-8 space-y-6">
              
              {isLoading ? (
                /* LOADING SHIMMER CARDS */
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="border border-[#E8DCC3] bg-white p-5 rounded-2xl space-y-4 animate-pulse">
                      <div className="flex gap-3">
                        <Skeleton className="w-10 h-10 rounded-full bg-[#E8DCC3]" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 bg-[#E8DCC3] w-1/4 rounded" />
                          <Skeleton className="h-3.5 bg-[#E8DCC3] w-1/3 rounded" />
                        </div>
                      </div>
                      <Skeleton className="h-10 bg-[#E8DCC3] w-full rounded-xl" />
                    </Card>
                  ))}
                </div>
              ) : filteredReviews.length === 0 ? (
                /* EMPTY STATE DISPLAY */
                <div className="bg-white border border-[#E8DCC3] rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto shadow-2xs mt-4">
                  <div className="p-4 bg-[#F0E7D5] text-[#C9A46A] rounded-full border border-[#E8DCC3]">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F1D1A] mt-2">No Reviews Found</h3>
                  <p className="text-xs text-[#7A7266] max-w-sm leading-relaxed">
                    We couldn't find any feedback comments matching your selection criteria. Try clearing search filters.
                  </p>
                </div>
              ) : (
                /* CARDS LISTINGS GRID */
                <div className="space-y-4">
                  {filteredReviews.map(rev => (
                    <Card key={rev.id} className="overflow-hidden border border-[#E8DCC3] bg-white p-5 rounded-2xl space-y-4 shadow-2xs">
                      
                      {/* Customer Metadata */}
                      <div className="flex items-center justify-between flex-wrap gap-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-[#E8DCC3] overflow-hidden shrink-0">
                            <AvatarImage src={rev.avatar} className="object-cover" />
                            <AvatarFallback className="bg-[#F0E7D5] text-[#C9A46A] font-bold">{rev.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-xs font-bold text-[#1F1D1A] block">{rev.name}</span>
                            <span className="text-[10px] text-[#C9A46A] font-bold bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E8DCC3] uppercase tracking-wide inline-block mt-0.5">
                              {rev.serviceName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center justify-end gap-0.5 text-[#C9A46A]">
                            {[...Array(5)].map((_, idx) => {
                              const starNum = idx + 1;
                              const isFilled = starNum <= Math.floor(rev.rating);
                              return (
                                <Star 
                                  key={idx} 
                                  className={`h-3.5 w-3.5 ${
                                    isFilled ? "fill-[#C9A46A] text-[#C9A46A]" : "text-[#E8DCC3]"
                                  }`} 
                                />
                              );
                            })}
                          </div>
                          <span className="text-[9px] text-[#7A7266] font-medium block">{rev.date}</span>
                        </div>
                      </div>

                      {/* Review Comment Text */}
                      <p className="text-xs text-[#5A5146] leading-relaxed font-medium bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DCC3]">
                        "{rev.comment}"
                      </p>

                      {/* Provider Reply block */}
                      {rev.reply ? (
                        /* ACTIVE REPLY BOX */
                        <div className="p-4 bg-[#F0E7D5]/60 border border-[#E8DCC3] rounded-xl space-y-2.5 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#1F1D1A] bg-white border border-[#E8DCC3] rounded-lg py-0.5 px-2.5 uppercase flex items-center gap-1">
                              <CornerDownRight className="h-3.5 w-3.5 text-[#C9A46A]" />
                              Your Reply
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleStartEdit(rev.id, rev.reply)}
                                className="p-1 text-[#7A7266] hover:text-[#C9A46A] transition-colors cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteReply(rev.id)}
                                className="p-1 text-[#8C4B3E] hover:underline transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Editable reply block */}
                          {editingReplyIds[rev.id] ? (
                            <div className="space-y-2 pt-1">
                              <Input
                                value={editTexts[rev.id] || ""}
                                onChange={(e) => setEditTexts(prev => ({ ...prev, [rev.id]: e.target.value }))}
                                className="h-9 border-[#E8DCC3] rounded-xl text-xs bg-white text-[#1F1D1A]"
                              />
                              <div className="flex justify-end gap-1.5">
                                <Button 
                                  size="xs" 
                                  variant="outline"
                                  onClick={() => setEditingReplyIds(prev => ({ ...prev, [rev.id]: false }))}
                                  className="h-7 text-[9px] font-bold border-[#E8DCC3] bg-white text-[#5A5146]"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="xs"
                                  onClick={() => handleSaveEdit(rev.id)}
                                  className="h-7 text-[9px] font-bold bg-[#C9A46A] text-white hover:bg-[#b89359] border border-[#E8DCC3]"
                                >
                                  Save Reply
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-[#1F1D1A] font-medium leading-relaxed">
                              {rev.reply}
                            </p>
                          )}
                        </div>
                      ) : (
                        /* WRITE REPLY FORM */
                        <div className="p-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl space-y-2">
                          <Label className="text-[10px] font-bold text-[#7A7266] block">No response yet. Write a reply:</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="e.g. Thanks for the feedback! Glad to assist."
                              value={replyInputs[rev.id] || ""}
                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [rev.id]: e.target.value }))}
                              className="h-9 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] flex-1"
                            />
                            <Button
                              onClick={() => handleAddReplySubmit(rev.id)}
                              className="bg-[#C9A46A] hover:bg-[#b89359] text-white h-9 px-4 font-bold text-xs rounded-xl border border-[#E8DCC3] cursor-pointer"
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      )}

                    </Card>
                  ))}
                </div>
              )}

            </main>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
