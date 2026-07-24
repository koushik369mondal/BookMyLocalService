import React from "react";
import { NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Clock,
  Users,
  ArrowRight,
  Award,
  Eye,
  Heart,
  Search,
  CheckCircle2,
  Lock,
  HelpCircle,
  TrendingUp,
  Sliders,
  Shield,
  ThumbsUp,
  Sparkle
} from "lucide-react";

export default function About() {
  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800">

        {/* PAGE HEADER */}
        <section className="relative overflow-hidden py-14 lg:py-18 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              {/* Text column */}
              <div className="lg:col-span-7 flex flex-col items-start text-left gap-5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  About <span className="text-amber-500">BookMyLocalService</span>
                </h1>

                <p className="text-base sm:text-lg font-bold text-slate-800 border-l-4 border-amber-500 pl-4 leading-relaxed">
                  Connecting People With Trusted Local Professionals
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  BookMyLocalService is a neighborhood marketplace designed to help customers easily discover, compare, and instantly book verified local service providers. At the same time, we empower independent skilled professionals by providing them the tools and visibility they need to grow their businesses.
                </p>

                <div className="flex flex-wrap gap-4 pt-1 w-full sm:w-auto">
                  <NavLink to="/services" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-7 font-bold transition-all flex items-center justify-center gap-2">
                      Browse Services
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </NavLink>
                  <NavLink to="/register?role=PROVIDER" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto h-11 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-xl px-7 font-bold transition-all">
                      Become a Provider
                    </Button>
                  </NavLink>
                </div>
              </div>

              {/* Photo Column */}
              <div className="lg:col-span-5 relative">
                <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-white aspect-4/3 sm:aspect-video lg:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                    alt="Premium Home Interior"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Background Checks</span>
                      <span className="text-xs font-extrabold text-slate-800">100% Verified Pros</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Image Left */}
              <div className="lg:col-span-6 relative order-last lg:order-first">
                <div className="relative border border-slate-200 rounded-2xl overflow-hidden aspect-4/3 sm:aspect-video lg:aspect-4/3 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                    alt="Service Provider Meeting Customer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Story Right */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Platform Genesis</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Our Story</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  BookMyLocalService was born out of a simple, everyday struggle: finding reliable, skilled professionals to get work done around the house. Standard directories were flooded with outdated contact details, fake ratings, and pricing ambiguity. We saw an opportunity to bring order to this unstructured marketplace.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  By building a robust infrastructure grounded in strict identity verification, transparency, and consumer protection, we created a destination where customers can browse, review, and book confidently. Today, we're proud to serve thousands of families across the country while providing verified specialists with a steady source of income.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Direct Bookings</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Direct connection with verified local pros</p>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Clear Pricing</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Upfront flat rates or hourly costs</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MISSION, VISION, VALUES */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col gap-2">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Purpose Driven</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Our Foundation</h2>
              <p className="text-xs sm:text-sm text-slate-500">The core values and goals that guide our marketplace operations daily.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mission Card */}
              <Card className="border border-slate-200 bg-white rounded-2xl p-6 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="p-2.5 bg-slate-900/5 text-slate-900 rounded-xl border border-slate-900/10 w-fit">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    To deliver reliable, high-quality local services to our customers' doorsteps with absolute transparency, safety, and booking convenience.
                  </p>
                </div>
              </Card>

              {/* Vision Card */}
              <Card className="border border-slate-200 bg-white rounded-2xl p-6 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 w-fit">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    To become a trusted, secure, and customer-focused local services marketplace for households and commercial businesses.
                  </p>
                </div>
              </Card>

              {/* Values Card */}
              <Card className="border border-slate-200 bg-white rounded-2xl p-6 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 w-fit">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Our Core Values</h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-500">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong>Trust:</strong> Verified provider background checks.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong>Quality:</strong> Audited rating standards.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong>Transparency:</strong> Upfront clear rates.
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col gap-2">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Features</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Why Choose BookMyLocalService</h2>
              <p className="text-xs sm:text-sm text-slate-500">We make booking quality home and personal services safe, secure, and hassle-free.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Verified Professionals", description: "Every service provider is background-checked and identity-verified to ensure absolute safety and quality.", icon: ShieldCheck, color: "bg-slate-900/5 text-slate-900 border-slate-900/10" },
                { title: "Secure Bookings", description: "Easily schedule, coordinate, and pay for all services directly through our secure platform.", icon: Lock, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                { title: "Transparent Pricing", description: "No hidden charges or surprise costs. See clear hourly or flat rates up front before you book.", icon: DollarSign, color: "bg-amber-50 text-amber-600 border-amber-100" },
                { title: "Fast Service", description: "Book instant same-day service or schedule weeks ahead. We respect your busy schedule.", icon: Clock, color: "bg-pink-50 text-pink-600 border-pink-100" },
                { title: "Ratings & Reviews", description: "Read verified feedback from genuine customers to hire the right provider for your project.", icon: Star, color: "bg-rose-50 text-rose-600 border-rose-100" },
                { title: "24/7 Support", description: "Our dedicated support team is available round the clock to help resolve any booking queries.", icon: HelpCircle, color: "bg-sky-50 text-sky-600 border-sky-100" }
              ].map((feature, idx) => {
                const IconComp = feature.icon;
                return (
                  <div key={idx} className="flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 bg-white">
                    <div className={`p-2.5 rounded-xl border self-start ${feature.color}`}>
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col gap-2">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Process Flow</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
              <p className="text-xs sm:text-sm text-slate-500">Book local experts in 4 simple steps.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Search Service", desc: "Select from cleaning, plumbing, electrical, lawn care, and more." },
                { step: "02", title: "Compare Providers", desc: "Browse portfolios, transparent pricing, ratings, and customer feedback." },
                { step: "03", title: "Book Online", desc: "Choose a convenient schedule, provide job details, and book securely." },
                { step: "04", title: "Get Work Done", desc: "Your pro arrives fully equipped to complete the job to your standards." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-3 text-center items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="bg-[#0F172A] text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_40%)] pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Book Your Next Service?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Find trusted professionals near you within minutes. Compare profiles, schedules, ratings, and book completely online.
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
