import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    description: "Successfully processed payment of ₹55.00 for Booking Ref: BMLS-28491.",
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
        return <Calendar className="h-4.5 w-4.5 text-[#1E4B75]" />;
      case "payment":
        return <CreditCard className="h-4.5 w-4.5 text-[#2B522B]" />;
      default:
        return <ShieldCheck className="h-4.5 w-4.5 text-[#8C4B3E]" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "booking":
        return "bg-[#5A95C9]/20 text-[#1E4B75] border-[#5A95C9]/30";
      case "payment":
        return "bg-[#7DAB7D]/20 text-[#2B522B] border-[#7DAB7D]/30";
      default:
        return "bg-[#8C4B3E]/20 text-[#8C4B3E] border-[#8C4B3E]/30";
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Notifications Log</h1>
              <p className="text-[#5A5146] text-xs mt-1 font-medium">Keep track of your booking status, payment receipts, and security alerts</p>
            </div>
            <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl h-9 text-xs font-bold flex items-center gap-1.5 shrink-0 border border-[#E8DCC3] shadow-2xs">
              <Check className="h-3.5 w-3.5" /> Mark All Read
            </Button>
          </div>
        </section>

        {/* NOTIFICATIONS LOG */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3]">
              <CardTitle className="text-base font-bold text-[#1F1D1A]">System Logs & Alerts</CardTitle>
              <CardDescription className="text-xs text-[#7A7266]">History of all alert receipts and message triggers</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              {mockNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-10 w-10 text-[#7A7266] mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-bold text-[#1F1D1A]">All caught up!</p>
                  <p className="text-xs text-[#7A7266] mt-1">No new notifications at this time</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {mockNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`flex items-start justify-between gap-4 p-4 border rounded-2xl transition-all duration-150 hover:bg-[#FAF6F0] ${
                        notif.unread ? "border-[#C9A46A] bg-[#F0E7D5]/30 shadow-2xs" : "border-[#E8DCC3] bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-xl border shrink-0 ${getBadgeColor(notif.type)}`}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-[#1F1D1A] leading-snug">{notif.title}</h4>
                            {notif.unread && (
                              <Badge className="bg-[#8C4B3E] text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full border border-[#E8DCC3]">
                                New
                              </Badge>
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

                      <button className="text-[#7A7266] hover:text-[#8C4B3E] p-1.5 shrink-0 transition-colors" title="Remove Notification">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
