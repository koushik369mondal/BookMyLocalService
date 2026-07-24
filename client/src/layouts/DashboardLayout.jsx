import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import MainLayout from "./MainLayout";
import CustomerSidebar from "../components/navigation/CustomerSidebar";
import ProviderSidebar from "../components/navigation/ProviderSidebar";
import AdminSidebar from "../components/navigation/AdminSidebar";
import { Menu, X, PanelLeftClose, PanelLeft, Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1F1D1A]" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render correct sidebar based on role
  const renderSidebar = (collapsed = false) => {
    switch (user.role) {
      case "ADMIN":
        return <AdminSidebar collapsed={collapsed} />;
      case "PROVIDER":
        return <ProviderSidebar collapsed={collapsed} />;
      default:
        return <CustomerSidebar collapsed={collapsed} />;
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-4rem)] bg-[#FAF6F0] font-sans relative">
        
        {/* Desktop Sidebar (Sticky under main navbar) */}
        <aside 
          className={`hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 shrink-0 z-35 ${
            isCollapsed ? "w-20" : "w-64 lg:w-72"
          }`}
        >
          <div className="relative h-full flex flex-col">
            {renderSidebar(isCollapsed)}

            {/* Collapse toggle button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3.5 top-20 bg-[#FAF6F0] border border-[#E8DCC3] text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#F0E7D5] shadow-2xs h-7 w-7 rounded-full flex items-center justify-center z-40 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Drawer Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 z-45 bg-[#1F1D1A]/40 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer Panel */}
        <aside 
          className={`fixed top-16 left-0 bottom-0 z-50 w-72 bg-[#F0E7D5] border-r border-[#E8DCC3] transform transition-transform duration-300 md:hidden flex flex-col ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button Inside Drawer */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute right-4 top-4 text-[#7A7266] hover:text-[#1F1D1A] p-1.5 z-55"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="h-full pt-6">
            {renderSidebar(false)}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-full pb-16">
          
          {/* Mobile Navigation Header Bar */}
          <div className="md:hidden flex items-center bg-[#F0E7D5] border-b border-[#E8DCC3] px-4 py-3 sticky top-16 z-30 justify-between">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#FAF6F0] rounded-lg flex items-center gap-1.5 font-bold text-xs"
            >
              <Menu className="h-5 w-5" />
              <span>Dashboard Menu</span>
            </button>

            <span className="text-[10px] font-extrabold uppercase text-[#1F1D1A] bg-[#FAF6F0] border border-[#E8DCC3] px-2.5 py-0.5 rounded-lg">
              {user.role}
            </span>
          </div>

          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
