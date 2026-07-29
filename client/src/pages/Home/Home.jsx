import React from "react";
import MainLayout from "../../layouts/MainLayout";
import { Loader2 } from "lucide-react";
import { useHomeServices } from "@/hooks/useHomeServices";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProvidersSection } from "@/components/home/FeaturedProvidersSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export default function Home() {
  const { user, loading, displayProviders } = useHomeServices();

  if (!loading && user && (user.role === "PROVIDER" || user.role === "ADMIN")) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1F1D1A]" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeroSection user={user} />
      <CategoriesSection />
      <FeaturedProvidersSection providers={displayProviders} />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
    </MainLayout>
  );
}