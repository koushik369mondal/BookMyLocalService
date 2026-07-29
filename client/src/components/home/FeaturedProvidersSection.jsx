import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export function FeaturedProvidersSection({ providers }) {
  return (
    <section className="py-20 bg-[#FAF6F0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C4B3E]">Top Rated Experts</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">Featured Local Service Providers</h2>
          </div>
          <NavLink to="/services" className="inline-flex items-center gap-2 text-xs font-extrabold text-[#8C4B3E] hover:text-[#783E33] transition-colors">
            View All Services
            <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>

        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {providers.map((p, idx) => (
            <motion.div key={p.id || idx} variants={fadeInUp}>
              <ServiceCard service={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
