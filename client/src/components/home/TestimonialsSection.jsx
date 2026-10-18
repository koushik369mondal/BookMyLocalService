import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";
import { reviewsService } from "@/services/reviewsService";
import ReviewCard from "@/components/reviews/ReviewCard";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const response = await reviewsService.getTestimonials();
        if (response.success && response.data) {
          setTestimonials(response.data);
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 sm:py-24 border-t border-border/70 relative">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Head */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <h2 className="text-2xl sm:text-[30px] font-medium tracking-tight text-foreground">
            Loved by neighbors
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Real feedback from verified platform bookings,{" "}
            <span className="highlight">reviewed by real customers</span>.
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading customer reviews...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="card-chai text-center py-12 max-w-md mx-auto space-y-2 p-6">
            <MessageSquare className="size-8 text-muted-foreground mx-auto opacity-50" />
            <h3 className="font-display text-sm font-semibold text-foreground">
              Be the first to leave a review
            </h3>
            <p className="text-xs text-muted-foreground">
              Complete any local service booking to share your experience with neighbors.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.08, 0)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, idx) => (
              <motion.div key={t.id || idx} variants={fadeInUp}>
                <ReviewCard variant="testimonial" review={t} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
