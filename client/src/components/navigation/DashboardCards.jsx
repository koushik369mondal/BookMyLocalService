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
  ArrowUpRight,
} from "lucide-react";

export default function DashboardCards({ role }) {
  const providerCards = [
    {
      title: "Manage availability",
      description: "Set your weekly shift hours, dates, and calendar holidays.",
      path: "/provider/availability",
      icon: Clock,
    },
    {
      title: "Subscription plan",
      description: "Configure your service tier plans, check billing, and invoices.",
      path: "/provider/subscription",
      icon: CreditCard,
    },
    {
      title: "Earnings and payouts",
      description: "Track income stats, transaction histories, and cashouts.",
      path: "/provider/earnings",
      icon: DollarSign,
    },
    {
      title: "Reviews and ratings",
      description: "Review customer feedback, performance ratings, and replies.",
      path: "/provider/reviews",
      icon: Star,
    },
  ];

  const customerCards = [
    {
      title: "Profile settings",
      description: "Configure personal info, contact details, and default addresses.",
      path: "/profile",
      icon: User,
    },
    {
      title: "Booking history",
      description: "Track active, upcoming, completed, and cancelled bookings.",
      path: "/bookings",
      icon: Calendar,
    },
    {
      title: "Saved favorites",
      description: "Quick access to your bookmarked local professionals.",
      path: "/favorites",
      icon: Heart,
    },
    {
      title: "Notification preferences",
      description: "Manage booking alerts, schedule updates, and receipts.",
      path: "/notifications",
      icon: Bell,
    },
    {
      title: "Payment methods",
      description: "Manage saved cards, bank accounts, and payment preferences.",
      path: "/payment-methods",
      icon: CreditCard,
    },
  ];

  const cards = role === "PROVIDER" ? providerCards : customerCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            to={card.path}
            className="card-chai group p-5 flex flex-col justify-between sm:opacity-90 hover:opacity-100 transition-all"
          >
            <div className="space-y-3">
              <div className="size-10 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-foreground group-hover:text-brand transition-colors">
                <Icon className="size-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-brand transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 mt-4 flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              <span>View section</span>
              <ArrowUpRight className="size-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-muted-foreground group-hover:text-brand" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
