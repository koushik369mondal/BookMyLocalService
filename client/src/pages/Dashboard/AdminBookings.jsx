import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, UserCheck, Sliders } from "lucide-react";

const mockAllBookings = [
  {
    id: "BMLS-28491",
    customer: "Ananya Sen",
    provider: "Sunita Rao",
    service: "Deep Home Cleaning & Sanitization",
    date: "2026-07-15",
    amount: 1499.00,
    status: "upcoming"
  },
  {
    id: "BMLS-19402",
    customer: "Rahul Das",
    provider: "Rajesh Sharma",
    service: "Expert Plumbing & Leakage Repair",
    date: "2026-07-03",
    amount: 499.00,
    status: "completed"
  }
];

export default function AdminBookings() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-[#C9A46A]/20 text-[#C9A46A] border border-[#C9A46A]/30 text-[9px] uppercase font-bold">Upcoming</Badge>;
      default:
        return <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border border-[#7DAB7D]/30 text-[9px] uppercase font-bold">Completed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">System Bookings Management</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Global supervisor dashboard for all dispatch appointments and providers schedules</p>
          </div>
        </section>

        {/* BOOKINGS CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-[#1F1D1A]">All System Dispatches</CardTitle>
                  <CardDescription className="text-xs text-[#7A7266]">System-wide records of customer requests and assignments</CardDescription>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-[#E8DCC3] text-[#1F1D1A] bg-[#FAF6F0] hover:bg-white text-xs font-bold rounded-xl shadow-2xs">
                <Sliders className="h-4 w-4 mr-1.5 text-[#C9A46A]" /> Filter Dispatches
              </Button>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              <div className="overflow-x-auto rounded-xl border border-[#E8DCC3]">
                <table className="w-full text-left text-xs text-[#1F1D1A]">
                  <thead className="bg-[#F0E7D5] text-[#5A5146] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DCC3]">
                    <tr>
                      <th className="py-3.5 px-4">Booking ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Provider</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Scheduled Date</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCC3] bg-white">
                    {mockAllBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">{b.id}</td>
                        <td className="py-3.5 px-4 font-medium">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-[#7A7266]" />
                            <span>{b.customer}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5 text-[#C9A46A]" />
                            <span>{b.provider}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#5A5146] font-medium">{b.service}</td>
                        <td className="py-3.5 px-4 text-[#7A7266] font-medium">{b.date}</td>
                        <td className="py-3.5 px-4 font-bold text-[#1F1D1A]">{formatPrice(b.amount, { decimals: true })}</td>
                        <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <Button size="xs" variant="ghost" className="text-[#C9A46A] hover:text-[#b89359] font-bold text-[11px]">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
