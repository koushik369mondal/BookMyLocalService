import React, { useState } from "react";
import { Plus, Minus, Info } from "lucide-react";
import { faqs } from "@/data/contactData";

export function ContactFaq() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="card-chai p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="size-9 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-foreground">
          <Info className="size-4" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-base text-foreground leading-none">
            Frequently asked questions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Answers to common questions about booking and provider verification
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border/70 overflow-hidden bg-card/40 transition-colors"
          >
            <button
              onClick={() => toggleFaq(idx)}
              className="w-full p-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-medium text-foreground hover:bg-card/70 transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              {openFaq === idx ? (
                <Minus className="size-3.5 text-muted-foreground shrink-0" />
              ) : (
                <Plus className="size-3.5 text-muted-foreground shrink-0" />
              )}
            </button>
            {openFaq === idx && (
              <div className="px-3.5 pb-3.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-2.5">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
