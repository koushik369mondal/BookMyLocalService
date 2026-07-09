import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

const getProviderGallery = (category) => {
  switch (category) {
    case "Home Cleaning":
      return [
        { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80", caption: "Spotless Living Room Setup" },
        { url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80", caption: "Deep Kitchen Sanitization" },
        { url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80", caption: "Polished Bathroom Counter" },
        { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80", caption: "Bedroom Bed Dressing" }
      ];
    case "Plumbing":
      return [
        { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80", caption: "Copper Pipe Soldering" },
        { url: "https://images.unsplash.com/photo-1607472586893-edb5caba0c55?auto=format&fit=crop&w=600&q=80", caption: "Water Heater Installation" },
        { url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80", caption: "Drain Snaking & Cleanup" },
        { url: "https://images.unsplash.com/photo-1542013936693-8848e574047a?auto=format&fit=crop&w=600&q=80", caption: "Leaking Faucet Replacement" }
      ];
    case "Electrical":
      return [
        { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", caption: "Smart Breaker Panel Configuration" },
        { url: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80", caption: "EV Charger Cable Running" },
        { url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80", caption: "Industrial Power Diagnostic" },
        { url: "https://images.unsplash.com/photo-1460518451285-cd7ba78488c7?auto=format&fit=crop&w=600&q=80", caption: "Chandelier Installation" }
      ];
    case "Moving & Packing":
      return [
        { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80", caption: "Cardboard Box Bubble Wrapping" },
        { url: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=600&q=80", caption: "Secured Transit Loading" },
        { url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80", caption: "Warehouse Safe Storage" },
        { url: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80", caption: "Furniture protective blankets" }
      ];
    case "Lawn & Garden":
      return [
        { url: "https://images.unsplash.com/photo-1558905619-1715497e68c6?auto=format&fit=crop&w=600&q=80", caption: "Clipped Boxwood Hedge Setup" },
        { url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80", caption: "Fresh Green Garden Clean" },
        { url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80", caption: "Patio Turf Layering" },
        { url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80", caption: "Yard Soil Aeration" }
      ];
    default:
      return [
        { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", caption: "Swedish Aroma Oil Massage" },
        { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80", caption: "Resistance Band Fitness Coach" },
        { url: "https://images.unsplash.com/photo-1519823551278-64ac92834907?auto=format&fit=crop&w=600&q=80", caption: "Hot Stone Therapy Sessions" },
        { url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80", caption: "Therapeutic Gym Exercise" }
      ];
  }
};

const getProviderReviews = (id, providerName) => {
  return [
    {
      id: 1,
      name: "Marcus Aurelius",
      avatar: null,
      rating: 5,
      date: "July 04, 2026",
      comment: `Absolutely brilliant experience. ${providerName} was on-time, polite, and extremely dedicated. Will definitely hire again!`
    },
    {
      id: 2,
      name: "Sophia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
      rating: 4,
      date: "June 27, 2026",
      comment: "Very professional job. They resolved the primary issue quickly and cleaned up after their workspace nicely."
    },
    {
      id: 3,
      name: "Julian Cole",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      rating: 5,
      date: "June 14, 2026",
      comment: "High level of skill and attention to detail. Provided recommendations on preventing future issues too."
    }
  ];
};

const buildServiceDetails = (service) => {
  const skillsData = getProviderSkills(service.category);
  const plans = getProviderPlans(service.category, service.price);
  const gallery = getProviderGallery(service.category);
  const reviews = getProviderReviews(service.id, service.provider?.fullName);

  const experience = service.id.length % 3 === 0 ? "9+ Years" : (service.id.length % 2 === 0 ? "7+ Years" : "5+ Years");

  return {
    id: service.id,
    name: service.title,
    category: service.category,
    providerName: service.provider?.fullName || "Verified Provider",
    providerImage: service.provider?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    location: service.location,
    rating: service.rating,
    reviewsCount: service.reviewCount,
    price: service.price,
    priceType: service.priceType,
    image: service.imageUrl,
    description: service.description,
    availability: service.availability,
    badge: service.badge,
    experience,
    about: `Hi! I'm ${service.provider?.fullName || "your service provider"}, a professional specialist offering top-tier ${service.category} services. With years of hands-on experience and a reputation for client satisfaction, I work hard to deliver exceptional results tailored to your specific requirements. I am fully licensed, background checked, and dedicated to safety, promptness, and quality.`,
    ...skillsData,
    gallery,
    plans,
    reviews
  };
};

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
          const details = buildServiceDetails(response.data);
          setProvider(details);
          
          // Load other services for the similar services section
          const allRes = await servicesService.getServices();
          if (allRes.success) {
            const mappedAll = allRes.data.map(service => ({
              id: service.id,
              name: service.title,
              category: service.category,
              providerName: service.provider?.fullName || "Verified Provider",
              providerImage: service.provider?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
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
        navigate(`/checkout?bookingId=${response.data.id}`);
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
        <div className="bg-slate-50 min-h-screen pb-16 animate-pulse">
          {/* Header Banner Skeleton */}
          <div className="h-64 bg-slate-200 w-full relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                <div className="w-28 h-28 rounded-full bg-slate-300 border-4 border-white shadow-md shrink-0"></div>
                <div className="space-y-3 w-full">
                  <div className="h-8 bg-slate-300 w-1/3 rounded-lg"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-slate-300 w-20 rounded-full"></div>
                    <div className="h-5 bg-slate-300 w-24 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="p-6">
                  <div className="h-6 bg-slate-200 w-1/4 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 w-full rounded"></div>
                    <div className="h-4 bg-slate-200 w-full rounded"></div>
                    <div className="h-4 bg-slate-200 w-5/6 rounded"></div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="h-6 bg-slate-200 w-1/4 rounded mb-4"></div>
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 bg-slate-200 w-24 rounded-full"></div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="h-6 bg-slate-200 w-1/4 rounded mb-4"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column Skeleton */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                  <div className="h-6 bg-slate-200 w-1/2 rounded mb-6"></div>
                  <div className="h-10 bg-slate-200 rounded-lg mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-slate-200 rounded-xl"></div>
                    <div className="h-12 bg-slate-200 rounded-xl"></div>
                  </div>
                </Card>
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
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* PROFILE HEADER HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary text-white py-12 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back Button */}
            <NavLink to="/services" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-6 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-xs">
              <ChevronLeft className="h-4 w-4" /> Back to Services
            </NavLink>

            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">
                
                {/* Profile Pic with Badge and Live Indicator */}
                <div className="relative">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white/90 shadow-xl rounded-full overflow-hidden bg-white shrink-0">
                    <AvatarImage src={provider.providerImage} className="object-cover w-full h-full" alt={provider.providerName} />
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">{provider.providerName[0]}</AvatarFallback>
                  </Avatar>
                  
                  {/* Verified Badge */}
                  <span className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1.5 shadow-md border-2 border-white" title="Verified Specialist">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{provider.providerName}</h1>
                    {provider.badge && (
                      <Badge variant="secondary" className="bg-white/15 hover:bg-white/20 border-white/10 text-white text-[10px] uppercase font-bold py-0.5 px-2">
                        {provider.badge}
                      </Badge>
                    )}
                  </div>

                  <p className="text-slate-300 font-medium text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-white">{provider.rating}</span>
                    <span className="opacity-75">({totalReviews} reviews)</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 opacity-80" />
                      <span>{provider.location}</span>
                    </div>

                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 hidden md:block"></span>

                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 opacity-80" />
                      <span>{provider.experience} Exp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Indicator */}
              <div className="shrink-0 flex flex-col items-center sm:items-end gap-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">Availability Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${
                  provider.availability === "today" 
                    ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                    : "bg-amber-500/15 border-amber-400/30 text-amber-300"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${provider.availability === "today" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
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
            <div className="lg:col-span-2 space-y-8">
              
              {/* SECTION 3: ABOUT */}
              <Card className="border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow duration-300 bg-white p-6 rounded-2xl">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-primary/5 text-primary rounded-xl">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-extrabold text-slate-900">About the Provider</CardTitle>
                    <CardDescription className="text-xs">Background and professional overview</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <p className="text-slate-600 leading-relaxed text-sm text-justify">
                    {provider.about}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-6 p-4 rounded-xl bg-slate-50/50 border border-slate-100 text-center">
                    <div>
                      <span className="block text-xl font-extrabold text-slate-900">140+</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jobs Finished</span>
                    </div>
                    <div className="border-x border-slate-100">
                      <span className="block text-xl font-extrabold text-slate-900">99%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Response Rate</span>
                    </div>
                    <div>
                      <span className="block text-xl font-extrabold text-slate-900">4.9/5</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Satisfaction</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 4: SKILLS & CERTIFICATIONS */}
              <Card className="border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow duration-300 bg-white p-6 rounded-2xl">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-primary/5 text-primary rounded-xl">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-extrabold text-slate-900">Skills & Credentials</CardTitle>
                    <CardDescription className="text-xs">Verified skills, licenses, and badges</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-5 space-y-5">
                  {/* Skills Grid */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">Specialized Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {provider.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-slate-100 hover:bg-slate-150 text-slate-700 font-semibold px-3 py-1 text-xs rounded-lg border-0">
                          <Check className="h-3 w-3 text-primary mr-1.5" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications List */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">Verified Certifications</span>
                    <div className="space-y-2">
                      {provider.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2.5 text-sm text-slate-650 bg-slate-50/50 p-2.5 border border-slate-100 rounded-xl">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <span className="font-semibold text-slate-800">{cert}</span>
                          <span className="text-[10px] bg-emerald-55 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 font-bold uppercase ml-auto">Verified</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 5: GALLERY OF PREVIOUS WORK */}
              <Card className="border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow duration-300 bg-white p-6 rounded-2xl">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-extrabold text-slate-900">Project Gallery</CardTitle>
                    <CardDescription className="text-xs">Photos of completed jobs and projects</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {provider.gallery.map((photo, index) => (
                      <div 
                        key={index} 
                        onClick={() => setZoomImage(photo)}
                        className="group relative h-28 md:h-32 rounded-xl overflow-hidden cursor-zoom-in border border-slate-150 bg-slate-50 shadow-2xs"
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.caption} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-slate-955/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ZoomIn className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity truncate">
                          {photo.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 6: CUSTOMER REVIEWS */}
              <Card className="border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow duration-300 bg-white p-6 rounded-2xl">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-extrabold text-slate-900">Client Reviews</CardTitle>
                      <CardDescription className="text-xs">Ratings and feedback from verified customers</CardDescription>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <Tabs value={reviewsFilter} onValueChange={setReviewsFilter} className="w-auto">
                    <TabsList className="bg-slate-50 p-1 border border-slate-100 rounded-xl h-8">
                      <TabsTrigger value="all" className="rounded-lg text-xs font-bold py-1 px-3">All</TabsTrigger>
                      <TabsTrigger value="5" className="rounded-lg text-xs font-bold py-1 px-3 flex items-center gap-0.5">5 <Star className="h-3 w-3 fill-amber-400 text-amber-400" /></TabsTrigger>
                      <TabsTrigger value="4" className="rounded-lg text-xs font-bold py-1 px-3 flex items-center gap-0.5">4 <Star className="h-3 w-3 fill-amber-400 text-amber-400" /></TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="p-0 pt-6">
                  
                  {/* Reviews Summary Stats Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl mb-8">
                    <div className="text-center space-y-1">
                      <span className="block text-4xl font-black text-slate-900">{avgRating}</span>
                      <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4.5 w-4.5 ${i < Math.floor(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-350'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Rating</span>
                    </div>

                    {/* Progress bars stars breakdown */}
                    <div className="md:col-span-2 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-505 w-3">{stars}</span>
                          <Star className="h-3 w-3 fill-slate-400 text-slate-400 shrink-0" />
                          <Progress value={ratingPercentages[stars]} className="h-1.5 flex-1 bg-slate-200" />
                          <span className="text-xs font-semibold text-slate-400 w-8 text-right">{ratingPercentages[stars]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-slate-100">
                      <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-505">No reviews found matching selection.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredReviews.map((rev) => (
                        <div key={rev.id} className="border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-slate-100 bg-primary/5 text-primary">
                                {rev.avatar && <AvatarImage src={rev.avatar} className="object-cover" />}
                                <AvatarFallback className="font-bold text-xs">{rev.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="block text-sm font-bold text-slate-800">{rev.name}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-100/50 py-0.5 px-2 rounded-full">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-extrabold text-amber-700">{rev.rating}.0</span>
                            </div>
                          </div>

                          <p className="text-slate-605 text-sm leading-relaxed mb-3">
                            {rev.comment}
                          </p>

                          <button className="flex items-center gap-1.5 text-slate-400 hover:text-accent text-xs font-bold transition-colors">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            Helpful (3)
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* SECTION 9: SIMILAR PROVIDERS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Similar Providers</h2>
                    <p className="text-xs text-slate-400">Other specialists offering {provider.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarProviders.map((sim) => (
                    <Card key={sim.id} className="group overflow-hidden border border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col h-full rounded-xl">
                      
                      {/* Image cover */}
                      <div className="relative h-32 w-full overflow-hidden shrink-0">
                        <img src={sim.image} alt={sim.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute top-2 left-2 bg-accent text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          {sim.rating} <Star className="h-2.5 w-2.5 fill-white text-white inline ml-0.5" />
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                        <div>
                          <h3 className="font-bold text-slate-955 text-sm line-clamp-1 group-hover:text-accent transition-colors">
                            <NavLink to={`/services/${sim.id}`} onClick={() => window.scrollTo(0,0)}>
                              {sim.name}
                            </NavLink>
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Avatar className="h-5 w-5 border border-slate-100">
                              <AvatarImage src={sim.providerImage} className="object-cover" />
                              <AvatarFallback className="text-[10px]">{sim.providerName[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] font-bold text-slate-600">{sim.providerName}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-2.5 mt-auto">
                          <span className="text-xs font-bold text-slate-950">${sim.price}<span className="text-slate-450 font-semibold text-[10px]">{sim.priceType}</span></span>
                          <NavLink to={`/services/${sim.id}`} onClick={() => window.scrollTo(0,0)}>
                            <Button size="xs" variant="outline" className="h-7 text-[10px] font-bold border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600">View Pro</Button>
                          </NavLink>
                        </div>
                      </div>

                    </Card>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: PRICING CARD, DATE/TIME SCHEDULER, CTAS */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                
                {/* PRICING & BOOKING WIDGET */}
                <Card className="border border-slate-150 shadow-md bg-white overflow-hidden rounded-2xl relative">
                  
                  {/* Banner tag overlay */}
                  <div className="bg-slate-900 text-white py-3 px-5 flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Available Pricing</span>
                    <span className="text-[11px] font-extrabold text-primary flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Vetted Rates
                    </span>
                  </div>

                  {/* Tabs select packages */}
                  <Tabs value={activePlanIdx.toString()} onValueChange={(val) => setActivePlanIdx(parseInt(val))} className="w-full">
                    <div className="px-5 pt-5 pb-3">
                      <TabsList className="grid grid-cols-3 bg-slate-50 border border-slate-150 p-1 rounded-xl h-10 shrink-0">
                        <TabsTrigger value="0" className="rounded-lg text-xs font-bold py-1.5">Basic</TabsTrigger>
                        <TabsTrigger value="1" className="rounded-lg text-xs font-bold py-1.5">Standard</TabsTrigger>
                        <TabsTrigger value="2" className="rounded-lg text-xs font-bold py-1.5">Premium</TabsTrigger>
                      </TabsList>
                    </div>

                    <CardContent className="px-5 pt-0 pb-5 border-b border-slate-100">
                      {provider.plans.map((plan, index) => (
                        <TabsContent key={index} value={index.toString()} className="mt-0 focus:outline-none">
                          <div className="space-y-3">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-extrabold text-slate-900 text-base">{plan.name}</h3>
                              <span className="text-xl font-black text-slate-900">${plan.price}<span className="text-slate-400 font-semibold text-xs">{provider.priceType}</span></span>
                            </div>

                            <p className="text-slate-505 text-xs leading-relaxed">
                              {plan.description}
                            </p>

                            <div className="space-y-1.5 pt-2">
                              {plan.inclusions.map((inc, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  <span>{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </CardContent>
                  </Tabs>

                  {/* CALENDAR & SCHEDULER */}
                  <div className="p-5 border-b border-slate-100 space-y-4">
                    
                    {/* Date select title */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" /> Select Date
                      </span>
                      {selectedDate && (
                        <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                          Selected
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
                            className={`flex flex-col items-center justify-center p-2.5 border rounded-xl min-w-[54px] snap-center transition-all ${
                              isSelected 
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                                : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{d.dayName}</span>
                            <span className="text-sm font-black mt-0.5">{d.dayNum}</span>
                            <span className="text-[9px] font-semibold opacity-70 mt-0.5">{d.month}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Date selection warning alert */}
                    {dateAlert && (
                      <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl animate-bounce">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="font-semibold">Please select a booking date first.</span>
                      </div>
                    )}

                    {/* Time slots scheduler select */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" /> Select Time Slot
                      </span>

                      {/* Time slot grids grouped */}
                      <div className="space-y-2.5">
                        {Object.entries(timeSlots).map(([groupName, slots]) => (
                          <div key={groupName} className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-405 block">{groupName}</span>
                            <div className="grid grid-cols-3 gap-2">
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
                                    className={`py-1.5 text-[11px] font-bold text-center border rounded-lg transition-all ${
                                      isSelected
                                        ? "bg-primary border-primary text-white shadow-xs"
                                        : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-350"
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

                      {/* Time slot warning alert */}
                      {timeAlert && (
                        <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl animate-bounce">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span className="font-semibold">Please select a time slot.</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* ACTION PANEL BUTTONS */}
                  <div className="p-5 bg-slate-50 space-y-3 shrink-0">
                    <Button 
                      onClick={handleBooking}
                      className="w-full bg-primary hover:bg-secondary text-white font-extrabold py-5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all hover:scale-[1.01]"
                    >
                      <CalendarCheck className="h-4.5 w-4.5" />
                      Book Appointment Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setIsContactOpen(true)}
                      className="w-full border-slate-200 bg-white text-slate-650 hover:bg-slate-100 hover:text-slate-800 font-bold py-5 rounded-xl flex items-center justify-center gap-2 text-xs"
                    >
                      <Mail className="h-4 w-4 text-slate-450" />
                      Contact {provider.providerName}
                    </Button>

                    <div className="text-center pt-2">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Fully Insured and Quality Guaranteed
                      </span>
                    </div>
                  </div>

                </Card>

                {/* HELP CARD */}
                <Card className="border border-slate-100 bg-white p-5 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-primary/5 text-primary rounded-xl shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs">Need custom service requirements?</h4>
                    <p className="text-[11px] text-slate-550 leading-relaxed">
                      Reach out to the provider via the "Contact Specialist" button. Specify your project requirements, scope, dates, and customized pricing details.
                    </p>
                  </div>
                </Card>

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
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white p-4 text-center text-sm font-semibold">
                {zoomImage.caption}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* CONTACT DIALOG MODAL */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Provider
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 pt-0.5">
              Send a direct inquiry message to {provider.providerName} for custom questions or quotes.
            </DialogDescription>
          </DialogHeader>

          {contactSentSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center rounded-full animate-bounce shadow-xs">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your direct message has been dispatched. {provider.providerName} will receive a dashboard notification and reply shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="contactName" className="text-xs font-bold text-slate-700">Your Full Name</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Amanda Cole"
                  className="rounded-xl border-slate-200 text-xs h-9.5 focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="text-xs font-bold text-slate-700">Email Address</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. amanda@example.com"
                  className="rounded-xl border-slate-200 text-xs h-9.5 focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactSubject" className="text-xs font-bold text-slate-700">Subject (Optional)</Label>
                <Input
                  id="contactSubject"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Custom scheduling inquiry"
                  className="rounded-xl border-slate-200 text-xs h-9.5 focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactMessage" className="text-xs font-bold text-slate-700">Inquiry Message</Label>
                <Textarea
                  id="contactMessage"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type details regarding the scope of work you need completed..."
                  rows={4}
                  className="rounded-xl border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                  required
                />
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsContactOpen(false)}
                  disabled={isSendingContact}
                  className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSendingContact}
                  className="rounded-xl bg-primary hover:bg-secondary text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto flex items-center justify-center gap-1.5"
                >
                  {isSendingContact ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/35 border-t-white animate-spin"></span>
                      Sending message...
                    </>
                  ) : (
                    <>
                      Send Message
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}
