import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Trash2, Plus, Lock, CheckCircle2 } from "lucide-react";

const mockCards = [];

export default function PaymentMethods() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Payment methods</h1>
            <p className="text-neutral-400 text-xs mt-1 font-medium">Link and manage payment cards and billing information securely</p>
          </div>
          <Button size="sm" variant="solid" className="flex items-center gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" /> Add card
          </Button>
        </div>

        {/* PAYMENT METHODS CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CARDS LIST */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-chai p-6 space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-base font-bold text-white">Saved cards</h2>
                <p className="text-xs text-neutral-400">Your primary checkout methods</p>
              </div>

              <div>
                {mockCards.length === 0 ? (
                  <div className="text-center py-16">
                    <CreditCard className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-white">No payment methods added yet</p>
                    <p className="text-xs text-neutral-400 mt-1">Add your first card for simple checkout</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockCards.map((card) => (
                      <div 
                        key={card.id} 
                        className={`card-chai p-5 relative flex flex-col justify-between ${
                          card.isDefault ? "border-white/20" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            {card.isDefault && (
                              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Default
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest">{card.brand}</span>
                            <span className="block font-mono text-white text-base leading-snug">•••• •••• •••• {card.last4}</span>
                            <span className="block text-[10px] text-neutral-500 font-mono mt-1">Exp: {card.expMonth}/{card.expYear}</span>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-5 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400 font-medium">{card.holder}</span>
                          {!card.isDefault ? (
                            <div className="flex items-center gap-2">
                              <button className="text-[10px] font-medium text-neutral-300 hover:text-white cursor-pointer">
                                Set default
                              </button>
                              <span className="text-neutral-700">|</span>
                              <button className="text-red-400 hover:text-red-300 p-1 cursor-pointer" title="Remove card">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-medium text-neutral-400">Primary</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECURITY NOTE CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-chai p-5 space-y-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block border-b border-white/10 pb-2">PCI security notice</span>
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl shrink-0 border border-white/10">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-white text-xs">Secure settlements</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-normal">
                    All payment details are encrypted via Stripe and standard SSL layers. No raw card digits are logged on our web servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
