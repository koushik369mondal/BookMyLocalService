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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <NavLink to="/" className="flex items-center gap-2 group shrink-0">
          <img 
            src="/logo.png" 
            alt="BookMyLocalService Logo" 
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
          />
          <span className="font-extrabold text-xl tracking-tight text-blue-600 group-hover:text-blue-700 transition-colors">
            BookMyLocalService
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "text-sm font-medium transition-all relative py-1 hover:text-blue-600",
                isActive 
                  ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full" 
                  : "text-gray-600"
              )}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Desktop Search Bar */}
          <div className="relative w-48 lg:w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-9 h-9 w-full bg-gray-50 border-gray-200 focus:bg-white rounded-full text-xs"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full h-9 w-9">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
          </Button>

          {user ? (
            /* Logged In Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 focus:outline-none hover:opacity-80 transition-opacity"
              >
                <div className="h-8.5 w-8.5 rounded-full overflow-hidden border border-gray-200 bg-gray-150 flex items-center justify-center font-bold text-xs text-blue-600">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    user.fullName[0].toUpperCase()
                  )}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in font-medium text-xs text-gray-705">
                  <div className="px-4 py-2 border-b border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Hi, {user.fullName.split(" ")[0]}
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </NavLink>
                  <NavLink
                    to="/bookings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Calendar className="h-4 w-4" /> Booking History
                  </NavLink>
                  {(user.role === "PROVIDER" || user.role === "ADMIN") && (
                    <NavLink
                      to={user.role === "ADMIN" ? "/admin/dashboard" : "/provider/dashboard"}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </NavLink>
                  )}
                  <NavLink
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </NavLink>
                  <hr className="my-1.5 border-gray-50" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login and Sign Up */
            <>
              <NavLink to="/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 text-xs">
                  Login
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 text-xs transition-transform hover:scale-[1.02]">
                  Sign Up
                </Button>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full h-9 w-9">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
          </Button>

          {/* Mobile Hamburger Drawer */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 h-9 w-9">
                <Menu className="h-6 w-6 text-gray-707" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="fixed right-0 top-0 bottom-0 left-auto h-full w-80 max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 border-l border-gray-100 p-6 bg-white shadow-2xl flex flex-col gap-6 z-50 transition-all duration-300">
              
              <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                <DialogTitle className="flex items-center gap-2">
                  <img 
                    src="/logo.png" 
                    alt="BookMyLocalService Logo" 
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-bold text-lg text-blue-600">
                    BookMyLocal
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Mobile Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search services..."
                  className="pl-9 h-10 w-full bg-gray-50 border-gray-200 rounded-full text-sm"
                />
              </div>

              {/* Mobile Menu Links */}
              <nav className="flex flex-col gap-3 py-2 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <DialogClose asChild key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => cn(
                        "text-base font-medium py-2.5 px-3 rounded-lg transition-colors",
                        isActive 
                          ? "bg-blue-50 text-blue-600 font-semibold" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {link.name}
                    </NavLink>
                  </DialogClose>
                ))}
              </nav>

              {/* Mobile Action Buttons / Profile */}
              <div className="border-t pt-4 flex flex-col gap-2 shrink-0">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 border-b pb-4 mb-2">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                        ) : (
                          user.fullName[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-800 leading-tight">{user.fullName}</span>
                        <span className="text-[10px] text-gray-400 capitalize block mt-0.5">{user.role.toLowerCase()} Account</span>
                      </div>
                    </div>
                    <DialogClose asChild>
                      <NavLink to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg">
                        <User className="h-4.5 w-4.5" /> My Profile
                      </NavLink>
                    </DialogClose>
                    <DialogClose asChild>
                      <NavLink to="/bookings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg">
                        <Calendar className="h-4.5 w-4.5" /> Booking History
                      </NavLink>
                    </DialogClose>
                    {(user.role === "PROVIDER" || user.role === "ADMIN") && (
                      <DialogClose asChild>
                        <NavLink to={user.role === "ADMIN" ? "/admin/dashboard" : "/provider/dashboard"} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg">
                          <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
                        </NavLink>
                      </DialogClose>
                    )}
                    <DialogClose asChild>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg text-left mt-2 font-bold"
                      >
                        <LogOut className="h-4.5 w-4.5" /> Logout
                      </button>
                    </DialogClose>
                  </>
                ) : (
                  <>
                    <DialogClose asChild>
                      <NavLink to="/login" className="w-full">
                        <Button variant="outline" className="w-full rounded-full h-10">
                          Login
                        </Button>
                      </NavLink>
                    </DialogClose>
                    <DialogClose asChild>
                      <NavLink to="/register" className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10">
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