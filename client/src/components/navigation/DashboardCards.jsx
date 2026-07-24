import React from "react";
import { Link } from "react-router-dom";
import { 
  Clock, 
  CreditCard, 
  DollarSign, 
  Star, 
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
      color: "text-[#1E4B75] bg-[#5A95C9]/20 border-[#5A95C9]/30",
    },
    {
      title: "Subscription Plan",
      description: "Configure your service tier plans, check billing, and invoices.",
      path: "/provider/subscription",
      icon: CreditCard,
      color: "text-[#5A5146] bg-[#F0E7D5] border-[#E8DCC3]",
    },
    {
      title: "Earnings & Payouts",
      description: "Track your income stats, transaction histories, and cashouts.",
      path: "/provider/earnings",
      icon: DollarSign,
      color: "text-[#2B522B] bg-[#7DAB7D]/20 border-[#7DAB7D]/30",
    },
    {
      title: "Reviews & Ratings",
      description: "See customer feedback, performance ratings, and comments.",
      path: "/provider/reviews",
      icon: Star,
      color: "text-[#C9A46A] bg-[#C9A46A]/20 border-[#C9A46A]/30",
    },
  ];

  const customerCards = [
    {
      title: "My Profile Settings",
      description: "Configure your personal info, login keys, and address rules.",
      path: "/profile",
      icon: User,
      color: "text-[#5A5146] bg-[#F0E7D5] border-[#E8DCC3]",
    },
    {
      title: "Booking History",
      description: "Track your active, past, or cancelled dispatch bookings.",
      path: "/bookings",
      icon: Calendar,
      color: "text-[#1E4B75] bg-[#5A95C9]/20 border-[#5A95C9]/30",
    },
    {
      title: "My Favorites",
      description: "Manage your preferred categories and bookmarked local experts.",
      path: "/favorites",
      icon: Heart,
      color: "text-[#8C4B3E] bg-[#8C4B3E]/20 border-[#8C4B3E]/30",
    },
    {
      title: "Notifications",
      description: "Manage SMS updates, promo alerts, and dispatch receipts.",
      path: "/notifications",
      icon: Bell,
      color: "text-[#C9A46A] bg-[#C9A46A]/20 border-[#C9A46A]/30",
    },
    {
      title: "Payment Methods",
      description: "Securely link credit cards, bank accounts, or digital wallets.",
      path: "/payment-methods",
      icon: CreditCard,
      color: "text-[#2B522B] bg-[#7DAB7D]/20 border-[#7DAB7D]/30",
    },
  ];

  const cards = role === "PROVIDER" ? providerCards : customerCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4 font-sans">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            to={card.path}
            className="group flex flex-col justify-between border border-[#E8DCC3] bg-white p-5 rounded-2xl shadow-2xs hover:border-[#C9A46A] hover:bg-[#FAF6F0] transition-all duration-200 relative overflow-hidden h-full"
          >
            <div className="relative z-10 space-y-3">
              <div className={`p-3 rounded-xl border w-fit shrink-0 transition-transform group-hover:scale-105 duration-200 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-[#1F1D1A] text-sm leading-tight group-hover:text-[#C9A46A] transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-[#5A5146] leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="border-t border-[#E8DCC3] pt-3 mt-4 flex items-center justify-between relative z-10 text-xs font-bold text-[#7A7266] group-hover:text-[#1F1D1A] transition-colors">
              <span>Access Action</span>
              <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 text-[#7A7266] group-hover:text-[#C9A46A]" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
