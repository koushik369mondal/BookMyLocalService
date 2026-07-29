import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";

export function useCustomerDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    activeBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomerDashboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await dashboardService.getCustomerDashboard();
      if (response.success && response.data) {
        setStats({
          totalBookings: response.data.totalBookings || 0,
          completedBookings: response.data.completedBookings || 0,
          pendingBookings: response.data.pendingBookings || 0,
          activeBookings: response.data.activeBookings || 0
        });
        setRecentBookings(response.data.recentBookings || []);
      } else {
        setError(response.message || "Failed to load customer metrics.");
      }
    } catch (err) {
      console.error("Customer dashboard fetch error:", err);
      setError(err.message || "Failed to fetch customer dashboard metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDashboard();
  }, []);

  return {
    stats,
    recentBookings,
    isLoading,
    error,
    refetch: fetchCustomerDashboard
  };
}
