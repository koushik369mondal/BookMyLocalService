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
  { name: "Home Cleaning", icon: Paintbrush, count: "120+ Providers", color: "bg-white/5 text-neutral-300 border-white/10" },
  { name: "Plumbing", icon: Droplet, count: "80+ Providers", color: "bg-white/5 text-neutral-300 border-white/10" },
  { name: "Electrical", icon: Zap, count: "95+ Providers", color: "bg-white/5 text-neutral-300 border-white/10" },
  { name: "Moving & Packing", icon: Truck, count: "60+ Providers", color: "bg-white/5 text-neutral-300 border-white/10" },
  { name: "Lawn & Garden", icon: Flower2, count: "75+ Providers", color: "bg-white/5 text-neutral-300 border-white/10" },
  { name: "Wellness & Personal", icon: Heart, count: "110+ Providers", color: "bg-white/5 text-neutral-300 border-white/10" },
];

export const steps = [
  {
    step: "01",
    title: "Select a service",
    description: "Choose from our wide variety of local services ranging from home cleaning to expert plumbing."
  },
  {
    step: "02",
    title: "Choose your pro",
    description: "Compare verified providers based on authentic reviews, transparent pricing, and scheduling."
  },
  {
    step: "03",
    title: "Relax and enjoy",
    description: "Book instantly, communicate in real-time, and get your service completed to perfection."
  }
];

export const features = [
  {
    title: "Verified professionals",
    description: "Every service provider is background-checked and identity-verified to ensure absolute safety and quality.",
    icon: ShieldAlert,
    color: "bg-white/5 text-neutral-300 border-white/10"
  },
  {
    title: "Transparent pricing",
    description: "No hidden charges or surprise costs. See clear flat rates in ₹ (INR) up front before you book.",
    icon: CircleDollarSign,
    color: "bg-white/5 text-neutral-300 border-white/10"
  },
  {
    title: "Happiness guarantee",
    description: "Not satisfied with the service? We work with you to make it right, backed by our booking support team.",
    icon: Smile,
    color: "bg-white/5 text-neutral-300 border-white/10"
  },
  {
    title: "Instant booking",
    description: "Easily schedule, coordinate, and pay for all services directly through our secure platform.",
    icon: CalendarCheck,
    color: "bg-white/5 text-neutral-300 border-white/10"
  }
];

