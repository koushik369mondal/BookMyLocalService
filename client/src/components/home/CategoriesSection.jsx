import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export function CategoriesSection({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 bg-white border-y border-[#E8DCC3]">
        <div className="container mx-auto px-4 text-center space-y-3">
          <Wrench className="h-8 w-8 text-[#7A7266] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#1F1D1A]">No Service Categories Available</h3>
          <p className="text-xs text-[#7A7266]">Categories will populate automatically as services are published</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white border-y border-[#E8DCC3] relative overflow-hidden">
      {/* Subtle bg decoration */}
      <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full bg-[#8C4B3E]/3 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#8C4B3E] bg-[#8C4B3E]/8 border border-[#8C4B3E]/20 px-3.5 py-1.5 rounded-full">
              Explore Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">
              Find The Right Service<br className="hidden sm:inline" /> For Every Need
            </h2>
            <p className="text-sm text-[#5A5146] font-medium">
              Browse verified professionals categorized by specialization
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <NavLink
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#8C4B3E] hover:text-white hover:bg-[#8C4B3E] border border-[#8C4B3E]/30 hover:border-[#8C4B3E] px-4 py-2 rounded-xl transition-all duration-200 shrink-0"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </NavLink>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer(0.07, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.slice(0, 12).map((cat, idx) => {
            const catName = typeof cat.name === "object" ? (cat.name?.name || "Category") : (cat.name || "Category");
            const Icon = (typeof cat.icon === "function" || typeof cat.icon === "object") ? cat.icon : Wrench;
            const isComingSoon = !cat.count || cat.count === "0 Services" || cat.count === 0;

            if (isComingSoon) {
              return (
                <motion.div key={cat.id || catName || idx} variants={fadeInUp}>
                  <div className="group flex flex-col items-center p-5 bg-[#FAF6F0]/80 border border-dashed border-[#E8DCC3] rounded-2xl text-center cursor-not-allowed opacity-60 relative">
                    <div className="p-3 rounded-xl bg-white/60 text-[#7A7266] mb-3 border border-[#E8DCC3]">
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="text-xs font-extrabold text-[#5A5146] mb-1.5 line-clamp-2 leading-tight text-center">{catName}</h3>
                    <span className="text-[9px] font-bold text-[#8C4B3E] bg-[#8C4B3E]/10 px-2 py-0.5 rounded-md">
                      Coming Soon
                    </span>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div key={cat.id || catName || idx} variants={fadeInUp}>
                <NavLink
                  to={`/services?category=${encodeURIComponent(catName)}`}
                  className="group flex flex-col items-center p-5 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl text-center hover:bg-[#8C4B3E] hover:border-[#8C4B3E] transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className={`p-3 rounded-xl ${cat.color || "bg-amber-50 text-[#8C4B3E]"} group-hover:bg-white/20 group-hover:text-white transition-colors mb-3 border border-transparent group-hover:border-white/20`}>
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-xs font-extrabold text-[#1F1D1A] group-hover:text-white transition-colors mb-1 line-clamp-2 leading-tight text-center">{catName}</h3>
                  <span className="text-[10px] font-semibold text-[#7A7266] group-hover:text-white/70 transition-colors">
                    {cat.count}
                  </span>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
