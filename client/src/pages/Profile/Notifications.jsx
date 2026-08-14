import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Check, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle,
  Filter,
  CheckCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotification();

  const [activeTab, setActiveTab] = useState("all"); // "all", "unread", "bookings", "payments", "reviews"

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    return notifications.filter((item) => {
      if (activeTab === "unread") return !item.isRead;
      if (activeTab === "bookings") return item.type?.startsWith("BOOKING_") || item.type?.startsWith("SERVICE_");
      if (activeTab === "payments") return item.type === "PAYMENT_RECEIVED";
      if (activeTab === "reviews") return item.type?.startsWith("REVIEW_");
      return true;
    });
  }, [notifications, activeTab]);

  const getIcon = (type) => {
    switch (type) {
      case "BOOKING_CREATED":
      case "BOOKING_CONFIRMED":
        return <Calendar className="h-4.5 w-4.5 text-[#1E4B75]" />;
      case "SERVICE_STARTED":
      case "SERVICE_COMPLETED":
        return <CheckCircle2 className="h-4.5 w-4.5 text-[#2B522B]" />;
      case "BOOKING_CANCELLED":
        return <Clock className="h-4.5 w-4.5 text-[#8C4B3E]" />;
      case "PAYMENT_RECEIVED":
        return <ShieldCheck className="h-4.5 w-4.5 text-[#C9A46A]" />;
      case "REVIEW_ADDED":
      case "REVIEW_REPLIED":
        return <Sparkles className="h-4.5 w-4.5 text-[#C9A46A]" />;
      default:
        return <Bell className="h-4.5 w-4.5 text-[#C9A46A]" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "BOOKING_CREATED":
      case "BOOKING_CONFIRMED":
        return "bg-[#5A95C9]/20 text-[#1E4B75] border-[#5A95C9]/30";
      case "SERVICE_STARTED":
      case "SERVICE_COMPLETED":
        return "bg-[#7DAB7D]/20 text-[#2B522B] border-[#7DAB7D]/30";
      case "BOOKING_CANCELLED":
        return "bg-[#8C4B3E]/20 text-[#8C4B3E] border-[#8C4B3E]/30";
      case "PAYMENT_RECEIVED":
        return "bg-[#C9A46A]/20 text-[#C9A46A] border-[#C9A46A]/30";
      default:
        return "bg-[#C9A46A]/20 text-[#C9A46A] border-[#C9A46A]/30";
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }

    if (item.referenceType === "BOOKING") {
      if (user?.role === "PROVIDER") navigate("/provider/jobs");
      else if (user?.role === "ADMIN") navigate("/admin/bookings");
      else navigate("/bookings");
    } else if (item.referenceType === "REVIEW") {
      if (user?.role === "PROVIDER") navigate("/provider/reviews");
      else navigate("/notifications");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">
                  Notification History
                </h1>
                {unreadCount > 0 && (
                  <Badge className="bg-[#8C4B3E] text-white font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#E8DCC3]">
                    {unreadCount} Unread
                  </Badge>
                )}
              </div>
              <p className="text-[#5A5146] text-xs mt-1 font-medium">
                Centralized database alerts for your bookings, payments, and reviews
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                size="sm"
                onClick={markAllAsRead}
                className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl h-9 text-xs font-bold flex items-center gap-1.5 shrink-0 border border-[#E8DCC3] shadow-2xs cursor-pointer"
              >
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </Button>
            )}
          </div>
        </section>

        {/* NOTIFICATIONS LOG */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">System Activity Log</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Real-time database triggers across all application events</CardDescription>
              </div>

              {/* TAB FILTERS */}
              <div className="flex items-center gap-1.5 bg-[#FAF6F0] p-1 border border-[#E8DCC3] rounded-xl overflow-x-auto max-w-full">
                {[
                  { key: "all", label: "All" },
                  { key: "unread", label: `Unread (${unreadCount})` },
                  { key: "bookings", label: "Bookings" },
                  { key: "payments", label: "Payments" },
                  { key: "reviews", label: "Reviews" }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.key
                        ? "bg-[#F0E7D5] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                        : "text-[#5A5146] hover:text-[#1F1D1A] hover:bg-[#F0E7D5]/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              {/* ERROR STATE */}
              {error && (
                <div className="p-4 mb-6 bg-[#8C4B3E]/10 border border-[#8C4B3E]/30 rounded-xl text-[#8C4B3E] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchNotifications(false)}
                    className="h-7 text-xs border-[#8C4B3E]/40 text-[#8C4B3E] hover:bg-[#8C4B3E]/20 cursor-pointer"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* LOADING STATE */}
              {loading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border border-[#E8DCC3]/60 rounded-2xl bg-[#FAF6F0]/40 animate-pulse">
                      <div className="h-10 w-10 bg-[#E8DCC3]/50 rounded-xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-[#E8DCC3]/60 rounded" />
                        <div className="h-3 w-3/4 bg-[#E8DCC3]/40 rounded" />
                        <div className="h-3 w-1/4 bg-[#E8DCC3]/30 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                /* EMPTY STATE */
                <div className="text-center py-16">
                  <Bell className="h-12 w-12 text-[#C9A46A] mx-auto mb-3 opacity-30" />
                  <h4 className="text-base font-bold text-[#1F1D1A]">No notifications found</h4>
                  <p className="text-xs text-[#7A7266] mt-1 max-w-sm mx-auto">
                    {activeTab === "unread"
                      ? "You have no unread notifications at this time."
                      : "When actions occur on your bookings, payments, or reviews, notifications will appear here."}
                  </p>
                </div>
              ) : (
                /* NOTIFICATIONS LIST */
                <div className="space-y-3.5">
                  {filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start justify-between gap-4 p-4 border rounded-2xl transition-all duration-150 ${
                        !notif.isRead
                          ? "border-[#C9A46A] bg-[#F0E7D5]/40 shadow-2xs"
                          : "border-[#E8DCC3] bg-white hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <div
                        onClick={() => handleNotificationClick(notif)}
                        className="flex items-start gap-3.5 flex-1 cursor-pointer min-w-0"
                      >
                        <div className={`p-2.5 rounded-xl border shrink-0 ${getBadgeColor(notif.type)}`}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-bold text-sm leading-snug ${!notif.isRead ? "text-[#1F1D1A]" : "text-[#5A5146]"}`}>
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <Badge className="bg-[#8C4B3E] text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full border border-[#E8DCC3]">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#5A5146] leading-relaxed font-medium">
                            {notif.message}
                          </p>
                          <span className="block text-[10px] text-[#7A7266] font-semibold mt-1">
                            {formatDate(notif.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        {!notif.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            className="p-1.5 text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#F0E7D5] rounded-lg transition-colors cursor-pointer"
                            title="Mark as Read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-1.5 text-[#7A7266] hover:text-[#8C4B3E] hover:bg-[#8C4B3E]/10 rounded-lg transition-colors cursor-pointer"
                          title="Remove Notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
