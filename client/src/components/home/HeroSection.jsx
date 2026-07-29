import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeInUp, buttonMotionProps, floatMotionProps } from "@/utils/motion";

export function HeroSection({ user, onSearch }) {
  return (
    <section className="relative overflow-hidden bg-[#FAF6F0] pt-12 pb-20 md:pt-16 md:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Form */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C4B3E]/10 border border-[#8C4B3E]/20 text-[#8C4B3E] text-xs sm:text-sm font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-[#8C4B3E] animate-pulse"></span>
              #1 Local Service Finder Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1D1A] tracking-tight leading-[1.15]">
              Expert Local Services, <br className="hidden sm:inline" />
              <span className="text-[#8C4B3E]">Delivered to Your Door.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5A5146] font-medium max-w-2xl leading-relaxed">
              Book background-checked electricians, plumbers, home cleaners, and wellness experts in minutes. Reliable, transparent pricing with verified customer reviews.
            </p>

            {/* Search Input Box */}
            <div className="bg-white p-2 sm:p-3 rounded-2xl border border-[#E8DCC3] shadow-lg flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7A7266]" />
                <Input
                  type="text"
                  placeholder="What service do you need? (e.g., Cleaning, Plumbing)"
                  className="pl-11 h-12 border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-[#7A7266]"
                />
              </div>

              <div className="h-8 w-[1px] bg-[#E8DCC3] hidden sm:block"></div>

              <div className="relative w-full sm:w-48">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7A7266]" />
                <Input
                  type="text"
                  placeholder="Location or ZIP"
                  className="pl-11 h-12 border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-[#7A7266]"
                />
              </div>

              <NavLink to="/services" className="w-full sm:w-auto">
                <Button {...buttonMotionProps} className="w-full sm:w-auto h-12 px-6 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer">
                  Search
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </NavLink>
            </div>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-[#7A7266]">Popular:</span>
              {["Home Cleaning", "Plumbing", "Electrical", "Lawn Care"].map((tag) => (
                <NavLink key={tag} to={`/services?category=${encodeURIComponent(tag)}`} className="text-xs font-semibold px-3 py-1 bg-white border border-[#E8DCC3] text-[#5A5146] hover:text-[#8C4B3E] hover:border-[#8C4B3E] rounded-full transition-colors">
                  {tag}
                </NavLink>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Visual Hero Banner */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div {...floatMotionProps} className="relative z-10 w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" alt="Local Service Professional" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="px-3 py-1 bg-[#8C4B3E] text-white text-xs font-bold rounded-full uppercase tracking-wider">Verified Professional</span>
                  <h3 className="text-xl font-black">Local House Cleaning Expert</h3>
                  <p className="text-xs text-stone-200">Over 140+ 5-Star Reviews in your neighborhood</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
