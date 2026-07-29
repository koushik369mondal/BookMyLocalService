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

export const fallbackProviders = [
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

export const testimonials = [
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
