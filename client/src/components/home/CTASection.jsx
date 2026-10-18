import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-chai p-8 sm:p-14 flex flex-col items-center gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-tight">
              Your perfect local professional is just a click away
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join thousands of neighbors who trust BookMyLocalService for{" "}
              <span className="highlight">dependable home maintenance</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <NavLink to="/services">
              <Button variant="solid" size="lg">
                Explore all services
              </Button>
            </NavLink>
            <NavLink to="/register">
              <Button variant="outline" size="lg">
                Become a provider
              </Button>
            </NavLink>
          </div>

          <p className="text-xs text-muted-foreground">
            Free to join · Transparent pricing · Guaranteed satisfaction
          </p>
        </motion.div>
      </div>
    </section>
  );
}
