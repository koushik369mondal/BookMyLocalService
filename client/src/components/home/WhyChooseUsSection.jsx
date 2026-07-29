import React from "react";
import { motion } from "framer-motion";
import { features } from "@/data/homeData";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-[#FAF6F0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#8C4B3E]">Why Book With Us</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">Built for Safety, Quality, and Ease</h2>
        </div>

        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div key={idx} variants={fadeInUp} className="bg-white border border-[#E8DCC3] rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold text-[#1F1D1A]">{feat.title}</h3>
                <p className="text-xs text-[#5A5146] font-medium leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
