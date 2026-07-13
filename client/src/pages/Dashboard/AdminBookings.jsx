import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, UserCheck, ShieldAlert, Sliders } from "lucide-react";

const mockAllBookings = [
  {
    id: "BMLS-28491",
    customer: "Amanda Watson",
    provider: "Sarah Jenkins",
    service: "Deep Home Cleaning Service",
    date: "2026-07-15",
    amount: 55.00,
    status: "upcoming"
  },
  {
    id: "BMLS-19402",
    customer: "John Doe",
    provider: "David Miller",
    service: "Expert Plumbing Service",
    date: "2026-07-03",
    amount: 75.00,
    status: "completed"
  }
];

export default function AdminBookings() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-bold border-0 rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Upcoming</Badge>;
      default:
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-0 rounded-lg px-2.5 py-0.5 text-[9px] uppercase">Completed</Badge>;
    }
  };

  return (
    <DashboardLayout>
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">System Bookings Management</h1>
          <p className="text-slate-350 text-xs mt-1.5 font-medium">Global supervisor dashboard for all dispatch appointments and providers schedules</p>
        </div>
      </section>

      {/* BOOKINGS TABLE */}
      <div className="space-y-6">
        <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-slate-50">
            <CardTitle className="text-base font-extrabold text-slate-900">All Registered Bookings</CardTitle>
            <CardDescription className="text-xs">Monitor dispatcher routes, rates, and transaction settlements</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                    <th className="py-2.5 px-1">Ref ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Provider</th>
                    <th className="py-2.5">Date Scheduled</th>
                    <th className="py-2.5">Service Rate</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {mockAllBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-55/30 transition-colors">
                      <td className="py-3 px-1 font-bold text-slate-900">{b.id}</td>
                      <td className="py-3 text-slate-700">{b.customer}</td>
                      <td className="py-3 text-slate-700">{b.provider}</td>
                      <td className="py-3 text-slate-550">{b.date}</td>
                      <td className="py-3 font-bold text-slate-800">${b.amount.toFixed(2)}</td>
                      <td className="py-3">{getStatusBadge(b.status)}</td>
                      <td className="py-3 text-right">
                        <Button variant="outline" size="xs" className="h-7 border-slate-200 text-[10px] rounded-lg">
                          Manage
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
    </DashboardLayout>
  );
}
