import React from "react";
import { Card } from "@/components/ui/card";
import { contactInfoCards } from "@/data/contactData";

export function ContactInfoCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactInfoCards.map((card, idx) => {
        const IconComp = card.icon;
        return (
          <Card key={idx} className="p-5 gap-0 border border-[#5A5146]/20 flex flex-col h-full bg-white rounded-2xl relative">
            <div className={`p-2.5 rounded-xl border self-start ${card.color} mb-3`}>
              <IconComp className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-bold text-[#1F1D1A] text-base leading-snug">{card.title}</h3>
            <p className="text-xs text-[#7A7266] leading-relaxed mt-1.5 whitespace-pre-line flex-1">{card.detail}</p>
          </Card>
        );
      })}
    </section>
  );
}
