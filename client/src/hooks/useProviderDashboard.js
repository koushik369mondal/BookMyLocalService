import { useState, useEffect } from "react";
import { providerService } from "../services/providerService";

export function useProviderDashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    completedJobs: 0,
    pendingJobs: 0,
    monthlyRevenue: 0,
    totalEarnings: 0,
    averageRating: 5.0
  });
  const [services, setServices] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProviderDashboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await providerService.getDashboard();
      if (response.success && response.data) {
        setStats({
          totalServices: response.data.totalServices || 0,
          activeServices: response.data.activeServices || 0,
          totalBookings: response.data.totalBookings || 0,
          completedJobs: response.data.completedJobs || 0,
          pendingJobs: response.data.pendingJobs || 0,
          monthlyRevenue: response.data.monthlyRevenue || 0,
          totalEarnings: response.data.totalEarnings || 0,
          averageRating: response.data.averageRating || 5.0
        });
        setServices(response.data.services || []);
        setRecentBookings(response.data.recentBookings || []);
      } else {
        setError(response.message || "Failed to load provider metrics.");
      }
    } catch (err) {
      console.error("Provider dashboard fetch error:", err);
      setError(err.message || "Failed to fetch provider dashboard metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderDashboard();
  }, []);

  return {
    stats,
    services,
    recentBookings,
    isLoading,
    error,
    refetch: fetchProviderDashboard
  };
}
