import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { checkoutService } from "../services/checkoutService";

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

export function useCheckoutForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

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
      paymentMethod: "card",
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
  }, [bookingId, setValue]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoErrorMsg("");
    setPromoSuccessMsg("");

    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoErrorMsg("Please enter a coupon code.");
      return;
    }

    if (code === "WELCOME10" || code === "LOCAL10") {
      const disc = 10.00;
      setAppliedDiscount(disc);
      setPromoSuccessMsg(`Coupon "${code}" applied! You saved $${disc.toFixed(2)}.`);
    } else if (code === "SAVE20") {
      const disc = 20.00;
      setAppliedDiscount(disc);
      setPromoSuccessMsg(`Coupon "${code}" applied! You saved $${disc.toFixed(2)}.`);
    } else {
      setPromoErrorMsg("Invalid or expired coupon code. Try WELCOME10.");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const checkoutPayload = {
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
      };

      const response = await checkoutService.submitCheckout(checkoutPayload);
      if (response.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate(`/booking/success?bookingId=${bookingId}`);
        }, 1500);
      } else {
        setSubmitError(response.message || "Failed to process payment. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Checkout submit error:", err);
      setSubmitError(err.message || "Server error while processing your order.");
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
