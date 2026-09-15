import React from "react";
import { motion } from "framer-motion";
import { Users, Star, Briefcase, MapPin } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/utils/motion";

const STATS = [
  { icon: Users, value: "10,000+", label: "Happy Customers", color: "text-[#8C4B3E]", bg: "bg-[#8C4B3E]/10" },
  { icon: Briefcase, value: "500+", label: "Verified Professionals", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Star, value: "4.9 / 5", label: "Average Rating", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: MapPin, value: "25+ Cities", label: "Across India", color: "text-blue-600", bg: "bg-blue-50" },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-[#1F1D1A] relative overflow-hidden">
      {/* Subtle shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#8C4B3E] blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-amber-400 blur-[60px]" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {STATS.map(({ icon: Icon, value, label, color, bg }) => (
            <motion.div
              key={label}
              variants={fadeInUp}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                <Icon className={`h-5.5 w-5.5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
                <p className="text-xs sm:text-sm text-white/50 font-semibold mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
