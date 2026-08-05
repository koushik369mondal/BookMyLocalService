import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { servicesService, bookingsService } from "../services/api";

export const getProviderPlans = (category, basePrice) => {
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

export function useBookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const serviceId = searchParams.get("serviceId");

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePlanIdx, setActivePlanIdx] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [dateAlert, setDateAlert] = useState(false);
  const [timeAlert, setTimeAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const plans = useMemo(() => {
    if (!service) return [];
    return getProviderPlans(service.category, service.price);
  }, [service]);

  const selectedPlan = useMemo(() => {
    return plans[activePlanIdx] || plans[0] || { name: "Standard Package", price: service?.price || 0 };
  }, [plans, activePlanIdx, service]);

  const pricingBreakdown = useMemo(() => {
    const basePrice = selectedPlan ? selectedPlan.price : (service?.price || 0);
    const platformFee = 49.00;
    const tax = Math.round(basePrice * 0.18 * 100) / 100;
    const total = Math.round((basePrice + platformFee + tax) * 100) / 100;
    return { basePrice, platformFee, tax, total };
  }, [selectedPlan, service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.email.trim()) errors.email = "Email Address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = "Please enter a valid email";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";

    if (!selectedDate) setDateAlert(true);
    else setDateAlert(false);

    if (!selectedTimeSlot) setTimeAlert(true);
    else setTimeAlert(false);

    setFormErrors(errors);
    return Object.keys(errors).length === 0 && Boolean(selectedDate) && Boolean(selectedTimeSlot);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) {
      navigate(`/login?redirect=/booking?serviceId=${serviceId}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingPayload = {
        customerId: user.id,
        serviceId: service.id,
        plan: selectedPlan.name,
        date: selectedDate,
        time: selectedTimeSlot,
        price: selectedPlan.price
      };

      const response = await bookingsService.createBooking(bookingPayload);
      if (response.success && response.data) {
        const bId = response.data.id || response.data._id;
        localStorage.setItem("lastBookingId", bId);
        navigate(`/checkout?bookingId=${bId}`);
      } else {
        alert("Failed to initialize booking. Please try again.");
      }
    } catch (err) {
      console.error("Failed to create booking:", err);
      alert(err.message || "Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    serviceId,
    service,
    isLoading,
    error,
    activePlanIdx,
    setActivePlanIdx,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    formData,
    formErrors,
    dateAlert,
    timeAlert,
    isSubmitting,
    plans,
    selectedPlan,
    pricingBreakdown,
    handleInputChange,
    handleBookingSubmit,
    user
  };
}
