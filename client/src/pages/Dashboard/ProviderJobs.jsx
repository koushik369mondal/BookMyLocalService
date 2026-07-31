import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

const mockJobs = [
  {
    id: "BMLS-98394",
    customer: "Ananya Sen",
    service: "Deep Home Cleaning & Sanitization",
    date: "2026-07-15",
    time: "10:30 AM",
    price: 1499.0,
    status: "pending",
    address: "Kolkata, WB"
  },
  {
    id: "BMLS-88294",
    customer: "Rahul Das",
    service: "Sofa & Carpet Sanitization",
    date: "2026-07-16",
    time: "01:00 PM",
    price: 699.0,
    status: "confirmed",
    address: "Kolkata, WB"
  }
];

export default function ProviderJobs() {
  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#C9A46A] text-white border-0 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Pending</Badge>;
      default:
        return <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 font-bold rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Confirmed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Job Board Operations</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Review and process booking requests dispatched by customers</p>
          </div>
        </section>

        {/* JOBS BOARD */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card className="border border-[#E8DCC3] shadow-2xs rounded-2xl bg-white p-6">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3]">
              <CardTitle className="text-base font-bold text-[#1F1D1A]">Assigned Jobs</CardTitle>
              <CardDescription className="text-xs text-[#7A7266]">Incoming and scheduled dispatch activities</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              {mockJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-10 w-10 text-[#7A7266] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#1F1D1A]">No active jobs assigned</p>
                  <p className="text-xs text-[#7A7266] mt-1">Available dispatches will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockJobs.map((job) => (
                    <div key={job.id} className="border border-[#E8DCC3] p-5 rounded-2xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#C9A46A] shadow-2xs transition-all duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#7A7266] uppercase tracking-wide">REF ID: {job.id}</span>
                          {getBadge(job.status)}
                        </div>
                        <h4 className="font-bold text-sm text-[#1F1D1A] leading-snug">{job.service}</h4>
                        <div className="flex flex-wrap gap-4 text-xs text-[#5A5146] font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#C9A46A]" /> {job.date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#C9A46A]" /> {job.time}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#C9A46A]" /> {job.address}</span>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 border-[#E8DCC3] pt-4 md:pt-0 flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                        <div className="text-left md:text-right shrink-0">
                          <span className="text-[9px] font-bold text-[#7A7266] uppercase block tracking-wider">Settlement Rate</span>
                          <span className="text-base font-bold text-[#1F1D1A]">₹{job.price.toFixed(2)}</span>
                        </div>
                        <Button size="xs" className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl h-9 px-4 text-[10px] font-bold flex items-center gap-1 shrink-0 border border-[#E8DCC3] cursor-pointer">
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
      </div>
    </DashboardLayout>
  );
}
