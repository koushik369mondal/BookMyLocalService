import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { contactService } from "../../services/api";
import { ContactInfoCards } from "@/components/contact/ContactInfoCards";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import AnimatedBadge from "@/components/ui/AnimatedBadge";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError(
        "Please fill in all required fields (Name, Email, Subject, and Message)."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await contactService.sendMessage(formData);
      setSuccess(
        res.message ||
          "Thank you! Your message has been sent successfully. Check your email for a confirmation receipt."
      );
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact Form Submit Error:", err);
      setError(
        err.message ||
          "Failed to send message. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Page Header */}
        <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 text-center flex flex-col items-center gap-3">
            <AnimatedBadge>
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Dedicated customer support</span>
            </AnimatedBadge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-tight">
              Get in touch
            </h1>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              Have questions about booking a service, provider onboarding, or account settings? We're here with{" "}
              <span className="highlight">rapid neighborly assistance</span>.
            </p>
          </div>
        </section>

        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-12">
          {/* Contact Info Cards */}
          <ContactInfoCards />

          {/* Form & Map */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <ContactForm
              formData={formData}
              loading={loading}
              success={success}
              error={error}
              onChange={handleInputChange}
              onSubmit={handleFormSubmit}
            />

            {/* Office Location & Info */}
            <div className="lg:col-span-5 card-chai p-6 sm:p-8 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-base text-foreground">
                  Headquarters location
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  BookMyLocalService Network Operations. Managing dispatch nodes across major Indian metropolises.
                </p>

                <div className="space-y-3 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>Sector V, Salt Lake, Kolkata, West Bengal 700091</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <span>+91 (800) 234-5678 (Toll Free)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    <span>support@bookmylocalservice.in</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <span>Monday to Saturday: 8:00 AM to 8:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/60 mt-6">
                <p className="text-[11px] text-muted-foreground">
                  Need emergency home dispatch? Emergency electrical and plumbing support is available 24/7.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <ContactFaq />
        </div>
      </div>
    </MainLayout>
  );
}
