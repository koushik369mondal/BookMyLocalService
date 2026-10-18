import React from "react";
import { NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Award,
  Users,
  Clock,
  Heart,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import AnimatedBadge from "@/components/ui/AnimatedBadge";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified trust",
    description: "Every professional is identity-checked and skills-tested before taking bookings.",
  },
  {
    icon: Award,
    title: "Quality guaranteed",
    description: "If a job is not completed to satisfaction, we will rebook or refund without hassle.",
  },
  {
    icon: Users,
    title: "Empowering specialists",
    description: "We provide skilled independent workers with fair access, transparent tools, and prompt payouts.",
  },
  {
    icon: Clock,
    title: "Respect for your time",
    description: "Direct dispatch updates, real-time arrival estimates, and quick customer support.",
  },
  {
    icon: Heart,
    title: "Community first",
    description: "Connecting local households with neighborhood experts to build lasting community bonds.",
  },
  {
    icon: TrendingUp,
    title: "Transparent pricing",
    description: "Clear hourly rates and fixed estimates with zero hidden service charges.",
  },
];

export default function About() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-border/70">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Text Column */}
              <div className="lg:col-span-7 flex flex-col items-start text-left gap-5">
                <AnimatedBadge>
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>About BookMyLocalService</span>
                </AnimatedBadge>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-[1.12]">
                  Connecting communities with verified local trades
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  BookMyLocalService is a neighborhood marketplace helping homeowners discover, compare, and book verified service providers with{" "}
                  <span className="highlight">guaranteed satisfaction</span>.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <NavLink to="/services">
                    <Button variant="solid" size="lg">
                      Explore services
                    </Button>
                  </NavLink>
                  <NavLink
                    to={
                      user?.role === "ADMIN"
                        ? "/admin/dashboard"
                        : user?.role === "PROVIDER"
                        ? "/provider/dashboard"
                        : "/register"
                    }
                  >
                    <Button variant="outline" size="lg">
                      {user?.role === "PROVIDER"
                        ? "Provider dashboard"
                        : user?.role === "ADMIN"
                        ? "Admin dashboard"
                        : "Become a provider"}
                    </Button>
                  </NavLink>
                </div>
              </div>

              {/* Central Focal Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="card-chai p-8 text-center flex flex-col items-center gap-4 max-w-sm w-full">
                  <div className="size-14 rounded-xl border border-border/80 bg-card/60 flex items-center justify-center text-foreground">
                    <ShieldCheck className="size-7 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base text-foreground">
                      Verified marketplace
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      Identity-verified technicians across 25+ Indian cities
                    </p>
                  </div>
                  <div className="w-full pt-3 border-t border-border/60 flex flex-col gap-2 text-left text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span>Background and police clearance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span>Upfront pricing before arrival</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 sm:py-20">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-2xl mb-12 space-y-2">
              <h2 className="text-2xl sm:text-[30px] font-medium tracking-tight text-foreground">
                Our core principles
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                The values guiding how we serve households and{" "}
                <span className="highlight">independent professionals</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUES.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="card-chai p-6 flex flex-col gap-3 sm:opacity-90 hover:opacity-100 transition-all group"
                  >
                    <div className="size-10 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-foreground group-hover:text-brand transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-semibold text-sm text-foreground">
                        {val.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
