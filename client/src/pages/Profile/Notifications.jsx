import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
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

  const [activeTab, setActiveTab] = useState("all");

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
        return <Calendar className="h-4 w-4 text-sky-400" />;
      case "SERVICE_STARTED":
      case "SERVICE_COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "BOOKING_CANCELLED":
        return <Clock className="h-4 w-4 text-red-400" />;
      case "PAYMENT_RECEIVED":
        return <ShieldCheck className="h-4 w-4 text-amber-400" />;
      case "REVIEW_ADDED":
      case "REVIEW_REPLIED":
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      default:
        return <Bell className="h-4 w-4 text-neutral-400" />;
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
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <Badge variant="outline" className="border-white/20 text-white text-xs px-2.5 py-0.5 rounded-full">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <p className="text-neutral-400 text-xs mt-1 font-medium">
              Real-time activity alerts for your bookings, payments, and reviews
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              className="text-xs flex items-center gap-1.5 shrink-0"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        {/* NOTIFICATIONS LOG */}
        <div className="card-chai p-6 space-y-6">
          <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Activity log</h2>
              <p className="text-xs text-neutral-400">Updates across all application events</p>
            </div>

            {/* TAB FILTERS */}
            <div className="flex items-center gap-1.5 bg-neutral-900/60 p-1 border border-white/10 rounded-xl overflow-x-auto max-w-full">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-white text-neutral-950 font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            {/* ERROR STATE */}
            {error && (
              <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fetchNotifications(false)}
                  className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* LOADING STATE */}
            {loading ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border border-white/5 rounded-2xl bg-white/[0.02] animate-pulse">
                    <div className="h-10 w-10 bg-neutral-800 rounded-xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/3 bg-neutral-800 rounded" />
                      <div className="h-3 w-3/4 bg-neutral-800/60 rounded" />
                      <div className="h-3 w-1/4 bg-neutral-800/40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              /* EMPTY STATE */
              <div className="text-center py-16">
                <Bell className="h-12 w-12 text-neutral-600 mx-auto mb-3 opacity-30" />
                <h4 className="text-base font-bold text-white">No notifications found</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  {activeTab === "unread"
                    ? "You have no unread notifications at this time."
                    : "When actions occur on your bookings, payments, or reviews, notifications will appear here."}
                </p>
              </div>
            ) : (
              /* NOTIFICATIONS LIST */
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start justify-between gap-4 p-4 border rounded-2xl transition-all duration-150 ${
                      !notif.isRead
                        ? "border-white/20 bg-white/[0.04]"
                        : "border-white/5 bg-transparent hover:bg-white/[0.02]"
                    }`}
                  >
                    <div
                      onClick={() => handleNotificationClick(notif)}
                      className="flex items-start gap-3.5 flex-1 cursor-pointer min-w-0"
                    >
                      <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-semibold text-sm leading-snug ${!notif.isRead ? "text-white" : "text-neutral-400"}`}>
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <Badge variant="outline" className="border-white/20 text-neutral-200 font-medium text-[9px] uppercase px-2 py-0.5 rounded-full">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                          {notif.message}
                        </p>
                        <span className="block text-[10px] text-neutral-500 font-mono mt-1">
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
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
