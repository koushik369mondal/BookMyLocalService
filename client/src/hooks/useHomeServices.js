import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { servicesService } from "../services/servicesService";
import { formatPrice } from "@/utils/currency";

export function useHomeServices() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dbServices, setDbServices] = useState([]);
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

  const displayProviders = dbServices.slice(0, 6).map(service => ({
    id: service.id,
    name: service.provider?.fullName || "Verified Provider",
    service: service.category || service.title,
    rating: service.rating || 5.0,
    reviews: service.reviewCount || 0,
    location: service.location || "Local Service Area",
    price: formatPrice(service.price, { priceType: service.priceType }),
    image: service.imageUrl,
    badge: service.badge || "Verified",
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
    displayProviders
  };
}
