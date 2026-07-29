import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { contactService } from "../../services/api";
import { ContactInfoCards } from "@/components/contact/ContactInfoCards";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFaq } from "@/components/contact/ContactFaq";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields (Name, Email, Subject, and Message).");
      return;
    }

    setLoading(true);
    try {
      const res = await contactService.sendMessage(formData);
      setSuccess(res.message || "Thank you! Your message has been sent successfully. Check your email for a confirmation receipt.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact Form Submit Error:", err);
      setError(err.message || "Failed to send message. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#FAF6F0] min-h-screen font-sans antialiased text-[#1F1D1A]">
        {/* PAGE HEADER */}
        <section className="py-12 bg-white border-b border-[#5A5146]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F1D1A] leading-tight">
              Get in <span className="text-[#C9A46A]">Touch</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#7A7266] max-w-xl leading-relaxed">
              Have questions about booking a service, provider registration, or need assistance? Drop us a message, and our team will get back to you.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* CONTACT INFO GRID */}
          <ContactInfoCards />

          {/* TWO-COLUMN FORM & MAP */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <ContactForm
              formData={formData}
              loading={loading}
              success={success}
              error={error}
              onChange={handleInputChange}
              onSubmit={handleFormSubmit}
            />

            {/* Map Column */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between h-full">
              <div className="space-y-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-[#1F1D1A]">Our Office Location</h3>
                <div className="w-full flex-1 min-h-[300px] rounded-xl overflow-hidden border border-[#5A5146]/20 relative">
                  <iframe
                    title="Office Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5620677583626!2d77.36214581508218!3d28.612911982424915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce566270d49cf%3A0x6b772c5780d6f4!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1625555555555!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "300px" }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>

          {/* FAQS */}
          <ContactFaq />
        </div>
      </div>
    </MainLayout>
  );
}
