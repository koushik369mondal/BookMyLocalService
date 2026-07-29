import React from "react";
import { MessageSquare, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm({
  formData,
  loading,
  success,
  error,
  onChange,
  onSubmit
}) {
  return (
    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-[#1F1D1A] leading-none">Send a Message</h2>
            <p className="text-xs text-[#7A7266] mt-1">We typically reply within 2 hours during business hours</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-[#5A5146] uppercase tracking-wider">Full Name *</label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={onChange}
                className="h-10 border-[#5A5146]/20 focus-visible:ring-violet-950 rounded-xl text-xs bg-white text-[#1F1D1A]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-[#5A5146] uppercase tracking-wider">Email Address *</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={onChange}
                className="h-10 border-[#5A5146]/20 focus-visible:ring-violet-950 rounded-xl text-xs bg-white text-[#1F1D1A]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-[#5A5146] uppercase tracking-wider">Phone Number</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={onChange}
                className="h-10 border-[#5A5146]/20 focus-visible:ring-violet-950 rounded-xl text-xs bg-white text-[#1F1D1A]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-bold text-[#5A5146] uppercase tracking-wider">Subject *</label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Booking Inquiry, Support..."
                value={formData.subject}
                onChange={onChange}
                className="h-10 border-[#5A5146]/20 focus-visible:ring-violet-950 rounded-xl text-xs bg-white text-[#1F1D1A]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-bold text-[#5A5146] uppercase tracking-wider">Message *</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Describe your question or requirement in detail..."
              value={formData.message}
              onChange={onChange}
              className="w-full p-3 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-[#8C4B3E] rounded-xl text-xs bg-white text-[#1F1D1A]"
              required
            ></textarea>
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto h-11 px-8 bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-white" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
