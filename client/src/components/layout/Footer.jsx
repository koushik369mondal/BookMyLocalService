import React from "react";
import { NavLink } from "react-router-dom";
import { Send, ShieldCheck, Briefcase } from "lucide-react";
import Logo from "@/components/ui/logo";
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
      <footer className="relative mt-20 px-6 font-sans sm:px-12 before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-[1440px] before:-translate-x-1/2 before:bg-amber-600 before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%)] dark:before:bg-orange-300/40">
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <NavLink to={dashboardPath}>
                <Logo size={24} />
              </NavLink>
              <span className="rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                {user.role === "ADMIN" ? (
                  <>
                    <ShieldCheck className="h-3 w-3" /> Admin workspace
                  </>
                ) : (
                  <>
                    <Briefcase className="h-3 w-3" /> Provider workspace
                  </>
                )}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} BookMyLocalService workspace. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <NavLink to={dashboardPath} className="hover:text-brand transition-colors">
                Dashboard
              </NavLink>
              <NavLink to={settingsPath} className="hover:text-brand transition-colors">
                Settings
              </NavLink>
              <NavLink to="/contact" className="hover:text-brand transition-colors">
                Support
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative mt-24 px-6 font-sans sm:px-12 before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-[1440px] before:-translate-x-1/2 before:bg-amber-600 before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%)] dark:before:bg-orange-300/40">
      <div className="max-w-6xl mx-auto pt-16 pb-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-3">
            <NavLink to="/" className="w-fit">
              <Logo size={28} />
            </NavLink>
            <p className="text-sm leading-relaxed text-muted-foreground mt-1">
              Verified local service marketplace. Connecting trusted professionals with homeowners and businesses across India.
            </p>
            <div className="flex items-center gap-2 pt-2 text-muted-foreground">
              <a
                href="https://x.com/BookMyLclServic"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="size-8 rounded-lg border border-border flex items-center justify-center hover:border-border/80 hover:text-foreground transition-colors"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/bookmylocalservice/?hl=en"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="size-8 rounded-lg border border-border flex items-center justify-center hover:border-border/80 hover:text-foreground transition-colors"
              >
                <svg className="size-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Explore
            </h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <NavLink to="/" className="hover:text-brand transition-colors w-fit">
                Home
              </NavLink>
              <NavLink to="/services" className="hover:text-brand transition-colors w-fit">
                Services
              </NavLink>
              <NavLink to="/categories" className="hover:text-brand transition-colors w-fit">
                Categories
              </NavLink>
              <NavLink to="/about" className="hover:text-brand transition-colors w-fit">
                About us
              </NavLink>
              <NavLink to="/contact" className="hover:text-brand transition-colors w-fit">
                Contact
              </NavLink>
            </nav>
          </div>

          {/* Column 3: Popular Services */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Categories
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/services?search=cleaning" className="hover:text-brand transition-colors w-fit">
                  Home cleaning
                </NavLink>
              </li>
              <li>
                <NavLink to="/services?search=plumbing" className="hover:text-brand transition-colors w-fit">
                  Plumbing repairs
                </NavLink>
              </li>
              <li>
                <NavLink to="/services?search=electrical" className="hover:text-brand transition-colors w-fit">
                  Electrical installations
                </NavLink>
              </li>
              <li>
                <NavLink to="/services?search=painting" className="hover:text-brand transition-colors w-fit">
                  Painting and polish
                </NavLink>
              </li>
              <li>
                <NavLink to="/services?search=ac" className="hover:text-brand transition-colors w-fit">
                  Appliance repair
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Updates
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Receive verified service specials and seasonal maintenance guides.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2 pt-1">
              <Input
                type="email"
                placeholder="Enter email address"
                aria-label="Email address for newsletter"
                className="bg-card/40 border border-border text-foreground text-xs h-9 rounded-md placeholder:text-muted-foreground"
              />
              <Button type="submit" variant="default" size="sm" className="w-full justify-center">
                Subscribe <Send className="size-3.5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} BookMyLocalService. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-brand transition-colors">
              Privacy policy
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              Terms of service
            </a>
            <a href="#" className="hover:text-brand transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}