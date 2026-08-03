import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
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
    <section className="py-20 bg-white border-y border-[#E8DCC3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#8C4B3E]">Explore Categories</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">Find The Right Service For Every Need</h2>
          <p className="text-sm text-[#5A5146] font-medium">Browse verified professionals categorized by specialization</p>
        </div>

        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon || Wrench;
            return (
              <motion.div key={cat.name || idx} variants={fadeInUp}>
                <NavLink to={`/services?category=${encodeURIComponent(cat.name)}`} className="group flex flex-col items-center p-6 bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl text-center hover:bg-[#8C4B3E] hover:border-[#8C4B3E] transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer">
                  <div className={`p-3.5 rounded-xl ${cat.color || "bg-amber-50 text-[#8C4B3E]"} group-hover:bg-white/20 group-hover:text-white transition-colors mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#1F1D1A] group-hover:text-white transition-colors mb-1">{cat.name}</h3>
                  <span className="text-[11px] font-semibold text-[#7A7266] group-hover:text-white/80 transition-colors">{cat.count}</span>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
