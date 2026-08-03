import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Trash2, Plus, Lock, CheckCircle2 } from "lucide-react";

const mockCards = [];

export default function PaymentMethods() {
  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Payment Methods</h1>
              <p className="text-[#5A5146] text-xs mt-1 font-medium">Link and manage credit cards and billing information securely</p>
            </div>
            <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl h-9 text-xs font-bold flex items-center gap-1.5 shrink-0 border border-[#E8DCC3] shadow-2xs">
              <Plus className="h-3.5 w-3.5" /> Add Card
            </Button>
          </div>
        </section>

        {/* PAYMENT METHODS CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CARDS LIST */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
                <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3]">
                  <CardTitle className="text-base font-bold text-[#1F1D1A]">Saved Cards</CardTitle>
                  <CardDescription className="text-xs text-[#7A7266]">Your primary checkout methods</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-6">
                  {mockCards.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-10 w-10 text-[#7A7266] mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-bold text-[#1F1D1A]">No payment methods added yet</p>
                      <p className="text-xs text-[#7A7266] mt-1">Add your first card for simple checkout</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockCards.map((card) => (
                        <div 
                          key={card.id} 
                          className={`border p-5 rounded-2xl bg-white relative flex flex-col justify-between hover:border-[#C9A46A] transition-all duration-200 shadow-2xs ${
                            card.isDefault ? "border-[#C9A46A] bg-[#FAF6F0]/50" : "border-[#E8DCC3]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="p-2.5 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                                <CreditCard className="h-5 w-5" />
                              </div>
                              {card.isDefault && (
                                <Badge className="bg-[#7DAB7D]/20 text-[#2B522B] border-[#7DAB7D]/30 text-[9px]">
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> Default
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="block text-xs font-bold text-[#7A7266] uppercase tracking-widest">{card.brand}</span>
                              <span className="block font-bold text-[#1F1D1A] text-base leading-snug">•••• •••• •••• {card.last4}</span>
                              <span className="block text-[10px] text-[#7A7266] font-semibold mt-1">Exp: {card.expMonth}/{card.expYear}</span>
                            </div>
                          </div>

                          <div className="border-t border-[#E8DCC3] pt-4 mt-5 flex items-center justify-between">
                            <span className="text-[10px] text-[#7A7266] font-bold">{card.holder}</span>
                            {!card.isDefault ? (
                              <div className="flex items-center gap-2">
                                <button className="text-[10px] font-bold text-[#C9A46A] hover:underline">
                                  Set Default
                                </button>
                                <span className="text-[#E8DCC3]">|</span>
                                <button className="text-[#8C4B3E] hover:underline p-1" title="Remove Card">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-[#7A7266]">Primary</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* SECURITY NOTE CARD */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-5 space-y-4 shadow-2xs">
                <span className="text-xs font-extrabold text-[#7A7266] uppercase tracking-wider block border-b border-[#E8DCC3] pb-2">PCI Security Panel</span>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#F0E7D5] text-[#C9A46A] rounded-xl shrink-0 border border-[#E8DCC3]">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-[#1F1D1A] text-xs">Secure Settlements</h5>
                    <p className="text-[11px] text-[#5A5146] leading-relaxed font-medium">
                      All payment details are encrypted via Stripe and standard SSL layers. No raw card digits are logged on our web servers.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
