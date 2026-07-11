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

        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 lg:py-28 bg-white border-b border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Text column */}
              <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
                  <Star className="h-3.5 w-3.5 fill-accent text-amber-500 animate-pulse" />
                  Trusted Local Service Marketplace
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  About <br />
                  <span className="text-slate-900 font-black">BookMyLocal</span>
                  <span className="text-amber-500 font-black">Service</span>
                </h1>

                <p className="text-lg sm:text-xl font-bold text-gray-800 border-l-4 border-amber-500 pl-4 leading-relaxed">
                  Connecting People With Trusted Local Professionals
                </p>

                <p className="text-base text-gray-500 leading-relaxed max-w-xl">
                  BookMyLocalService is India's premier neighborhood marketplace designed to help customers easily discover, compare, and instantly book verified local service providers. At the same time, we empower independent skilled professionals by providing them the tools and visibility they need to grow their businesses.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
                  <NavLink to="/services" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-12 bg-slate-900 hover:bg-slate-700 text-white rounded-xl px-8 font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      Browse Services
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </NavLink>
                  <NavLink to="/register?role=PROVIDER" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto h-12 border-gray-200 bg-white hover:bg-gray-50 text-gray-800 rounded-xl px-8 font-bold shadow-xs transition-all">
                      Become a Provider
                    </Button>
                  </NavLink>
                </div>
              </div>

              {/* Illustration / Photo Column */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-4 bg-amber-500/5 rounded-3xl blur-2xl opacity-50 -rotate-2"></div>
                <div className="relative border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xl aspect-4/3 sm:aspect-video lg:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                    alt="Premium Home Interior"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>

                  {/* Floating Micro-Badge */}
                  <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-gray-100 shadow-lg flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Background Checks</span>
                      <span className="text-xs font-extrabold text-gray-800">100% Verified Pros</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* Image Left */}
              <div className="lg:col-span-6 relative order-last lg:order-first">
                <div className="absolute -inset-4 bg-slate-900/5 rounded-3xl blur-2xl opacity-40 rotate-1"></div>
                <div className="relative border border-slate-200 rounded-3xl overflow-hidden shadow-lg aspect-4/3 sm:aspect-video lg:aspect-4/3 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                    alt="Service Provider Meeting Customer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Story Right */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Platform Genesis</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Our Story</h2>
                </div>
                <p className="text-base text-gray-500 leading-relaxed">
                  BookMyLocalService was born out of a simple, everyday struggle: finding reliable, skilled professionals to get work done around the house. Standard directories were flooded with outdated contact details, fake ratings, and pricing ambiguity. We saw an opportunity to bring order to this unstructured marketplace.
                </p>
                <p className="text-base text-gray-500 leading-relaxed">
                  By building a robust infrastructure grounded in strict identity verification, transparency, and consumer protection, we created a destination where customers can browse, review, and book confidently. Today, we're proud to serve thousands of families across the country while providing verified specialists with a steady source of income.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-lg">No Gimmicks</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Only direct bookings with Verified local pros</p>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-lg">Clear Pricing</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Clear upfront flat rates or hourly costs</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MISSION, VISION, VALUES */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Purpose Driven</span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Foundation</h2>
              <p className="text-gray-500">The core values and goals that guide our marketplace operations daily.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission Card */}
              <Card className="group border border-gray-100 bg-white rounded-2xl p-6 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl border border-slate-900/10 w-fit">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    To deliver reliable, high-quality local services to our customers' doorsteps with absolute transparency, safety, and booking convenience.
                  </p>
                </div>
              </Card>

              {/* Vision Card */}
              <Card className="group border border-gray-100 bg-white rounded-2xl p-6 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 w-fit">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    To become India's most trusted, secure, and customer-focused local services marketplace for households and commercial businesses.
                  </p>
                </div>
              </Card>

              {/* Values Card */}
              <Card className="group border border-gray-100 bg-white rounded-2xl p-6 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 w-fit">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Core Values</h3>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong>Trust:</strong> Complete provider identity and background checks.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong>Quality:</strong> Constantly auditing provider ratings.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong>Transparency:</strong> No hidden costs, up-front rates.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                      <strong>Satisfaction:</strong> Resolving disputes fast.
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US - Styled exactly like Home page why choose us */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Features</span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Why Choose BookMyLocalService</h2>
              <p className="text-gray-500">We make booking quality home and personal services safe, secure, and hassle-free.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <div key={idx} className="flex flex-col gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300 border border-transparent hover:border-gray-100">
                    <div className={`p-3 rounded-full border self-start ${feature.color}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PLATFORM STATISTICS */}
        <section className="py-16 bg-[#0F172A] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_45%)] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { count: "10,000+", label: "Happy Customers" },
                { count: "1,500+", label: "Verified Professionals" },
                { count: "30+", label: "Service Categories" },
                { count: "98%", label: "Customer Satisfaction" }
              ].map((stat, i) => (
                <div key={i} className="space-y-2 group">
                  <span className="block text-3xl sm:text-4xl lg:text-5xl font-black text-amber-500 group-hover:scale-105 transition-transform duration-300">{stat.count}</span>
                  <span className="block text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Process Flow</span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">How It Works</h2>
              <p className="text-gray-500">Book local experts in 4 simple, stress-free steps.</p>
            </div>

            <div className="relative">
              {/* Connecting horizontal line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gray-100 -translate-y-12 pointer-events-none"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { step: "01", title: "Search Service", desc: "Select from deep cleaning, plumbing, electricians, lawn care, wellness, and more." },
                  { step: "02", title: "Compare Providers", desc: "Browse portfolios, transparent pricing, background ratings, and feedback." },
                  { step: "03", title: "Book Online", desc: "Choose a convenient schedule, provide job details, and book securely." },
                  { step: "04", title: "Get Work Done", desc: "Your pro arrives fully equipped to complete the job to your high standards." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col gap-4 text-center items-center shadow-2xs hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm group-hover:bg-amber-500 transition-colors">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-base text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MEET OUR PLATFORM (STRENGTHS) */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Our Capabilities</span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Strengths</h2>
              <p className="text-gray-500">Engineered to bring security, velocity, and quality to local commerce.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Verified Providers", desc: "Continuous rating audits and verification updates protect community safety.", icon: Shield, color: "border-sky-100" },
                { title: "Smart Booking System", desc: "Matches service requests to provider availability constraints in real-time.", icon: Sliders, color: "border-pink-100" },
                { title: "Secure Payments", desc: "Payments are processed securely via encrypted gateways for your protection.", icon: Lock, color: "border-emerald-100" },
                { title: "Real Reviews", desc: "100% genuine reviews left by verified customers post-service completion.", icon: ThumbsUp, color: "border-amber-100" }
              ].map((strength, idx) => {
                const Icon = strength.icon;
                return (
                  <Card key={idx} className={`border bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-3xs hover:shadow-xs transition-shadow ${strength.color}`}>
                    <div className="p-2 bg-slate-50 text-slate-700 rounded-lg w-fit">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base">{strength.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{strength.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CUSTOMER TRUST BADGES */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-slate-400">
              {[
                { label: "Verified Reviews", icon: Sparkle },
                { label: "Background Checked Providers", icon: ShieldCheck },
                { label: "Secure Transactions", icon: Lock },
                { label: "Fast Support", icon: Clock }
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors cursor-default">
                    <Icon className="h-4.5 w-4.5 text-amber-500" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
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
