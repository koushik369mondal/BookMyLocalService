import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
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
  Briefcase,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProviderImage } from "@/utils/imageUtils";
import { UserAvatar } from "@/components/ui/avatar";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

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
      return [
        { name: "Services", path: "/services" },
        { name: "Categories", path: "/categories" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ];
    }

    if (user.role === "PROVIDER") {
      return [
        { name: "Dashboard", path: "/provider/dashboard" },
        { name: "My Services", path: "/provider/services" },
        { name: "Bookings", path: "/provider/jobs" },
        { name: "Earnings", path: "/provider/earnings" },
        { name: "Reviews", path: "/provider/reviews" },
        { name: "Settings", path: "/provider/settings" },
      ];
    }

    if (user.role === "ADMIN") {
      return [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Users", path: "/admin/users" },
        { name: "Providers", path: "/admin/providers" },
        { name: "Bookings", path: "/admin/bookings" },
        { name: "Payments", path: "/admin/payments" },
        { name: "Reports", path: "/admin/reports" },
      ];
    }

    return [
      { name: "Services", path: "/services" },
      { name: "Categories", path: "/categories" },
      { name: "My Bookings", path: "/bookings" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ];
  }, [user]);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const logoLink = React.useMemo(() => {
    if (user?.role === "PROVIDER") return "/provider/dashboard";
    if (user?.role === "ADMIN") return "/admin/dashboard";
    return "/";
  }, [user]);

  const searchPlaceholder = React.useMemo(() => {
    if (user?.role === "PROVIDER") return "Search jobs, services...";
    if (user?.role === "ADMIN") return "Search users, bookings...";
    return "Search local services...";
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case "BOOKING_CREATED":
      case "BOOKING_CONFIRMED":
        return { Icon: Calendar, color: "text-blue-500 border border-blue-500/20" };
      case "SERVICE_STARTED":
      case "SERVICE_COMPLETED":
        return { Icon: CheckCircle2, color: "text-emerald-500 border border-emerald-500/20" };
      case "BOOKING_CANCELLED":
        return { Icon: Clock, color: "text-red-500 border border-red-500/20" };
      case "PAYMENT_RECEIVED":
      case "REVIEW_ADDED":
      case "REVIEW_REPLIED":
        return { Icon: Sparkles, color: "text-amber-500 border border-amber-500/20" };
      default:
        return { Icon: Bell, color: "text-foreground border border-border" };
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = Math.max(0, now - date);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    setShowNotifications(false);

    if (item.referenceType === "BOOKING") {
      if (user?.role === "PROVIDER") navigate("/provider/jobs");
      else if (user?.role === "ADMIN") navigate("/admin/bookings");
      else navigate("/bookings");
    } else if (item.referenceType === "REVIEW") {
      if (user?.role === "PROVIDER") navigate("/provider/reviews");
      else navigate("/notifications");
    } else {
      navigate("/notifications");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-[backdrop-filter,background,border-color] duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/80"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-5">
        {/* Brand / Logo */}
        <NavLink to={logoLink} className="flex items-center gap-3 shrink-0">
          <Logo size={28} />
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-brand"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-44 lg:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search site content"
              className="pl-8.5 pr-3 h-8.5 w-full bg-card/40 border border-border/80 text-foreground placeholder:text-muted-foreground rounded-lg text-xs transition-colors focus:border-border"
            />
          </form>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border/70 bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand" />
              )}
            </button>

            {showNotifications && (
              <div className="card-chai absolute right-0 mt-2 w-80 sm:w-88 p-3 z-50 animate-in fade-in duration-150">
                <div className="px-2 pb-2.5 border-b border-border/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        ({unreadCount} new)
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-border/50 py-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const { Icon, color } = getNotificationIcon(item.type);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`p-2.5 flex items-start gap-2.5 transition-colors hover:bg-card cursor-pointer rounded-lg ${
                            !item.isRead ? "bg-card/50" : ""
                          }`}
                        >
                          <div className={`p-1.5 rounded-md shrink-0 ${color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="font-medium text-xs truncate text-foreground">
                                {item.title}
                              </h5>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {formatTimeAgo(item.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-2 border-t border-border/70 text-center">
                  <NavLink
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-muted-foreground hover:text-brand font-medium inline-block py-0.5"
                  >
                    View all notifications
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Auth Actions */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-card/70 border border-border/70 transition-colors cursor-pointer"
                aria-label="User menu"
              >
                <UserAvatar user={user} className="size-7 rounded-md shrink-0" />
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform" />
              </button>

              {showDropdown && (
                <div className="card-chai absolute right-0 mt-2 w-56 p-1.5 z-50 animate-in fade-in duration-150 text-xs">
                  <div className="px-3 py-2 border-b border-border/70">
                    <span className="text-[11px] text-muted-foreground block">Signed in as</span>
                    <span className="text-sm font-semibold text-foreground truncate block mt-0.5">
                      {user.fullName}
                    </span>
                  </div>

                  <div className="py-1">
                    <NavLink
                      to={
                        user.role === "ADMIN"
                          ? "/admin/dashboard"
                          : user.role === "PROVIDER"
                          ? "/provider/dashboard"
                          : "/customer/dashboard"
                      }
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-brand transition-colors text-foreground"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-brand transition-colors text-foreground"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Profile</span>
                    </NavLink>

                    {user.role === "CUSTOMER" && (
                      <NavLink
                        to="/bookings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-brand transition-colors text-foreground"
                      >
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Bookings</span>
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
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-brand transition-colors text-foreground"
                    >
                      <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Settings</span>
                    </NavLink>

                    {user.role !== "ADMIN" && (
                      <button
                        onClick={handleToggleRole}
                        disabled={isSwitchingRole}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-brand transition-colors text-left cursor-pointer border-t border-border/50 mt-1 pt-2"
                      >
                        {isSwitchingRole ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Switching...</span>
                          </>
                        ) : user.role === "PROVIDER" ? (
                          <>
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Switch to customer</span>
                          </>
                        ) : (
                          <>
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Switch to provider</span>
                          </>
                        )}
                      </button>
                    )}

                    <div className="border-t border-border/70 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors text-left cursor-pointer font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login">
                <Button variant="ghost" size="sm" className="hover:text-brand">
                  Sign in
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="solid" size="sm">
                  Join now
                </Button>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />

          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-border/70 bg-card/40 text-foreground cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </DialogTrigger>

            <DialogContent className="fixed right-0 top-0 bottom-0 inset-y-0 h-full w-[85vw] max-w-[320px] rounded-none border-y-0 border-r-0 border-l border-border bg-background/95 backdrop-blur-xl p-0 flex flex-col z-50 text-foreground">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <Logo size={24} />
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-8.5 h-9 w-full bg-card/40 border-border text-foreground text-xs rounded-lg"
                  />
                </form>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <DialogClose asChild key={link.path}>
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          cn(
                            "text-sm font-medium py-2 px-3 rounded-lg transition-colors",
                            isActive
                              ? "bg-card text-foreground font-semibold"
                              : "text-muted-foreground hover:text-brand"
                          )
                        }
                      >
                        {link.name}
                      </NavLink>
                    </DialogClose>
                  ))}
                </nav>

                <div className="border-t border-border pt-4 space-y-3">
                  {user ? (
                    <div className="space-y-1 text-sm">
                      <div className="px-3 py-2 bg-card/60 rounded-lg border border-border">
                        <span className="font-semibold block truncate">{user.fullName}</span>
                        <span className="text-[11px] text-muted-foreground capitalize">
                          {user.role?.toLowerCase()} account
                        </span>
                      </div>
                      <DialogClose asChild>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left py-2 px-3 text-red-500 font-medium"
                        >
                          Log out
                        </button>
                      </DialogClose>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <DialogClose asChild>
                        <NavLink to="/login">
                          <Button variant="outline" className="w-full justify-center">
                            Sign in
                          </Button>
                        </NavLink>
                      </DialogClose>
                      <DialogClose asChild>
                        <NavLink to="/register">
                          <Button variant="solid" className="w-full justify-center">
                            Join now
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
  );
}