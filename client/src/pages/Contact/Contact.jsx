import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Lock,
  Plus,
  Minus,
  Info
} from "lucide-react";

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
  
  // FAQs Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How do I book a service?",
      a: "Simply browse our service categories, choose a provider based on reviews and pricing, select your preferred time slot, and confirm your booking securely online."
    },
    {
      q: "How can I become a provider?",
      a: "Click on the 'Become a Provider' button. You'll need to enter your business details, upload required certifications, specify service locations, and pass our identity and background check."
    },
    {
      q: "Is online payment secure?",
      a: "Yes. All payments are processed through encrypted Stripe payment gateways. BookMyLocalService does not store your credit card credentials on our servers."
    },
    {
      q: "How do I cancel a booking?",
      a: "You can cancel any booking up to 24 hours before the scheduled time slot from your Customer Dashboard with a full refund. Cancellations made under 24 hours may incur a small fee."
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields (Name, Email, Subject, and Message).");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess("Thank you! Your message has been sent successfully. Our support team will contact you shortly.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1500);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
        
        {/* PAGE HEADER */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Get in <span className="text-amber-500">Touch</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Have questions about booking a service, provider registration, or need assistance? Drop us a message, and our team will get back to you.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          
          {/* CONTACT INFO GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Office Address", detail: "123 Business Hub, Sector 62, Noida, UP, India", icon: MapPin, color: "bg-slate-900/5 text-slate-900 border-slate-900/10" },
              { title: "Phone Number", detail: "+91 120 456 7890\n+91 98765 43210", icon: Phone, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
              { title: "Email Address", detail: "support@bookmylocal.com\ninfo@bookmylocal.com", icon: Mail, color: "bg-amber-50 text-amber-600 border-amber-100" },
              { title: "Business Hours", detail: "Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed", icon: Clock, color: "bg-pink-50 text-pink-600 border-pink-100" }
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <Card 
                  key={idx} 
                  className="p-5 gap-0 border border-slate-200 flex flex-col h-full bg-white rounded-2xl relative"
                >
                  <div className={`p-2.5 rounded-xl border self-start ${card.color} mb-3`}>
                    <IconComp className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5 whitespace-pre-line flex-1">
                    {card.detail}
                  </p>
                </Card>
              );
            })}
          </section>

          {/* TWO-COLUMN FORM & MAP - Equal height alignment via grid items-stretch */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Contact Form Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between h-full">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 bg-slate-900/5 text-slate-900 rounded-xl">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-slate-900 leading-none">Send a Message</h2>
                    <p className="text-xs text-slate-500 mt-1">We typically reply within 2 hours during business hours</p>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  
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
                      <label htmlFor="name" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-10 border-slate-200 focus-visible:ring-slate-900 rounded-xl text-xs bg-white text-slate-800"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address *</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-10 border-slate-200 focus-visible:ring-slate-900 rounded-xl text-xs bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Optional"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-10 border-slate-200 focus-visible:ring-slate-900 rounded-xl text-xs bg-white text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Subject *</label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Booking Inquiries / Partnerships"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="h-10 border-slate-200 focus-visible:ring-slate-900 rounded-xl text-xs bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Tell us what you need assistance with..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 p-3.5 rounded-xl text-xs bg-white text-slate-800"
                      required
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-11 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin animate-infinite" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                </form>
              </div>
            </div>

            {/* Google Map Column - Styled precisely to match Form height */}
            <div className="lg:col-span-5 relative border border-gray-100 rounded-2xl overflow-hidden bg-slate-100 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[450px]">
              
              {/* Mock Map Vector Grid */}
              <div className="absolute inset-0 bg-[#E5E9F0] pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-0 w-full h-[6px] bg-white transform rotate-3"></div>
                <div className="absolute top-[50%] left-0 w-full h-[6px] bg-white transform -rotate-12"></div>
                <div className="absolute top-0 left-[30%] w-[6px] h-full bg-white transform rotate-6"></div>
                <div className="absolute top-0 left-[70%] w-[6px] h-full bg-white transform -rotate-3"></div>
                <div className="absolute top-[35%] left-[20%] w-[120px] h-[80px] bg-emerald-50 rounded-xl border border-emerald-100 opacity-60"></div>
                <div className="absolute top-[55%] left-[60%] w-[140px] h-[90px] bg-sky-50 rounded-xl border border-sky-100 opacity-60"></div>
              </div>

              {/* Pinned map marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10 select-none">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-900/25 absolute -inset-2 animate-ping"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center border border-white shadow-md relative z-10">
                    <MapPin className="h-4 w-4 text-amber-500 fill-accent" />
                  </div>
                </div>
                <span className="bg-[#0F172A] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-white/10 uppercase tracking-wide whitespace-nowrap">
                  HQ Noida, Sector 62
                </span>
              </div>

              {/* Headquarters Pinned Info Badge - Inside map container with margin */}
              <div className="relative z-20 m-4 p-4 bg-white/95 backdrop-blur-xs rounded-xl border border-gray-100 shadow-lg mt-auto">
                <span className="block text-[9px] text-amber-500 font-black uppercase tracking-widest leading-none">Headquarters</span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-1">BookMyLocalService Pvt Ltd</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Noida Sector 62 Business Hub, Uttar Pradesh, 201301
                </p>
              </div>

            </div>

          </section>

          {/* FAQ PREVIEW ACCORDION */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-500">Quick answers to common questions about booking services and provider onboarding.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3.5">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div 
                    key={i} 
                    className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full p-4 flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base text-left focus:outline-none cursor-pointer select-none"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <Minus className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                      ) : (
                        <Plus className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4.5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100/50 pt-2.5 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* CALL TO ACTION - Mirrored from Home CTA */}
        <section className="bg-[#0F172A] text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_40%)] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Need Immediate Assistance?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Our support team is ready to help you. Send a message, schedule a booking, or reach out to verify provider registration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 max-w-sm mx-auto sm:max-w-none">
              <NavLink to="/services" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl px-8 shadow-md">
                  Browse Services
                </Button>
              </NavLink>
              <NavLink to="/register?role=PROVIDER" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-12 border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl px-8">
                  Become a Provider
                </Button>
              </NavLink>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
