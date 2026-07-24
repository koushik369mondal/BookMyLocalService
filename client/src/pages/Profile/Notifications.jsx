import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Calendar, CreditCard, ShieldCheck, Trash2 } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    title: "Booking Confirmed",
    description: "Your deep home cleaning service with Sarah Jenkins has been scheduled for July 15, 2026, at 09:30 AM.",
    date: "2026-07-13 08:30 AM",
    type: "booking",
    unread: true
  },
  {
    id: 2,
    title: "Payment Received",
    description: "Successfully processed payment of $55.00 for Booking Ref: BMLS-28491.",
    date: "2026-07-13 08:32 AM",
    type: "payment",
    unread: false
  },
  {
    id: 3,
    title: "Security Alert",
    description: "Your login credentials password was successfully updated.",
    date: "2026-07-12 04:15 PM",
    type: "security",
    unread: false
  }
];

export default function Notifications() {
  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4.5 w-4.5 text-blue-600" />;
      case "payment":
        return <CreditCard className="h-4.5 w-4.5 text-emerald-600" />;
      default:
        return <ShieldCheck className="h-4.5 w-4.5 text-[#8C4B3E]" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "booking":
        return "bg-blue-55 text-blue-600 border-blue-100";
      case "payment":
        return "bg-emerald-55 text-emerald-600 border-emerald-100";
      default:
        return "bg-[#F0E7D5] text-[#8C4B3E] border-[#5A5146]/20";
    }
  };

  return (
    <DashboardLayout>
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-violet-950 via-violet-800 to-violet-950 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Notifications Log</h1>
            <p className="text-[#7A7266] text-xs mt-1.5 font-medium">Keep track of your bookings status, receipts, and account settings logs</p>
          </div>
          <Button size="xs" className="bg-white text-[#1F1D1A] hover:bg-[#FAF6F0] rounded-xl h-8.5 text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-md">
            <Check className="h-3.5 w-3.5" /> Mark All Read
          </Button>
        </div>
      </section>

      {/* NOTIFICATIONS LOG */}
      <div className="space-y-6">
        <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-stone-50">
            <CardTitle className="text-base font-extrabold text-[#1F1D1A]">System Logs & Alerts</CardTitle>
            <CardDescription className="text-xs">History of all alert receipts and message triggers</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            {mockNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-[#7A7266]">All caught up!</p>
                <p className="text-xs text-[#7A7266] mt-1">No new notifications at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`flex items-start justify-between gap-4 p-4 border rounded-2xl transition-colors duration-200 hover:bg-[#FAF6F0] ${
                      notif.unread ? "border-amber-250 bg-amber-50/20" : "border-[#5A5146]/20 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${getBadgeColor(notif.type)}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-[#1F1D1A] leading-snug">{notif.title}</h4>
                          {notif.unread && (
                            <span className="bg-[#8C4B3E] text-white font-bold text-[8px] uppercase px-1.5 py-0.5 rounded-full tracking-wider animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5A5146] leading-relaxed font-medium">
                          {notif.description}
                        </p>
                        <span className="block text-[10px] text-[#7A7266] font-semibold mt-1">
                          {notif.date}
                        </span>
                      </div>
                    </div>

                    <button className="text-[#7A7266] hover:text-rose-600 p-1.5 shrink-0 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
