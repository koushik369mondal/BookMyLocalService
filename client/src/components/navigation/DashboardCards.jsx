import React from "react";
import { Link } from "react-router-dom";
import { 
  Clock, 
  CreditCard, 
  DollarSign, 
  Star, 
  LayoutDashboard, 
  User, 
  Calendar, 
  Heart, 
  Bell, 
  ArrowUpRight 
} from "lucide-react";

export default function DashboardCards({ role }) {
  const providerCards = [
    {
      title: "Manage Availability",
      description: "Set your weekly shift hours, dates, and block calendar holidays.",
      path: "/provider/availability",
      icon: Clock,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Subscription Plan",
      description: "Configure your service tier plans, check billing, and invoices.",
      path: "/provider/subscription",
      icon: CreditCard,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Earnings & Payouts",
      description: "Track your income stats, transaction histories, and cashouts.",
      path: "/provider/earnings",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Reviews & Ratings",
      description: "See customer feedback, performance ratings, and comments.",
      path: "/provider/reviews",
      icon: Star,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Dashboard Home",
      description: "View your pending bookings, job boards, and weekly trends.",
      path: "/provider/dashboard",
      icon: LayoutDashboard,
      color: "text-slate-650 bg-slate-100/50 border-slate-200",
    },
  ];

  const customerCards = [
    {
      title: "My Profile Settings",
      description: "Configure your personal info, login keys, and address rules.",
      path: "/profile",
      icon: User,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Booking History",
      description: "Track your active, past, or cancelled dispatch bookings.",
      path: "/bookings",
      icon: Calendar,
      color: "text-sky-650 bg-sky-50 border-sky-100",
    },
    {
      title: "My Favorites",
      description: "Manage your preferred categories and bookmarked local experts.",
      path: "/favorites",
      icon: Heart,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      title: "Notifications",
      description: "Manage SMS updates, promo alerts, and dispatch receipts.",
      path: "/notifications",
      icon: Bell,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Payment Methods",
      description: "Securely link credit cards, bank accounts, or digital wallets.",
      path: "/payment-methods",
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  const cards = role === "PROVIDER" ? providerCards : customerCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 my-6 font-sans">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            to={card.path}
            className="group flex flex-col justify-between border border-slate-200 p-5 rounded-2xl bg-white hover:border-slate-350 hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Ambient hover effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_50%)] transition-opacity duration-300"></div>

            <div className="relative z-10 space-y-3">
              <div className={`p-3 rounded-xl border w-fit shrink-0 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-amber-550 transition-colors">
                  {card.title}
                </h4>
                <p className="text-[11px] text-slate-450 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-3 mt-4 flex items-center justify-between relative z-10 text-[10px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
              <span>Go to Page</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
