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
  const renderSidebar = (collapsed = false, onNavigate) => {
    switch (user.role) {
      case "ADMIN":
        return <AdminSidebar collapsed={collapsed} onNavigate={onNavigate} />;
      case "PROVIDER":
        return <ProviderSidebar collapsed={collapsed} onNavigate={onNavigate} />;
      default:
        return <CustomerSidebar collapsed={collapsed} onNavigate={onNavigate} />;
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
              className="absolute -right-3.5 top-20 bg-[#FAF6F0] border border-[#E8DCC3] text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#F0E7D5] shadow-2xs h-7 w-7 rounded-full flex items-center justify-center z-40 transition-colors cursor-pointer"
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

        {/* Mobile Drawer Backdrop Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 z-45 bg-[#1F1D1A]/50 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer Panel */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] h-full h-screen bg-[#F0E7D5] border-r border-[#E8DCC3] transform transition-transform duration-300 md:hidden flex flex-col overflow-hidden shadow-2xl ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header with Close Button */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E8DCC3] shrink-0 bg-[#F0E7D5]">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BookMyLocalService Logo" className="h-7 w-auto object-contain" />
              <span className="font-bold text-xs text-[#1F1D1A]">BookMyLocal<span className="text-[#C9A46A]">Service</span></span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 text-[#5A5146] hover:text-[#1F1D1A] hover:bg-[#FAF6F0] rounded-xl transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content inside Drawer */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {renderSidebar(false, () => setIsMobileOpen(false))}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-full pb-16">
          
          {/* Mobile Navigation Header Bar */}
          <div className="md:hidden flex items-center bg-[#F0E7D5] border-b border-[#E8DCC3] px-4 py-3 sticky top-16 z-30 justify-between">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 text-[#5A5146] hover:text-[#C9A46A] hover:bg-[#FAF6F0] rounded-lg flex items-center gap-1.5 font-bold text-xs cursor-pointer"
            >
              <Menu className="h-5 w-5 text-[#1F1D1A]" />
              <span>Dashboard Menu</span>
            </button>

            <span className="text-[10px] font-bold uppercase text-[#C9A46A] bg-[#FAF6F0] border border-[#E8DCC3] px-2.5 py-0.5 rounded-lg">
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
