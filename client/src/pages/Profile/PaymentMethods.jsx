import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2, Plus, Lock, CheckCircle2 } from "lucide-react";

const mockCards = [
  {
    id: 1,
    brand: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2028,
    isDefault: true,
    holder: "Amanda Watson"
  },
  {
    id: 2,
    brand: "Mastercard",
    last4: "9834",
    expMonth: 8,
    expYear: 2027,
    isDefault: false,
    holder: "Amanda Watson"
  }
];

export default function PaymentMethods() {
  return (
    <DashboardLayout>
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Payment Methods</h1>
            <p className="text-slate-350 text-xs mt-1.5 font-medium">Link and manage credit cards and billing information securely</p>
          </div>
          <Button size="xs" className="bg-white text-slate-900 hover:bg-slate-50 rounded-xl h-8.5 text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-md">
            <Plus className="h-3.5 w-3.5" /> Add Card
          </Button>
        </div>
      </section>

      {/* PAYMENT METHODS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CARDS LIST */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
            <CardHeader className="p-0 pb-4 border-b border-slate-50">
              <CardTitle className="text-base font-extrabold text-slate-900">Saved Cards</CardTitle>
              <CardDescription className="text-xs">Your primary checkout methods</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              {mockCards.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">No payment methods added yet</p>
                  <p className="text-xs text-slate-400 mt-1">Add your first card for simple checkout</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockCards.map((card) => (
                    <div 
                      key={card.id} 
                      className={`border p-5 rounded-2xl bg-white relative flex flex-col justify-between hover:border-slate-350 transition-all duration-300 shadow-2xs ${
                        card.isDefault ? "border-slate-800" : "border-slate-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-slate-900/5 rounded-xl border border-slate-200 text-slate-850">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          {card.isDefault && (
                            <span className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                              <CheckCircle2 className="h-3 w-3" /> Default
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{card.brand}</span>
                          <span className="block font-black text-slate-900 text-base leading-snug">•••• •••• •••• {card.last4}</span>
                          <span className="block text-[10px] text-slate-500 font-semibold mt-1">Exp: {card.expMonth}/{card.expYear}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-50 pt-4 mt-5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold">{card.holder}</span>
                        {!card.isDefault ? (
                          <div className="flex items-center gap-2">
                            <button className="text-[9px] font-bold text-slate-450 hover:text-slate-900">
                              Set Default
                            </button>
                            <span className="text-slate-300">|</span>
                            <button className="text-rose-500 hover:text-rose-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-400">Primary</span>
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
          <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-5 space-y-4">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2">PCI Security Panel</span>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl shrink-0">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-slate-900 text-xs">Secure Settlements</h5>
                <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                  All credit details are encrypted via Stripe and standard SSL layers. No raw card digits are logged on our web servers.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
