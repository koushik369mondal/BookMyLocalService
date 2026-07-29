import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const contactInfoCards = [
  { title: "Office Address", detail: "123 Business Hub, Sector 62, Noida, UP, India", icon: MapPin, color: "bg-[#8C4B3E]/5 text-[#1F1D1A] border-violet-950/10" },
  { title: "Phone Number", detail: "+91 120 456 7890\n+91 98765 43210", icon: Phone, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { title: "Email Address", detail: "support@bookmylocal.com\ninfo@bookmylocal.com", icon: Mail, color: "bg-amber-50 text-[#8C4B3E] border-amber-100" },
  { title: "Business Hours", detail: "Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed", icon: Clock, color: "bg-pink-50 text-pink-600 border-pink-100" }
];

export const faqs = [
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
