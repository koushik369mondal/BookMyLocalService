import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Search,
  Paintbrush,
  Droplet,
  Zap,
  Truck,
  Flower2,
  Heart,
  Star,
  ShieldAlert,
  CircleDollarSign,
  Smile,
  CalendarCheck,
  ArrowRight,
  Quote
} from "lucide-react";
import { servicesService } from "../../services/api";

// Category list
const categories = [
  { name: "Home Cleaning", icon: Paintbrush, count: "120+ Providers", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Plumbing", icon: Droplet, count: "80+ Providers", color: "bg-primary/5 text-primary border-primary/10" },
  { name: "Electrical", icon: Zap, count: "95+ Providers", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Moving & Packing", icon: Truck, count: "60+ Providers", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "Lawn & Garden", icon: Flower2, count: "75+ Providers", color: "bg-lime-50 text-lime-600 border-lime-100" },
  { name: "Wellness & Personal", icon: Heart, count: "110+ Providers", color: "bg-rose-50 text-rose-600 border-rose-100" },
];

// Featured Providers list
const providers = [
  {
    name: "Sarah Jenkins",
    service: "Professional Cleaning",
    rating: 4.9,
    reviews: 142,
    location: "Brooklyn, NY",
    price: "$35/hr",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80",
    badge: "Top Rated"
  },
  {
    name: "David Miller",
    service: "Expert Plumbing",
    rating: 4.8,
    reviews: 98,
    location: "Queens, NY",
    price: "$50/hr",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    badge: "Verified"
  },
  {
    name: "Marcus Vance",
    service: "Licensed Electrician",
    rating: 4.9,
    reviews: 115,
    location: "Manhattan, NY",
    price: "$65/hr",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    badge: "Top Rated"
  },
];

// How it works steps
const steps = [
  {
    step: "01",
    title: "Select a Service",
    description: "Choose from our wide variety of local services ranging from home cleaning to expert plumbing."
  },
  {
    step: "02",
    title: "Choose Your Pro",
    description: "Compare Verified providers based on verified reviews, transparent pricing, and scheduling."
  },
  {
    step: "03",
    title: "Relax & Enjoy",
    description: "Book instantly, communicate in real-time, and get your service completed to perfection."
  }
];

// Why choose us features
const features = [
  {
    title: "Verified Professionals",
    description: "Every service provider is background-checked and identity-verified to ensure absolute safety and quality.",
    icon: ShieldAlert,
    color: "bg-primary/5 text-primary border-primary/10"
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges or surprise costs. See clear hourly or flat rates up front before you book.",
    icon: CircleDollarSign,
    color: "bg-amber-50 text-amber-600 border-amber-100"
  },
  {
    title: "Happiness Guarantee",
    description: "Not satisfied with the service? We work with you to make it right, backed by our booking support team.",
    icon: Smile,
    color: "bg-emerald-50 text-emerald-600 border-emerald-105"
  },
  {
    title: "Instant Booking",
    description: "Easily schedule, coordinate, and pay for all services directly through our secure platform.",
    icon: CalendarCheck,
    color: "bg-rose-50 text-rose-600 border-rose-100"
  }
];

// Testimonials list
const testimonials = [
  {
    quote: "BookMyLocalService has completely changed how I manage chores. I booked a deep cleaning service, and the professional was punctual, efficient, and extremely friendly!",
    author: "Jessica Alba",
    role: "Homeowner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5
  },
  {
    quote: "Finding an electrician used to take days of phone calls. Here, I found a verified expert within minutes and got my home wiring issues resolved the very next day.",
    author: "Robert Chen",
    role: "Apartment Tenant",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5
  },
  {
    quote: "As a service provider, this platform has helped me build a steady stream of local clients. The billing is transparent, and customer coordination is seamless.",
    author: "Elena Rostov",
    role: "Cleaning Agency Owner",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5
  }
];

export default function Home() {
  const [dbServices, setDbServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesService.getServices();
        if (response.success && response.data) {
          setDbServices(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch services in Home component:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Map database services if available, fallback to mock providers
  const displayProviders = dbServices.length > 0
    ? dbServices.slice(0, 3).map(service => ({
      id: service.id,
      name: service.provider?.fullName || "Verified Provider",
      service: service.category || service.title,
      rating: service.rating,
      reviews: service.reviewCount,
      location: service.location,
      price: `$${service.price}${service.priceType}`,
      image: service.imageUrl,
      badge: service.badge
    }))
    : providers;

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 lg:py-24 bg-background">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Left Column (Hero Copy) */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 self-center lg:self-start bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full border border-accent/20">
                  <Star className="h-3 w-3 fill-accent text-accent" /> Verified Local Professionals
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text leading-tight">
                  Your Trusted Partner for <span className="text-accent">Local Services</span>
                </h1>
                <p className="text-lg text-secondary max-w-2xl mx-auto lg:mx-0">
                  Book home cleaning, plumbing, electrical tasks, and more instantly. Enjoy Verified local experts and clear upfront pricing.
                </p>

                {/* Hero CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-2">
                  <NavLink to="/services" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-secondary text-white rounded-full font-semibold shadow-md px-8 h-12 transition-transform hover:scale-[1.02]">
                      Book a Service
                    </Button>
                  </NavLink>
                  <NavLink to="/provider/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-card hover:text-primary rounded-full font-semibold px-8 h-12">
                      Become a Provider
                    </Button>
                  </NavLink>
                </div>

                {/* SEARCH SECTION */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-border max-w-2xl mt-6 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative w-full flex-1">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary" />
                    <Input placeholder="Your location..." className="pl-10 h-11 border-border focus-visible:ring-primary rounded-xl bg-white" />
                  </div>
                  <div className="relative w-full flex-grow-[1.5]">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary" />
                    <Input placeholder="What service do you need?" className="pl-10 h-11 border-border focus-visible:ring-primary rounded-xl bg-white" />
                  </div>
                  <Button className="w-full sm:w-auto h-11 bg-primary hover:bg-secondary text-white rounded-xl px-8 shadow-xs transition-all">
                    Search
                  </Button>
                </div>

              </div>

              {/* Right Column (Hero Graphic) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="absolute -inset-4 bg-primary/10 rounded-full filter blur-2xl opacity-50 scale-95 animate-pulse pointer-events-none"></div>
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
                  alt="Cleaning Service Professional"
                  className="rounded-3xl shadow-2xl w-full max-w-md object-cover aspect-4/3 relative z-10 border-4 border-white"
                />
              </div>

            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES SECTION */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Popular Categories</h2>
            <p className="text-gray-500">Find Verified professionals for your exact local service requirements.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Card
                  key={idx}
                  className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 bg-white p-0 py-0 gap-0 flex flex-col items-center justify-center text-center group h-48"
                >
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    <div className={`p-3 rounded-full border ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-950 text-sm">{cat.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-16 md:py-20 bg-linear-to-b from-white to-slate-50 border-y border-gray-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">How It Works</h2>
              <p className="text-gray-500">Book local services online in three easy, transparent steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col gap-4 text-center group px-4">
                  <span className="text-6xl font-extrabold text-border group-hover:text-accent transition-colors select-none duration-300">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 mt-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PROVIDERS SECTION */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Featured Service Providers</h2>
              <p className="text-gray-500">Top-rated and verified local specialists in your neighbourhood.</p>
            </div>
            <NavLink to="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors">
              View All Providers <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProviders.map((provider, idx) => (
              <Card key={idx} className="overflow-hidden p-0 py-0 gap-0 hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full bg-card">
                <div className="relative">
                  <img src={provider.image} alt={provider.name} className="h-48 w-full object-cover" />
                  {provider.badge && (
                    <span className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {provider.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">{provider.service}</h4>
                    <h3 className="font-bold text-text text-lg mt-1">{provider.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-secondary">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-bold text-text text-sm">{provider.rating}</span>
                      <span className="text-secondary text-xs">({provider.reviews})</span>
                    </div>
                    <span className="font-bold text-text text-sm">{provider.price}</span>
                  </div>
                  <NavLink to={provider.id ? `/booking?serviceId=${provider.id}` : "/booking"} className="w-full">
                    <Button className="w-full bg-primary hover:bg-secondary text-white rounded-xl h-10 mt-1 shadow-xs">
                      Book Now
                    </Button>
                  </NavLink>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-16 md:py-20 bg-white border-y border-gray-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Why Choose BookMyLocalService</h2>
              <p className="text-gray-500">We make booking quality home and personal services safe, secure, and hassle-free.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => {
                const IconComp = feature.icon;
                return (
                  <div key={idx} className="flex flex-col gap-4 p-5 rounded-2xl hover:bg-slate-50 transition-colors duration-300 border border-transparent hover:border-gray-100">
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

        {/* TESTIMONIALS SECTION */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">What Our Customers Say</h2>
            <p className="text-gray-500">Hear from homeowners and service providers using our local service network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <Card key={idx} className="bg-white hover:shadow-md transition-shadow border border-gray-100 flex flex-col p-0 py-0 gap-0 justify-between h-full">
                <CardContent className="p-6 flex flex-col gap-6">
                  <div className="text-accent">
                    <Quote className="h-8 w-8 fill-current opacity-20" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{test.quote}"
                  </p>

                  {/* Testimonial Author details */}
                  <div className="flex items-center gap-3 border-t border-gray-50 pt-4 mt-auto">
                    <img
                      src={test.avatar}
                      alt={test.author}
                      className="h-10 w-10 rounded-full object-cover border border-gray-150"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-950">{test.author}</h4>
                      <p className="text-xs text-gray-400">{test.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl text-white py-12 px-6 sm:px-12 md:py-16 md:px-20 text-center relative overflow-hidden shadow-xl border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)] pointer-events-none"></div>
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to get your tasks completed?</h2>
              <p className="text-slate-300 text-lg md:text-xl">
                Book professional local services in seconds or sign up as a provider to start growing your local business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
                <NavLink to="/services">
                  <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary font-bold rounded-full shadow-md px-8 h-12 transition-transform hover:scale-[1.02]">
                    Book a Service
                  </Button>
                </NavLink>
                <NavLink to="/provider/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 hover:bg-white/10 text-white rounded-full font-semibold px-8 h-12">
                    Become a Provider
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}