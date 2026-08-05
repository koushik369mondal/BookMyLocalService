import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { servicesService } from "../services/servicesService";
import { categoriesService } from "../services/categoriesService";
import { getCategoryIconComponent } from "@/utils/categoryIconMap";
import { formatPrice } from "@/utils/currency";

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
          categoriesService.getCategories()
        ]);

        if (servRes.success && servRes.data) {
          setDbServices(servRes.data);
        }

        if (catRes.success && catRes.data) {
          const mappedCats = catRes.data.map((c) => {
            const Icon = getCategoryIconComponent(c.icon);
            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              count: `${c.serviceCount || 0} Service${c.serviceCount === 1 ? "" : "s"}`,
              icon: Icon,
              image: c.imageUrl
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

  const displayProviders = dbServices.slice(0, 6).map((service) => {
    const catName = typeof service.category === "object" ? (service.category?.name || "General") : (service.category || "General");
    const providerAvatar = service.provider?.avatar || service.provider?.profileImage || "";
    const providerFullName = service.provider?.fullName || "Verified Professional";

    return {
      id: service.id,
      title: service.title,
      name: service.title,
      providerName: providerFullName,
      avatar: providerAvatar,
      providerImage: providerAvatar,
      providerProfileImage: providerAvatar,
      service: catName,
      rating: service.rating || 5.0,
      reviews: service.reviewCount || 0,
      reviewCount: service.reviewCount || 0,
      location: service.location || "Local Service Area",
      price: formatPrice(service.price, { priceType: service.priceType }),
      image: service.imageUrl,
      imageUrl: service.imageUrl,
      badge: service.badge || "Verified Pro",
      isVerified: service.provider?.isVerified ?? true,
      slug: service.slug,
      priceNum: service.price,
      priceType: service.priceType,
      category: catName,
      availability: service.availability,
      provider: {
        ...service.provider,
        avatar: providerAvatar,
        profileImage: providerAvatar
      }
    };
  });

  return {
    user,
    loading,
    isLoading,
    displayProviders,
    categories: dbCategories
  };
}
