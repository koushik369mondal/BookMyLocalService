import { 
  User, 
  MapPin, 
  Bell, 
  CreditCard, 
  LogOut,
  LayoutDashboard,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Settings,
  Users,
  ShieldCheck,
  FileText,
  TrendingUp,
  Calendar,
  Edit3,
  Layers,
  Tag
} from "lucide-react";

export const customerMenu = [
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "Saved Addresses", icon: MapPin, path: "/profile", tab: "addresses" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Payment Methods", icon: CreditCard, path: "/payment-methods" },
  { label: "Logout", icon: LogOut, path: "/logout", isLogout: true }
];

export const providerMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/provider/dashboard" },
  { label: "My Services", icon: Layers, path: "/provider/services" },
  { label: "My Jobs", icon: Briefcase, path: "/provider/jobs" },
  { label: "Availability", icon: Clock, path: "/provider/availability" },
  { label: "Earnings", icon: DollarSign, path: "/provider/earnings" },
  { label: "Reviews", icon: Star, path: "/provider/reviews" },
  { label: "Billing & Subscription", icon: CreditCard, path: "/provider/subscription" },
  { label: "Edit Provider Profile", icon: Edit3, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/provider/settings" },
  { label: "Logout", icon: LogOut, path: "/logout", isLogout: true }
];

export const adminMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Providers", icon: ShieldCheck, path: "/admin/providers" },
  { label: "Bookings", icon: Calendar, path: "/admin/bookings" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
  { label: "Coupons", icon: Tag, path: "/admin/coupons" },
  { label: "Reports", icon: FileText, path: "/admin/reports" },
  { label: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
  { label: "Settings", icon: Settings, path: "/admin/settings" }
];
