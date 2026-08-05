import React from "react";
import { CreditCard, QrCode, Building, DollarSign, ShieldCheck, Zap } from "lucide-react";

export function CheckoutPaymentMethod({
  setValue,
  selectedPaymentMethod,
  isSubmitting
}) {
  const paymentOptions = [
    { id: "razorpay", title: "Razorpay Checkout (UPI, Cards, Netbanking)", icon: Zap, isBadge: true },
    { id: "card", title: "Credit / Debit Card (Razorpay)", icon: CreditCard },
    { id: "upi", title: "UPI / GPay / PhonePe", icon: QrCode },
    { id: "netbanking", title: "Netbanking", icon: Building },
    { id: "cash", title: "Pay on Completion (Cash)", icon: DollarSign }
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCC3] shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DCC3]">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#8C4B3E]/10 text-[#8C4B3E] rounded-xl">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1F1D1A]">2. Payment Selection</h2>
            <p className="text-xs text-[#5A5146] font-medium">Choose your preferred payment gateway method</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          Razorpay 256-bit Secured
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentOptions.map((opt) => {
          const IconComp = opt.icon;
          const isSelected = selectedPaymentMethod === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => !isSubmitting && setValue("paymentMethod", opt.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "bg-[#FAF6F0] border-[#8C4B3E] shadow-2xs"
                  : "bg-white border-[#E8DCC3] hover:border-[#8C4B3E]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComp className={`h-5 w-5 ${isSelected ? "text-[#8C4B3E]" : "text-[#7A7266]"}`} />
                <span className="text-xs font-extrabold text-[#1F1D1A]">{opt.title}</span>
              </div>
              {opt.isBadge && (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#8C4B3E] text-white">
                  Recommended
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedPaymentMethod !== "cash" && (
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC3] flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[#8C4B3E] shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#1F1D1A]">Razorpay Standard Web Checkout</p>
            <p className="text-[11px] text-[#5A5146] font-medium">
              Upon clicking "Complete Booking & Pay", the secure Razorpay Payment Gateway modal will open to safely authorize your transaction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
