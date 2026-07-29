import React from "react";
import { ServiceCard, ServiceCardSkeleton } from "@/components/ui/ServiceCard";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesGrid({ isLoading, error, services, onClearAll }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center space-y-3">
        <ShieldAlert className="h-10 w-10 text-rose-600 mx-auto" />
        <h3 className="text-base font-extrabold text-rose-900">Error Loading Services</h3>
        <p className="text-xs text-rose-700 font-medium">{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white border border-[#E8DCC3] rounded-3xl p-12 text-center space-y-4">
        <h3 className="text-lg font-black text-[#1F1D1A]">No Matching Services Found</h3>
        <p className="text-xs text-[#5A5146] font-medium max-w-md mx-auto">
          We couldn't find any professionals matching your selected criteria. Try resetting filters or expanding your search location.
        </p>
        <Button onClick={onClearAll} className="h-10 px-5 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl cursor-pointer">
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
