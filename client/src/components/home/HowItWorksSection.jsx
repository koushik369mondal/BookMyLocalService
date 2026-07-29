import React from "react";
import { motion } from "framer-motion";
import { steps } from "@/data/homeData";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white border-y border-[#E8DCC3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#8C4B3E]">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">How BookMyLocalService Works</h2>
        </div>

        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="relative bg-[#FAF6F0] border border-[#E8DCC3] rounded-3xl p-8 space-y-4">
              <span className="text-4xl font-black text-[#8C4B3E]/30">{st.step}</span>
              <h3 className="text-xl font-black text-[#1F1D1A]">{st.title}</h3>
              <p className="text-xs sm:text-sm text-[#5A5146] font-medium leading-relaxed">{st.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
