import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/homeData";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white border-t border-[#E8DCC3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#8C4B3E]">Customer Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">Loved by Thousands of Local Neighbors</h2>
        </div>

        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="bg-[#FAF6F0] border border-[#E8DCC3] rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <Quote className="h-8 w-8 text-[#8C4B3E]/30" />
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#5A5146] font-medium leading-relaxed italic">"{t.quote}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E8DCC3]">
                <img src={t.avatar} alt={t.author} className="h-10 w-10 rounded-full object-cover border border-[#E8DCC3]" />
                <div>
                  <h4 className="text-xs font-extrabold text-[#1F1D1A]">{t.author}</h4>
                  <span className="text-[11px] font-semibold text-[#7A7266]">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
