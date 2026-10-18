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
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (error || !booking) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] py-16 px-4 flex items-center justify-center">
          <div className="max-w-md w-full card-chai p-8 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
            <h2 className="text-xl font-heading font-medium text-foreground">Checkout error</h2>
            <p className="text-xs text-muted-foreground">{error || "Checkout session details could not be loaded."}</p>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-brand underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to services
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-10 font-sans text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="mb-6">
            <Link to={`/booking?serviceId=${booking.serviceId}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to booking options
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
