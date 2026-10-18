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
  onSubmit,
}) {
  return (
    <div className="lg:col-span-7 card-chai p-6 sm:p-8 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="size-9 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-foreground">
            <MessageSquare className="size-4" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base text-foreground leading-none">
              Send a message
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              We typically reply within 2 hours during active business hours
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {success && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs p-3.5 flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-foreground">
                Full name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={onChange}
                className="h-9 border-border bg-card/40 text-xs rounded-md"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground">
                Email address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={onChange}
                className="h-9 border-border bg-card/40 text-xs rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-medium text-foreground">
                Phone number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={onChange}
                className="h-9 border-border bg-card/40 text-xs rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-medium text-foreground">
                Subject *
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Booking inquiry, service support..."
                value={formData.subject}
                onChange={onChange}
                className="h-9 border-border bg-card/40 text-xs rounded-md"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-medium text-foreground">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Describe your question or requirement in detail..."
              value={formData.message}
              onChange={onChange}
              className="w-full p-3 border border-border bg-card/40 focus:outline-none focus:ring-1 focus:ring-ring rounded-md text-xs text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={loading}
            className="w-full sm:w-auto h-9 px-6 font-display font-semibold text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                <span>Send message</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
