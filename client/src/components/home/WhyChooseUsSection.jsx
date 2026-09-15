import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  IndianRupee,
  SmilePlus,
  CalendarCheck,
  Star,
  HeartHandshake,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const FEATURES = [
  {
    title: "Verified Professionals",
    description:
      "Every provider is identity-verified, background-checked, and skills-tested before going live on our platform. Your safety is our top priority.",
    icon: ShieldCheck,
    iconColor: "text-[#8C4B3E]",
    iconBg: "bg-[#8C4B3E]/10",
    accentBar: "from-[#8C4B3E] to-[#8C4B3E]/40",
    large: true,
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden charges. See flat rates in ₹ upfront before you book.",
    icon: IndianRupee,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    accentBar: "from-amber-500 to-amber-500/40",
  },
  {
    title: "Happiness Guarantee",
    description:
      "Not satisfied? We rebook or refund — no questions asked.",
    icon: SmilePlus,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    accentBar: "from-emerald-500 to-emerald-500/40",
  },
  {
    title: "Instant Booking",
    description:
      "Book, schedule, and pay in under 60 seconds on web or mobile.",
    icon: CalendarCheck,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    accentBar: "from-blue-500 to-blue-500/40",
  },
  {
    title: "Top-Rated Experts",
    description:
      "Only providers with 4★+ ratings stay on our platform — quality is enforced.",
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    accentBar: "from-amber-400 to-amber-400/40",
  },
  {
    title: "Community Trust",
    description:
      "Real reviews from verified bookings. No fake ratings, ever.",
    icon: HeartHandshake,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
    accentBar: "from-rose-400 to-rose-400/40",
    large: true,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-[#FAF6F0] relative overflow-hidden">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#8C4B3E]/5 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14 space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#8C4B3E] bg-[#8C4B3E]/8 border border-[#8C4B3E]/20 px-3.5 py-1.5 rounded-full">
            Why Book With Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">
            Built for Safety, Quality & Ease
          </h2>
          <p className="text-sm text-[#5A5146] font-medium leading-relaxed">
            We set the bar high so every booking feels like it was made for you.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={`group relative bg-white border border-[#E8DCC3] rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${feat.large ? "sm:col-span-1" : ""}`}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.accentBar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-6 w-6 ${feat.iconColor}`} />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#1F1D1A] mb-1.5">{feat.title}</h3>
                  <p className="text-sm text-[#5A5146] font-medium leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
