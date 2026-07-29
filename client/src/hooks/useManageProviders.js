import { useState, useEffect, useMemo } from "react";
import { adminService } from "../services/adminService";

export function useManageProviders() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const fetchProviders = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminService.getProviders({ search: searchQuery });
      if (response.success && response.data) {
        setProviders(response.data);
      } else {
        setError(response.message || "Failed to load providers.");
      }
    } catch (err) {
      console.error("Fetch providers error:", err);
      setError(err.message || "Failed to fetch providers from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [searchQuery]);

  const handleVerifyProvider = async (id, isVerified) => {
    try {
      await adminService.verifyProvider(id, isVerified);
      setProviders(prev => prev.map(p => p.id === id ? { ...p, isVerified } : p));
      setSuccessMsg(`Provider verification status updated!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Verify provider error:", err);
      alert(err.message || "Failed to update verification status.");
    }
  };

  return {
    providers,
    isLoading,
    error,
    successMsg,
    searchQuery,
    setSearchQuery,
    handleVerifyProvider,
    refetch: fetchProviders
  };
}
