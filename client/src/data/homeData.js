import {
  Paintbrush,
  Droplet,
  Zap,
  Truck,
  Flower2,
  Heart,
  ShieldAlert,
  CircleDollarSign,
  Smile,
  CalendarCheck
} from "lucide-react";

export const categories = [
  { name: "Home Cleaning", icon: Paintbrush, count: "120+ Providers", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Plumbing", icon: Droplet, count: "80+ Providers", color: "bg-[#8C4B3E]/5 text-[#1F1D1A] border-violet-950/10" },
  { name: "Electrical", icon: Zap, count: "95+ Providers", color: "bg-amber-50 text-[#8C4B3E] border-amber-100" },
  { name: "Moving & Packing", icon: Truck, count: "60+ Providers", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "Lawn & Garden", icon: Flower2, count: "75+ Providers", color: "bg-lime-50 text-lime-600 border-lime-100" },
  { name: "Wellness & Personal", icon: Heart, count: "110+ Providers", color: "bg-rose-50 text-rose-600 border-rose-100" },
];

export const steps = [
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

export const features = [
  {
    title: "Verified Professionals",
    description: "Every service provider is background-checked and identity-verified to ensure absolute safety and quality.",
    icon: ShieldAlert,
    color: "bg-[#8C4B3E]/5 text-[#1F1D1A] border-violet-950/10"
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges or surprise costs. See clear flat rates in ₹ (INR) up front before you book.",
    icon: CircleDollarSign,
    color: "bg-amber-50 text-[#8C4B3E] border-amber-100"
  },
  {
    title: "Happiness Guarantee",
    description: "Not satisfied with the service? We work with you to make it right, backed by our booking support team.",
    icon: Smile,
    color: "bg-emerald-50 text-emerald-605"
  },
  {
    title: "Instant Booking",
    description: "Easily schedule, coordinate, and pay for all services directly through our secure platform.",
    icon: CalendarCheck,
    color: "bg-rose-50 text-rose-600 border-rose-100"
  }
];

export const testimonials = [
  {
    quote: "BookMyLocalService has completely changed how I manage household services in Kolkata. I booked deep cleaning, and the team was punctual, thorough, and polite!",
    author: "Ananya Sen",
    role: "Homeowner, Kolkata",
    avatar: "",
    rating: 5
  },
  {
    quote: "Finding an electrician in Delhi used to take hours of searching. Here, I booked an expert in 2 minutes and got our AC circuit issue fixed on the same day.",
    author: "Rahul Chatterjee",
    role: "Apartment Owner, Delhi NCR",
    avatar: "",
    rating: 5
  },
  {
    quote: "As a local service provider in Bengaluru, this platform has helped me build a steady stream of satisfied local customers with transparent UPI payouts.",
    author: "Deepak Kumar",
    role: "Garden & Lawn Care Owner",
    avatar: "",
    rating: 5
  }
];
