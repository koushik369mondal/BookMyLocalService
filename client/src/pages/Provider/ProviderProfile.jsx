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
import { ProviderAvatar } from "@/components/ui/avatar";
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
  Loader2,
  ArrowUpRight
} from "lucide-react";
import { providerService } from "@/services/providerService";
import NotFound from "@/pages/NotFound/NotFound";
import ReviewCard from "@/components/reviews/ReviewCard";

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
        <div className="min-h-screen pb-16 animate-pulse">
          <section className="border-b border-white/5 py-10 md:py-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <Skeleton className="h-6 w-32 rounded-full mb-6" />
              <div className="card-chai p-8 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Skeleton className="w-28 h-28 rounded-full shrink-0" />
                  <div className="space-y-3 w-full max-w-md">
                    <Skeleton className="h-8 w-2/3 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 rounded-2xl" />
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
      <div className="min-h-screen pb-16 font-sans">
        
        {/* HERO BANNER SECTION */}
        <section className="relative overflow-hidden border-b border-white/5 py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            
            {/* Back Button */}
            <NavLink
              to="/services"
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white transition-colors mb-6 bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" /> Back to services
            </NavLink>

            {/* Provider Card Header */}
            <div className="card-chai p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">
                  
                  {/* Avatar with Verification Badge */}
                  <div className="relative">
                    <ProviderAvatar
                      provider={provider}
                      className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-white/10 rounded-full overflow-hidden shrink-0"
                      fallbackClassName="bg-neutral-800 text-neutral-100 text-2xl font-bold"
                      size={240}
                    />
                    {provider.isVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500/90 text-white rounded-full p-1.5 border-2 border-neutral-950" title="Verified specialist">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{provider.fullName}</h1>
                      {provider.isVerified && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                          Verified pro
                        </span>
                      )}
                    </div>

                    <p className="text-neutral-400 font-medium text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white">{stats?.averageRating || 5.0}</span>
                      <span className="text-neutral-400">({stats?.totalReviews || 0} reviews)</span>
                      <span className="mx-1 font-bold opacity-30">•</span>
                      <span className="text-neutral-300 font-medium">{stats?.completedJobs || 15}+ jobs completed</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs text-neutral-400 pt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{locationsServed.join(", ")}</span>
                      </div>

                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden md:block"></span>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                        <span>Member since {memberSinceYear}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                  <a href="#services-grid" className="w-full sm:w-auto">
                    <Button variant="solid" className="w-full sm:w-auto flex items-center justify-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      View services ({services.length})
                    </Button>
                  </a>

                  <Button
                    onClick={() => setIsContactOpen(true)}
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-neutral-400" />
                    Contact specialist
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
            
            <div className="card-chai p-4 flex items-center gap-3">
              <div className="p-3 bg-white/[0.04] text-neutral-200 rounded-xl shrink-0 border border-white/10">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">{stats?.totalServices || services.length}</span>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Services offered</span>
              </div>
            </div>

            <div className="card-chai p-4 flex items-center gap-3">
              <div className="p-3 bg-white/[0.04] text-neutral-200 rounded-xl shrink-0 border border-white/10">
                <ThumbsUp className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">{stats?.completedJobs || 15}+</span>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Jobs completed</span>
              </div>
            </div>

            <div className="card-chai p-4 flex items-center gap-3">
              <div className="p-3 bg-white/[0.04] text-amber-400 rounded-xl shrink-0 border border-white/10">
                <Star className="h-5 w-5 fill-amber-400" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">{stats?.averageRating || 5.0} / 5.0</span>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Avg rating</span>
              </div>
            </div>

            <div className="card-chai p-4 flex items-center gap-3">
              <div className="p-3 bg-white/[0.04] text-neutral-200 rounded-xl shrink-0 border border-white/10">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">{stats?.responseTime || "< 30 mins"}</span>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Response time</span>
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
                    <div className="p-2 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Services offered</h2>
                      <p className="text-xs text-neutral-400">Select a service to view details and book instantly</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/10 text-neutral-300 font-medium text-xs px-3 py-1">
                    {services.length} {services.length === 1 ? "service" : "services"}
                  </Badge>
                </div>

                {services.length === 0 ? (
                  <div className="card-chai p-8 text-center space-y-3">
                    <Briefcase className="h-10 w-10 text-neutral-500 mx-auto opacity-50" />
                    <h3 className="text-sm font-semibold text-white">No active services found</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      This provider currently has no active service listings available for booking.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {services.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: CUSTOMER REVIEWS */}
              <div className="card-chai p-6 space-y-6">
                <div className="pb-4 border-b border-white/10 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Customer ratings & reviews</h3>
                      <p className="text-xs text-neutral-400">Verified client feedback for {provider.fullName}</p>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <Tabs value={reviewsFilter} onValueChange={setReviewsFilter} className="w-auto">
                    <TabsList className="bg-neutral-900/60 p-1 border border-white/10 rounded-xl h-8">
                      <TabsTrigger value="all" className="rounded-lg text-xs font-medium py-1 px-3">All</TabsTrigger>
                      <TabsTrigger value="5" className="rounded-lg text-xs font-medium py-1 px-3 flex items-center gap-1">5 <Star className="h-3 w-3 fill-amber-400 text-amber-400" /></TabsTrigger>
                      <TabsTrigger value="4" className="rounded-lg text-xs font-medium py-1 px-3 flex items-center gap-1">4 <Star className="h-3 w-3 fill-amber-400 text-amber-400" /></TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-6">
                  
                  {/* Rating Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-5 bg-white/[0.02] border border-white/10 rounded-2xl">
                    <div className="text-center space-y-1">
                      <span className="block text-4xl font-bold text-white">{stats?.averageRating || 5.0}</span>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(stats?.averageRating || 5) ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Overall satisfaction</span>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-neutral-400 w-3">{stars}</span>
                          <Star className="h-3 w-3 fill-neutral-500 text-neutral-500 shrink-0" />
                          <Progress value={ratingPercentages[stars] || 0} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium text-neutral-400 w-8 text-right">{ratingPercentages[stars] || 0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-8 bg-white/[0.02] rounded-xl border border-white/10">
                      <AlertCircle className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-neutral-400">No customer reviews recorded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReviews.map((rev) => (
                        <ReviewCard
                          key={rev.id}
                          review={rev}
                          providerName={provider.fullName}
                        />
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* SIDEBAR COLUMN (ABOUT & TRUST SIGNALS) */}
            <div className="space-y-6">
              
              {/* ABOUT CARD */}
              <div className="card-chai p-6 space-y-4">
                <div className="pb-3 border-b border-white/10 flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">About the provider</h4>
                    <p className="text-[11px] text-neutral-400">Professional background</p>
                  </div>
                </div>
                
                <p className="text-xs text-neutral-300 leading-relaxed text-justify">
                  {provider.bio}
                </p>

                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Service locations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {locationsServed.map((loc, idx) => (
                      <Badge key={idx} variant="outline" className="border-white/10 text-neutral-300 font-medium text-[11px] px-2.5 py-1 rounded-lg">
                        <MapPin className="h-3 w-3 text-neutral-400 mr-1" />
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* TRUST SIGNALS CARD */}
              <div className="card-chai p-6 space-y-4">
                <div className="pb-3 border-b border-white/10 flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Verified credentials</h4>
                    <p className="text-[11px] text-neutral-400">Platform verification status</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 bg-white/[0.02] rounded-xl border border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-neutral-200">Government ID verified</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-white/[0.02] rounded-xl border border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-neutral-200">Background checked</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-white/[0.02] rounded-xl border border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-neutral-200">Satisfaction guarantee backed</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* CONTACT PROVIDER DIALOG */}
        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
          <DialogContent className="sm:max-w-md card-chai border-white/10 p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">Contact {provider.fullName}</DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Send an inquiry directly to this specialist
              </DialogDescription>
            </DialogHeader>

            {contactSentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-sm">Message sent successfully</h3>
                <p className="text-xs text-neutral-400">
                  {provider.fullName} has received your inquiry and will respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Your name</Label>
                  <Input
                    required
                    placeholder="Enter your full name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Email address</Label>
                  <Input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Subject (optional)</Label>
                  <Input
                    placeholder="e.g. Inquiry about availability"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-300">Message</Label>
                  <Textarea
                    required
                    rows={4}
                    placeholder="Describe your service requirements or questions..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsContactOpen(false)}
                    className="text-xs font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSendingContact}
                    variant="solid"
                    className="flex items-center gap-1.5"
                  >
                    {isSendingContact ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowUpRight className="size-4" />
                      </>
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
