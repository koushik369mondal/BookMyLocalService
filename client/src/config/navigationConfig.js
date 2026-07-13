import { 
  User, 
  Edit3, 
  Calendar, 
  MapPin, 
  Heart, 
  Bell, 
  CreditCard, 
  Lock, 
  Sliders, 
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
  Grid,
  Layers
} from "lucide-react";

export const customerMenu = [
  { label: "Personal Information", icon: User, path: "/profile", tab: "details" },
  { label: "Edit Profile", icon: Edit3, path: "/profile/edit" },
  { label: "My Bookings", icon: Calendar, path: "/bookings" },
  { label: "Saved Addresses", icon: MapPin, path: "/profile", tab: "addresses" },
  { label: "Favorites", icon: Heart, path: "/favorites" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Payment Methods", icon: CreditCard, path: "/payment-methods" },
  { label: "Security", icon: Lock, path: "/profile", tab: "security" },
  { label: "Preferences", icon: Sliders, path: "/profile", tab: "settings" },
  { label: "Logout", icon: LogOut, path: "/logout", isLogout: true }
];

export const providerMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/provider/dashboard" },
  { label: "My Jobs", icon: Briefcase, path: "/provider/jobs" },
  { label: "Availability", icon: Clock, path: "/provider/availability" },
  { label: "Earnings", icon: DollarSign, path: "/provider/earnings" },
  { label: "Reviews", icon: Star, path: "/provider/reviews" },
  { label: "Billing & Subscription", icon: CreditCard, path: "/provider/subscription" },
  { label: "Edit Provider Profile", icon: Edit3, path: "/profile/edit" },
  { label: "Settings", icon: Settings, path: "/provider/settings" },
  { label: "Logout", icon: LogOut, path: "/logout", isLogout: true }
];

export const adminMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Providers", icon: ShieldCheck, path: "/admin/providers" },
  { label: "Bookings", icon: Calendar, path: "/admin/bookings" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
  { label: "Reports", icon: FileText, path: "/admin/reports" },
  { label: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
  { label: "Categories", icon: Grid, path: "/categories" },
  { label: "Services", icon: Layers, path: "/services" },
  { label: "Settings", icon: Settings, path: "/admin/settings" }
];
