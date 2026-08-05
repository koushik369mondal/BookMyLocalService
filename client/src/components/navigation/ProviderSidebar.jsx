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
    <div className="flex flex-col h-full bg-[#F0E7D5] border-r border-[#E8DCC3] w-full select-none">
      
      {/* Compact Header Profile Section */}
      <div className={`border-b border-[#E8DCC3] bg-[#FAF6F0]/60 shrink-0 transition-all ${
        collapsed ? "p-3 flex justify-center" : "p-3.5 flex items-center gap-3"
      }`}>
        <div className="h-9 w-9 rounded-full overflow-hidden border border-[#E8DCC3] shadow-2xs bg-[#8C4B3E] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
          {user?.avatar || user?.profileImage ? (
            <img src={getProviderImage(user, { width: 80, height: 80 })} alt={user.fullName} className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-[#1F1D1A] leading-tight truncate">{user?.fullName || "Provider"}</h4>
            <span className="text-[9px] text-[#C9A46A] font-extrabold uppercase tracking-wider block mt-0.5">
              Provider Workspace
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className={`flex-1 py-2 space-y-1 overflow-y-auto scrollbar-none ${collapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          const destination = item.tab ? `${item.path}?tab=${item.tab}` : item.path;

          return (
            <Link
              key={idx}
              to={destination}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-2.5 text-xs font-bold py-2 rounded-xl transition-all ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                active
                  ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                  : "text-[#5A5146] hover:bg-[#FAF6F0] hover:text-[#C9A46A]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#C9A46A]" : "text-[#7A7266]"}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Quick Utility Actions */}
      <div className={`border-t border-[#E8DCC3] py-2 shrink-0 bg-[#F0E7D5] ${collapsed ? "px-2 space-y-1" : "px-3 space-y-1"}`}>
        <button
          type="button"
          onClick={handleSwitchToCustomer}
          disabled={isSwitching}
          className={`w-full flex items-center gap-2.5 text-xs font-bold py-2 rounded-xl text-[#C9A46A] hover:bg-[#FAF6F0] transition-all text-left cursor-pointer ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
          title={collapsed ? "Switch to Customer Account" : undefined}
        >
          {isSwitching ? (
            <Loader2 className="h-4 w-4 shrink-0 text-[#C9A46A] animate-spin" />
          ) : (
            <User className="h-4 w-4 shrink-0 text-[#C9A46A]" />
          )}
          {!collapsed && <span className="truncate">{isSwitching ? "Switching..." : "Switch to Customer"}</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 text-xs font-bold py-2 rounded-xl text-[#8C4B3E] hover:bg-[#FAF6F0] transition-all text-left cursor-pointer ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">Logout</span>}
        </button>
      </div>

    </div>
  );
}
