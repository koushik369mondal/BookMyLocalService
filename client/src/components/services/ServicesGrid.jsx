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
      <div className="card-chai border-rose-500/20 bg-rose-500/5 p-8 text-center space-y-3">
        <ShieldAlert className="h-10 w-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-semibold text-rose-300">Error loading services</h3>
        <p className="text-xs text-rose-400/80 font-medium">{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="card-chai p-12 text-center space-y-4">
        <h3 className="text-lg font-semibold text-white">No matching services found</h3>
        <p className="text-xs text-neutral-400 font-medium max-w-md mx-auto">
          We couldn't find any professionals matching your selected criteria. Try resetting filters or expanding your search location.
        </p>
        <Button onClick={onClearAll} variant="solid" className="h-10 px-5 text-xs font-medium cursor-pointer">
          Reset filters
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
