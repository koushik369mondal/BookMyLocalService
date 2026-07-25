import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCards from "../../components/navigation/DashboardCards";
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
              {user?.fullName ? `Welcome back, ${user.fullName} 👋` : "Welcome back 👋"}
            </h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">
              Quickly request dispatches, manage payments, track ratings, and configure your address locations
            </p>
          </div>
        </section>

        {/* QUICK ACTION CARDS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A7266]">
            Quick Actions
          </h3>
          <DashboardCards role="CUSTOMER" />
        </div>

      </div>
    </DashboardLayout>
  );
}
