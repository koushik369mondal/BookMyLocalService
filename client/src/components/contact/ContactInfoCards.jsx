import React from "react";
import { contactInfoCards } from "@/data/contactData";

export function ContactInfoCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {contactInfoCards.map((card, idx) => {
        const IconComp = card.icon;
        return (
          <div
            key={idx}
            className="card-chai p-5 flex flex-col h-full sm:opacity-90 hover:opacity-100 transition-all group"
          >
            <div className="size-10 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-foreground group-hover:text-brand transition-colors mb-3">
              <IconComp className="size-4.5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-foreground">
              {card.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1 whitespace-pre-line flex-1">
              {card.detail}
            </p>
          </div>
        );
      })}
    </section>
  );
}
