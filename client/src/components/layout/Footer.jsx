import { NavLink } from "react-router-dom";
import { Mail, Phone, MapPin, Send, ShieldCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const isWorkspace = user?.role === "PROVIDER" || user?.role === "ADMIN";

  if (isWorkspace) {
    const dashboardPath = user.role === "ADMIN" ? "/admin/dashboard" : "/provider/dashboard";
    const settingsPath = user.role === "ADMIN" ? "/admin/settings" : "/provider/settings";

    return (
      <footer className="bg-[#F0E7D5] text-[#5A5146] border-t border-[#E8DCC3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
            
            {/* Workspace Brand & Badge */}
            <div className="flex items-center gap-3">
              <NavLink to={dashboardPath} className="flex items-center gap-2 group shrink-0">
                <img
                  src="/logo.png"
                  alt="BookMyLocalService Logo"
                  className="h-7 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                />
                <span className="font-bold text-base tracking-tight text-[#1F1D1A]">
                  BookMyLocal<span className="text-[#C9A46A]">Service</span>
                </span>
              </NavLink>
              <span className="bg-[#FAF6F0] border border-[#E8DCC3] px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-[#C9A46A] uppercase tracking-wider flex items-center gap-1">
                {user.role === "ADMIN" ? (
                  <>
                    <ShieldCheck className="h-3 w-3 text-[#C9A46A]" /> Admin Workspace
                  </>
                ) : (
                  <>
                    <Briefcase className="h-3 w-3 text-[#C9A46A]" /> Provider Workspace
                  </>
                )}
              </span>
            </div>

            {/* Copyright Notice */}
            <p className="text-[11px] text-[#7A7266]">
              © {new Date().getFullYear()} BookMyLocalService Workspace Portal. All rights reserved.
            </p>

            {/* Workspace Navigation Links */}
            <div className="flex items-center gap-5 text-xs">
              <NavLink to={dashboardPath} className="hover:text-[#C9A46A] transition-colors font-bold">
                Dashboard
              </NavLink>
              <NavLink to={settingsPath} className="hover:text-[#C9A46A] transition-colors font-semibold">
                Settings
              </NavLink>
              <NavLink to="/contact" className="hover:text-[#C9A46A] transition-colors font-semibold">
                Support
              </NavLink>
              <a href="#" className="hover:text-[#C9A46A] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#C9A46A] transition-colors">Terms</a>
            </div>

          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#F0E7D5] text-[#5A5146] border-t border-[#E8DCC3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: Brand Logo & Description */}
          <div className="flex flex-col gap-4">
            <NavLink to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/logo.png"
                alt="BookMyLocalService Logo"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
              />
              <span className="font-bold text-xl tracking-tight text-[#1F1D1A] group-hover:text-[#C9A46A] transition-colors">
                BookMyLocal<span className="text-[#C9A46A]">Service</span>
              </span>
            </NavLink>
            <p className="text-xs leading-relaxed text-[#5A5146] mt-2 font-medium">
              Connecting you with top-rated local professionals for all your home, wellness, and business needs. Reliable, fast, and secure.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" aria-label="Facebook" className="p-2 bg-[#FAF6F0] hover:bg-[#C9A46A] hover:text-white rounded-lg text-[#5A5146] transition-all duration-300 hover:scale-105 border border-[#E8DCC3]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/bookmylocalservice/?hl=en" aria-label="Instagram" className="p-2 bg-[#FAF6F0] hover:bg-[#C9A46A] hover:text-white rounded-lg text-[#5A5146] transition-all duration-300 hover:scale-105 border border-[#E8DCC3]">
                <svg className="h-4 w-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://x.com/BookMyLclServic" aria-label="Twitter" className="p-2 bg-[#FAF6F0] hover:bg-[#C9A46A] hover:text-white rounded-lg text-[#5A5146] transition-all duration-300 hover:scale-105 border border-[#E8DCC3]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 bg-[#FAF6F0] hover:bg-[#C9A46A] hover:text-white rounded-lg text-[#5A5146] transition-all duration-300 hover:scale-105 border border-[#E8DCC3]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#1F1D1A] text-base tracking-wide">Quick Links</h3>
            <nav className="flex flex-col gap-2.5">
              <NavLink to="/" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 w-fit font-medium">
                Home
              </NavLink>
              <NavLink to="/services" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 w-fit font-medium">
                Services
              </NavLink>
              <NavLink to="/categories" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 w-fit font-medium">
                Categories
              </NavLink>
              <NavLink to="/about" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 w-fit font-medium">
                About Us
              </NavLink>
              <NavLink to="/contact" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 w-fit font-medium">
                Contact
              </NavLink>
            </nav>
          </div>

          {/* Column 3: Popular Services */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#1F1D1A] text-base tracking-wide">Popular Services</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <NavLink to="/services" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 block w-fit font-medium">
                  Home Cleaning
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 block w-fit font-medium">
                  Plumbing Repairs
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 block w-fit font-medium">
                  Electrical Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 block w-fit font-medium">
                  Moving & Packing
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-xs text-[#5A5146] hover:text-[#C9A46A] hover:translate-x-1 transition-all duration-300 block w-fit font-medium">
                  Lawn & Garden Care
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#1F1D1A] text-base tracking-wide">Stay Connected</h3>
            <p className="text-xs text-[#7A7266] font-medium leading-relaxed">Subscribe to receive local deals, seasonal tips, and dispatch updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5 w-full">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#FAF6F0] border border-[#E8DCC3] text-[#1F1D1A] placeholder:text-[#7A7266] text-xs h-10 rounded-xl focus:border-[#C9A46A]"
              />
              <Button type="submit" className="w-full bg-[#8C4B3E] hover:bg-[#783E33] text-white text-xs font-bold h-10 rounded-xl border border-[#8C4B3E] shadow-2xs cursor-pointer flex items-center justify-center gap-1.5">
                Subscribe <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E8DCC3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7266] gap-4 font-medium">
          <p>© {new Date().getFullYear()} BookMyLocalService. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#C9A46A] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#C9A46A] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#C9A46A] transition-colors">Cookies Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}