import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Calendar,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Repeat,
  Briefcase,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";

const mockNotifications = [
  { id: 1, title: "Booking Confirmed", desc: "Deep Home Cleaning scheduled for Tomorrow at 10:30 AM", time: "5 mins ago", icon: CheckCircle2, iconColor: "text-[#2B522B] bg-[#7DAB7D]/20", unread: true },
  { id: 2, title: "Specialist Assigned", desc: "Sarah Jenkins accepted your dispatch request in Brooklyn", time: "1 hour ago", icon: ShieldCheck, iconColor: "text-[#C9A46A] bg-[#F0E7D5]", unread: true },
  { id: 3, title: "Payment Received", desc: "Receipt of $55.00 generated for Window Washing", time: "3 hours ago", icon: Sparkles, iconColor: "text-[#8C4B3E] bg-[#8C4B3E]/20", unread: true },
  { id: 4, title: "Rate Your Service", desc: "Share your feedback for Sofa & Carpet Sanitization", time: "1 day ago", icon: Clock, iconColor: "text-[#5A5146] bg-[#FAF6F0]", unread: false }
];

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const handleToggleRole = async () => {
    if (!user || isSwitchingRole) return;
    const targetRole = user.role === "PROVIDER" ? "CUSTOMER" : "PROVIDER";
    setIsSwitchingRole(true);
    setShowDropdown(false);
    try {
      await switchRole(targetRole);
      if (targetRole === "PROVIDER") {
        navigate("/provider/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Role switch error:", error);
    } finally {
      setIsSwitchingRole(false);
    }
  };

  // Dynamic role-based navbar links
  const navLinks = React.useMemo(() => {
    if (!user) {
      // Guest Navigation
      return [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Categories', path: '/categories' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
      ];
    }

    if (user.role === 'PROVIDER') {
      // Provider-specific Navigation
      return [
        { name: 'Dashboard', path: '/provider/dashboard' },
        { name: 'My Services', path: '/provider/services' },
        { name: 'Bookings', path: '/provider/jobs' },
        { name: 'Earnings', path: '/provider/earnings' },
        { name: 'Reviews', path: '/provider/reviews' },
        { name: 'Settings', path: '/provider/settings' }
      ];
    }

    if (user.role === 'ADMIN') {
      // Admin-specific Navigation
      return [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Providers', path: '/admin/providers' },
        { name: 'Bookings', path: '/admin/bookings' },
        { name: 'Payments', path: '/admin/payments' },
        { name: 'Reports', path: '/admin/reports' },
        { name: 'Settings', path: '/admin/settings' }
      ];
    }

    // Customer Navigation
    return [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Categories', path: '/categories' },
      { name: 'My Bookings', path: '/bookings' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ];
  }, [user]);

  // State management
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const logoLink = React.useMemo(() => {
    if (user?.role === "PROVIDER") return "/provider/dashboard";
    if (user?.role === "ADMIN") return "/admin/dashboard";
    return "/";
  }, [user]);

  const searchPlaceholder = React.useMemo(() => {
    if (user?.role === "PROVIDER") return "Search my services, jobs...";
    if (user?.role === "ADMIN") return "Search users, providers, bookings...";
    return "Search services...";
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    if (user?.role === "PROVIDER") {
      navigate(`/provider/services?search=${encodeURIComponent(query)}`);
    } else if (user?.role === "ADMIN") {
      navigate(`/admin/users?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/services?search=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const handleMarkAllRead = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notificationsList.filter(n => n.unread).length;

  return (
    <div className="sticky top-0 z-50 w-full font-sans">
      <header className="w-full border-b border-[#E8DCC3] bg-[#F0E7D5] shadow-2xs text-[#1F1D1A] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4 lg:gap-6">

          {/* Brand / Logo */}
          <NavLink to={logoLink} className="flex items-center gap-3 group shrink-0 py-1">
            <img
              src="/logo.png"
              alt="BookMyLocalService Logo"
              className="h-10 lg:h-11 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
            <span className="font-bold text-xl lg:text-2xl tracking-tight text-[#1F1D1A] group-hover:text-[#C9A46A] transition-colors duration-200">
              BookMyLocal<span className="text-[#C9A46A]">Service</span>
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => cn(
                  "text-sm font-bold transition-all duration-200 relative py-1.5 whitespace-nowrap",
                  isActive
                    ? "text-[#C9A46A] font-extrabold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-[#C9A46A] after:rounded-full"
                    : "text-[#5A5146] hover:text-[#C9A46A]"
                )}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative w-44 lg:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266] pointer-events-none" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10 pr-4 h-[44px] lg:h-[48px] w-full bg-[#FAF6F0] border border-[#E8DCC3] text-[#1F1D1A] placeholder:text-[#7A7266] focus:border-[#C9A46A] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 shadow-2xs rounded-xl text-xs lg:text-sm transition-all duration-200"
              />
            </form>

            {/* Notifications Bell Button & Dropdown */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative hover:bg-[#F0E7D5] text-[#5A5146] hover:text-[#1F1D1A] rounded-xl h-[44px] w-[44px] lg:h-[48px] lg:w-[48px] transition-all duration-200 shrink-0 cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-[#5A5146] hover:text-[#C9A46A] transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#8C4B3E] text-[10px] font-extrabold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* LIVE NOTIFICATIONS DROPDOWN MENU */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-lg py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-3 border-b border-[#E8DCC3] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#C9A46A]" />
                      <h4 className="font-bold text-sm text-[#1F1D1A]">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="bg-[#C9A46A]/20 text-[#8C4B3E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C9A46A]/30">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#8C4B3E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E8DCC3]/60">
                    {notificationsList.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#7A7266]">No new notifications</div>
                    ) : (
                      notificationsList.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-[#F0E7D5]/50 ${item.unread ? "bg-[#F0E7D5]/30" : ""
                              }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${item.iconColor || "bg-[#C9A46A]/10 text-[#C9A46A]"}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h5 className="font-bold text-xs text-[#1F1D1A] truncate">{item.title}</h5>
                                <span className="text-[10px] text-[#7A7266] font-medium shrink-0">{item.time}</span>
                              </div>
                              <p className="text-xs text-[#5A5146] leading-snug font-normal line-clamp-2">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="px-4 pt-2.5 border-t border-[#E8DCC3] text-center">
                    <NavLink
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-[#7A7266] hover:text-[#C9A46A] font-bold transition-colors block py-1"
                    >
                      View all notification history →
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              /* Logged In Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F0E7D5] focus:outline-none transition-all duration-200 border border-transparent hover:border-[#E8DCC3] cursor-pointer"
                >
                  <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl overflow-hidden border border-[#E8DCC3] bg-[#F0E7D5] flex items-center justify-center font-bold text-xs lg:text-sm text-[#C9A46A] shadow-2xs shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                    ) : (
                      user.fullName[0].toUpperCase()
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#7A7266] transition-transform duration-200" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-medium text-xs text-[#5A5146]">
                    <div className="px-4 py-2.5 border-b border-[#E8DCC3] text-[11px] text-[#7A7266] font-semibold uppercase tracking-wider">
                      Signed in as <span className="text-[#1F1D1A] font-bold block normal-case text-sm truncate mt-0.5">{user.fullName}</span>
                    </div>

                    <NavLink
                      to={
                        user.role === "ADMIN"
                          ? "/admin/dashboard"
                          : user.role === "PROVIDER"
                            ? "/provider/dashboard"
                            : "/customer/dashboard"
                      }
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150 font-bold"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#7A7266]" /> Dashboard
                    </NavLink>

                    <NavLink
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150"
                    >
                      <User className="h-4 w-4 text-[#7A7266]" /> My Profile
                    </NavLink>

                    {user.role === "CUSTOMER" && (
                      <NavLink
                        to="/bookings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150"
                      >
                        <Calendar className="h-4 w-4 text-[#7A7266]" /> Booking History
                      </NavLink>
                    )}

                    <NavLink
                      to={
                        user.role === "ADMIN"
                          ? "/admin/settings"
                          : user.role === "PROVIDER"
                            ? "/provider/settings"
                            : "/profile"
                      }
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150"
                    >
                      <Settings className="h-4 w-4 text-[#7A7266]" /> Settings
                    </NavLink>

                    {user.role !== "ADMIN" && (
                      <button
                        onClick={handleToggleRole}
                        disabled={isSwitchingRole}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] text-[#C9A46A] transition-colors duration-150 text-left font-bold cursor-pointer border-t border-[#E8DCC3]/60"
                      >
                        {isSwitchingRole ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-[#C9A46A]" />
                            <span>Switching...</span>
                          </>
                        ) : user.role === "PROVIDER" ? (
                          <>
                            <User className="h-4 w-4 text-[#C9A46A]" />
                            <span>Switch to Customer</span>
                          </>
                        ) : (
                          <>
                            <Briefcase className="h-4 w-4 text-[#C9A46A]" />
                            <span>Switch to Provider</span>
                          </>
                        )}
                      </button>
                    )}

                    <hr className="my-1.5 border-[#E8DCC3]" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#8C4B3E]/10 text-[#8C4B3E] transition-colors duration-150 text-left font-bold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login and Sign Up */
              <div className="flex items-center gap-2.5">
                <NavLink to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#F0E7D5] h-[44px] px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                  >
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/register">
                  <Button
                    size="sm"
                    className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold h-[44px] px-5 rounded-xl text-sm transition-all duration-200 border border-[#E8DCC3] cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Notifications Bell */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative hover:bg-[#F0E7D5] text-[#5A5146] rounded-xl h-10 w-10 transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5 text-[#7A7266]" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-[#8C4B3E] rounded-full border border-white"></span>
              )}
            </Button>

            {/* Mobile Hamburger Drawer */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-[#F0E7D5] h-10 w-10 transition-colors cursor-pointer" title="Open Menu">
                  <Menu className="h-6 w-6 text-[#1F1D1A]" />
                </Button>
              </DialogTrigger>

              <DialogContent className="fixed right-0 top-0 bottom-0 inset-y-0 h-full h-screen w-[85vw] max-w-[320px] translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 border-l border-[#E8DCC3] p-0 bg-[#FAF6F0] shadow-2xl flex flex-col z-50 transition-all duration-300 text-[#5A5146] overflow-hidden">

                {/* Header with logo & title */}
                <div className="p-4 sm:p-5 border-b border-[#E8DCC3] flex items-center justify-between shrink-0 bg-[#F0E7D5] pr-12">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/logo.png"
                      alt="BookMyLocalService Logo"
                      className="h-8 w-auto object-contain"
                    />
                    <span className="font-bold text-base text-[#1F1D1A]">
                      BookMyLocal<span className="text-[#C9A46A]">Service</span>
                    </span>
                  </div>
                </div>

                {/* Scrollable Container inside Mobile Drawer */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-5">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266] pointer-events-none" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="pl-10 h-10 w-full bg-white border-[#E8DCC3] text-[#1F1D1A] placeholder:text-[#7A7266] focus:border-[#C9A46A] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 rounded-xl text-xs"
                    />
                  </form>

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-1 py-1">
                    {navLinks.map((link) => (
                      <DialogClose asChild key={link.path}>
                        <NavLink
                          to={link.path}
                          className={({ isActive }) => cn(
                            "text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-150 flex items-center justify-between",
                            isActive
                              ? "bg-[#F0E7D5] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                              : "text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#1F1D1A]"
                          )}
                        >
                          <span>{link.name}</span>
                        </NavLink>
                      </DialogClose>
                    ))}
                  </nav>

                  {/* User Profile / Auth Section */}
                  <div className="border-t border-[#E8DCC3] pt-4 space-y-3 shrink-0">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-[#F0E7D5] border border-[#E8DCC3] rounded-2xl">
                          <div className="h-10 w-10 rounded-xl overflow-hidden border border-[#E8DCC3] bg-white flex items-center justify-center font-bold text-sm text-[#C9A46A] shrink-0">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                            ) : (
                              user.fullName[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-[#1F1D1A] truncate">{user.fullName}</span>
                            <span className="text-[10px] text-[#C9A46A] font-bold uppercase tracking-wider block mt-0.5">{user.role} Account</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <DialogClose asChild>
                            <NavLink
                              to={
                                user.role === "ADMIN"
                                  ? "/admin/dashboard"
                                  : user.role === "PROVIDER"
                                    ? "/provider/dashboard"
                                    : "/customer/dashboard"
                              }
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#C9A46A] rounded-xl transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4 text-[#7A7266]" /> Dashboard
                            </NavLink>
                          </DialogClose>
                          <DialogClose asChild>
                            <NavLink to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#C9A46A] rounded-xl transition-colors">
                              <User className="h-4 w-4 text-[#7A7266]" /> My Profile
                            </NavLink>
                          </DialogClose>
                          {user.role === "CUSTOMER" && (
                            <DialogClose asChild>
                              <NavLink to="/bookings" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#C9A46A] rounded-xl transition-colors">
                                <Calendar className="h-4 w-4 text-[#7A7266]" /> Booking History
                              </NavLink>
                            </DialogClose>
                          )}
                          {user.role !== "ADMIN" && (
                            <DialogClose asChild>
                              <button
                                onClick={handleToggleRole}
                                disabled={isSwitchingRole}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#C9A46A] hover:bg-[#F0E7D5] rounded-xl text-left transition-colors cursor-pointer"
                              >
                                {isSwitchingRole ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin text-[#C9A46A]" />
                                    <span>Switching Account...</span>
                                  </>
                                ) : user.role === "PROVIDER" ? (
                                  <>
                                    <User className="h-4 w-4 text-[#C9A46A]" />
                                    <span>Switch to Customer</span>
                                  </>
                                ) : (
                                  <>
                                    <Briefcase className="h-4 w-4 text-[#C9A46A]" />
                                    <span>Switch to Provider</span>
                                  </>
                                )}
                              </button>
                            </DialogClose>
                          )}
                          <DialogClose asChild>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#8C4B3E] hover:bg-[#8C4B3E]/10 rounded-xl text-left font-bold transition-colors mt-1 cursor-pointer"
                            >
                              <LogOut className="h-4 w-4" /> Logout
                            </button>
                          </DialogClose>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 pt-1">
                        <DialogClose asChild>
                          <NavLink to="/login" className="w-full">
                            <Button variant="outline" className="w-full border-[#E8DCC3] bg-white hover:bg-[#F0E7D5] text-[#1F1D1A] rounded-xl h-10 text-xs font-bold">
                              Login
                            </Button>
                          </NavLink>
                        </DialogClose>
                        <DialogClose asChild>
                          <NavLink to="/register" className="w-full">
                            <Button className="w-full bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold rounded-xl h-10 text-xs border border-[#E8DCC3]">
                              Sign Up
                            </Button>
                          </NavLink>
                        </DialogClose>
                      </div>
                    )}
                  </div>
                </div>

              </DialogContent>
            </Dialog>
          </div>

        </div>
      </header>
    </div>
  );
}