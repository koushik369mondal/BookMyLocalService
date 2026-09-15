import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  ArrowRight,
  Star,
  Shield,
  CheckCircle2,
  Users,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeInUp, buttonMotionProps, floatMotionProps, staggerContainer } from "@/utils/motion";

const POPULAR_TAGS = ["Home Cleaning", "Plumbing", "Electrical", "Lawn Care", "Painting"];

const STAT_CARDS = [
  { value: "10K+", label: "Happy Customers", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "4.9★", label: "Avg. Rating", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  { value: "500+", label: "Verified Pros", icon: Shield, color: "text-[#8C4B3E]", bg: "bg-[#8C4B3E]/10" },
];

const FLOATING_BADGES = [
  { icon: CheckCircle2, text: "Background Checked", color: "text-emerald-600" },
  { icon: Clock, text: "Same-Day Booking", color: "text-blue-600" },
  { icon: Zap, text: "Instant Confirmation", color: "text-amber-600" },
];

export function HeroSection({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (location) params.set("location", location);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF6F0] pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#8C4B3E]/6 blur-[80px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-amber-400/8 blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-400/6 blur-[60px]" />
        {/* Dot grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#1F1D1A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* ─── Left Column ─── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.12, 0)}
            className="lg:col-span-7 space-y-7"
          >
            {/* Pill badge */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8C4B3E]/10 border border-[#8C4B3E]/25 text-[#8C4B3E] text-xs sm:text-sm font-bold shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#8C4B3E] animate-pulse" />
                #1 Local Service Finder in India
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-[#1F1D1A] tracking-tight leading-[1.12]"
            >
              Expert Local Services,{" "}
              <br className="hidden sm:inline" />
              <span className="relative inline-block">
                <span className="relative z-10 text-[#8C4B3E]">Delivered to Your Door.</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C50 3 150 1 298 9"
                    stroke="#8C4B3E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#5A5146] font-medium max-w-xl leading-relaxed"
            >
              Book background-checked electricians, plumbers, home cleaners, and wellness experts in minutes. Transparent pricing, verified reviews.
            </motion.p>

            {/* Search form */}
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSearch}
              className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E8DCC3] shadow-lg shadow-[#8C4B3E]/5 flex flex-col sm:flex-row items-stretch gap-2 max-w-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7A7266]" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need?"
                  className="pl-11 h-12 border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-[#7A7266]"
                />
              </div>

              <div className="h-[1px] sm:h-auto sm:w-[1px] bg-[#E8DCC3]" />

              <div className="relative w-full sm:w-44">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7A7266]" />
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or PIN code"
                  className="pl-11 h-12 border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-[#7A7266]"
                />
              </div>

              <Button
                type="submit"
                {...buttonMotionProps}
                className="h-12 px-6 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>

            {/* Popular tags */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-bold text-[#7A7266] shrink-0">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <NavLink
                  key={tag}
                  to={`/services?category=${encodeURIComponent(tag)}`}
                  className="text-xs font-semibold px-3 py-1 bg-white border border-[#E8DCC3] text-[#5A5146] hover:text-[#8C4B3E] hover:border-[#8C4B3E] hover:bg-[#8C4B3E]/5 rounded-full transition-all duration-200 shadow-xs"
                >
                  {tag}
                </NavLink>
              ))}
            </motion.div>

            {/* Trust signals row */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-1">
              {FLOATING_BADGES.map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-xs font-semibold text-[#5A5146]">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ─── Right Column: Visual Panel ─── */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div {...floatMotionProps} className="relative z-10 w-full max-w-sm">
              {/* Main card */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E8DCC3] bg-white shadow-2xl shadow-[#8C4B3E]/10 p-6">
                {/* Gradient bar at top */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8C4B3E] via-amber-400 to-emerald-400" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold text-[#7A7266] uppercase tracking-wider">Top Rated Pro</p>
                    <h3 className="text-base font-black text-[#1F1D1A] mt-0.5">Book a Local Expert</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-700">4.9</span>
                  </div>
                </div>

                {/* Provider mock */}
                <div className="bg-[#FAF6F0] rounded-2xl p-4 mb-4 border border-[#E8DCC3]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8C4B3E] to-amber-500 flex items-center justify-center text-white font-black text-base shadow-sm">
                      R
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#1F1D1A]">Rajesh Kumar</p>
                      <p className="text-xs text-[#7A7266] font-medium">Master Electrician • 8 yrs exp</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Available</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-[#7A7266] ml-1">4.9 (128 reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#5A5146]">Starting from</span>
                    <span className="text-base font-black text-[#1F1D1A]">₹299 <span className="text-xs font-normal text-[#7A7266]">/hr</span></span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {STAT_CARDS.map(({ value, label, icon: Icon, color, bg }) => (
                    <div key={label} className={`${bg} rounded-xl p-2.5 text-center`}>
                      <Icon className={`h-4 w-4 ${color} mx-auto mb-1`} />
                      <p className={`text-sm font-black ${color}`}>{value}</p>
                      <p className="text-[9px] font-semibold text-[#7A7266] leading-tight">{label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <NavLink to="/services">
                  <Button className="w-full h-11 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer">
                    Book Now — Instantly
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </NavLink>

                {/* Trusted note */}
                <p className="text-center text-[10px] text-[#7A7266] mt-3 font-medium">
                  🔒 Secure booking · Free cancellation · No hidden fees
                </p>
              </div>

              {/* Floating notification pill */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-[#E8DCC3] px-3.5 py-2.5 flex items-center gap-2.5 z-20"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1F1D1A]">Booking Confirmed!</p>
                  <p className="text-[9px] text-[#7A7266]">just now • Cleaning Service</p>
                </div>
              </motion.div>

              {/* Bottom floating pill */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="absolute -bottom-5 -left-4 bg-white rounded-2xl shadow-xl border border-[#E8DCC3] px-3.5 py-2.5 flex items-center gap-2.5 z-20"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1F1D1A]">5★ Review Left</p>
                  <p className="text-[9px] text-[#7A7266]">Priya S. • Plumbing</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
