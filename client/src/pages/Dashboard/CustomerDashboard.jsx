import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCards from "../../components/navigation/DashboardCards";

export default function CustomerDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Customer Portal</h1>
            <p className="text-slate-350 text-xs mt-1.5 font-medium">Quickly request dispatches, manage payments, track ratings, and configure your address locations</p>
          </div>
        </section>

        {/* QUICK ACTION CARDS */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
            Quick Actions
          </h3>
          <DashboardCards role="CUSTOMER" />
        </div>
      </div>
    </DashboardLayout>
  );
}
