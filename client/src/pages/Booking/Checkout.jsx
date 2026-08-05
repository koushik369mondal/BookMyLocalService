import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { CheckoutBillingForm } from "@/components/checkout/CheckoutBillingForm";
import { CheckoutPaymentMethod } from "@/components/checkout/CheckoutPaymentMethod";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function Checkout() {
  const {
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
    handleSubmit,
    setValue,
    selectedPaymentMethod,
    acceptTermsValue,
    errors
  } = useCheckoutForm();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF6F0]">
          <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E]" />
        </div>
      </MainLayout>
    );
  }

  if (error || !booking) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] bg-[#FAF6F0] py-16 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E8DCC3] shadow-md text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-rose-600 mx-auto" />
            <h2 className="text-xl font-black text-[#1F1D1A]">Checkout Error</h2>
            <p className="text-xs text-[#5A5146] font-medium">{error || "Checkout session details could not be loaded."}</p>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#8C4B3E] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Services Catalog
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen py-10 font-sans text-[#1F1D1A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="mb-6">
            <Link to={`/booking?serviceId=${booking.serviceId}`} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#8C4B3E] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Booking Options
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Details */}
              <div className="lg:col-span-8 space-y-6">
                <CheckoutBillingForm
                  register={register}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />

                <CheckoutPaymentMethod
                  register={register}
                  setValue={setValue}
                  selectedPaymentMethod={selectedPaymentMethod}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Right Column: Summary */}
              <div className="lg:col-span-4">
                <CheckoutOrderSummary
                  booking={booking}
                  promoInput={promoInput}
                  setPromoInput={setPromoInput}
                  appliedDiscount={appliedDiscount}
                  promoSuccessMsg={promoSuccessMsg}
                  promoErrorMsg={promoErrorMsg}
                  onApplyPromo={handleApplyPromo}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                  submitSuccess={submitSuccess}
                  register={register}
                  acceptTermsValue={acceptTermsValue}
                  setValue={setValue}
                  selectedPaymentMethod={selectedPaymentMethod}
                  errors={errors}
                />
              </div>

            </div>
          </form>

        </div>
      </div>
    </MainLayout>
  );
}
