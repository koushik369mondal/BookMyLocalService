import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, MessageSquare, Loader2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/motion";
import { reviewsService } from "@/services/reviewsService";
import { UserAvatar } from "@/components/ui/avatar";

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
        console.error("Failed to load testimonials from database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-20 bg-white border-t border-[#E8DCC3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#8C4B3E]">Verified Customer Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F1D1A]">Loved by Thousands of Local Neighbors</h2>
          <p className="text-xs sm:text-sm text-[#5A5146]">Real feedback from verified platform service bookings</p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#5A5146]">Loading customer reviews from database...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-center bg-[#FAF6F0] rounded-3xl border border-[#E8DCC3] max-w-xl mx-auto">
            <MessageSquare className="h-8 w-8 text-[#7A7266] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1F1D1A]">Be the first to leave a review!</p>
            <p className="text-[11px] text-[#7A7266] mt-1">Complete a local service booking to share your experience with neighbors.</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div key={t.id || idx} variants={fadeInUp} className="bg-[#FAF6F0] border border-[#E8DCC3] rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-2xs">
                <div className="space-y-4">
                  <Quote className="h-8 w-8 text-[#8C4B3E]/30" />
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#5A5146] font-medium leading-relaxed italic">"{t.quote}"</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E8DCC3]">
                  <UserAvatar
                    src={t.avatar}
                    name={t.author}
                    className="h-10 w-10 border border-[#E8DCC3]"
                    fallbackClassName="bg-[#8C4B3E] text-white font-bold text-xs"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1F1D1A]">{t.author}</h4>
                    <span className="text-[11px] font-semibold text-[#7A7266]">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
