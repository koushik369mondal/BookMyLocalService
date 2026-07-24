import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MainLayout from "../../layouts/MainLayout";
import { checkoutService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Tag, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  Percent, 
  ArrowLeft,
  Building,
  Check,
  QrCode,
  DollarSign,
  AlertCircle
} from "lucide-react";

// Zod Checkout validation schema with conditional card values
const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }).regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {
    message: "Please enter a valid 10-digit phone number"
  }),
  street: z.string().min(5, { message: "Street Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().regex(/^\d{6}$/, { message: "PIN code must be 6 digits" }),
  paymentMethod: z.enum(["upi", "card", "netbanking", "wallet", "cash"], {
    errorMap: () => ({ message: "Please select a payment method" })
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms & conditions to proceed"
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "card") {
    const cleanedCard = (data.cardNumber || "").replace(/\s+/g, "");
    if (!data.cardNumber || !/^\d{16}$/.test(cleanedCard)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid 16-digit credit card number",
        path: ["cardNumber"]
      });
    }
    if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter expiry date in MM/YY format",
        path: ["cardExpiry"]
      });
    }
    if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid 3-4 digit CVC",
        path: ["cardCvc"]
      });
    }
  }
});

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Booking ID from query params
  const bookingId = searchParams.get("bookingId");

  // Booking state loaded from database
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Coupon / Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState("");
  const [promoErrorMsg, setPromoErrorMsg] = useState("");

  // Payment execution states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form hooks
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "card",
      acceptTerms: false,
      cardNumber: "",
      cardExpiry: "",
      cardCvc: ""
    }
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const acceptTermsValue = watch("acceptTerms");

  // Load checkout details on mount
  useEffect(() => {
    const fetchCheckout = async () => {
      if (!bookingId) {
        setError("Invalid checkout URL: booking ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await checkoutService.getCheckoutDetails(bookingId);
        if (response.success && response.data) {
          setBooking(response.data);
          
          const b = response.data;
          if (b.customer) {
            setValue("fullName", b.billingName || b.customer.fullName || "");
            setValue("email", b.billingEmail || b.customer.email || "");
            setValue("phone", b.billingPhone || b.customer.phone || "");
          }
          if (b.street) setValue("street", b.street);
          if (b.city) setValue("city", b.city);
          if (b.state) setValue("state", b.state);
          if (b.zipCode) setValue("zipCode", b.zipCode);
          if (b.paymentMethod) setValue("paymentMethod", b.paymentMethod);
          if (b.discount) setAppliedDiscount(b.discount);
        } else {
          setError(response.message || "Failed to load checkout details.");
        }
      } catch (err) {
        console.error("Fetch checkout error:", err);
        setError(err.response?.data?.message || "Failed to load checkout details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckout();
  }, [bookingId, setValue]);

  // Pricing calculations
  const serviceFee = booking ? booking.price : 0;
  const platformFee = booking ? booking.platformFee : 4.99;
  const discountVal = appliedDiscount;
  const taxVal = booking ? booking.tax : 0;
  const grandTotal = Math.max(0, Math.round((serviceFee + platformFee + taxVal - discountVal) * 100) / 100);

  const selectedDate = booking ? booking.date : "";
  const selectedTime = booking ? booking.time : "";
  const selectedPlanName = booking ? booking.plan : "";

  const provider = booking ? {
    providerImage: booking.provider?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    providerName: booking.provider?.fullName || "",
    category: booking.service?.category || "",
    name: booking.service?.title || "",
    image: booking.service?.imageUrl || ""
  } : {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyPromo = () => {
    setPromoErrorMsg("");
    setPromoSuccessMsg("");
    
    if (promoInput.trim().toUpperCase() === "LOCAL20") {
      const discount = Math.round(serviceFee * 0.20 * 100) / 100;
      setAppliedDiscount(discount);
      setPromoSuccessMsg("Coupon 'LOCAL20' applied! 20% discount granted.");
    } else if (promoInput.trim() === "") {
      setPromoErrorMsg("Please enter a coupon code.");
    } else {
      setPromoErrorMsg("Invalid coupon code. Try 'LOCAL20' for 20% off.");
    }
  };

  const onCheckoutSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await checkoutService.submitCheckout({
        bookingId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        paymentMethod: data.paymentMethod,
        discount: appliedDiscount
      });

      const paymentResponse = await checkoutService.processPayment({
        bookingId,
        paymentMethod: data.paymentMethod,
        cardNumber: data.cardNumber,
        cardExpiry: data.cardExpiry,
        cardCvc: data.cardCvc
      });

      if (paymentResponse.success) {
        setSubmitSuccess(true);
        setIsSubmitting(false);
        
        setTimeout(() => {
          navigate("/customer/dashboard");
        }, 2000);
      } else {
        setSubmitError(paymentResponse.message || "Transaction declined.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Checkout process error:", err);
      setSubmitError(err.response?.data?.message || "Transaction declined. Please verify your payment credentials and try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-[#FAF6F0] min-h-screen max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F1D1A] mx-auto" />
          <p className="text-[#5A5146] font-bold text-xs">Loading checkout details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !booking) {
    return (
      <MainLayout>
        <div className="bg-[#FAF6F0] min-h-screen py-16 px-4">
          <div className="max-w-xl mx-auto my-8 p-8 bg-white border border-[#E8DCC3] rounded-3xl shadow-2xs text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-[#8C4B3E] mx-auto" />
            <h2 className="text-lg font-bold text-[#1F1D1A]">Checkout Error</h2>
            <p className="text-xs text-[#7A7266] font-medium">{error || "We couldn't retrieve the checkout details for this booking."}</p>
            <Button onClick={() => navigate("/services")} className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl text-xs h-9.5 px-6 font-bold mt-2 border border-[#E8DCC3]">
              Back to Services
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C9A46A] hover:underline transition-colors mb-3 bg-white px-3 py-1 rounded-full border border-[#E8DCC3] shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Modify Details
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1D1A]">Checkout Booking Securely</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Verify your booking specifications, credentials, and select payment method</p>
          </div>
        </section>

        {/* SECURE SUB-BANNER */}
        <div className="bg-[#F0E7D5]/70 text-[#5A5146] py-2.5 text-center border-b border-[#E8DCC3] px-4">
          <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-[#2B522B]" />
            256-Bit SSL Encryption Payment Protocols Active
          </span>
        </div>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {successSubmitUI(submitSuccess, provider, selectedDate, selectedTime, selectedPlanName, grandTotal)}

          {!submitSuccess && (
            <form onSubmit={handleSubmit(onCheckoutSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: CUSTOMER INFO, BILLING, AND PAYMENTS */}
              <div className="lg:col-span-7 space-y-6">
                
                {submitError && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl shadow-2xs">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#8C4B3E]" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* STEP 1: CUSTOMER DETAILS */}
                <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6">
                  <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#1F1D1A]">1. Customer Information</CardTitle>
                      <CardDescription className="text-xs text-[#7A7266]">Provide contact details for booking verification</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5 space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-bold text-[#1F1D1A]">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Amanda Watson"
                        className={`h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] ${
                          errors.fullName ? "border-[#8C4B3E]" : ""
                        }`}
                        disabled={isSubmitting}
                        {...register("fullName")}
                      />
                      {errors.fullName && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-[#1F1D1A]">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="amanda@example.com"
                          className={`h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] ${
                            errors.email ? "border-[#8C4B3E]" : ""
                          }`}
                          disabled={isSubmitting}
                          {...register("email")}
                        />
                        {errors.email && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.email.message}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold text-[#1F1D1A]">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="123-456-7890"
                          className={`h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] ${
                            errors.phone ? "border-[#8C4B3E]" : ""
                          }`}
                          disabled={isSubmitting}
                          {...register("phone")}
                        />
                        {errors.phone && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* STEP 2: BILLING ADDRESS */}
                <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6">
                  <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#1F1D1A]">2. Billing Address</CardTitle>
                      <CardDescription className="text-xs text-[#7A7266]">Address connected to invoice calculations</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5 space-y-4">
                    {/* Street Address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="street" className="text-xs font-bold text-[#1F1D1A]">Street Address</Label>
                      <Input
                        id="street"
                        placeholder="123 Main St, Apt 4B"
                        className={`h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] ${
                          errors.street ? "border-[#8C4B3E]" : ""
                        }`}
                        disabled={isSubmitting}
                        {...register("street")}
                      />
                      {errors.street && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.street.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* City */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <Label htmlFor="city" className="text-xs font-bold text-[#1F1D1A]">City</Label>
                        <Input
                          id="city"
                          placeholder="Brooklyn"
                          className={`h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] ${
                            errors.city ? "border-[#8C4B3E]" : ""
                          }`}
                          disabled={isSubmitting}
                          {...register("city")}
                        />
                        {errors.city && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.city.message}</p>}
                      </div>

                      {/* State */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <Label htmlFor="state" className="text-xs font-bold text-[#1F1D1A]">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          className={`h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] ${
                            errors.state ? "border-[#8C4B3E]" : ""
                          }`}
                          disabled={isSubmitting}
                          {...register("state")}
                        />
                        {errors.state && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.state.message}</p>}
                      </div>

                      {/* ZIP Code */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <Label htmlFor="zipCode" className="text-xs font-bold text-[#1F1D1A]">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="400001"
                          maxLength={6}
                          className={`h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] ${
                            errors.zipCode ? "border-[#8C4B3E]" : ""
                          }`}
                          disabled={isSubmitting}
                          {...register("zipCode")}
                        />
                        {errors.zipCode && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.zipCode.message}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* STEP 3: PAYMENT METHOD */}
                <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6">
                  <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#1F1D1A]">3. Select Payment Method</CardTitle>
                      <CardDescription className="text-xs text-[#7A7266]">Choose how you want to settle the transaction</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5 space-y-6">
                    {/* Method options layout */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { id: "card", label: "Credit Card", icon: CreditCard },
                        { id: "upi", label: "UPI Pay", icon: QrCode },
                        { id: "netbanking", label: "NetBanking", icon: Building },
                        { id: "wallet", label: "Wallet", icon: Sparkles },
                        { id: "cash", label: "Pay on Job", icon: DollarSign }
                      ].map((opt) => {
                        const isSelected = selectedPaymentMethod === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setValue("paymentMethod", opt.id)}
                            disabled={isSubmitting}
                            className={`flex flex-col items-center justify-center p-3.5 border rounded-xl gap-2 transition-all cursor-pointer ${
                              isSelected 
                                ? "bg-[#F0E7D5] border-[#C9A46A] text-[#C9A46A] shadow-2xs font-bold"
                                : "bg-white border-[#E8DCC3] text-[#5A5146] hover:bg-[#FAF6F0]"
                            }`}
                          >
                            <opt.icon className={`h-5 w-5 ${isSelected ? "text-[#C9A46A]" : "text-[#7A7266]"}`} />
                            <span className="text-[10px] text-center font-bold">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* DYNAMIC CARD DETAIL INPUT SUB-FIELDS */}
                    {selectedPaymentMethod === "card" && (
                      <div className="p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl space-y-3.5">
                        <span className="text-xs font-bold text-[#1F1D1A] block">Credit/Debit Card Details</span>
                        
                        {/* Card number */}
                        <div className="space-y-1.5">
                          <Label htmlFor="cardNumber" className="text-[11px] font-bold text-[#1F1D1A]">Card Number</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-[50%] translate-y-[-50%] text-[#7A7266]">
                              <CreditCard className="h-4 w-4" />
                            </span>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 1234 5678"
                              maxLength={19}
                              className="pl-9 h-9 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                              disabled={isSubmitting}
                              {...register("cardNumber")}
                            />
                          </div>
                          {errors.cardNumber && <p className="text-[10px] text-[#8C4B3E] font-bold mt-0.5">{errors.cardNumber.message}</p>}
                        </div>

                        {/* Expiry / CVC grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="cardExpiry" className="text-[11px] font-bold text-[#1F1D1A]">Expiry Date</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/YY"
                              maxLength={5}
                              className="h-9 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-center text-[#1F1D1A]"
                              disabled={isSubmitting}
                              {...register("cardExpiry")}
                            />
                            {errors.cardExpiry && <p className="text-[10px] text-[#8C4B3E] font-bold mt-0.5">{errors.cardExpiry.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="cardCvc" className="text-[11px] font-bold text-[#1F1D1A]">CVC Code</Label>
                            <Input
                              id="cardCvc"
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              className="h-9 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-center text-[#1F1D1A]"
                              disabled={isSubmitting}
                              {...register("cardCvc")}
                            />
                            {errors.cardCvc && <p className="text-[10px] text-[#8C4B3E] font-bold mt-0.5">{errors.cardCvc.message}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC UPI PAY SUB-DETAILS */}
                    {selectedPaymentMethod === "upi" && (
                      <div className="p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl text-center space-y-3.5 flex flex-col items-center">
                        <QrCode className="h-16 w-16 text-[#C9A46A] border border-[#E8DCC3] p-2 bg-white rounded-xl" />
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#1F1D1A] block">Scan Dynamic QR Code</span>
                          <p className="text-[10px] text-[#7A7266] max-w-xs leading-relaxed font-medium">
                            Upon submitting the order, a secure dynamic UPI payment overlay will open to authorize the transaction.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC CASH PAYMENT SUB-DETAILS */}
                    {selectedPaymentMethod === "cash" && (
                      <div className="p-4 bg-[#7DAB7D]/10 border border-[#7DAB7D]/30 rounded-2xl space-y-2 flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-[#2B522B] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#2B522B] block">Cash on Service Confirmed</span>
                          <p className="text-[10px] text-[#2B522B]/80 leading-relaxed font-medium">
                            No upfront payment required today. Pay provider directly in cash or digital wallet once the service is fully completed to your satisfaction.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TERMS AGREEMENT CHECKBOX */}
                    <div className="space-y-1.5 border-t border-[#E8DCC3] pt-5">
                      <div className="flex items-start space-x-2.5">
                        <Checkbox 
                          id="acceptTerms" 
                          checked={acceptTermsValue}
                          onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
                          disabled={isSubmitting}
                          className="rounded-md border-[#E8DCC3] bg-white mt-0.5"
                        />
                        <label
                          htmlFor="acceptTerms"
                          className="text-[11px] font-medium text-[#5A5146] leading-relaxed cursor-pointer select-none"
                        >
                          I agree to BookMyLocalService's booking guidelines, cancellation policies, and payment terms. I verify that the service requirements specified in this summary are correct.
                        </label>
                      </div>
                      {errors.acceptTerms && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{errors.acceptTerms.message}</p>}
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* RIGHT COLUMN: BOOKING SUMMARY, PROMO CODES, AND INVOICE */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-24 space-y-6">
                  
                  {/* BOOKING DETAILS CARD */}
                  <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-5 space-y-4">
                    <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block">Booking Details</span>
                    
                    <div className="flex items-center gap-3.5 p-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl">
                      <Avatar className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#E8DCC3]">
                        <AvatarImage src={provider.providerImage} className="object-cover" />
                        <AvatarFallback>{provider.providerName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-[10px] font-bold text-[#C9A46A] bg-[#F0E7D5] px-2.5 py-0.5 rounded-full border border-[#E8DCC3] tracking-wide uppercase">
                          {provider.category}
                        </span>
                        <h4 className="font-bold text-[#1F1D1A] text-sm mt-1">{provider.providerName}</h4>
                        <p className="text-[11px] text-[#7A7266] truncate max-w-[200px]">{provider.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="flex items-center gap-2 p-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl text-[#1F1D1A]">
                        <Calendar className="h-4.5 w-4.5 text-[#C9A46A] shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[9px] text-[#7A7266] font-bold uppercase tracking-wider">Date</span>
                          <span className="text-xs font-bold">{selectedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-[#FAF6F0] border border-[#E8DCC3] rounded-xl text-[#1F1D1A]">
                        <Clock className="h-4.5 w-4.5 text-[#C9A46A] shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[9px] text-[#7A7266] font-bold uppercase tracking-wider">Time</span>
                          <span className="text-xs font-bold">{selectedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-[#FAF6F0] p-3 border border-[#E8DCC3] rounded-xl">
                      <span className="text-xs font-bold text-[#1F1D1A]">Tier Package:</span>
                      <Badge variant="secondary" className="bg-white border-[#E8DCC3] text-[#C9A46A] font-bold rounded-lg text-xs py-0.5 px-2.5">
                        {selectedPlanName}
                      </Badge>
                    </div>
                  </Card>

                  {/* PROMO / COUPON CODE CARD */}
                  <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-5">
                    <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider block mb-3.5">Promo / Coupon Code</span>
                    
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-[50%] translate-y-[-50%] text-[#7A7266]">
                          <Tag className="h-4 w-4" />
                        </span>
                        <Input
                          placeholder="Enter Promo Code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="pl-9 h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={isSubmitting}
                        className="bg-[#C9A46A] hover:bg-[#b89359] text-white h-9.5 px-4 font-bold text-xs rounded-xl border border-[#E8DCC3]"
                      >
                        Apply
                      </Button>
                    </div>

                    {promoSuccessMsg && (
                      <p className="text-[11px] text-[#2B522B] font-bold mt-2 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-[#2B522B]" /> {promoSuccessMsg}
                      </p>
                    )}

                    {promoErrorMsg && (
                      <p className="text-[11px] text-[#8C4B3E] font-bold mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-[#8C4B3E]" /> {promoErrorMsg}
                      </p>
                    )}

                    <div className="mt-3 text-[10px] text-[#7A7266] font-medium flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-[#C9A46A]" />
                      <span>Use coupon <span className="font-bold text-[#1F1D1A]">LOCAL20</span> to save 20% on booking fees.</span>
                    </div>
                  </Card>

                  {/* ORDER INVOICE SUMMARY CARD */}
                  <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white overflow-hidden">
                    <div className="bg-[#F0E7D5] text-[#1F1D1A] py-3.5 px-5 flex items-center justify-between shrink-0 border-b border-[#E8DCC3]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1F1D1A]">Order Invoice</span>
                      <span className="text-[10px] font-bold text-[#2B522B] bg-[#7DAB7D]/20 py-0.5 px-2.5 rounded-full border border-[#7DAB7D]/30">Final Amount</span>
                    </div>

                    <CardContent className="p-5 space-y-3.5">
                      <div className="flex justify-between text-xs text-[#5A5146] font-medium">
                        <span>Service Base Price:</span>
                        <span>${serviceFee.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-[#5A5146] font-medium">
                        <span>Platform Handling Fee:</span>
                        <span>${platformFee.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-[#5A5146] font-medium">
                        <span>Local State Taxes (8.5%):</span>
                        <span>${taxVal.toFixed(2)}</span>
                      </div>

                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-xs text-[#2B522B] font-bold bg-[#7DAB7D]/10 p-2.5 rounded-xl border border-[#7DAB7D]/30">
                          <span className="flex items-center gap-1"><Percent className="h-3.5 w-3.5" /> Coupon Discount:</span>
                          <span>-${discountVal.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="border-t border-[#E8DCC3] pt-3.5 flex justify-between items-baseline">
                        <span className="text-sm font-bold text-[#1F1D1A]">Total Amount:</span>
                        <span className="text-xl font-bold text-[#1F1D1A]">${grandTotal.toFixed(2)}</span>
                      </div>

                      <div className="pt-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-11 bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs border border-[#E8DCC3]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              Authorizing secure payment...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4.5 w-4.5" />
                              Proceed & Pay ${grandTotal.toFixed(2)}
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="text-center pt-2">
                        <span className="text-[10px] font-bold text-[#7A7266] flex items-center justify-center gap-1">
                          <Lock className="h-3.5 w-3.5 text-[#2B522B]" /> SSL Insured Checkout Processing
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </MainLayout>
  );
}

// Success Booking authorization screen UI
function successSubmitUI(submitSuccess, provider, date, time, plan, total) {
  if (!submitSuccess) return null;

  return (
    <div className="max-w-xl mx-auto py-12 px-6 bg-white border border-[#E8DCC3] rounded-3xl shadow-2xs text-center space-y-6">
      <div className="w-16 h-16 bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/40 rounded-full flex items-center justify-center mx-auto shadow-2xs">
        <Check className="h-8 w-8" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#1F1D1A] tracking-tight">Booking Confirmed!</h2>
        <p className="text-xs text-[#7A7266] font-medium max-w-sm mx-auto leading-relaxed">
          Your transaction has been processed securely. A confirmation email invoice was dispatched containing appointment details.
        </p>
      </div>

      <div className="p-4 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl text-left space-y-3.5 max-w-md mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7266] block">Transaction Details</span>
        
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E8DCC3]">
            <AvatarImage src={provider.providerImage} className="object-cover" />
            <AvatarFallback>{provider.providerName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-[11px] font-bold text-[#1F1D1A] block">{provider.providerName}</span>
            <span className="text-[9px] text-[#7A7266] font-semibold">{provider.category} • {plan}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#E8DCC3] pt-3">
          <div>
            <span className="text-[9px] text-[#7A7266] font-bold uppercase block">Date & Time</span>
            <span className="text-xs font-bold text-[#C9A46A]">{date} at {time}</span>
          </div>
          <div>
            <span className="text-[9px] text-[#7A7266] font-bold uppercase block">Amount Paid</span>
            <span className="text-xs font-bold text-[#C9A46A]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#7A7266] pt-2.5">
        <Loader2 className="h-4 w-4 animate-spin text-[#C9A46A]" />
        <span>Loading Customer Dashboard... Please wait.</span>
      </div>
    </div>
  );
}
