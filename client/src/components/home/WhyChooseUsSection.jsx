import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  IndianRupee,
  SmilePlus,
  CalendarCheck,
  Star,
  Clock,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const FEATURES = [
  {
    title: "Verified professionals",
    description:
      "Every service provider is identity-verified and background-checked before onboarding. Your safety and quality come first.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent upfront pricing",
    description:
      "Clear rates with no hidden fees or surprise charges. Review prices before booking.",
    icon: IndianRupee,
  },
  {
    title: "Happiness guarantee",
    description:
      "If you're not fully satisfied with a service, our support team will rebook or issue a refund promptly.",
    icon: SmilePlus,
  },
  {
    title: "Instant scheduling",
    description:
      "Book same-day or future appointments in seconds from your phone or desktop.",
    icon: CalendarCheck,
  },
  {
    title: "Community rated experts",
    description:
      "All service ratings are generated solely by verified customers who booked through the platform.",
    icon: Star,
  },
  {
    title: "On-time arrival",
    description:
      "Providers respect your time with direct dispatch updates and punctual doorstep service.",
    icon: Clock,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section Head */}
        <div className="max-w-2xl mb-12 space-y-2">
          <h2 className="text-2xl sm:text-[30px] font-medium tracking-tight text-foreground">
            Why BookMyLocalService
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Engineered for reliability, speed, and{" "}
            <span className="highlight">transparent local hiring</span>.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="card-chai p-6 flex flex-col gap-3.5 sm:opacity-90 hover:opacity-100 group"
              >
                <div className="size-10 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-foreground group-hover:text-brand transition-colors">
                  <Icon className="size-5" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
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
