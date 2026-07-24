import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
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
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Categories', path: '/categories' },
  { name: 'Become a Provider', path: '/provider/dashboard' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const mockNotifications = [
  { id: 1, title: "Booking Confirmed", desc: "Deep Home Cleaning scheduled for Tomorrow at 10:30 AM", time: "5 mins ago", icon: CheckCircle2, iconColor: "text-emerald-400 bg-emerald-500/10", unread: true },
  { id: 2, title: "Specialist Assigned", desc: "Sarah Jenkins accepted your dispatch request in Brooklyn", time: "1 hour ago", icon: ShieldCheck, iconColor: "text-blue-400 bg-blue-500/10", unread: true },
  { id: 3, title: "Payment Received", desc: "Receipt of $55.00 generated for Window Washing", time: "3 hours ago", icon: Sparkles, iconColor: "text-[#8C4B3E] bg-[#C9A46A]/20", unread: true },
  { id: 4, title: "Rate Your Service", desc: "Share your feedback for Sofa & Carpet Sanitization", time: "1 day ago", icon: Clock, iconColor: "text-purple-400 bg-purple-500/10", unread: false }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State management
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [notificationsList, setNotificationsList] = useState(mockNotifications);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

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

      {/* TOP DUMMY ANNOUNCEMENT NOTIFICATION BAR */}
      {/* {showAnnouncementBar && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-[#1F1D1A] px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs transition-all duration-300 relative z-55">
          <div className="flex-1 flex items-center justify-center gap-2 text-center">
            <span className="bg-[#8C4B3E] text-[#8C4B3E] text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md shrink-0">
              Limited Offer
            </span>
            <span className="truncate">
              🎉 Get <strong>20% OFF</strong> your first service booking! Use code <code className="bg-[#8C4B3E]/20 px-1.5 py-0.5 rounded font-mono font-extrabold">LOCAL20</code> at checkout.
            </span>
            <NavLink to="/services" className="underline hover:text-white transition-colors shrink-0 hidden sm:inline-flex items-center gap-0.5">
              Book Now <ArrowRight className="h-3 w-3 inline" />
            </NavLink>
          </div>
          <button
            onClick={() => setShowAnnouncementBar(false)}
            className="text-[#1F1D1A]/70 hover:text-[#1F1D1A] p-1 rounded-md transition-colors shrink-0 ml-2"
            title="Dismiss Announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )} */}

      <header className="w-full border-b border-[#E8DCC3] bg-[#F0E7D5] shadow-2xs text-[#1F1D1A] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4 lg:gap-6">

          {/* Brand / Logo */}
          <NavLink to="/" className="flex items-center gap-3 group shrink-0 py-1">
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
            {/* Search Input */}
            <div className="relative w-44 lg:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266] pointer-events-none" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-10 pr-4 h-[44px] lg:h-[48px] w-full bg-[#FAF6F0] border border-[#E8DCC3] text-[#1F1D1A] placeholder:text-[#7A7266] focus:border-[#C9A46A] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 shadow-2xs rounded-xl text-xs lg:text-sm transition-all duration-200"
              />
            </div>

            {/* Notifications Bell Button & Dropdown */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative hover:bg-[#F0E7D5] text-[#5A5146] hover:text-[#1F1D1A] rounded-xl h-[44px] w-[44px] lg:h-[48px] lg:w-[48px] transition-all duration-200 shrink-0"
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
                        className="text-[11px] text-[#8C4B3E] hover:underline font-semibold flex items-center gap-1"
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
                            className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-[#F0E7D5]/50 ${
                              item.unread ? "bg-[#F0E7D5]/30" : ""
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
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F0E7D5] focus:outline-none transition-all duration-200 border border-transparent hover:border-[#E8DCC3]"
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
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150"
                    >
                      <User className="h-4 w-4 text-[#7A7266]" /> My Profile
                    </NavLink>
                    <NavLink
                      to="/bookings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150"
                    >
                      <Calendar className="h-4 w-4 text-[#7A7266]" /> Booking History
                    </NavLink>
                    {(user.role === "PROVIDER" || user.role === "ADMIN") && (
                      <NavLink
                        to={user.role === "ADMIN" ? "/admin/dashboard" : "/provider/dashboard"}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150"
                      >
                        <LayoutDashboard className="h-4 w-4 text-[#7A7266]" /> Dashboard
                      </NavLink>
                    )}
                    <NavLink
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F0E7D5] hover:text-[#C9A46A] transition-colors duration-150"
                    >
                      <Settings className="h-4 w-4 text-[#7A7266]" /> Settings
                    </NavLink>
                    <hr className="my-1.5 border-[#E8DCC3]" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-rose-50 text-[#8C4B3E] transition-colors duration-150 text-left font-bold"
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
                    className="text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#F0E7D5] h-[44px] px-4 rounded-xl text-sm font-semibold transition-all duration-200"
                  >
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/register">
                  <Button
                    size="sm"
                    className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold h-[44px] px-5 rounded-xl text-sm transition-all duration-200 border border-[#E8DCC3]"
                  >
                    Sign Up
                  </Button>
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Notifications Bell */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative hover:bg-[#F0E7D5] text-[#5A5146] rounded-xl h-10 w-10 transition-colors"
            >
              <Bell className="h-5 w-5 text-[#7A7266]" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-[#8C4B3E] rounded-full border border-white"></span>
              )}
            </Button>

            {/* Mobile Hamburger Drawer */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-[#F0E7D5] h-10 w-10 transition-colors">
                  <Menu className="h-6 w-6 text-[#1F1D1A]" />
                </Button>
              </DialogTrigger>

              <DialogContent className="fixed right-0 top-0 bottom-0 left-auto h-full w-80 max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 border-l border-[#E8DCC3] p-6 bg-[#FAF6F0] shadow-2xl flex flex-col gap-6 z-50 transition-all duration-300 text-[#5A5146]">

                <DialogHeader className="flex flex-row items-center justify-between border-b border-[#E8DCC3] pb-4">
                  <DialogTitle className="flex items-center gap-2.5">
                    <img
                      src="/logo.png"
                      alt="BookMyLocalService Logo"
                      className="h-8 w-auto object-contain"
                    />
                    <span className="font-bold text-lg text-[#1F1D1A]">
                      BookMyLocal<span className="text-[#C9A46A]">Service</span>
                    </span>
                  </DialogTitle>
                </DialogHeader>

                {/* Mobile Search */}
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7266] pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-10 h-11 w-full bg-[#FAF6F0] border-[#E8DCC3] text-[#1F1D1A] placeholder:text-[#7A7266] focus:border-[#C9A46A] rounded-xl text-sm"
                  />
                </div>

                {/* Mobile Menu Links */}
                <nav className="flex flex-col gap-2 py-2 flex-1 overflow-y-auto">
                  {navLinks.map((link) => (
                    <DialogClose asChild key={link.path}>
                      <NavLink
                        to={link.path}
                        className={({ isActive }) => cn(
                          "text-base font-semibold py-2.5 px-3.5 rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-[#F0E7D5] text-[#C9A46A] font-bold"
                            : "text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#1F1D1A]"
                        )}
                      >
                        {link.name}
                      </NavLink>
                    </DialogClose>
                  ))}
                </nav>

                {/* Mobile Action Buttons / Profile */}
                <div className="border-t border-[#E8DCC3] pt-4 flex flex-col gap-2 shrink-0">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2 border-b border-[#E8DCC3] pb-4 mb-2">
                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-[#E8DCC3] bg-[#F0E7D5] flex items-center justify-center font-bold text-sm text-[#C9A46A] shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                          ) : (
                            user.fullName[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-[#1F1D1A] leading-tight">{user.fullName}</span>
                          <span className="text-xs text-[#8C4B3E] capitalize block mt-0.5 font-medium">{user.role.toLowerCase()} Account</span>
                        </div>
                      </div>
                      <DialogClose asChild>
                        <NavLink to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#C9A46A] rounded-xl transition-colors">
                          <User className="h-4.5 w-4.5" /> My Profile
                        </NavLink>
                      </DialogClose>
                      <DialogClose asChild>
                        <NavLink to="/bookings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#C9A46A] rounded-xl transition-colors">
                          <Calendar className="h-4.5 w-4.5" /> Booking History
                        </NavLink>
                      </DialogClose>
                      {(user.role === "PROVIDER" || user.role === "ADMIN") && (
                        <DialogClose asChild>
                          <NavLink to={user.role === "ADMIN" ? "/admin/dashboard" : "/provider/dashboard"} className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#5A5146] hover:bg-[#F0E7D5] hover:text-[#C9A46A] rounded-xl transition-colors">
                            <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
                          </NavLink>
                        </DialogClose>
                      )}
                      <DialogClose asChild>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#8C4B3E] hover:bg-rose-50 rounded-xl text-left mt-2 font-bold transition-colors"
                        >
                          <LogOut className="h-4.5 w-4.5" /> Logout
                        </button>
                      </DialogClose>
                    </>
                  ) : (
                    <>
                      <DialogClose asChild>
                        <NavLink to="/login" className="w-full">
                          <Button variant="outline" className="w-full border-[#E8DCC3] bg-[#FAF6F0] hover:bg-[#F0E7D5] text-[#1F1D1A] rounded-xl h-11 text-sm font-semibold">
                            Login
                          </Button>
                        </NavLink>
                      </DialogClose>
                      <DialogClose asChild>
                        <NavLink to="/register" className="w-full">
                          <Button className="w-full bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold rounded-xl h-11 text-sm border border-[#E8DCC3]">
                            Sign Up
                          </Button>
                        </NavLink>
                      </DialogClose>
                    </>
                  )}
                </div>

              </DialogContent>
            </Dialog>
          </div>

        </div>
      </header>
    </div>
  );
}