import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedBadge from "@/components/ui/AnimatedBadge";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const POPULAR_TAGS = [
  "Home cleaning",
  "Plumbing",
  "Electrical",
  "Painting",
  "Appliance repair",
];

const TRUST_METRICS = [
  { icon: ShieldCheck, text: "Background checked" },
  { icon: Clock, text: "Same-day booking" },
  { icon: Zap, text: "Instant confirmation" },
];

export function HeroSection({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/services?${params.toString()}`);
  };

  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Focused Copy & Search */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.12, 0)}
            className="lg:col-span-7 flex flex-col gap-4 sm:gap-6"
          >
            {/* Signature Animated Badge */}
            <motion.div variants={fadeInUp}>
              <AnimatedBadge>
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                <span>Verified local services across 25+ cities in India</span>
              </AnimatedBadge>
            </motion.div>

            {/* Manrope Hero Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-[40px] sm:text-5xl lg:text-[62px] font-semibold tracking-tight text-foreground leading-[1.08]"
            >
              Verified local services, delivered to your door
            </motion.h1>

            {/* Lead with ONE Cream Highlight Phrase */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Finding dependable help shouldn't be stressful. Book verified electricians, plumbers, and home cleaners with{" "}
              <span className="highlight">guaranteed upfront pricing</span>.
            </motion.p>

            {/* Solid & Outline Actions */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 pt-1">
              <NavLink to="/services">
                <Button variant="solid" size="lg">
                  Explore services
                </Button>
              </NavLink>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  How it works
                </Button>
              </a>
            </motion.div>

            {/* Search Toolbar */}
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSearch}
              className="card-chai p-2 flex flex-col sm:flex-row items-stretch gap-2 mt-2 max-w-xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need?"
                  aria-label="Service search query"
                  className="pl-9 h-10 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none"
                />
              </div>

              <div className="hidden sm:block w-px bg-border/80 my-1.5" />

              <div className="relative w-full sm:w-44">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or PIN"
                  aria-label="Location or PIN code"
                  className="pl-9 h-10 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none"
                />
              </div>

              <Button type="submit" variant="default" size="default" className="h-10 px-5 shrink-0">
                Search
              </Button>
            </motion.form>

            {/* Popular Tags */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-muted-foreground font-medium">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <NavLink
                  key={tag}
                  to={`/services?category=${encodeURIComponent(tag)}`}
                  className="rounded-md border border-border/70 px-2.5 py-1 text-muted-foreground hover:text-brand hover:border-border transition-colors font-sans"
                >
                  {tag}
                </NavLink>
              ))}
            </motion.div>

            {/* Trust Signals */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 pt-2 text-xs text-muted-foreground">
              {TRUST_METRICS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="size-3.5 text-emerald-500" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: One Central Focal Card (No floating badge clutter) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-sm"
            >
              <article className="card-chai p-6 flex flex-col gap-5 sm:opacity-95 hover:opacity-100">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">
                      Verified provider
                    </span>
                    <h3 className="font-display text-base font-semibold text-foreground mt-0.5">
                      Electrical and appliances
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 px-2 py-0.5 text-xs text-amber-500">
                    <Star className="size-3 fill-amber-500" />
                    <span className="font-medium">4.9</span>
                  </span>
                </div>

                {/* Provider Detail */}
                <div className="rounded-lg border border-border/60 bg-card/40 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-neutral-800 text-neutral-200 border border-border flex items-center justify-center font-display font-semibold text-sm">
                      RK
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold text-foreground truncate">
                        Rajesh Kumar
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Certified technician (8 yrs experience)
                      </p>
                    </div>
                    <span className="size-2 rounded-full bg-emerald-500" title="Active now" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <span className="text-muted-foreground">Standard rate</span>
                    <span className="font-display font-semibold text-foreground">
                      ₹299 <span className="text-muted-foreground font-normal">/hr</span>
                    </span>
                  </div>
                </div>

                {/* Key Checklist */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Identity and background verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>No hidden charges, pay after completion</span>
                  </div>
                </div>

                {/* Action button on card (soft default) */}
                <NavLink to="/services" className="w-full">
                  <Button variant="default" size="default" className="w-full justify-center">
                    View local experts
                  </Button>
                </NavLink>

                <p className="text-center text-[11px] text-muted-foreground">
                  Free cancellation up to 2 hours before arrival
                </p>
              </article>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
