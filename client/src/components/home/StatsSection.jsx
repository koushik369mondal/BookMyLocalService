import React from "react";
import { motion } from "framer-motion";
import { Users, Star, Briefcase, MapPin } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/utils/motion";

const STATS = [
  { icon: Users, value: "10,000+", label: "Happy customers" },
  { icon: Briefcase, value: "500+", label: "Verified professionals" },
  { icon: Star, value: "4.9 / 5", label: "Average rating" },
  { icon: MapPin, value: "25+ cities", label: "Across India" },
];

export function StatsSection() {
  return (
    <section className="py-12 border-y border-border/70 relative">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              variants={fadeInUp}
              className="flex flex-col items-center text-center gap-2.5 p-4 rounded-xl border border-border/40 bg-card/20"
            >
              <div className="size-10 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-muted-foreground">
                <Icon className="size-4.5" />
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
