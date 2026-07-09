import { NavLink } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
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
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-500 transition-colors">
                BookMyLocalService
              </span>
            </NavLink>
            <p className="text-sm leading-relaxed text-slate-400 mt-2">
              Connecting you with top-rated local professionals for all your home, wellness, and business needs. Reliable, fast, and secure.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {/* Facebook Icon */}
              <a href="#" aria-label="Facebook" className="p-2 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-full text-slate-400 transition-all duration-300 hover:scale-110">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              {/* Instagram Icon */}
              <a href="https://www.instagram.com/bookmylocalservice/?hl=en" aria-label="Instagram" className="p-2 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-full text-slate-400 transition-all duration-300 hover:scale-110">
                <svg className="h-4 w-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* X / Twitter Icon */}
              <a href="https://x.com/BookMyLclServic" aria-label="Twitter" className="p-2 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-full text-slate-400 transition-all duration-300 hover:scale-110">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn Icon */}
              <a href="#" aria-label="LinkedIn" className="p-2 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-full text-slate-400 transition-all duration-300 hover:scale-110">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Quick Links</h3>
            <nav className="flex flex-col gap-2.5">
              <NavLink to="/" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 w-fit">
                Home
              </NavLink>
              <NavLink to="/services" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 w-fit">
                Services
              </NavLink>
              <NavLink to="/categories" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 w-fit">
                Categories
              </NavLink>
              <NavLink to="/about" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 w-fit">
                About Us
              </NavLink>
              <NavLink to="/contact" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 w-fit">
                Contact
              </NavLink>
            </nav>
          </div>

          {/* Column 3: Popular Services */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Popular Services</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <NavLink to="/services" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 block w-fit">
                  Home Cleaning
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 block w-fit">
                  Plumbing Repairs
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 block w-fit">
                  Electrical Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 block w-fit">
                  Lawn & Garden Care
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all duration-300 block w-fit">
                  Appliance Maintenance
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Contact Details</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span>123 Service Lane, Suite 400, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="tel:+18005550199" className="hover:text-blue-500 transition-colors">+1 (800) 555-0199</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="mailto:bookmylocalservice@gmail.com" className="hover:text-blue-500 transition-colors">bookmylocalservice@gmail.com</a>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Subscribe to Newsletter</h4>
              <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Your email..."
                  className="bg-slate-900 border-slate-800 text-white rounded-full pr-10 focus-visible:ring-blue-500 h-9 text-xs"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </div>

        </div>

        {/* Footer Bottom Division */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} BookMyLocalService. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}