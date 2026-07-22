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
  ChevronDown 
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

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md shadow-lg shadow-slate-950/20 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4 lg:gap-6">
        
        {/* Brand / Logo */}
        <NavLink to="/" className="flex items-center gap-3 group shrink-0 py-1">
          <img 
            src="/logo.png" 
            alt="BookMyLocalService Logo" 
            className="h-10 lg:h-11 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
          />
          <span className="font-extrabold text-xl lg:text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors duration-200">
            BookMyLocal<span className="text-amber-500">Service</span>
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "text-sm font-semibold transition-all duration-200 relative py-1.5 whitespace-nowrap",
                isActive 
                  ? "text-amber-400 font-bold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400 after:rounded-full" 
                  : "text-slate-300 hover:text-amber-400"
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
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-10 pr-4 h-[44px] lg:h-[48px] w-full bg-slate-800/80 border border-slate-700/60 text-slate-100 placeholder:text-slate-400 focus:bg-slate-900 focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/25 shadow-inner rounded-xl text-xs lg:text-sm transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl h-[44px] w-[44px] lg:h-[48px] lg:w-[48px] transition-all duration-200 shrink-0"
          >
            <Bell className="h-5 w-5 text-slate-300 group-hover:text-amber-400 transition-colors" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-amber-500 rounded-full border border-slate-900 animate-pulse"></span>
          </Button>

          {user ? (
            /* Logged In Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 focus:outline-none transition-all duration-200 border border-transparent hover:border-slate-700/60"
              >
                <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl overflow-hidden border border-amber-500/30 bg-amber-500/10 flex items-center justify-center font-bold text-xs lg:text-sm text-amber-400 shadow-sm shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    user.fullName[0].toUpperCase()
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-medium text-xs text-slate-200">
                  <div className="px-4 py-2.5 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Signed in as <span className="text-white font-bold block normal-case text-sm truncate mt-0.5">{user.fullName}</span>
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-800 hover:text-amber-400 transition-colors duration-150"
                  >
                    <User className="h-4 w-4 text-slate-400" /> My Profile
                  </NavLink>
                  <NavLink
                    to="/bookings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-800 hover:text-amber-400 transition-colors duration-150"
                  >
                    <Calendar className="h-4 w-4 text-slate-400" /> Booking History
                  </NavLink>
                  {(user.role === "PROVIDER" || user.role === "ADMIN") && (
                    <NavLink
                      to={user.role === "ADMIN" ? "/admin/dashboard" : "/provider/dashboard"}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-800 hover:text-amber-400 transition-colors duration-150"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" /> Dashboard
                    </NavLink>
                  )}
                  <NavLink
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-800 hover:text-amber-400 transition-colors duration-150"
                  >
                    <Settings className="h-4 w-4 text-slate-400" /> Settings
                  </NavLink>
                  <hr className="my-1.5 border-slate-800" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors duration-150 text-left font-semibold"
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
                  className="text-slate-200 hover:text-amber-400 hover:bg-slate-800 h-[44px] px-4 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Login
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button 
                  size="sm" 
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold h-[44px] px-5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign Up
                </Button>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-slate-800 text-slate-300 rounded-xl h-10 w-10 transition-colors">
            <Bell className="h-5 w-5 text-slate-300" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-amber-500 rounded-full border border-slate-900"></span>
          </Button>

          {/* Mobile Hamburger Drawer */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-800 h-10 w-10 transition-colors">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="fixed right-0 top-0 bottom-0 left-auto h-full w-80 max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 border-l border-slate-800 p-6 bg-slate-900 shadow-2xl flex flex-col gap-6 z-50 transition-all duration-300 text-white">
              
              <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
                <DialogTitle className="flex items-center gap-2.5">
                  <img 
                    src="/logo.png" 
                    alt="BookMyLocalService Logo" 
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-extrabold text-lg text-white">
                    BookMyLocal<span className="text-amber-500">Service</span>
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Mobile Search */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search services..."
                  className="pl-10 h-11 w-full bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-amber-500 rounded-xl text-sm"
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
                          ? "bg-amber-500/10 text-amber-400 font-bold" 
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      {link.name}
                    </NavLink>
                  </DialogClose>
                ))}
              </nav>

              {/* Mobile Action Buttons / Profile */}
              <div className="border-t border-slate-800 pt-4 flex flex-col gap-2 shrink-0">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-800 pb-4 mb-2">
                      <div className="h-10 w-10 rounded-xl overflow-hidden border border-amber-500/30 bg-amber-500/10 flex items-center justify-center font-bold text-sm text-amber-400 shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                        ) : (
                          user.fullName[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-white leading-tight">{user.fullName}</span>
                        <span className="text-xs text-amber-400 capitalize block mt-0.5 font-medium">{user.role.toLowerCase()} Account</span>
                      </div>
                    </div>
                    <DialogClose asChild>
                      <NavLink to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-400 rounded-xl transition-colors">
                        <User className="h-4.5 w-4.5" /> My Profile
                      </NavLink>
                    </DialogClose>
                    <DialogClose asChild>
                      <NavLink to="/bookings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-400 rounded-xl transition-colors">
                        <Calendar className="h-4.5 w-4.5" /> Booking History
                      </NavLink>
                    </DialogClose>
                    {(user.role === "PROVIDER" || user.role === "ADMIN") && (
                      <DialogClose asChild>
                        <NavLink to={user.role === "ADMIN" ? "/admin/dashboard" : "/provider/dashboard"} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-400 rounded-xl transition-colors">
                          <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
                        </NavLink>
                      </DialogClose>
                    )}
                    <DialogClose asChild>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl text-left mt-2 font-bold transition-colors"
                      >
                        <LogOut className="h-4.5 w-4.5" /> Logout
                      </button>
                    </DialogClose>
                  </>
                ) : (
                  <>
                    <DialogClose asChild>
                      <NavLink to="/login" className="w-full">
                        <Button variant="outline" className="w-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl h-11 text-sm font-semibold">
                          Login
                        </Button>
                      </NavLink>
                    </DialogClose>
                    <DialogClose asChild>
                      <NavLink to="/register" className="w-full">
                        <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl h-11 text-sm">
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
  );
}