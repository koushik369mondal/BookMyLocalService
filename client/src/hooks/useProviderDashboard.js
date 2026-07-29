import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";

export function useProviderDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalEarnings: 0
  });
  const [services, setServices] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProviderDashboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await dashboardService.getProviderDashboard();
      if (response.success && response.data) {
        setStats({
          totalJobs: response.data.totalJobs || 0,
          completedJobs: response.data.completedJobs || 0,
          pendingJobs: response.data.pendingJobs || 0,
          totalEarnings: response.data.totalEarnings || 0
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
