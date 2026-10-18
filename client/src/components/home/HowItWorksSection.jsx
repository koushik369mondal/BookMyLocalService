import React from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, CheckCircle2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Find your service",
    description:
      "Browse verified local offerings, from electrical and plumbing to home cleaning and appliance repair. Filter by pricing or schedule.",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Choose your professional",
    description:
      "Review background-checked experts with transparent pricing and genuine community feedback. No surprise add-ons.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Sit back and relax",
    description:
      "Confirm appointments instantly and pay securely once work is done. Our satisfaction guarantee covers every booking.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-y border-border/70 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section Head */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <h2 className="text-2xl sm:text-[30px] font-medium tracking-tight text-foreground">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Booking professional help in your neighborhood with{" "}
            <span className="highlight">complete peace of mind</span>.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STEPS.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="card-chai p-6 flex flex-col gap-4 relative group sm:opacity-90 hover:opacity-100"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-foreground group-hover:text-brand transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground font-semibold">
                    {st.step}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
