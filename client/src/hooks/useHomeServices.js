import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { servicesService } from "../services/servicesService";
import { formatPrice } from "@/utils/currency";
import {
  Paintbrush,
  Droplet,
  Zap,
  Truck,
  Flower2,
  Heart,
  Wrench
} from "lucide-react";

const categoryIconMap = {
  "Home Cleaning": { icon: Paintbrush, color: "bg-pink-50 text-pink-600 border-pink-100" },
  "Plumbing": { icon: Droplet, color: "bg-[#8C4B3E]/5 text-[#1F1D1A] border-violet-950/10" },
  "Electrical": { icon: Zap, color: "bg-amber-50 text-[#8C4B3E] border-amber-100" },
  "Moving & Packing": { icon: Truck, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  "Lawn & Garden": { icon: Flower2, color: "bg-lime-50 text-lime-600 border-lime-100" },
  "Wellness & Personal": { icon: Heart, color: "bg-rose-50 text-rose-600 border-rose-100" }
};

export function useHomeServices() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dbServices, setDbServices] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "PROVIDER") {
        navigate("/provider/dashboard", { replace: true });
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [servRes, catRes] = await Promise.all([
          servicesService.getServices(),
          servicesService.getCategories()
        ]);

        if (servRes.success && servRes.data) {
          setDbServices(servRes.data);
        }

        if (catRes.success && catRes.data) {
          const mappedCats = catRes.data.map((c) => {
            const config = categoryIconMap[c.name] || {
              icon: Wrench,
              color: "bg-amber-50 text-[#8C4B3E] border-amber-100"
            };
            return {
              name: c.name,
              count: `${c.count} Service${c.count === 1 ? "" : "s"}`,
              icon: config.icon,
              color: config.color,
              image: c.image
            };
          });
          setDbCategories(mappedCats);
        }
      } catch (err) {
        console.error("Failed to fetch home services/categories from database:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayProviders = dbServices.slice(0, 6).map((service) => ({
    id: service.id,
    name: service.provider?.fullName || "Verified Professional",
    providerName: service.provider?.fullName || "Verified Professional",
    avatar: service.provider?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    service: service.category || service.title,
    rating: service.rating || 5.0,
    reviews: service.reviewCount || 0,
    reviewCount: service.reviewCount || 0,
    location: service.location || "Local Service Area",
    price: formatPrice(service.price, { priceType: service.priceType }),
    image: service.imageUrl,
    badge: service.badge || "Verified Pro",
    isVerified: service.provider?.isVerified ?? true,
    title: service.title,
    slug: service.slug,
    priceNum: service.price,
    priceType: service.priceType,
    category: service.category,
    availability: service.availability
  }));

  return {
    user,
    loading,
    isLoading,
    displayProviders,
    categories: dbCategories
  };
}
