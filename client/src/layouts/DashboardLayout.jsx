import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import MainLayout from "./MainLayout";
import CustomerSidebar from "../components/navigation/CustomerSidebar";
import ProviderSidebar from "../components/navigation/ProviderSidebar";
import AdminSidebar from "../components/navigation/AdminSidebar";
import { Menu, X, PanelLeftClose, PanelLeft, Loader2 } from "lucide-react";
import Logo from "../components/ui/logo";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

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
      <div className="flex min-h-[calc(100vh-5rem)] font-sans relative">
        {/* Desktop Sidebar (Sticky under main navbar) */}
        <aside
          className={`hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 shrink-0 z-30 ${
            isCollapsed ? "w-20" : "w-64 lg:w-72"
          }`}
        >
          <div className="relative h-full flex flex-col">
            {renderSidebar(isCollapsed)}

            {/* Collapse toggle button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3.5 top-16 size-7 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground flex items-center justify-center z-40 transition-colors cursor-pointer"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeft className="size-3.5" />
              ) : (
                <PanelLeftClose className="size-3.5" />
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Drawer Backdrop Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer Panel */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[300px] h-full bg-background/95 backdrop-blur-xl border-r border-border transform transition-transform duration-300 md:hidden flex flex-col overflow-hidden ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header with Close Button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <Logo size={24} />
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
              title="Close menu"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Scrollable Content inside Drawer */}
          <div className="flex-1 overflow-y-auto">
            {renderSidebar(false, () => setIsMobileOpen(false))}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-full pb-16">
          {/* Mobile Navigation Header Bar */}
          <div className="md:hidden flex items-center border-b border-border/70 bg-card/40 backdrop-blur-md px-4 py-3 sticky top-16 z-20 justify-between">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer"
            >
              <Menu className="size-4 text-foreground" />
              <span>Dashboard menu</span>
            </button>

            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/80 px-2 py-0.5 rounded">
              {user.role?.toLowerCase()}
            </span>
          </div>

          <div className="flex-1 px-4 sm:px-8 lg:px-12 py-8 w-full max-w-[1536px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
