import React, { useState } from "react";
import { Plus, Minus, Info } from "lucide-react";
import { faqs } from "@/data/contactData";

export function ContactFaq() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-amber-50 text-[#8C4B3E] rounded-xl">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-xl text-[#1F1D1A] leading-none">Frequently Asked Questions</h2>
          <p className="text-xs text-[#7A7266] mt-1">Quick answers to common questions about our platform</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-[#5A5146]/20 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleFaq(idx)}
              className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#1F1D1A] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              {openFaq === idx ? (
                <Minus className="h-4 w-4 text-[#8C4B3E] shrink-0" />
              ) : (
                <Plus className="h-4 w-4 text-[#7A7266] shrink-0" />
              )}
            </button>
            {openFaq === idx && (
              <div className="px-4 pb-4 text-xs text-[#7A7266] leading-relaxed border-t border-[#5A5146]/10 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
