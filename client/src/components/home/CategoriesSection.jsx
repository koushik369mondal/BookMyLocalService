import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, ArrowUpRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

export function CategoriesSection({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Head */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-[30px] font-medium tracking-tight text-foreground">
              Explore categories
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Browse verified providers categorized by{" "}
              <span className="highlight">specialized skills</span>.
            </p>
          </div>

          <NavLink
            to="/services"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/80 px-3.5 text-xs font-medium text-muted-foreground hover:text-brand hover:border-border transition-colors shrink-0"
          >
            <span>View all</span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </NavLink>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerContainer(0.05, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4"
        >
          {categories.slice(0, 12).map((cat, idx) => {
            const catName =
              typeof cat.name === "object"
                ? cat.name?.name || "Category"
                : cat.name || "Category";
            const Icon =
              typeof cat.icon === "function" || typeof cat.icon === "object"
                ? cat.icon
                : Wrench;
            const isComingSoon =
              !cat.count || cat.count === "0 Services" || cat.count === 0;

            if (isComingSoon) {
              return (
                <motion.div key={cat.id || catName || idx} variants={fadeInUp}>
                  <div className="card-chai p-4 flex flex-col items-center text-center opacity-60 cursor-not-allowed">
                    <div className="size-10 rounded-lg border border-border/60 bg-card/60 flex items-center justify-center text-muted-foreground mb-2.5">
                      <Icon className="size-4.5" />
                    </div>
                    <h3 className="font-display text-xs font-medium text-foreground line-clamp-1">
                      {catName}
                    </h3>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      Coming soon
                    </span>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div key={cat.id || catName || idx} variants={fadeInUp}>
                <NavLink
                  to={`/services?category=${encodeURIComponent(catName)}`}
                  className="card-chai group p-4 flex flex-col items-center text-center sm:opacity-90 hover:opacity-100 block transition-all"
                >
                  <div className="size-10 rounded-lg border border-border/60 bg-card/60 flex items-center justify-center text-muted-foreground group-hover:text-brand transition-colors mb-2.5">
                    <Icon className="size-4.5 transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  <h3 className="font-display text-xs font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-1">
                    {catName}
                  </h3>
                  <span className="text-[11px] text-muted-foreground mt-1 font-mono">
                    {cat.count}
                  </span>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
