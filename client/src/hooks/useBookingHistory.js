import { useState, useEffect, useMemo } from "react";
import { bookingsService } from "../services/bookingsService";

export function useBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await bookingsService.getBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.message || "Failed to load booking history.");
      }
    } catch (err) {
      console.error("Booking history fetch error:", err);
      setError(err.message || "Failed to load bookings from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    try {
      await bookingsService.updateBooking(id, { status: "cancelled" });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(err.message || "Failed to cancel booking.");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (activeStatus !== "all" && booking.status !== activeStatus) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const serviceTitle = booking.service?.title?.toLowerCase() || "";
        const providerName = booking.provider?.fullName?.toLowerCase() || "";
        const id = booking.id.toLowerCase();
        if (!serviceTitle.includes(q) && !providerName.includes(q) && !id.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, activeStatus, searchQuery]);

  return {
    bookings,
    filteredBookings,
    isLoading,
    error,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    handleCancelBooking,
    refetch: fetchBookings
  };
}
