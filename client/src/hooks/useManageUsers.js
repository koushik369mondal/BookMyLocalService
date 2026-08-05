import { useState, useEffect, useMemo } from "react";
import { adminService } from "../services/adminService";

export function useManageUsers() {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminService.getUsers({
        role: roleFilter,
        search: searchQuery
      });
      if (response.success && response.data) {
        setUsersList(response.data);
      } else {
        setError(response.message || "Failed to load users.");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message || "Failed to fetch users from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchUsers();
  }, [roleFilter, searchQuery]);

  const handleDeleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsersList(prev => prev.filter(u => u.id !== id));
      setSuccessMsg("User deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.message || "Failed to delete user.");
    }
  };

  const filteredUsers = useMemo(() => {
    return usersList;
  }, [usersList]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  return {
    usersList,
    filteredUsers,
    paginatedUsers,
    isLoading,
    error,
    successMsg,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDeleteUser,
    refetch: fetchUsers
  };
}
