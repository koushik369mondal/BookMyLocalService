import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  SlidersHorizontal, 
  Search, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Loader2, 
  Check, 
  CornerDownRight, 
  Sparkles, 
  Clock,
  AlertCircle,
  ThumbsUp
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
  const [replyInputs, setReplyInputs] = useState({}); // { reviewId: "text" }
  const [editingReplyIds, setEditingReplyIds] = useState({}); // { reviewId: true }
  const [editTexts, setEditTexts] = useState({}); // { reviewId: "text" }

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

    // Search query matching
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.comment.toLowerCase().includes(q) ||
        r.serviceName.toLowerCase().includes(q)
      );
    }

    // Star rating matching
    if (starFilter !== "all") {
      const minStars = parseFloat(starFilter);
      result = result.filter(r => r.rating >= minStars && r.rating < minStars + 1);
    }

    // Sort matching
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else { // lowest
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
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Customer Feedbacks</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Verify ratings breakdown and reply to client testimonials</p>
            </div>
            
            {/* Quick dashboard back button */}
            <Link to="/provider/dashboard">
              <Button size="sm" className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-5 h-9.5 backdrop-blur-xs">
                <ArrowLeft className="h-4 w-4 text-white/60 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* STATS OVERVIEW CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Avg Rating */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Rating</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">{ratingAvg} <span className="text-xs text-slate-400 font-semibold">/5</span></span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0">
                <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
              </div>
            </Card>

            {/* Total reviews */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Reviews</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</span>
              </div>
              <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl shrink-0">
                <MessageSquare className="h-6 w-6" />
              </div>
            </Card>

            {/* Response Rate */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Response Rate</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">{responseRate}%</span>
              </div>
              <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </Card>

            {/* Recommended Rate */}
            <Card className="border border-slate-100 shadow-md bg-white p-5 flex items-center justify-between gap-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommend Rate</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">{recommendRate}%</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <ThumbsUp className="h-6 w-6" />
              </div>
            </Card>

          </div>
        </section>

        {/* REVIEWS GRID LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: RATING DISTRIBUTION AND FILTERS */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* RATINGS DISTRIBUTION CARD */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2">Rating Distribution</span>
                
                <div className="space-y-3">
                  {starsBreakdown.map(item => (
                    <div key={item.star} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <span className="w-8 flex items-center justify-end gap-0.5 shrink-0">
                        {item.star} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      </span>
                      
                      <Progress value={item.percentage} className="h-2 flex-1 rounded-full bg-slate-100 [&>div]:bg-amber-500" />
                      
                      <span className="w-10 text-right text-slate-400 font-semibold shrink-0">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* FILTERING CONTROLS */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2 border-b border-slate-50 pb-2">Search & Filters</span>
                
                {/* Search */}
                <div className="space-y-1.5">
                  <Label htmlFor="searchQuery" className="text-[10px] font-bold text-slate-700">Search reviews</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-[50%] translate-y-[-50%] text-slate-450">
                      <Search className="h-4 w-4" />
                    </span>
                    <Input
                      id="searchQuery"
                      placeholder="Type keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9.5 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Rating filter */}
                <div className="space-y-1.5">
                  <Label htmlFor="starFilter" className="text-[10px] font-bold text-slate-700">Star Rating</Label>
                  <div className="relative">
                    <select
                      id="starFilter"
                      value={starFilter}
                      onChange={(e) => setStarFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="all">All Stars</option>
                      <option value="5">5 Stars only</option>
                      <option value="4">4 Stars only</option>
                      <option value="3">3 Stars only</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-1.5">
                  <Label htmlFor="sortBy" className="text-[10px] font-bold text-slate-700">Sort By</Label>
                  <div className="relative">
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="newest">Newest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                      <ChevronDown className="h-4 w-4 opacity-60" />
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
                    <Card key={i} className="border border-slate-100 bg-white p-5 rounded-2xl space-y-4 animate-pulse">
                      <div className="flex gap-3">
                        <Skeleton className="w-10 h-10 rounded-full bg-slate-200" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 bg-slate-200 w-1/4 rounded" />
                          <Skeleton className="h-3.5 bg-slate-200 w-1/3 rounded" />
                        </div>
                      </div>
                      <Skeleton className="h-10 bg-slate-200 w-full rounded-xl" />
                    </Card>
                  ))}
                </div>
              ) : filteredReviews.length === 0 ? (
                /* EMPTY STATE DISPLAY */
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto shadow-2xs mt-4">
                  <div className="p-4 bg-slate-900/5 text-slate-900 rounded-full border border-slate-900/10">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">No Reviews Found</h3>
                  <p className="text-xs text-slate-450 max-w-sm leading-relaxed">
                    We couldn't find any feedback comments matching your selection criteria. Try clearing search filters.
                  </p>
                </div>
              ) : (
                /* CARDS LISTINGS GRID */
                <div className="space-y-4">
                  {filteredReviews.map(rev => (
                    <Card key={rev.id} className="overflow-hidden border border-slate-100 bg-white p-5 rounded-2xl space-y-4 shadow-2xs">
                      
                      {/* Customer Metadata */}
                      <div className="flex items-center justify-between flex-wrap gap-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-slate-100 overflow-hidden shrink-0">
                            <AvatarImage src={rev.avatar} className="object-cover" />
                            <AvatarFallback>{rev.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-xs font-black text-slate-800 block">{rev.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-wide inline-block mt-0.5">
                              {rev.serviceName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center justify-end gap-0.5 text-amber-500">
                            {[...Array(5)].map((_, idx) => {
                              const starNum = idx + 1;
                              const isFilled = starNum <= Math.floor(rev.rating);
                              return (
                                <Star 
                                  key={idx} 
                                  className={`h-3.5 w-3.5 ${
                                    isFilled ? "fill-amber-400 text-amber-500" : "text-slate-200"
                                  }`} 
                                />
                              );
                            })}
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold block">{rev.date}</span>
                        </div>
                      </div>

                      {/* Review Comment Text */}
                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/30 p-3 rounded-xl border border-slate-100/50">
                        "{rev.comment}"
                      </p>

                      {/* Provider Reply block */}
                      {rev.reply ? (
                        /* ACTIVE REPLY BOX */
                        <div className="p-4 bg-slate-900/5 border border-slate-900/10 rounded-xl space-y-2.5 animate-fade-in relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-900 bg-slate-900/5 border border-slate-900/10 rounded-lg py-0.5 px-2.5 uppercase flex items-center gap-1">
                              <CornerDownRight className="h-3.5 w-3.5" />
                              Your Reply
                            </span>
                            
                            {/* Reply Action keys */}
                            <div className="flex items-center gap-1.5 print:hidden">
                              <button 
                                onClick={() => handleStartEdit(rev.id, rev.reply)}
                                className="p-1 text-slate-450 hover:text-slate-700 transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteReply(rev.id)}
                                className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Editable reply block */}
                          {editingReplyIds[rev.id] ? (
                            <div className="space-y-2 pt-1 animate-fade-in">
                              <Input
                                value={editTexts[rev.id] || ""}
                                onChange={(e) => setEditTexts(prev => ({ ...prev, [rev.id]: e.target.value }))}
                                className="h-9 border-slate-300 rounded-xl text-xs bg-white"
                              />
                              <div className="flex justify-end gap-1.5">
                                <Button 
                                  size="xs" 
                                  variant="outline"
                                  onClick={() => setEditingReplyIds(prev => ({ ...prev, [rev.id]: false }))}
                                  className="h-7 text-[9px] font-bold border-slate-200 bg-white"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="xs"
                                  onClick={() => handleSaveEdit(rev.id)}
                                  className="h-7 text-[9px] font-bold bg-slate-900 text-white hover:bg-slate-900"
                                >
                                  Save Reply
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                              {rev.reply}
                            </p>
                          )}
                        </div>
                      ) : (
                        /* WRITE REPLY FORM */
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 animate-fade-in">
                          <Label className="text-[10px] font-bold text-slate-500 block">No response yet. Write a reply:</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="e.g. Thanks for the feedback! Glad to assist."
                              value={replyInputs[rev.id] || ""}
                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [rev.id]: e.target.value }))}
                              className="h-9 border-slate-200 focus:ring-1 focus:ring-slate-900 rounded-xl text-xs bg-white flex-1"
                            />
                            <Button
                              onClick={() => handleAddReplySubmit(rev.id)}
                              className="bg-slate-900 hover:bg-black text-white h-9 px-4 font-bold text-xs rounded-xl"
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
    </MainLayout>
  );
}

// Chevron selector icon
function ChevronDown(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
