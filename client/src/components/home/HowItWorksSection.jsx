import React from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, PartyPopper } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Find Your Service",
    description:
      "Browse hundreds of verified local services — from home cleaning and plumbing to electrical and wellness. Filter by rating, price, or availability.",
    color: "from-[#8C4B3E]/15 to-[#8C4B3E]/5",
    iconBg: "bg-[#8C4B3E]",
    accent: "#8C4B3E",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Pick Your Pro",
    description:
      "Compare background-checked professionals by verified reviews, transparent pricing, and real-time scheduling. Zero surprises, always.",
    color: "from-amber-500/15 to-amber-500/5",
    iconBg: "bg-amber-500",
    accent: "#F59E0B",
  },
  {
    step: "03",
    icon: PartyPopper,
    title: "Relax & Enjoy",
    description:
      "Book instantly, pay securely, and track your pro in real time. Our happiness guarantee means we make it right — every time.",
    color: "from-emerald-500/15 to-emerald-500/5",
    iconBg: "bg-emerald-500",
    accent: "#10B981",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white border-y border-[#E8DCC3] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8DCC3] to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#8C4B3E] bg-[#8C4B3E]/8 border border-[#8C4B3E]/20 px-3.5 py-1.5 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">
            How BookMyLocalService Works
          </h2>
          <p className="text-sm text-[#5A5146] font-medium leading-relaxed">
            Getting expert help at your doorstep has never been this seamless.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[3.5rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-0.5 bg-gradient-to-r from-[#8C4B3E]/30 via-amber-400/30 to-emerald-500/30 z-0" />

          {STEPS.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={`relative z-10 bg-gradient-to-br ${st.color} border border-[#E8DCC3] rounded-3xl p-7 space-y-4 group hover:shadow-xl hover:shadow-[${st.accent}]/10 hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Step number */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-12 h-12 rounded-2xl ${st.iconBg} flex items-center justify-center shadow-md shrink-0`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className="text-5xl font-black opacity-10 select-none leading-none"
                    style={{ color: st.accent }}
                  >
                    {st.step}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#1F1D1A]">{st.title}</h3>
                <p className="text-sm text-[#5A5146] font-medium leading-relaxed">
                  {st.description}
                </p>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to right, ${st.accent}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
