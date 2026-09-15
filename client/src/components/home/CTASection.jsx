import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonMotionProps } from "@/utils/motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-white border-t border-[#E8DCC3] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#8C4B3E]/6 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-amber-400/8 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8C4B3E]/10 border border-[#8C4B3E]/25 text-[#8C4B3E] text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            Ready to get started?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F1D1A] leading-tight">
            Your Perfect Local Pro<br />
            <span className="text-[#8C4B3E]">Is Just a Click Away</span>
          </h2>

          <p className="text-sm sm:text-base text-[#5A5146] font-medium max-w-xl mx-auto leading-relaxed">
            Join thousands of happy customers who trust BookMyLocalService for all their home and wellness needs. Book in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <NavLink to="/services">
              <Button
                {...buttonMotionProps}
                className="h-12 px-8 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#8C4B3E]/20 flex items-center gap-2 cursor-pointer"
              >
                Explore All Services
                <ArrowRight className="h-4 w-4" />
              </Button>
            </NavLink>
            <NavLink to="/auth/register">
              <Button
                {...buttonMotionProps}
                variant="outline"
                className="h-12 px-8 border-[#E8DCC3] hover:border-[#8C4B3E] text-[#1F1D1A] font-extrabold text-sm rounded-xl flex items-center gap-2 cursor-pointer"
              >
                Become a Provider
              </Button>
            </NavLink>
          </div>

          <p className="text-xs text-[#7A7266] font-medium">
            Free to sign up · No credit card required · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
