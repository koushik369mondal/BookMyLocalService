import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { checkoutService } from "../services/checkoutService";
import { couponService } from "../services/couponService";
import { bookingsService } from "../services/api";
import { formatPrice } from "../utils/currency";

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
  paymentMethod: z.enum(["razorpay", "upi", "card", "netbanking", "wallet", "cash"], {
    errorMap: () => ({ message: "Please select a payment method" })
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms & conditions to proceed"
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional()
});

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function useCheckoutForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawQueryBookingId = searchParams.get("bookingId");
  const [activeBookingId, setActiveBookingId] = useState(rawQueryBookingId || localStorage.getItem("lastBookingId") || "");
  const bookingId = rawQueryBookingId || activeBookingId || localStorage.getItem("lastBookingId") || "";

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState("");
  const [promoErrorMsg, setPromoErrorMsg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      paymentMethod: "razorpay",
      acceptTerms: false,
      cardNumber: "",
      cardExpiry: "",
      cardCvc: ""
    }
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const acceptTermsValue = watch("acceptTerms");

  useEffect(() => {
    const fetchCheckout = async () => {
      let targetId = searchParams.get("bookingId") || localStorage.getItem("lastBookingId");

      if (!targetId) {
        try {
          const userBookings = await bookingsService.getUserBookings();
          if (userBookings.success && Array.isArray(userBookings.data)) {
            const pending = userBookings.data.find(b => b.status === "pending" || b.paymentStatus === "pending");
            if (pending && (pending.id || pending._id)) {
              targetId = pending.id || pending._id;
              navigate(`/checkout?bookingId=${targetId}`, { replace: true });
            }
          }
        } catch (e) {
          console.warn("[CHECKOUT] Could not auto-recover booking ID from user bookings:", e);
        }
      }

      if (!targetId) {
        console.error("[CHECKOUT ERROR] bookingId is missing!");
        setError("Invalid checkout URL: booking ID is missing. Please select a service and initiate a booking first.");
        setIsLoading(false);
        return;
      }

      setActiveBookingId(targetId);
      localStorage.setItem("lastBookingId", targetId);
      console.log("[DEBUG] bookingId:", targetId);

      try {
        const response = await checkoutService.getCheckoutDetails(targetId);
        if (response.success && response.data) {
          setBooking(response.data);
          const b = response.data;
          if (b.customer) {
            setValue("fullName", b.billingName || b.customer.fullName || "");
            setValue("email", b.billingEmail || b.customer.email || "");
            setValue("phone", b.billingPhone || b.customer.phone || "");
            setValue("street", b.street || b.customer.address || "");
            setValue("city", b.city || b.customer.city || "");
            setValue("state", b.state || b.customer.state || "");
            setValue("zipCode", b.zipCode || b.customer.zipCode || "");
          }
        } else {
          setError(response.message || "Failed to load booking details.");
        }
      } catch (err) {
        console.error("Checkout load error:", err);
        setError(err.message || "Error loading checkout details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckout();
  }, [searchParams, setValue, navigate]);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoErrorMsg("");
    setPromoSuccessMsg("");

    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoErrorMsg("Please enter a coupon code.");
      return;
    }

    try {
      const currentTotal = booking?.total || booking?.price || 0;
      const response = await couponService.validateCoupon(code, currentTotal);

      if (response.success && response.data) {
        const couponData = response.data;
        const discAmount = parseFloat(couponData.discountAmount || couponData.discountValue) || 0;
        setAppliedDiscount(discAmount);
        setPromoSuccessMsg(couponData.message || `Coupon "${code}" applied successfully! You saved ${formatPrice(discAmount, { decimals: true })}.`);
      } else {
        setPromoErrorMsg(response.message || "Invalid or expired promo code.");
      }
    } catch (err) {
      console.error("Apply promo error:", err);
      const msg = err.response?.data?.message || err.message || "Invalid or expired promo code.";
      setPromoErrorMsg(msg);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    const currentBookingId = activeBookingId || searchParams.get("bookingId") || localStorage.getItem("lastBookingId");
    console.log("[DEBUG] Submitting checkout with bookingId:", currentBookingId);

    if (!currentBookingId) {
      setSubmitError("Booking ID is missing. Cannot process payment.");
      setIsSubmitting(false);
      return;
    }

    try {
      const checkoutPayload = {
        bookingId: currentBookingId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        paymentMethod: data.paymentMethod,
        discount: appliedDiscount
      };

      const submitRes = await checkoutService.submitCheckout(checkoutPayload);
      if (!submitRes.success) {
        setSubmitError(submitRes.message || "Failed to update checkout billing information.");
        setIsSubmitting(false);
        return;
      }

      const currentBooking = submitRes.data || booking;

      if (data.paymentMethod === "cash") {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate(`/booking/success?bookingId=${currentBookingId}&serviceId=${currentBooking?.serviceId || ""}&date=${currentBooking?.date || ""}&time=${currentBooking?.time || ""}&price=${currentBooking?.total || ""}&paymentMethod=cash`);
        }, 1000);
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setSubmitError("Failed to load Razorpay SDK. Please check your network connection.");
        setIsSubmitting(false);
        return;
      }

      const totalInINR = currentBooking?.total || booking?.total || 1;
      const amountInPaise = Math.max(100, Math.round(totalInINR * 100));

      const jwtToken = localStorage.getItem("token");
      console.log("[DEBUG] JWT token:", jwtToken);

      const orderPayload = {
        amount: amountInPaise,
        currency: "INR",
        bookingId: currentBookingId,
        receipt: `rcpt_${currentBookingId}_${Date.now()}`
      };
      console.log("[DEBUG] /create-order request payload:", orderPayload);

      const orderRes = await checkoutService.createRazorpayOrder(orderPayload);
      console.log("[DEBUG] /create-order response:", orderRes);

      if (!orderRes.success || (!orderRes.order_id && !orderRes.id && !orderRes.data?.id)) {
        setSubmitError(orderRes.message || "Failed to initialize Razorpay payment order.");
        setIsSubmitting(false);
        return;
      }

      const orderId = orderRes.order_id || orderRes.id || orderRes.data?.id;
      const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      const razorpayKey = (envKey && envKey !== "undefined") ? envKey : (orderRes.key || orderRes.data?.key || "rzp_test_TLvwTXbLFNy4u0");

      console.log("[DEBUG] Razorpay public key:", razorpayKey);

      if (!razorpayKey || razorpayKey === "undefined" || !orderId || orderId === "undefined") {
        console.error("[RAZORPAY ERROR] Missing valid public key or order_id:", { razorpayKey, orderId });
        setSubmitError("Cannot initialize payment window: Missing Razorpay Key ID or Order ID.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: String(razorpayKey).trim(),
        amount: Number(orderRes.amount || orderRes.data?.amount || amountInPaise),
        currency: String(orderRes.currency || orderRes.data?.currency || "INR"),
        name: "BookMyLocalService",
        description: `Booking #${String(currentBookingId).substring(0, 8)}`,
        order_id: String(orderId).trim(),
        prefill: {
          name: data.fullName || "",
          email: data.email || "",
          contact: data.phone || ""
        },
        theme: {
          color: "#8C4B3E"
        },
        handler: async function (razorpayResponse) {
          console.log("[FRONTEND RAZORPAY SUCCESS] Received handler payload:", razorpayResponse);
          try {
            const verifyRes = await checkoutService.verifyRazorpayPayment({
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              bookingId: currentBookingId
            });

            if (verifyRes.success) {
              setSubmitSuccess(true);
              setTimeout(() => {
                navigate(`/booking/success?bookingId=${currentBookingId}&serviceId=${currentBooking?.serviceId || ""}&date=${currentBooking?.date || ""}&time=${currentBooking?.time || ""}&price=${currentBooking?.total || ""}&paymentMethod=${data.paymentMethod}&paymentId=${razorpayResponse.razorpay_payment_id}`);
              }, 1000);
            } else {
              setSubmitError(verifyRes.message || "Payment signature verification failed.");
              setIsSubmitting(false);
            }
          } catch (verifyErr) {
            console.error("Razorpay verification error:", verifyErr);
            const msg = verifyErr.response?.data?.message || verifyErr.message || "Failed to verify payment with server.";
            setSubmitError(msg);
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("[FRONTEND RAZORPAY MODAL] Dismissed by user");
            setIsSubmitting(false);
            setSubmitError("Payment modal was closed before completing payment. You can try paying again whenever ready.");
          }
        }
      };

      console.log("[DEBUG] Razorpay initialization options:", options);

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResponse) {
        console.error("[FRONTEND RAZORPAY PAYMENT FAILED]:", failResponse);
        const failMsg = failResponse.error?.description || "Payment failed. Please try again.";
        setSubmitError(failMsg);
        setIsSubmitting(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout submit error:", err);
      const errMsg = err.response?.data?.message || err.message || "Server error while processing your order.";
      setSubmitError(errMsg);
      setIsSubmitting(false);
    }
  };

  return {
    bookingId,
    booking,
    isLoading,
    error,
    promoInput,
    setPromoInput,
    appliedDiscount,
    promoSuccessMsg,
    promoErrorMsg,
    handleApplyPromo,
    isSubmitting,
    submitError,
    submitSuccess,
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    selectedPaymentMethod,
    acceptTermsValue,
    errors
  };
}
