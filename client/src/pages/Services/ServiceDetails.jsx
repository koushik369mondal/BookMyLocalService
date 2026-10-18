import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { formatPrice } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback, ProviderAvatar } from "@/components/ui/avatar";
import { getProviderImage, getServiceImage } from "@/utils/imageUtils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Star,
  MapPin,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  MessageSquare,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  Phone,
  Mail,
  ThumbsUp,
  Sparkles,
  AlertCircle,
  Check,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from "lucide-react";
import { servicesService, bookingsService } from "../../services/api";
import { reviewsService } from "@/services/reviewsService";
import NotFound from "../NotFound/NotFound";

// Helper to generate dynamic content based on category
const getProviderSkills = (category) => {
  switch (category) {
    case "Home Cleaning":
      return {
        skills: ["Deep Sanitization", "Kitchen & Oven Cleaning", "Eco-Friendly Products", "Decluttering & Storage", "Upholstery & Carpet Care"],
        certifications: ["Certified Housekeeper Pro (CHP)", "OSHA Hazard Standards Certification", "Green Clean Certified"]
      };
    case "Plumbing":
      return {
        skills: ["Pipe Repair & Replacement", "Drain Cleaning & Unclogging", "Water Heater Maintenance", "Emergency Water Shutoff", "Leak Diagnostics"],
        certifications: ["Licensed Master Plumber (LMP)", "Advanced Hydro-Jetting Certification", "Backflow Safety License"]
      };
    case "Electrical":
      return {
        skills: ["Smart Home Integration", "Outlet & Switch Installation", "Panel Upgrades", "Light Fixture Installation", "Electrical Inspections"],
        certifications: ["Licensed Electrician Journeyman", "SmartHome Integration Specialist", "NEC Standard Safety Certified"]
      };
    case "Moving & Packing":
      return {
        skills: ["Local & Long Distance Moves", "Protective Furniture Wrapping", "Heavy Item Moving", "Secure Packing & Unpacking", "Storage Solutions"],
        certifications: ["National Moving Association Certified", "Licensed & Insured Cargo Transport", "ProMover Certified Partner"]
      };
    case "Lawn & Garden":
      return {
        skills: ["Hedge Trimming", "Grass Lawn Mowing", "Weed & Insect Control", "Garden Planting & Care", "Soil Fertilization"],
        certifications: ["Certified Landscape Designer", "Eco-friendly Pesticide Applier", "Horticultural Arts License"]
      };
    default:
      return {
        skills: ["Swedish & Deep Tissue Massage", "Muscle Recovery Therapy", "Aromatherapy Oils", "Personal Training Programs", "Diet & Nutrition Guidance"],
        certifications: ["Licensed Massage Therapist (LMT)", "Certified Strength & Conditioning Specialist", "CPR/First Aid Certified"]
      };
  }
};

const getProviderPlans = (category, basePrice) => {
  const basicPrice = basePrice;
  const standardPrice = Math.round(basePrice * 1.5);
  const premiumPrice = Math.round(basePrice * 2.2);

  switch (category) {
    case "Home Cleaning":
      return [
        { name: "Express Clean", price: basicPrice, description: "Quick dusting, vacuuming, and trash removal for standard spaces.", inclusions: ["Standard Dusting", "Vacuuming & Mopping", "Trash Disposal", "1 Bedroom & Bathroom"] },
        { name: "Premium Deep Clean", price: standardPrice, description: "Detailed top-to-bottom sanitization of kitchen, bathrooms, and bedrooms.", inclusions: ["All Basic Inclusions", "Deep Kitchen Cleaning", "Full Bathroom Scrubbing", "Cabinet Wipedowns", "Fridge Cleaning"] },
        { name: "Ultimate Move Out Package", price: premiumPrice, description: "Meticulous preparation cleanup for tenants or homeowners moving in/out.", inclusions: ["All Standard Inclusions", "Window Washing (Interior)", "Wall Spot Cleaning", "Baseboard Detailing", "Priority Re-clean Guarantee"] }
      ];
    case "Plumbing":
      return [
        { name: "Diagnostic & Fix", price: basicPrice, description: "Inspection of plumbing issues and simple repairs such as washers or small leaks.", inclusions: ["Visual Inspection", "Minor Clog Removal", "Single Pipe Patching", "Standard Tools Included"] },
        { name: "Comprehensive Repair", price: standardPrice, description: "Advanced drain clearing, faucet replacements, and toilet repairs.", inclusions: ["All Basic Inclusions", "Main Drain Snaking", "Faucet & Valve Replacement", "Garbage Disposal Fix", "1-Year Work Warranty"] },
        { name: "Major Overhaul & Emergency", price: premiumPrice, description: "Complex installations or emergency troubleshooting of water heaters and sewer lines.", inclusions: ["All Standard Inclusions", "Water Heater Installation", "Hydro-Jetting Clearance", "Emergency After-Hours Priority", "Full Parts Guarantee"] }
      ];
    case "Electrical":
      return [
        { name: "Consultation & Diagnostics", price: basicPrice, description: "Troubleshooting outlets, switches, light fixtures, or basic wiring checks.", inclusions: ["Outlet & Switch Check", "Single Fixture Repair", "Basic Safety Review"] },
        { name: "Smart Home Setup", price: standardPrice, description: "Installation of smart switches, thermostats, video doorbells, or light hubs.", inclusions: ["All Basic Inclusions", "Smart Switch Installation", "Hub Connection Setup", "Voice Assistant Integration", "Device Testing & Tutorial"] },
        { name: "EV Charger & Panel Upgrade", price: premiumPrice, description: "Heavy-duty electric vehicle charger installation or breaker panel upgrades.", inclusions: ["All Standard Inclusions", "Level 2 EV Charger Mount", "Breaker Panel Calculation", "Permit & Safety Report", "3-Year Performance Warranty"] }
      ];
    case "Moving & Packing":
      return [
        { name: "Standard Moving Assistance", price: basicPrice, description: "Standard introductory service for local moves.", inclusions: ["2 Professional Movers", "Loading & Unloading", "Transit Vehicle Included", "Basic Protective Blankets"] },
        { name: "Full Packing & Move", price: standardPrice, description: "Comprehensive professional service for local moving and packing.", inclusions: ["All Basic Inclusions", "Bubble Wrap & Box Supplies", "Specialized Furniture Wrapping", "Dismantling & Reassembly", "Cargo Insurance Protection"] },
        { name: "Deluxe Long-Distance Service", price: premiumPrice, description: "Ultimate service tier with complete coverage for out-of-city/interstate moves.", inclusions: ["All Standard Inclusions", "Priority Interstate Shipping", "Premium Item Moving (Piano/Safe)", "Full Packing & Unpacking", "Complimentary Storage (30 Days)"] }
      ];
    case "Lawn & Garden":
      return [
        { name: "Lawn Mowing & Edging", price: basicPrice, description: "Mowing, edging, and debris clean up for standard yards.", inclusions: ["Grass Mowing", "Lawn Edging", "Sidewalk Cleansing (Blower)", "Debris Bagging"] },
        { name: "Lawn & Shrub Maintenance", price: standardPrice, description: "Pruning, weed control, and fertilization for standard lawns and gardens.", inclusions: ["All Basic Inclusions", "Hedge & Shrub Trimming", "Weeding & Mulching", "Eco Fertilization Treatment"] },
        { name: "Complete Landscaping Revamp", price: premiumPrice, description: "Landscape design, soil adjustments, tree/sod planting and comprehensive cleanup.", inclusions: ["All Standard Inclusions", "Flower/Sod Planting", "Dethatching & Aeration", "Soil pH Correction", "Premium Garden Design Consultation"] }
      ];
    default:
      return [
        { name: "Express Session", price: basicPrice, description: "Quick target area massage or personal training session.", inclusions: ["45-Minute Therapy/Session", "Standard Oils/Equipment", "Muscle Focus Assessment"] },
        { name: "Classic Holistic Treatment", price: standardPrice, description: "Full length personalized service for recovery and wellness.", inclusions: ["All Basic Inclusions", "90-Minute Therapeutic Session", "Premium Organic Oils/Guides", "Post-Session Recovery Plan"] },
        { name: "Ultimate Wellness Package", price: premiumPrice, description: "Premium long form therapy/training with personal guidelines.", inclusions: ["All Standard Inclusions", "120-Minute Deep Treatment", "Personal Consultation", "Custom Nutrition Program", "24/7 Trainer Advisory Access"] }
      ];
  }
};

const getProviderGallery = (service) => {
  if (service?.imageUrl) {
    return [{ url: service.imageUrl, caption: service.title || "Service Cover Photo" }];
  }
  return [];
};

const buildServiceDetails = (service, dbReviews = [], dbAvgRating, dbTotalReviews) => {
  const categoryName = typeof service.category === "object" ? (service.category?.name || "General") : (service.category || "General");
  const skillsData = getProviderSkills(categoryName);
  const plans = getProviderPlans(categoryName, service.price);
  const gallery = getProviderGallery(service);
  const experience = "5+ Years";

  const reviews = dbReviews.map(r => ({
    id: r.id,
    name: r.customerName || r.customer?.fullName || "Verified Customer",
    avatar: r.customerAvatar || r.customer?.avatar || "",
    rating: r.rating,
    title: r.title || "",
    date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "Recent",
    comment: r.comment,
    reply: r.reply || null
  }));

  return {
    id: service.id,
    title: service.title,
    category: categoryName,
    categoryIcon: service.category?.icon || null,
    providerId: service.providerId || service.provider?.id,
    providerName: service.provider?.fullName || "Verified Provider",
    providerImage: getProviderImage(service.provider),
    provider: service.provider,
    location: service.location,
    rating: dbAvgRating !== undefined ? dbAvgRating : service.rating,
    reviewsCount: dbTotalReviews !== undefined ? dbTotalReviews : service.reviewCount,
    price: service.price,
    priceType: service.priceType,
    image: service.imageUrl,
    description: service.description,
    availability: service.availability,
    badge: service.badge,
    experience,
    about: `Hi! I'm ${service.provider?.fullName || "your service provider"}, a professional specialist offering top-tier ${categoryName} services. With years of hands-on experience and a reputation for client satisfaction, I work hard to deliver exceptional results tailored to your specific requirements. I am fully licensed, background checked, and dedicated to safety, promptness, and quality.`,
    ...skillsData,
    gallery,
    plans,
    reviews
  };
};

import ReviewCard from "@/components/reviews/ReviewCard";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);

  // Details states
  const [activePlanIdx, setActivePlanIdx] = useState(1); // Default to Standard package (idx 1)
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [reviewsFilter, setReviewsFilter] = useState("all");
  const [dateAlert, setDateAlert] = useState(false);
  const [timeAlert, setTimeAlert] = useState(false);

  // Gallery zoom dialog states
  const [zoomImage, setZoomImage] = useState(null);

  // Contact Provider dialog states
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSentSuccess, setContactSentSuccess] = useState(false);

  // Load service details from database
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setIsNotFound(false);

    const loadServiceData = async () => {
      try {
        const response = await servicesService.getServiceById(id);
        if (response.success && response.data) {
          let dbReviews = [];
          let dbAvgRating;
          let dbTotalReviews;

          try {
            const reviewsRes = await reviewsService.getServiceReviews(id);
            if (reviewsRes.success && reviewsRes.data) {
              dbReviews = reviewsRes.data.reviews || [];
              dbAvgRating = reviewsRes.data.averageRating;
              dbTotalReviews = reviewsRes.data.totalReviews;
            }
          } catch (rErr) {
            console.error("Failed to load service reviews:", rErr);
          }

          const details = buildServiceDetails(response.data, dbReviews, dbAvgRating, dbTotalReviews);
          setProvider(details);

          // Load other services for the similar services section
          const allRes = await servicesService.getServices();
          if (allRes.success) {
            const mappedAll = allRes.data.map(service => ({
              id: service.id,
              name: service.title,
              category: service.category,
              providerName: service.provider?.fullName || "Verified Provider",
              providerImage: getProviderImage(service.provider),
              provider: service.provider,
              location: service.location,
              rating: service.rating,
              reviewsCount: service.reviewCount,
              price: service.price,
              priceType: service.priceType,
              image: service.imageUrl,
              description: service.description,
              availability: service.availability,
              popularity: service.reviewCount,
              dateAdded: service.createdAt,
              badge: service.badge
            }));
            setServices(mappedAll);
          }
        } else {
          setIsNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load service details:", err);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceData();

    // Reset booking selections
    setSelectedDate("");
    setSelectedTimeSlot("");
    setDateAlert(false);
    setTimeAlert(false);
  }, [id]);

  // Generate next 7 days list dynamically
  const next7Days = React.useMemo(() => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const current = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(current.getDate() + i);
      days.push({
        dateStr: nextDate.toISOString().split("T")[0],
        dayName: dayNames[nextDate.getDay()],
        dayNum: nextDate.getDate(),
        month: months[nextDate.getMonth()]
      });
    }
    return days;
  }, []);

  // Time slot configurations
  const timeSlots = {
    "Morning": ["08:00 AM", "09:30 AM", "11:00 AM"],
    "Afternoon": ["01:00 PM", "02:30 PM", "04:00 PM"],
    "Evening": ["05:30 PM", "07:00 PM"]
  };

  const handleBooking = async () => {
    let error = false;
    if (!selectedDate) {
      setDateAlert(true);
      error = true;
    } else {
      setDateAlert(false);
    }

    if (!selectedTimeSlot) {
      setTimeAlert(true);
      error = true;
    } else {
      setTimeAlert(false);
    }

    if (error) return;

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to continue booking this service.");
      navigate(`/login?redirect=/services/${id}`);
      return;
    }

    // Get selected plan details
    const planName = provider.plans[activePlanIdx].name;
    const planPrice = provider.plans[activePlanIdx].price;

    try {
      const response = await bookingsService.createBooking({
        serviceId: provider.id,
        plan: planName,
        date: selectedDate,
        time: selectedTimeSlot,
        price: planPrice
      });

      if (response.success && response.data) {
        const bId = response.data.id || response.data._id;
        localStorage.setItem("lastBookingId", bId);
        navigate(`/checkout?bookingId=${bId}`);
      } else {
        alert(response.message || "Failed to initiate booking.");
      }
    } catch (err) {
      console.error("Booking initiation error:", err);
      alert(err.response?.data?.message || "Failed to initiate booking. Please try again.");
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSendingContact(true);

    // Simulate sending email
    setTimeout(() => {
      setIsSendingContact(false);
      setContactSentSuccess(true);

      // Auto close dialog after success message
      setTimeout(() => {
        setIsContactOpen(false);
        setContactSentSuccess(false);
        // Reset form
        setContactName("");
        setContactEmail("");
        setContactSubject("");
        setContactMessage("");
      }, 1800);
    }, 1500);
  };

  // Find similar providers in the same category
  const similarProviders = React.useMemo(() => {
    if (!provider) return [];
    const sameCat = services.filter(s => s.category === provider.category && s.id !== provider.id);
    if (sameCat.length > 0) return sameCat.slice(0, 3);

    // Fallback to top rated ones if none in same category
    return services.filter(s => s.id !== provider.id).slice(0, 3);
  }, [provider, services]);

  // Filter reviews
  const filteredReviews = React.useMemo(() => {
    if (!provider) return [];
    if (reviewsFilter === "all") return provider.reviews;
    return provider.reviews.filter(r => r.rating === parseInt(reviewsFilter));
  }, [provider, reviewsFilter]);

  if (isNotFound) {
    return <NotFound />;
  }

  if (isLoading || !provider) {
    return (
      <MainLayout>
        <div className="min-h-screen pb-16 animate-pulse">
          {/* Header Banner Skeleton */}
          <div className="h-56 bg-card/40 border-b border-border/80 w-full relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                <div className="size-24 rounded-full bg-muted border border-border shrink-0"></div>
                <div className="space-y-3 w-full">
                  <div className="h-7 bg-muted w-1/3 rounded-lg"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-muted w-20 rounded-full"></div>
                    <div className="h-4 bg-muted w-24 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card-chai p-6 space-y-3">
                  <div className="h-5 bg-muted w-1/4 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted w-full rounded"></div>
                    <div className="h-4 bg-muted w-full rounded"></div>
                    <div className="h-4 bg-muted w-5/6 rounded"></div>
                  </div>
                </div>
                <div className="card-chai p-6 space-y-3">
                  <div className="h-5 bg-muted w-1/4 rounded"></div>
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-7 bg-muted w-20 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Skeleton */}
              <div className="lg:col-span-1 space-y-6">
                <div className="card-chai p-6 space-y-4">
                  <div className="h-5 bg-muted w-1/2 rounded"></div>
                  <div className="h-9 bg-muted rounded-lg"></div>
                  <div className="h-10 bg-muted rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Calculate review stats
  const totalReviews = provider.reviews.length;
  const avgRating = provider.rating;
  const ratingPercentages = {
    5: Math.round((provider.reviews.filter(r => r.rating === 5).length / totalReviews) * 100) || 0,
    4: Math.round((provider.reviews.filter(r => r.rating === 4).length / totalReviews) * 100) || 0,
    3: Math.round((provider.reviews.filter(r => r.rating === 3).length / totalReviews) * 100) || 0,
    2: Math.round((provider.reviews.filter(r => r.rating === 2).length / totalReviews) * 100) || 0,
    1: Math.round((provider.reviews.filter(r => r.rating === 1).length / totalReviews) * 100) || 0,
  };

  return (
    <MainLayout>
      <div className="min-h-screen pb-16 font-sans text-foreground">

        {/* PROFILE HEADER HERO BANNER */}
        <section className="relative overflow-hidden border-b border-border/80 bg-card/60 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back Button */}
            <NavLink to="/services" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 border border-border/80 bg-card px-3 py-1.5 rounded-full">
              <ChevronLeft className="h-3.5 w-3.5" /> Back to services
            </NavLink>

            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">

                {/* Profile Pic with Badge */}
                <div className="relative">
                  {provider.providerId ? (
                    <NavLink to={`/providers/${provider.providerId}`}>
                      <Avatar className="size-24 sm:size-28 border border-border/80 shadow-sm rounded-full overflow-hidden bg-card shrink-0 hover:opacity-90 transition-opacity cursor-pointer">
                        <AvatarImage src={provider.providerImage} className="object-cover w-full h-full" alt={provider.providerName} />
                        <AvatarFallback className="text-xl font-medium bg-card text-foreground">{provider.providerName[0]}</AvatarFallback>
                      </Avatar>
                    </NavLink>
                  ) : (
                    <Avatar className="size-24 sm:size-28 border border-border/80 shadow-sm rounded-full overflow-hidden bg-card shrink-0">
                      <AvatarImage src={provider.providerImage} className="object-cover w-full h-full" alt={provider.providerName} />
                      <AvatarFallback className="text-xl font-medium bg-card text-foreground">{provider.providerName[0]}</AvatarFallback>
                    </Avatar>
                  )}

                  {/* Verified Badge */}
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm border-2 border-background" title="Verified Specialist">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    {provider.providerId ? (
                      <NavLink to={`/providers/${provider.providerId}`} className="hover:text-brand transition-colors">
                        <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-foreground">{provider.providerName}</h1>
                      </NavLink>
                    ) : (
                      <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-foreground">{provider.providerName}</h1>
                    )}
                    {provider.badge && (
                      <span className="border border-border/80 bg-card text-muted-foreground text-[10px] font-mono uppercase px-2 py-0.5 rounded-md">
                        {provider.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-brand text-brand" />
                    <span className="font-mono font-medium text-foreground">{provider.rating}</span>
                    <span className="text-muted-foreground">({totalReviews} reviews)</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{provider.location}</span>
                    </div>

                    <span className="size-1 rounded-full bg-border hidden md:block"></span>

                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      <span>{provider.experience} Exp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Indicator */}
              <div className="shrink-0 flex flex-col items-center sm:items-end gap-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Availability</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono ${
                  provider.availability === "today"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-border/80 bg-card text-muted-foreground"
                }`}>
                  <span className={`size-1.5 rounded-full ${provider.availability === "today" ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"}`} />
                  Available {provider.availability === "today" ? "Today" : (provider.availability === "weekend" ? "This Weekend" : "This Week")}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* PAGE GRID CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: ABOUT, SKILLS, GALLERY, REVIEWS */}
            <div className="lg:col-span-2 space-y-6">

              {/* ABOUT */}
              <div className="card-chai p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                  <div className="p-2 rounded-xl bg-foreground/5 text-foreground border border-border/70">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-base text-foreground">About the provider</h3>
                    <p className="text-xs text-muted-foreground">Background and professional overview</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {provider.about}
                </p>
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/70 text-center">
                  <div>
                    <span className="block text-xl font-mono font-medium text-foreground">140+</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Jobs finished</span>
                  </div>
                  <div className="border-x border-border/70">
                    <span className="block text-xl font-mono font-medium text-foreground">99%</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Response rate</span>
                  </div>
                  <div>
                    <span className="block text-xl font-mono font-medium text-foreground">4.9/5</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Satisfaction</span>
                  </div>
                </div>
              </div>

              {/* SKILLS & CERTIFICATIONS */}
              <div className="card-chai p-6 space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                  <div className="p-2 rounded-xl bg-foreground/5 text-foreground border border-border/70">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-base text-foreground">Skills and credentials</h3>
                    <p className="text-xs text-muted-foreground">Verified skills, licenses, and badges</p>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Specialized skills</span>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center border border-border/80 bg-card/60 text-foreground px-2.5 py-1 text-xs rounded-lg">
                        <Check className="h-3 w-3 mr-1.5 text-muted-foreground" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications List */}
                <div className="space-y-2 pt-2 border-t border-border/70">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Verified certifications</span>
                  <div className="space-y-2">
                    {provider.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2.5 text-xs text-muted-foreground bg-card/60 p-2.5 border border-border/80 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="font-medium text-foreground">{cert}</span>
                        <span className="text-[10px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono uppercase ml-auto">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* GALLERY OF PREVIOUS WORK */}
              <div className="card-chai p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-border/80">
                  <div className="p-2 rounded-xl bg-foreground/5 text-foreground border border-border/70">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-base text-foreground">Project gallery</h3>
                    <p className="text-xs text-muted-foreground">Photos of completed jobs and projects</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {provider.gallery.map((photo, index) => (
                    <div
                      key={index}
                      onClick={() => setZoomImage(photo)}
                      className="group relative h-28 md:h-32 rounded-xl overflow-hidden cursor-zoom-in border border-border/80 bg-card"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ZoomIn className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity truncate">
                        {photo.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CUSTOMER REVIEWS */}
              <div className="card-chai p-6 space-y-6">
                <div className="flex flex-row items-center justify-between flex-wrap gap-4 pb-4 border-b border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-foreground/5 text-foreground border border-border/70">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-medium text-base text-foreground">Client reviews</h3>
                      <p className="text-xs text-muted-foreground">Ratings and feedback from verified customers</p>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <Tabs value={reviewsFilter} onValueChange={setReviewsFilter} className="w-auto">
                    <TabsList className="bg-muted/40 p-1 border border-border/80 rounded-xl h-8">
                      <TabsTrigger value="all" className="rounded-lg text-xs py-0.5 px-2.5">All</TabsTrigger>
                      <TabsTrigger value="5" className="rounded-lg text-xs py-0.5 px-2.5 flex items-center gap-1">5 <Star className="h-3 w-3 fill-brand text-brand" /></TabsTrigger>
                      <TabsTrigger value="4" className="rounded-lg text-xs py-0.5 px-2.5 flex items-center gap-1">4 <Star className="h-3 w-3 fill-brand text-brand" /></TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Reviews Summary Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 rounded-xl border border-border/80 bg-card/60">
                  <div className="text-center space-y-1">
                    <span className="block text-3xl font-mono font-medium text-foreground">{avgRating}</span>
                    <div className="flex justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'fill-brand text-brand' : 'text-border'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Overall rating</span>
                  </div>

                  {/* Progress bars stars breakdown */}
                  <div className="md:col-span-2 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground w-3">{stars}</span>
                        <Star className="h-3 w-3 fill-border text-border shrink-0" />
                        <Progress value={ratingPercentages[stars]} className="h-1.5 flex-1 bg-muted" />
                        <span className="text-xs font-mono text-muted-foreground w-8 text-right">{ratingPercentages[stars]}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8 rounded-xl border border-border/80 bg-card/40">
                    <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No reviews found matching selection.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReviews.map((rev) => (
                      <ReviewCard
                        key={rev.id}
                        review={rev}
                        providerName={provider.providerName}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* SIMILAR PROVIDERS */}
              {similarProviders.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand" />
                    <h3 className="font-heading font-medium text-base text-foreground">Similar providers</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {similarProviders.map((sim) => (
                      <div key={sim.id} className="card-chai p-4 rounded-xl flex flex-col justify-between hover:border-foreground/30 transition-all">
                        <div className="space-y-2">
                          <div className="relative h-28 w-full overflow-hidden rounded-lg border border-border/70">
                            <img src={sim.image} alt={sim.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                          </div>
                          <h4 className="font-heading font-medium text-xs text-foreground line-clamp-1">
                            <NavLink to={`/services/${sim.id}`} onClick={() => window.scrollTo(0, 0)} className="hover:text-brand">
                              {sim.name}
                            </NavLink>
                          </h4>
                          <p className="text-[11px] text-muted-foreground">{sim.providerName}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/70 pt-2.5 mt-3">
                          <span className="text-xs font-mono font-medium text-foreground">{formatPrice(sim.price, { priceType: sim.priceType })}</span>
                          <NavLink to={`/services/${sim.id}`} onClick={() => window.scrollTo(0, 0)}>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5">View</Button>
                          </NavLink>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: PRICING CARD, DATE/TIME SCHEDULER, CTAS */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">

                {/* PRICING & BOOKING WIDGET */}
                <div className="card-chai rounded-2xl overflow-hidden relative">

                  {/* Banner tag overlay */}
                  <div className="bg-muted/40 py-2.5 px-5 flex items-center justify-between border-b border-border/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Select plan</span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                      <ShieldCheck className="h-3.5 w-3.5" /> Guaranteed rate
                    </span>
                  </div>

                  {/* Tabs select packages */}
                  <Tabs value={activePlanIdx.toString()} onValueChange={(val) => setActivePlanIdx(parseInt(val))} className="w-full">
                    <div className="px-5 pt-4 pb-2">
                      <TabsList className="grid grid-cols-3 bg-muted/40 border border-border/80 p-1 rounded-xl h-9">
                        <TabsTrigger value="0" className="rounded-lg text-xs py-1">Basic</TabsTrigger>
                        <TabsTrigger value="1" className="rounded-lg text-xs py-1">Standard</TabsTrigger>
                        <TabsTrigger value="2" className="rounded-lg text-xs py-1">Premium</TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="px-5 pt-0 pb-4 border-b border-border/80">
                      {provider.plans.map((plan, index) => (
                        <TabsContent key={index} value={index.toString()} className="mt-0 focus:outline-none">
                          <div className="space-y-3">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-heading font-medium text-foreground text-sm">{plan.name}</h4>
                              <span className="text-xl font-mono font-medium text-foreground">{formatPrice(plan.price, { priceType: provider.priceType })}</span>
                            </div>

                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {plan.description}
                            </p>

                            <div className="space-y-1.5 pt-1">
                              {plan.inclusions.map((inc, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  <span>{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>

                  {/* CALENDAR & SCHEDULER */}
                  <div className="p-5 border-b border-border/80 space-y-4">

                    {/* Date select title */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Select date
                      </span>
                      {selectedDate && (
                        <span className="text-[10px] font-mono text-muted-foreground border border-border/80 bg-card px-2 py-0.5 rounded-full">
                          {selectedDate}
                        </span>
                      )}
                    </div>

                    {/* Date horizontal strip */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x">
                      {next7Days.map((d, index) => {
                        const isSelected = selectedDate === d.dateStr;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedDate(d.dateStr);
                              setDateAlert(false);
                            }}
                            className={`flex flex-col items-center justify-center p-2 border rounded-xl min-w-[50px] snap-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-foreground text-background border-foreground font-semibold"
                                : "bg-card border-border/80 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                            }`}
                          >
                            <span className="text-[9px] uppercase font-mono tracking-wider opacity-80">{d.dayName}</span>
                            <span className="text-sm font-mono mt-0.5">{d.dayNum}</span>
                            <span className="text-[9px] font-mono opacity-70">{d.month}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Date selection warning alert */}
                    {dateAlert && (
                      <div className="flex items-center gap-2 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Please select a booking date first.</span>
                      </div>
                    )}

                    {/* Time slots scheduler select */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Select time slot
                      </span>

                      <div className="space-y-2">
                        {Object.entries(timeSlots).map(([groupName, slots]) => (
                          <div key={groupName} className="space-y-1">
                            <span className="text-[10px] font-mono text-muted-foreground block">{groupName}</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {slots.map((slot) => {
                                const isSelected = selectedTimeSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => {
                                      setSelectedTimeSlot(slot);
                                      setTimeAlert(false);
                                    }}
                                    className={`py-1 text-[11px] font-mono text-center border rounded-lg transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-card border-border/80 text-muted-foreground hover:border-foreground/30"
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {timeAlert && (
                        <div className="flex items-center gap-2 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>Please select a time slot.</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* ACTION PANEL BUTTONS */}
                  <div className="p-5 space-y-2.5">
                    <Button
                      onClick={handleBooking}
                      variant="solid"
                      className="w-full h-11 text-xs justify-center cursor-pointer"
                    >
                      <CalendarCheck className="h-4 w-4 mr-1.5" />
                      Book appointment now
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setIsContactOpen(true)}
                      className="w-full h-10 text-xs justify-center cursor-pointer"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      Contact {provider.providerName}
                    </Button>

                    <div className="text-center pt-2">
                      <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Fully insured and quality guaranteed
                      </span>
                    </div>
                  </div>

                </div>

                {/* HELP CARD */}
                <div className="card-chai p-4 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-card text-muted-foreground shrink-0 border border-border/70">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-medium text-foreground text-xs">Custom requirements?</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Reach out via "Contact Specialist" to specify custom project requirements, dates, or customized pricing.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* GALLERY LIGHTBOX POPUP DIALOG */}
      {zoomImage && (
        <Dialog open={zoomImage !== null} onOpenChange={(open) => { if (!open) setZoomImage(null); }}>
          <DialogContent className="max-w-3xl border-0 p-0 overflow-hidden bg-black/95">
            <div className="relative aspect-video max-h-[80vh] flex items-center justify-center">
              <img src={zoomImage.url} alt={zoomImage.caption} className="max-w-full max-h-full object-contain" />
              <div className="absolute bottom-0 inset-x-0 bg-black/80 text-white p-3 text-center text-xs font-mono">
                {zoomImage.caption}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* CONTACT DIALOG MODAL */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-md card-chai p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact specialist
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-0.5">
              Send an inquiry to {provider.providerName} for questions or quotes.
            </DialogDescription>
          </DialogHeader>

          {contactSentSuccess ? (
            <div className="py-6 text-center space-y-2">
              <div className="mx-auto size-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center rounded-full">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-medium text-foreground text-sm">Message sent</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Your message has been dispatched. {provider.providerName} will reply shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <Label htmlFor="contactName" className="text-xs font-medium text-foreground">Your name</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Amanda Cole"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contactEmail" className="text-xs font-medium text-foreground">Email address</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. amanda@example.com"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contactSubject" className="text-xs font-medium text-foreground">Subject (optional)</Label>
                <Input
                  id="contactSubject"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Custom scheduling inquiry"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contactMessage" className="text-xs font-medium text-foreground">Inquiry message</Label>
                <Textarea
                  id="contactMessage"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type details regarding the scope of work you need completed..."
                  rows={4}
                  className="text-xs"
                  required
                />
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsContactOpen(false)}
                  disabled={isSendingContact}
                  className="text-xs h-9 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSendingContact}
                  variant="solid"
                  className="text-xs h-9 px-5 w-full sm:w-auto"
                >
                  {isSendingContact ? "Sending..." : "Send message"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}
