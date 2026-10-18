import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export function FeaturedProvidersSection({ providers = [] }) {
  return (
    <section className="py-16 sm:py-20 relative">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Head */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-[30px] font-medium tracking-tight text-foreground">
              Featured service providers
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Hire vetted local professionals with{" "}
              <span className="highlight">proven community trust</span>.
            </p>
          </div>

          <NavLink
            to="/services"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/80 px-3.5 text-xs font-medium text-muted-foreground hover:text-brand hover:border-border transition-colors shrink-0"
          >
            <span>View all services</span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </NavLink>
        </div>

        {providers.length === 0 ? (
          <div className="card-chai text-center py-16 space-y-2.5">
            <Briefcase className="size-8 text-muted-foreground mx-auto opacity-50" />
            <h3 className="font-display text-sm font-semibold text-foreground">
              No featured services available
            </h3>
            <p className="text-xs text-muted-foreground">
              New service listings will appear here as providers publish offerings.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.08, 0)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {providers.slice(0, 6).map((p, idx) => (
              <motion.div key={p.id || idx} variants={fadeInUp}>
                <ServiceCard service={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
