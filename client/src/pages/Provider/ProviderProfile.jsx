import React, { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { formatPrice } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/avatar";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Star,
  MapPin,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  MessageSquare,
  ChevronLeft,
  CheckCircle2,
  Check,
  Briefcase,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  Mail,
  Loader2
} from "lucide-react";
import { providerService } from "@/services/providerService";
import NotFound from "@/pages/NotFound/NotFound";

export default function ProviderProfile() {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [reviewsFilter, setReviewsFilter] = useState("all");

  // Contact Dialog State
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSentSuccess, setContactSentSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setIsNotFound(false);

    const fetchProviderProfile = async () => {
      try {
        const response = await providerService.getPublicProviderProfile(providerId);
        if (response.success && response.data) {
          setProvider(response.data);
        } else {
          setIsNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load provider profile:", err);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (providerId) {
      fetchProviderProfile();
    } else {
      setIsNotFound(true);
      setIsLoading(false);
    }
  }, [providerId]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSendingContact(true);

    setTimeout(() => {
      setIsSendingContact(false);
      setContactSentSuccess(true);

      setTimeout(() => {
        setIsContactOpen(false);
        setContactSentSuccess(false);
        setContactName("");
        setContactEmail("");
        setContactSubject("");
        setContactMessage("");
      }, 1800);
    }, 1200);
  };

  if (isNotFound) {
    return <NotFound />;
  }

  if (isLoading || !provider) {
    return (
      <MainLayout>
        <div className="bg-[#FAF6F0] min-h-screen pb-16 animate-pulse">
          <section className="bg-[#FAF6F0] border-b border-[#E8DCC3] py-10 md:py-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="h-6 bg-stone-300 w-32 rounded-full mb-6"></div>
              <div className="bg-white rounded-3xl border border-[#E8DCC3] p-8 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-28 h-28 rounded-full bg-stone-300 shrink-0"></div>
                  <div className="space-y-3 w-full max-w-md">
                    <div className="h-8 bg-stone-300 w-2/3 rounded-lg"></div>
                    <div className="h-4 bg-stone-300 w-1/2 rounded-md"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-stone-300 w-20 rounded-full"></div>
                      <div className="h-6 bg-stone-300 w-24 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-white rounded-2xl border border-[#E8DCC3] p-6"></div>
                <div className="h-64 bg-white rounded-2xl border border-[#E8DCC3] p-6"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-white rounded-2xl border border-[#E8DCC3] p-6"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { stats, services = [], reviews = [], locationsServed = [] } = provider;
  const memberSinceYear = provider.memberSince ? new Date(provider.memberSince).getFullYear() : 2024;

  const filteredReviews = reviewsFilter === "all"
    ? reviews
    : reviews.filter(r => r.rating === parseInt(reviewsFilter));

  const totalReviewsCount = reviews.length;
  const ratingPercentages = {
    5: Math.round((reviews.filter(r => r.rating === 5).length / (totalReviewsCount || 1)) * 100),
    4: Math.round((reviews.filter(r => r.rating === 4).length / (totalReviewsCount || 1)) * 100),
    3: Math.round((reviews.filter(r => r.rating === 3).length / (totalReviewsCount || 1)) * 100),
    2: Math.round((reviews.filter(r => r.rating === 2).length / (totalReviewsCount || 1)) * 100),
    1: Math.round((reviews.filter(r => r.rating === 1).length / (totalReviewsCount || 1)) * 100),
  };

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* HERO BANNER SECTION */}
        <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#E8DCC3] py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            
            {/* Back Button */}
            <NavLink
              to="/services"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-[#8C4B3E] hover:text-[#783E33] transition-colors mb-6 bg-white border border-[#E8DCC3] px-3.5 py-1.5 rounded-full shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Services
            </NavLink>

            {/* Provider Card Header */}
            <div className="bg-white rounded-3xl border border-[#E8DCC3] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">
                  
                  {/* Avatar with Verification Badge */}
                  <div className="relative">
                    <UserAvatar
                      src={provider.profileImage || provider.avatar}
                      name={provider.fullName}
                      className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-[#FAF6F0] shadow-md rounded-full overflow-hidden bg-white shrink-0"
                      fallbackClassName="bg-[#8C4B3E] text-white text-2xl font-black"
                    />
                    {provider.isVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 shadow-md border-2 border-white" title="Verified Specialist">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-black text-[#1F1D1A] tracking-tight">{provider.fullName}</h1>
                      {provider.isVerified && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#8C4B3E]/10 border border-[#8C4B3E]/20 text-[#8C4B3E] text-[10px] font-extrabold uppercase tracking-wider">
                          Verified Pro
                        </span>
                      )}
                    </div>

                    <p className="text-[#5A5146] font-medium text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5">
                      <Star className="h-4 w-4 fill-[#C9A46A] text-[#C9A46A]" />
                      <span className="font-extrabold text-[#1F1D1A]">{stats?.averageRating || 5.0}</span>
                      <span className="text-[#7A7266]">({stats?.totalReviews || 0} reviews)</span>
                      <span className="mx-1 font-extrabold opacity-40">•</span>
                      <span className="text-[#5A5146] font-bold">{stats?.completedJobs || 15}+ Jobs Completed</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs font-semibold text-[#7A7266] pt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#8C4B3E]" />
                        <span>{locationsServed.join(", ")}</span>
                      </div>

                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8DCC3] hidden md:block"></span>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#8C4B3E]" />
                        <span>Member since {memberSinceYear}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                  <a href="#services-grid" className="w-full sm:w-auto">
                    <Button className="w-full h-10 px-5 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl shadow-xs border border-[#8C4B3E] cursor-pointer">
                      <Briefcase className="h-4 w-4 mr-1.5" />
                      View Services ({services.length})
                    </Button>
                  </a>

                  <Button
                    onClick={() => setIsContactOpen(true)}
                    variant="outline"
                    className="w-full sm:w-auto h-10 px-4 border-[#E8DCC3] bg-white hover:bg-[#FAF6F0] text-[#1F1D1A] font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    <Mail className="h-4 w-4 mr-1.5 text-[#8C4B3E]" />
                    Contact Specialist
                  </Button>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* PAGE CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* STATS HIGHLIGHT BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            
            <div className="bg-white border border-[#E8DCC3] rounded-2xl p-4 flex items-center gap-3 shadow-2xs hover:border-[#C9A46A] transition-colors">
              <div className="p-3 bg-[#FAF6F0] text-[#8C4B3E] rounded-xl shrink-0 border border-[#E8DCC3]">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-black text-[#1F1D1A]">{stats?.totalServices || services.length}</span>
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Services Offered</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8DCC3] rounded-2xl p-4 flex items-center gap-3 shadow-2xs hover:border-[#C9A46A] transition-colors">
              <div className="p-3 bg-[#FAF6F0] text-[#8C4B3E] rounded-xl shrink-0 border border-[#E8DCC3]">
                <ThumbsUp className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-black text-[#1F1D1A]">{stats?.completedJobs || 15}+</span>
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Jobs Completed</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8DCC3] rounded-2xl p-4 flex items-center gap-3 shadow-2xs hover:border-[#C9A46A] transition-colors">
              <div className="p-3 bg-[#FAF6F0] text-[#C9A46A] rounded-xl shrink-0 border border-[#E8DCC3]">
                <Star className="h-5 w-5 fill-[#C9A46A]" />
              </div>
              <div>
                <span className="block text-lg font-black text-[#1F1D1A]">{stats?.averageRating || 5.0} / 5.0</span>
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Avg Rating</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8DCC3] rounded-2xl p-4 flex items-center gap-3 shadow-2xs hover:border-[#C9A46A] transition-colors">
              <div className="p-3 bg-[#FAF6F0] text-[#8C4B3E] rounded-xl shrink-0 border border-[#E8DCC3]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-black text-[#1F1D1A]">{stats?.responseTime || "< 30 mins"}</span>
                <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Response Time</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* MAIN CONTENT COLUMN (SERVICES & REVIEWS) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* SECTION: SERVICES OFFERED */}
              <div id="services-grid" className="space-y-5 scroll-mt-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#8C4B3E]/10 text-[#8C4B3E] rounded-xl">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#1F1D1A]">Services Offered</h2>
                      <p className="text-xs text-[#5A5146] font-medium">Select a service to view details and book instantly</p>
                    </div>
                  </div>
                  <Badge className="bg-white text-[#8C4B3E] border border-[#E8DCC3] font-bold text-xs px-3 py-1 shadow-2xs">
                    {services.length} {services.length === 1 ? "Service" : "Services"}
                  </Badge>
                </div>

                {services.length === 0 ? (
                  <Card className="border border-[#E8DCC3] bg-white p-8 text-center rounded-2xl space-y-3">
                    <Briefcase className="h-10 w-10 text-[#7A7266] mx-auto opacity-50" />
                    <h3 className="text-sm font-bold text-[#1F1D1A]">No Active Services Found</h3>
                    <p className="text-xs text-[#7A7266] max-w-sm mx-auto">
                      This provider currently has no active service listings available for booking.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {services.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: CUSTOMER REVIEWS */}
              <Card className="border border-[#E8DCC3] bg-white p-6 rounded-2xl shadow-2xs">
                <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#FAF6F0] text-[#8C4B3E] rounded-xl border border-[#E8DCC3]">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black text-[#1F1D1A]">Customer Ratings & Reviews</CardTitle>
                      <CardDescription className="text-xs text-[#7A7266]">Verified client feedback for {provider.fullName}</CardDescription>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <Tabs value={reviewsFilter} onValueChange={setReviewsFilter} className="w-auto">
                    <TabsList className="bg-[#FAF6F0] p-1 border border-[#E8DCC3] rounded-xl h-8">
                      <TabsTrigger value="all" className="rounded-lg text-xs font-bold py-1 px-3">All</TabsTrigger>
                      <TabsTrigger value="5" className="rounded-lg text-xs font-bold py-1 px-3 flex items-center gap-0.5">5 <Star className="h-3 w-3 fill-[#C9A46A] text-[#C9A46A]" /></TabsTrigger>
                      <TabsTrigger value="4" className="rounded-lg text-xs font-bold py-1 px-3 flex items-center gap-0.5">4 <Star className="h-3 w-3 fill-[#C9A46A] text-[#C9A46A]" /></TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>

                <CardContent className="p-0 pt-6 space-y-6">
                  
                  {/* Rating Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-5 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl">
                    <div className="text-center space-y-1">
                      <span className="block text-4xl font-black text-[#1F1D1A]">{stats?.averageRating || 5.0}</span>
                      <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4.5 w-4.5 ${i < Math.floor(stats?.averageRating || 5) ? 'fill-[#C9A46A] text-[#C9A46A]' : 'text-stone-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider">Overall Satisfaction</span>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#7A7266] w-3">{stars}</span>
                          <Star className="h-3 w-3 fill-stone-400 text-stone-400 shrink-0" />
                          <Progress value={ratingPercentages[stars] || 0} className="h-1.5 flex-1 bg-[#E8DCC3]" />
                          <span className="text-xs font-semibold text-[#7A7266] w-8 text-right">{ratingPercentages[stars] || 0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-8 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                      <AlertCircle className="h-8 w-8 text-[#7A7266] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-[#7A7266]">No customer reviews recorded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredReviews.map((rev) => (
                        <div key={rev.id} className="border-b border-[#E8DCC3] pb-6 last:border-0 last:pb-0 space-y-2">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                src={rev.customerAvatar}
                                name={rev.customerName}
                                className="h-10 w-10 border border-[#E8DCC3]"
                              />
                              <div>
                                <span className="block text-sm font-bold text-[#1F1D1A]">{rev.customerName}</span>
                                <span className="text-[10px] text-[#7A7266] font-semibold">{rev.serviceTitle}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 bg-[#F0E7D5] border border-[#E8DCC3] text-[#1F1D1A] px-2 py-0.5 rounded-md shrink-0">
                              <Star className="h-3.5 w-3.5 fill-[#C9A46A] text-[#C9A46A]" />
                              <span className="font-bold text-xs">{rev.rating}.0</span>
                            </div>
                          </div>

                          {rev.title && (
                            <h4 className="text-xs font-extrabold text-[#1F1D1A]">{rev.title}</h4>
                          )}

                          <p className="text-[#5A5146] text-sm leading-relaxed">
                            {rev.comment}
                          </p>

                          {rev.reply && (
                            <div className="mt-2.5 p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3] text-xs text-[#5A5146]">
                              <span className="font-bold text-[#8C4B3E] block mb-0.5">Response from {provider.fullName}:</span>
                              <p>{rev.reply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </CardContent>
              </Card>

            </div>

            {/* SIDEBAR COLUMN (ABOUT & TRUST SIGNALS) */}
            <div className="space-y-6">
              
              {/* ABOUT CARD */}
              <Card className="border border-[#E8DCC3] bg-white p-6 rounded-2xl shadow-2xs space-y-4">
                <CardHeader className="p-0 pb-3 border-b border-[#E8DCC3] flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-[#FAF6F0] text-[#8C4B3E] rounded-xl border border-[#E8DCC3]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-[#1F1D1A]">About the Provider</CardTitle>
                    <CardDescription className="text-[11px] text-[#7A7266]">Professional background</CardDescription>
                  </div>
                </CardHeader>
                
                <p className="text-xs text-[#5A5146] leading-relaxed text-justify">
                  {provider.bio}
                </p>

                <div className="pt-3 border-t border-[#E8DCC3] space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wider block">Service Locations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {locationsServed.map((loc, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-[#FAF6F0] border-[#E8DCC3] text-[#1F1D1A] font-semibold text-[11px] px-2.5 py-1 rounded-lg">
                        <MapPin className="h-3 w-3 text-[#8C4B3E] mr-1" />
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* TRUST SIGNALS CARD */}
              <Card className="border border-[#E8DCC3] bg-white p-6 rounded-2xl shadow-2xs space-y-4">
                <CardHeader className="p-0 pb-3 border-b border-[#E8DCC3] flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-[#FAF6F0] text-[#8C4B3E] rounded-xl border border-[#E8DCC3]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-[#1F1D1A]">Verified Credentials</CardTitle>
                    <CardDescription className="text-[11px] text-[#7A7266]">Platform verification status</CardDescription>
                  </div>
                </CardHeader>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[#1F1D1A]">Government ID Verified</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[#1F1D1A]">Background Checked</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E8DCC3]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[#1F1D1A]">Satisfaction Guarantee Backed</span>
                  </div>
                </div>
              </Card>

            </div>

          </div>

        </div>

        {/* CONTACT PROVIDER DIALOG */}
        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
          <DialogContent className="sm:max-w-md bg-white border border-[#E8DCC3] rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-[#1F1D1A]">Contact {provider.fullName}</DialogTitle>
              <DialogDescription className="text-xs text-[#7A7266]">
                Send an inquiry directly to this specialist
              </DialogDescription>
            </DialogHeader>

            {contactSentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-[#1F1D1A] text-sm">Message Sent Successfully!</h3>
                <p className="text-xs text-[#7A7266]">
                  {provider.fullName} has received your inquiry and will respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Your Name</Label>
                  <Input
                    required
                    placeholder="Enter your full name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="border-[#E8DCC3] bg-[#FAF6F0] text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Email Address</Label>
                  <Input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="border-[#E8DCC3] bg-[#FAF6F0] text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Subject (Optional)</Label>
                  <Input
                    placeholder="e.g. Inquiry about availability"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="border-[#E8DCC3] bg-[#FAF6F0] text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1F1D1A]">Message</Label>
                  <Textarea
                    required
                    rows={4}
                    placeholder="Describe your service requirements or questions..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="border-[#E8DCC3] bg-[#FAF6F0] text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsContactOpen(false)}
                    className="border-[#E8DCC3] text-xs font-bold h-9 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSendingContact}
                    className="bg-[#8C4B3E] hover:bg-[#783E33] text-white font-bold text-xs h-9 cursor-pointer"
                  >
                    {isSendingContact ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </MainLayout>
  );
}
