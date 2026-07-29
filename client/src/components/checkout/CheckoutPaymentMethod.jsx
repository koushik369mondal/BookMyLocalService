import React from "react";
import { CreditCard, QrCode, Building, DollarSign, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutPaymentMethod({
  register,
  setValue,
  selectedPaymentMethod,
  errors,
  isSubmitting
}) {
  const paymentOptions = [
    { id: "card", title: "Credit / Debit Card", icon: CreditCard },
    { id: "upi", title: "UPI / QR Code", icon: QrCode },
    { id: "netbanking", title: "Netbanking", icon: Building },
    { id: "cash", title: "Pay on Completion (Cash)", icon: DollarSign }
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCC3] shadow-sm space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-[#E8DCC3]">
        <div className="p-2 bg-[#8C4B3E]/10 text-[#8C4B3E] rounded-xl">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#1F1D1A]">2. Payment Selection</h2>
          <p className="text-xs text-[#5A5146] font-medium">Choose your preferred payment method</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentOptions.map((opt) => {
          const IconComp = opt.icon;
          const isSelected = selectedPaymentMethod === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setValue("paymentMethod", opt.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? "bg-[#FAF6F0] border-[#8C4B3E]"
                  : "bg-white border-[#E8DCC3] hover:border-[#8C4B3E]/50"
              }`}
            >
              <IconComp className={`h-5 w-5 ${isSelected ? "text-[#8C4B3E]" : "text-[#7A7266]"}`} />
              <span className="text-xs font-extrabold text-[#1F1D1A]">{opt.title}</span>
            </div>
          );
        })}
      </div>

      {selectedPaymentMethod === "card" && (
        <div className="space-y-4 pt-4 border-t border-[#E8DCC3] bg-[#FAF6F0]/30 p-4 rounded-2xl border">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#1F1D1A]">Card Number *</Label>
            <Input
              placeholder="1234 5678 9101 1121"
              disabled={isSubmitting}
              className={`h-10 border-[#E8DCC3] text-xs bg-white ${errors.cardNumber ? "border-rose-400" : ""}`}
              {...register("cardNumber")}
            />
            {errors.cardNumber && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.cardNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1F1D1A]">Expiry Date *</Label>
              <Input
                placeholder="MM/YY"
                disabled={isSubmitting}
                className={`h-10 border-[#E8DCC3] text-xs bg-white ${errors.cardExpiry ? "border-rose-400" : ""}`}
                {...register("cardExpiry")}
              />
              {errors.cardExpiry && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.cardExpiry.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1F1D1A]">CVC / CVV *</Label>
              <Input
                placeholder="123"
                disabled={isSubmitting}
                className={`h-10 border-[#E8DCC3] text-xs bg-white ${errors.cardCvc ? "border-rose-400" : ""}`}
                {...register("cardCvc")}
              />
              {errors.cardCvc && <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1"><ShieldAlert className="h-3 w-3" />{errors.cardCvc.message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
