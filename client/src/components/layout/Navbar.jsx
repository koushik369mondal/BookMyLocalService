import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Categories', path: '/categories' },
  { name: 'Become a Provider', path: '/provider/dashboard' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
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

          {/* Login and Sign Up */}
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
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full h-9 w-9">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
          </Button>

          {/* Mobile Hamburger Drawer using Dialog styled as Sheet */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 h-9 w-9">
                <Menu className="h-6 w-6 text-gray-700" />
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

              {/* Mobile Action Buttons */}
              <div className="border-t pt-4 flex flex-col gap-3">
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
              </div>

            </DialogContent>
          </Dialog>
        </div>

      </div>
    </header>
  );
}