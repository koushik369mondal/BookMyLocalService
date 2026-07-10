import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { servicesService, bookingsService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Info,
  Check,
  AlertCircle,
  Loader2,
  DollarSign
} from "lucide-react";

// Helpers to get matching category styling
const getCategoryStyles = (category) => {
  switch (category) {
    case "Home Cleaning":
      return "bg-pink-50 text-pink-600 border-pink-100";
    case "Plumbing":
      return "bg-primary/5 text-primary border-primary/10";
    case "Electrical":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "Moving & Packing":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Lawn & Garden":
      return "bg-lime-50 text-lime-600 border-lime-100";
    case "Wellness & Personal":
      return "bg-rose-50 text-rose-600 border-rose-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
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

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const serviceId = searchParams.get("serviceId");

  // Booking details states
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePlanIdx, setActivePlanIdx] = useState(1); // Default to Standard
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Customer form details state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: ""
  });

  // Validation feedback alerts
  const [formErrors, setFormErrors] = useState({});
  const [dateAlert, setDateAlert] = useState(false);
  const [timeAlert, setTimeAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepopulate form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || ""
      });
    }
  }, [user]);

  // Load service from database
  useEffect(() => {
    if (!serviceId) {
      setIsLoading(false);
      return;
    }

    const loadService = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await servicesService.getServiceById(serviceId);
        if (response.success && response.data) {
          setService(response.data);
        } else {
          setError("Service not found in the database.");
        }
      } catch (err) {
        console.error("Failed to load service for booking page:", err);
        setError("Error loading service details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  // Generate next 7 days list dynamically
  const next7Days = useMemo(() => {
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

  const timeSlots = {
    "Morning": ["08:00 AM", "09:30 AM", "11:00 AM"],
    "Afternoon": ["01:00 PM", "02:30 PM", "04:00 PM"],
    "Evening": ["05:30 PM", "07:00 PM"]
  };

  const plans = useMemo(() => {
    if (!service) return [];
    return getProviderPlans(service.category, service.price);
  }, [service]);

  // Pricing calculations
  const selectedPlan = plans[activePlanIdx] || null;
  const basePrice = selectedPlan ? selectedPlan.price : 0;
  const platformFee = 4.99;
  const tax = Math.round(basePrice * 0.085 * 100) / 100; // 8.5%
  const total = Math.round((basePrice + platformFee + tax) * 100) / 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone)) {
      errors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) {
      errors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      errors.zipCode = "ZIP code must be 5 digits";
    }
    return errors;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    // Check authentication first
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed with booking.");
      navigate(`/login?redirect=/booking?serviceId=${serviceId}`);
      return;
    }

    let hasErrors = false;

    // Validate date selection
    if (!selectedDate) {
      setDateAlert(true);
      hasErrors = true;
    } else {
      setDateAlert(false);
    }

    // Validate time selection
    if (!selectedTimeSlot) {
      setTimeAlert(true);
      hasErrors = true;
    } else {
      setTimeAlert(false);
    }

    // Validate form inputs
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      hasErrors = true;
    }

    if (hasErrors) {
      // Scroll to error or display message
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create a pending booking on backend
      const createResponse = await bookingsService.createBooking({
        serviceId: service.id,
        plan: selectedPlan.name,
        date: selectedDate,
        time: selectedTimeSlot,
        price: basePrice
      });

      if (createResponse.success && createResponse.data) {
        const bookingId = createResponse.data.id;

        // 2. Save custom customer details to the booking
        await bookingsService.updateBooking(bookingId, {
          billingName: formData.fullName,
          billingEmail: formData.email,
          billingPhone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        });

        // 3. Navigate to checkout page
        navigate(`/checkout?bookingId=${bookingId}`);
      } else {
        alert(createResponse.message || "Failed to initiate booking.");
      }
    } catch (err) {
      console.error("Failed to book service:", err);
      alert(err.response?.data?.message || "Failed to complete booking process. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-slate-50 min-h-screen py-12 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-semibold text-secondary">Loading service details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !serviceId || !service) {
    return (
      <MainLayout>
        <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center px-4">
          <Card className="max-w-md w-full border border-border text-center shadow-lg p-8">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-2">
                <AlertCircle className="h-6 w-6 text-rose-500" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">No Service Selected</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                {error || "To schedule a booking, please select one of our premium services from our services directory first."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              <Link to="/services">
                <Button className="w-full bg-primary hover:bg-secondary text-white rounded-xl h-11 font-bold shadow-xs">
                  Browse Services
                </Button>
              </Link>
              <Link to="/" className="text-xs text-slate-400 hover:text-primary font-semibold transition-colors">
                Back to Home Page
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header breadcrumb bar */}
          <div className="mb-8">
            <Link to={`/services/${service.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-all">
              <ArrowLeft className="h-4 w-4" /> Back to Details
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Schedule Your Booking</h1>
            <p className="text-sm text-slate-500">Customize plan parameters, select your scheduling slot, and review pricing.</p>
          </div>

          <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: OPTIONS AND DETAILS */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SERVICE CARD & PROVIDER COMPACT BOX */}
              <Card className="border border-slate-150 overflow-hidden shadow-sm bg-white p-0 gap-0">
                <div className="flex flex-col sm:flex-row gap-5 p-5">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full sm:w-44 h-32 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${getCategoryStyles(service.category)}`}>
                          {service.category}
                        </span>
                        {service.badge && (
                          <span className="text-[10px] bg-accent text-primary font-bold px-2 py-0.5 rounded-full">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-black text-slate-900 mt-2 leading-tight">{service.title}</h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{service.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                      {/* Provider badge */}
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border border-slate-100">
                          <AvatarImage src={service.provider?.avatar || ""} />
                          <AvatarFallback className="text-[10px] font-black">{service.provider?.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Provider</span>
                          <span className="text-xs font-bold text-slate-800 leading-none">{service.provider?.fullName || "Verified Specialist"}</span>
                        </div>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-800 gap-1 border-0 hover:bg-slate-100 text-[11px] font-bold">
                          ★ {service.rating.toFixed(1)}
                        </Badge>
                        <span className="text-[10px] text-slate-400">({service.reviewCount} Reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* PLAN / PACKAGE SELECTION TABS */}
              <Card className="border border-slate-150 shadow-sm bg-white">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Choose Service Tier
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-455">Select a pricing plan matching your work requirements.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <Tabs value={activePlanIdx.toString()} onValueChange={(val) => setActivePlanIdx(parseInt(val))} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full bg-slate-100 p-1 rounded-xl h-11">
                      {plans.map((plan, idx) => (
                        <TabsTrigger
                          key={idx}
                          value={idx.toString()}
                          className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-primary transition-all cursor-pointer"
                        >
                          {plan.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {plans.map((plan, idx) => (
                      <TabsContent key={idx} value={idx.toString()} className="mt-4 pt-2 border-t border-slate-50 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-slate-900 text-base">{plan.name} Package</h3>
                          <span className="text-xl font-black text-slate-905">${plan.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
                        
                        <div className="space-y-2 pt-1.5">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">What's Included:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {plan.inclusions.map((inc, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-655 font-medium">
                                <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                  <Check className="h-3 w-3 text-emerald-600" />
                                </div>
                                <span>{inc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* DATE & TIME PICKER */}
              <Card className="border border-slate-150 shadow-sm bg-white">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="h-4.5 w-4.5 text-primary" /> Select Schedule Date & Time
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-455">Choose a convenient date and arrival window for your service dispatch.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-6">
                  
                  {/* Date strips */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Available Days</span>
                      {selectedDate && (
                        <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                          {selectedDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
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
                            className={`flex flex-col items-center justify-center p-3 border rounded-2xl min-w-[62px] snap-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                                : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-85">{d.dayName}</span>
                            <span className="text-base font-black mt-0.5 leading-none">{d.dayNum}</span>
                            <span className="text-[9px] font-bold opacity-75 mt-1">{d.month}</span>
                          </button>
                        );
                      })}
                    </div>
                    {dateAlert && (
                      <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl mt-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="font-bold">Please select a booking date to proceed.</span>
                      </div>
                    )}
                  </div>

                  {/* Time slots scheduler */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Available Time Slots</span>
                    
                    <div className="space-y-3">
                      {Object.entries(timeSlots).map(([groupName, slots]) => (
                        <div key={groupName} className="space-y-1.5">
                          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider block uppercase">{groupName}</span>
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
                                  className={`py-2 text-xs font-bold text-center border rounded-xl transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-primary border-primary text-white shadow-xs"
                                      : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50 hover:border-slate-300"
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
                      <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl mt-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="font-bold">Please select a time slot to proceed.</span>
                      </div>
                    )}
                  </div>

                </CardContent>
              </Card>

              {/* CUSTOMER DETAILS FORM */}
              <Card className="border border-slate-150 shadow-sm bg-white">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="h-4.5 w-4.5 text-primary" /> Service Address & Customer Details
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-455">Please fill in where the service professional should be dispatched.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  
                  {/* Grid for Name, Email, Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Contact Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sarah Connor"
                        className={`h-10 rounded-xl border-slate-200 focus-visible:ring-primary ${formErrors.fullName ? "border-rose-350" : ""}`}
                      />
                      {formErrors.fullName && <p className="text-[10px] font-semibold text-rose-600 mt-0.5">{formErrors.fullName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. name@example.com"
                        className={`h-10 rounded-xl border-slate-200 focus-visible:ring-primary ${formErrors.email ? "border-rose-350" : ""}`}
                      />
                      {formErrors.email && <p className="text-[10px] font-semibold text-rose-600 mt-0.5">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 555-555-5555"
                        className={`h-10 rounded-xl border-slate-200 focus-visible:ring-primary ${formErrors.phone ? "border-rose-350" : ""}`}
                      />
                      {formErrors.phone && <p className="text-[10px] font-semibold text-rose-600 mt-0.5">{formErrors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="street" className="text-xs font-bold text-slate-700">Street Address</Label>
                      <Input
                        id="street"
                        name="street"
                        type="text"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="e.g. 123 Main St, Apt 4B"
                        className={`h-10 rounded-xl border-slate-200 focus-visible:ring-primary ${formErrors.street ? "border-rose-350" : ""}`}
                      />
                      {formErrors.street && <p className="text-[10px] font-semibold text-rose-600 mt-0.5">{formErrors.street}</p>}
                    </div>
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-slate-700">City</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Brooklyn"
                        className={`h-10 rounded-xl border-slate-200 focus-visible:ring-primary ${formErrors.city ? "border-rose-350" : ""}`}
                      />
                      {formErrors.city && <p className="text-[10px] font-semibold text-rose-600 mt-0.5">{formErrors.city}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="state" className="text-xs font-bold text-slate-700">State</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g. NY"
                        className={`h-10 rounded-xl border-slate-200 focus-visible:ring-primary ${formErrors.state ? "border-rose-350" : ""}`}
                      />
                      {formErrors.state && <p className="text-[10px] font-semibold text-rose-600 mt-0.5">{formErrors.state}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="zipCode" className="text-xs font-bold text-slate-700">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 11201"
                        className={`h-10 rounded-xl border-slate-200 focus-visible:ring-primary ${formErrors.zipCode ? "border-rose-350" : ""}`}
                      />
                      {formErrors.zipCode && <p className="text-[10px] font-semibold text-rose-600 mt-0.5">{formErrors.zipCode}</p>}
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR (STICKY) */}
            <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
              
              <Card className="border border-slate-150 shadow-md bg-white">
                <CardHeader className="p-5 pb-3 border-b border-slate-50 bg-slate-50/50">
                  <CardTitle className="text-sm font-bold text-slate-800">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  
                  {/* Summary grid */}
                  <div className="space-y-3.5 text-xs">
                    
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-slate-450 font-medium">Selected Service</span>
                      <span className="font-bold text-slate-800 text-right">{service.title}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 font-medium">Provider</span>
                      <span className="font-bold text-slate-800">{service.provider?.fullName || "Verified Provider"}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 font-medium">Selected Plan</span>
                      <span className="font-bold text-primary bg-slate-100 px-2 py-0.5 rounded-md">{selectedPlan?.name || "Standard"}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                      <span className="text-slate-450 font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Date</span>
                      <span className={`font-bold ${selectedDate ? "text-slate-800" : "text-rose-500 font-semibold"}`}>
                        {selectedDate || "Not selected"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> Time Slot</span>
                      <span className={`font-bold ${selectedTimeSlot ? "text-slate-800" : "text-rose-500 font-semibold"}`}>
                        {selectedTimeSlot || "Not selected"}
                      </span>
                    </div>

                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-slate-150 pt-4 space-y-2.5">
                    <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider block">Price Breakdown</span>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Base Package Price</span>
                      <span className="font-bold text-slate-800">${basePrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Platform Safety Fee</span>
                      <span className="font-bold text-slate-800">${platformFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Taxes (8.5%)</span>
                      <span className="font-bold text-slate-800">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm border-t border-slate-150 pt-3 mt-1.5">
                      <span className="font-extrabold text-slate-900">Total Amount</span>
                      <span className="font-black text-primary text-base">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Guarantee banner */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-650 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10.5px] font-black text-emerald-800 block leading-tight">Happiness Guarantee Active</span>
                      <p className="text-[9.5px] text-emerald-600 leading-tight mt-0.5">Your satisfaction is backed by our customer support. Secure payment authorization holds apply.</p>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-secondary text-white rounded-xl h-11 font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Scheduling...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium text-center">
                    <Info className="h-3 w-3 shrink-0" />
                    <span>You won't be charged until completing checkout.</span>
                  </div>

                </CardContent>
              </Card>

            </div>

          </form>

        </div>
      </div>
    </MainLayout>
  );
}
