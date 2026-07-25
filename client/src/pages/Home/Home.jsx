import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
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
import { ServiceCard } from "@/components/ui/ServiceCard";
import { servicesService } from "../../services/api";
import {
  fadeInUp,
  staggerContainer,
  buttonMotionProps,
  floatMotionProps
} from "@/utils/motion";

// Category list
const categories = [
  { name: "Home Cleaning", icon: Paintbrush, count: "120+ Providers", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Plumbing", icon: Droplet, count: "80+ Providers", color: "bg-[#8C4B3E]/5 text-[#1F1D1A] border-violet-950/10" },
  { name: "Electrical", icon: Zap, count: "95+ Providers", color: "bg-amber-50 text-[#8C4B3E] border-amber-100" },
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
    color: "bg-[#8C4B3E]/5 text-[#1F1D1A] border-violet-950/10"
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges or surprise costs. See clear hourly or flat rates up front before you book.",
    icon: CircleDollarSign,
    color: "bg-amber-50 text-[#8C4B3E] border-amber-100"
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
  const { user } = useAuth();
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
      <div className="bg-[#FAF6F0] min-h-screen">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28 bg-[#FAF6F0]">
          <div className="absolute inset-0 bg-linear-to-b from-violet-950/5 to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

              {/* Left Column (Hero Copy) */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer(0.1, 0.05)}
                className="lg:col-span-7 flex flex-col gap-6 sm:gap-8 text-center lg:text-left"
              >
                <motion.div variants={fadeInUp}>
                  <span className="inline-flex items-center gap-2 self-center lg:self-start bg-[#C9A46A]/20 text-[#8C4B3E] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-[#C9A46A]/40 shadow-xs transition-transform hover:scale-105 duration-200">
                    <Star className="h-3.5 w-3.5 fill-accent text-[#C9A46A]" /> Verified Local Professionals
                  </span>
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black tracking-tight text-[#1F1D1A] leading-[1.15] lg:leading-[1.12]">
                  Your Trusted Partner for <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Local Services</span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-[#5A5146] font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Book home cleaning, plumbing, electrical tasks, and more instantly. Enjoy Verified local experts and clear upfront pricing.
                </motion.p>

                {/* Hero CTA buttons */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-1 sm:pt-2">
                  <NavLink to="/services" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-[#8C4B3E] hover:bg-[#7A3E32] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:shadow-2xs px-8 h-12 sm:h-[48px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base">
                      Book a Service
                    </Button>
                  </NavLink>
                  <NavLink 
                    to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/provider/dashboard'} 
                    className="w-full sm:w-auto"
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#E8DCC3] hover:border-[#C9A46A] hover:bg-white hover:text-[#1F1D1A] text-[#8C4B3E] font-semibold rounded-xl px-8 h-12 sm:h-[48px] shadow-2xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base cursor-pointer">
                      {user?.role === 'PROVIDER' ? 'Provider Dashboard' : (user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Become a Provider')}
                    </Button>
                  </NavLink>
                </motion.div>

                {/* SEARCH SECTION */}
                <motion.div variants={fadeInUp} className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-2xs border border-[#5A5146]/20 max-w-2xl lg:max-w-3xl mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-center w-full">
                  <div className="relative w-full flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7A7266] pointer-events-none" />
                    <Input
                      placeholder="Your location..."
                      className="pl-11 h-14 bg-[#FAF6F0]/80 border-[#5A5146]/20 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500 rounded-2xl text-sm font-medium text-[#1F1D1A] placeholder:text-[#7A7266] transition-all duration-200"
                    />
                  </div>
                  <div className="relative w-full flex-grow-[1.4]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7A7266] pointer-events-none" />
                    <Input
                      placeholder="What service do you need?"
                      className="pl-11 h-14 bg-[#FAF6F0]/80 border-[#5A5146]/20 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500 rounded-2xl text-sm font-medium text-[#1F1D1A] placeholder:text-[#7A7266] transition-all duration-200"
                    />
                  </div>
                  <Button className="w-full sm:w-auto h-14 bg-[#8C4B3E] hover:bg-[#7A3E32] text-white font-bold rounded-2xl px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base shrink-0">
                    <Search className="h-4.5 w-4.5" />
                    <span>Search</span>
                  </Button>
                </motion.div>

              </motion.div>

              {/* Right Column (Hero Graphic with Framer Motion) */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="absolute -inset-4 bg-[#E8DCC3]/40 rounded-full filter blur-2xl opacity-60 scale-95 animate-pulse pointer-events-none"></div>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-full flex justify-center lg:justify-end"
                >
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                    alt="Cleaning Service Professional"
                    className="rounded-3xl shadow-xl w-full max-w-lg lg:max-w-xl object-cover aspect-4/3 border-4 border-white"
                  />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer(0.08)}
          className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1D1A] tracking-tight leading-tight">Explore Popular Categories</h2>
            <p className="text-base text-[#5A5146] font-normal leading-relaxed">Find Verified professionals for your exact local service requirements.</p>
          </motion.div>

          <motion.div variants={staggerContainer(0.06)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card
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
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-16 md:py-20 bg-linear-to-b from-white to-stone-50 border-y border-gray-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">How It Works</h2>
              <p className="text-gray-500">Book local services online in three easy, transparent steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col gap-4 text-center group px-4">
                  <span className="text-6xl font-extrabold text-stone-200 group-hover:text-[#C9A46A] transition-colors select-none duration-300">
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
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1D1A] tracking-tight leading-tight">Featured Service Providers</h2>
              <p className="text-base text-[#5A5146] font-normal leading-relaxed">Top-rated and verified local specialists in your neighbourhood.</p>
            </div>
            <NavLink to="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-[#1F1D1A] hover:text-[#C9A46A] transition-colors">
              View All Providers <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProviders.map((provider, idx) => (
              <ServiceCard
                key={provider.id || idx}
                service={{
                  id: provider.id,
                  name: provider.service || provider.name,
                  category: provider.service || "Local Service",
                  providerName: provider.name,
                  providerImage: provider.image,
                  location: provider.location,
                  rating: provider.rating,
                  reviewsCount: provider.reviews,
                  price: parseFloat(String(provider.price).replace(/[^0-9.]/g, '')) || 35,
                  priceType: String(provider.price).includes("/hr") ? "/hr" : "/service",
                  image: provider.image,
                  badge: provider.badge
                }}
                ctaText="Book Now"
                ctaLink={provider.id ? `/booking?serviceId=${provider.id}` : "/booking"}
              />
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
                  <div key={idx} className="flex flex-col gap-4 p-5 rounded-2xl hover:bg-[#FAF6F0] transition-colors duration-300 border border-transparent hover:border-gray-100">
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
                  <div className="text-[#C9A46A]">
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
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-[#8C4B3E]" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}