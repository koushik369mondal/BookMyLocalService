import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useBookingForm } from "@/hooks/useBookingForm";
import { BookingPlanSelector } from "@/components/booking/BookingPlanSelector";
import { BookingSchedulePicker } from "@/components/booking/BookingSchedulePicker";
import { BookingSummaryCard } from "@/components/booking/BookingSummaryCard";
import { Loader2, ArrowLeft, AlertCircle, User, MapPin } from "lucide-react";
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
    handleBookingSubmit
  } = useBookingForm();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF6F0]">
          <Loader2 className="h-8 w-8 animate-spin text-[#8C4B3E]" />
        </div>
      </MainLayout>
    );
  }

  if (error || !service) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] bg-[#FAF6F0] py-16 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E8DCC3] shadow-md text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-rose-600 mx-auto" />
            <h2 className="text-xl font-black text-[#1F1D1A]">Booking Error</h2>
            <p className="text-xs text-[#5A5146] font-medium">{error || "Service details could not be loaded."}</p>
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
            <Link to={`/services/slug/${service.slug || ""}`} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#8C4B3E] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Service Details
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Main Options Form */}
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
              <div className="space-y-4 bg-white p-6 rounded-3xl border border-[#E8DCC3] shadow-sm">
                <h3 className="text-sm font-extrabold text-[#1F1D1A] flex items-center gap-1.5">
                  <User className="h-4 w-4 text-[#8C4B3E]" />
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1F1D1A]">Full Name *</label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Amanda Watson"
                      className="h-10 border-[#E8DCC3] rounded-xl text-xs"
                    />
                    {formErrors.fullName && <p className="text-[10px] text-rose-600 font-bold">{formErrors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1F1D1A]">Email Address *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="h-10 border-[#E8DCC3] rounded-xl text-xs"
                    />
                    {formErrors.email && <p className="text-[10px] text-rose-600 font-bold">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-[#1F1D1A]">Phone Number *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="123-456-7890"
                      className="h-10 border-[#E8DCC3] rounded-xl text-xs"
                    />
                    {formErrors.phone && <p className="text-[10px] text-rose-600 font-bold">{formErrors.phone}</p>}
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
