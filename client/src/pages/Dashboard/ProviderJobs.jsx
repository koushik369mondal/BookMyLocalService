import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

const mockJobs = [
  {
    id: "BMLS-98394",
    customer: "Amanda Watson",
    service: "Deep Home Cleaning Service",
    date: "2026-07-15",
    time: "10:30 AM",
    price: 55.0,
    status: "pending",
    address: "Brooklyn, NY"
  },
  {
    id: "BMLS-88294",
    customer: "Robert Garcia",
    service: "Window Washing Service",
    date: "2026-07-16",
    time: "01:00 PM",
    price: 30.0,
    status: "confirmed",
    address: "Queens, NY"
  }
];

export default function ProviderJobs() {
  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Pending</Badge>;
      default:
        return <Badge className="bg-slate-900/50 hover:bg-slate-900 text-white border-0 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Confirmed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Job Board Operations</h1>
          <p className="text-slate-350 text-xs mt-1.5 font-medium">Review and process booking requests dispatched by customers</p>
        </div>
      </section>

      {/* JOBS BOARD */}
      <div className="space-y-6">
        <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-slate-50">
            <CardTitle className="text-base font-extrabold text-slate-900">Assigned Jobs</CardTitle>
            <CardDescription className="text-xs">Incoming and scheduled dispatch activities</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            {mockJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No active jobs assigned</p>
                <p className="text-xs text-slate-400 mt-1">Available dispatches will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <div key={job.id} className="border border-slate-200 p-5 rounded-2xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 hover:shadow-xs transition-all duration-300">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">REF ID: {job.id}</span>
                        {getBadge(job.status)}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{job.service}</h4>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-semibold">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {job.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> {job.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.address}</span>
                      </div>
                    </div>

                    <div className="border-t md:border-t-0 border-slate-50 pt-4 md:pt-0 flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                      <div className="text-left md:text-right shrink-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Settlement Rate</span>
                        <span className="text-base font-black text-slate-900">${job.price.toFixed(2)}</span>
                      </div>
                      <Button size="xs" className="bg-slate-900 hover:bg-black text-white rounded-xl h-9 px-4 text-[10px] font-bold flex items-center gap-1 shrink-0">
                        Manage Job <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
