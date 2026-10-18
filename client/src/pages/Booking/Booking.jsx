import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useBookingForm } from "@/hooks/useBookingForm";
import { BookingPlanSelector } from "@/components/booking/BookingPlanSelector";
import { BookingSchedulePicker } from "@/components/booking/BookingSchedulePicker";
import { BookingSummaryCard } from "@/components/booking/BookingSummaryCard";
import { Loader2, ArrowLeft, AlertCircle, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Booking() {
  const {
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
  } = useBookingForm();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (error || !service) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] py-16 px-4 flex items-center justify-center">
          <div className="max-w-md w-full card-chai p-8 text-center space-y-4">
            <AlertCircle className="size-8 text-red-500 mx-auto" />
            <h2 className="font-display font-semibold text-base text-foreground">
              Booking error
            </h2>
            <p className="text-xs text-muted-foreground">
              {error || "Service details could not be loaded."}
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs text-foreground hover:text-brand font-medium"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to services catalog</span>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="mb-6">
            <Link
              to={`/services/slug/${service.slug || ""}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to service details</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Options Form */}
            <div className="lg:col-span-8 space-y-6">
              <BookingPlanSelector
                plans={plans}
                activePlanIdx={activePlanIdx}
                onSelectPlan={(idx) => setActivePlanIdx(idx)}
              />

              <BookingSchedulePicker
                selectedDate={selectedDate}
                onDateChange={(d) => setSelectedDate(d)}
                selectedTimeSlot={selectedTimeSlot}
                onTimeChange={(t) => setSelectedTimeSlot(t)}
                dateAlert={dateAlert}
                timeAlert={timeAlert}
              />

              {/* Customer Contact & Address Info */}
              <div className="card-chai p-6 space-y-4">
                <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span>Customer details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Full name *
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="h-9 border-border bg-card/40 rounded-md text-xs"
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-500">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Email address *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="h-9 border-border bg-card/40 rounded-md text-xs"
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Phone number *
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="h-9 border-border bg-card/40 rounded-md text-xs"
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-500">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-4">
              <BookingSummaryCard
                service={service}
                selectedPlan={selectedPlan}
                pricingBreakdown={pricingBreakdown}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                isSubmitting={isSubmitting}
                onSubmit={handleBookingSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
