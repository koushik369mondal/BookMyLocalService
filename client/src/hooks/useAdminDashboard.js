import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import { adminService } from "../services/adminService";

export function useAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [unverifiedProviders, setUnverifiedProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await dashboardService.getAdminDashboard();
      if (response.success && response.data) {
        setStats(response.data.stats || {});
        setRecentUsers(response.data.recentUsers || []);
        setRecentBookings(response.data.recentBookings || []);
        setUnverifiedProviders(response.data.unverifiedProviders || []);
      } else {
        setError(response.message || "Failed to load dashboard metrics.");
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError(err.message || "Failed to fetch admin dashboard metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprovalAction = async (providerId, action) => {
    try {
      const isVerified = action === "approve";
      await adminService.verifyProvider(providerId, isVerified);
      setUnverifiedProviders(prev => prev.filter(p => p.id !== providerId));
      setActionSuccessMsg(`Provider ${isVerified ? "approved" : "rejected"} successfully.`);
      setTimeout(() => setActionSuccessMsg(""), 3000);
      fetchDashboardData();
    } catch (err) {
      console.error("Approval action error:", err);
      alert(err.message || "Failed to update provider approval status.");
    }
  };

  return {
    stats,
    recentUsers,
    recentBookings,
    unverifiedProviders,
    isLoading,
    error,
    actionSuccessMsg,
    handleApprovalAction,
    refetch: fetchDashboardData
  };
}
