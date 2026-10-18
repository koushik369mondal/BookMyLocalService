import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Loader2, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { providerMenu } from "../../config/navigationConfig";
import { getUserInitials } from "@/lib/utils";
import { getProviderImage } from "@/utils/imageUtils";

export default function ProviderSidebar({ collapsed, onNavigate }) {
  const { logout, user, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchToCustomer = async (e) => {
    e.preventDefault();
    if (isSwitching) return;
    setIsSwitching(true);
    onNavigate?.();
    try {
      await switchRole("CUSTOMER");
      navigate("/customer/dashboard");
    } catch (err) {
      console.error("Failed to switch to customer:", err);
    } finally {
      setIsSwitching(false);
    }
  };

  const isItemActive = (item) => {
    if (item.path !== location.pathname) return false;
    if (item.tab) {
      const params = new URLSearchParams(location.search);
      return params.get("tab") === item.tab;
    }
    const params = new URLSearchParams(location.search);
    if (!item.tab && params.get("tab")) return false;
    return true;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    onNavigate?.();
    logout();
    navigate("/");
  };

  const initials = getUserInitials(user?.fullName);
  const navItems = providerMenu.filter((item) => !item.isLogout);

  return (
    <div className="flex flex-col h-full border-r border-border/70 bg-card/30 backdrop-blur-md w-full select-none">
      {/* Compact Header Profile Section */}
      <div
        className={`border-b border-border/70 shrink-0 transition-all ${
          collapsed ? "p-3 flex justify-center" : "p-3.5 flex items-center gap-3"
        }`}
      >
        <div className="size-9 rounded-full overflow-hidden border border-border bg-neutral-800 text-neutral-200 flex items-center justify-center font-display font-semibold text-xs shrink-0">
          {user?.avatar || user?.profileImage ? (
            <img
              src={getProviderImage(user, { width: 80, height: 80 })}
              alt={user.fullName}
              className="size-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-semibold text-xs text-foreground leading-tight truncate">
              {user?.fullName || "Provider"}
            </h4>
            <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
              Provider workspace
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav
        className={`flex-1 py-3 space-y-1 overflow-y-auto ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          const destination = item.tab
            ? `${item.path}?tab=${item.tab}`
            : item.path;

          return (
            <Link
              key={idx}
              to={destination}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-2.5 text-xs font-medium py-2 rounded-lg transition-colors ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                active
                  ? "bg-card text-foreground font-semibold border border-border/80"
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`size-4 shrink-0 ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Role Switcher and Logout */}
      <div
        className={`border-t border-border/70 p-2.5 space-y-1 ${
          collapsed ? "flex flex-col items-center" : ""
        }`}
      >
        <button
          type="button"
          onClick={handleSwitchToCustomer}
          disabled={isSwitching}
          className={`w-full flex items-center gap-2.5 text-xs font-medium py-2 rounded-lg text-foreground hover:bg-card hover:text-brand transition-colors text-left cursor-pointer ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
          title={collapsed ? "Switch to customer" : undefined}
        >
          {isSwitching ? (
            <Loader2 className="size-4 shrink-0 animate-spin" />
          ) : (
            <User className="size-4 shrink-0 text-muted-foreground" />
          )}
          {!collapsed && (
            <span>
              {isSwitching ? "Switching..." : "Switch to customer"}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 text-xs font-medium py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-left cursor-pointer ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}
