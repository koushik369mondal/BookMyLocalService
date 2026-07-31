import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { customerMenu } from "../../config/navigationConfig";
import { getUserInitials } from "@/lib/utils";

export default function CustomerSidebar({ collapsed, onNavigate }) {
  const { logout, user, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchToProvider = async (e) => {
    e.preventDefault();
    if (isSwitching) return;
    setIsSwitching(true);
    onNavigate?.();
    try {
      await switchRole("PROVIDER");
      navigate("/provider/dashboard");
    } catch (err) {
      console.error("Failed to switch to provider:", err);
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

  return (
    <div className="flex flex-col h-full bg-[#F0E7D5] border-r border-[#E8DCC3] w-full">
      {/* Header Profile Section */}
      <div className={`p-4 border-b border-[#E8DCC3] flex flex-col items-center text-center transition-all shrink-0 ${collapsed ? "py-6 px-2" : "p-6"}`}>
        <div className={`rounded-full overflow-hidden border border-[#E8DCC3] shadow-2xs bg-[#8C4B3E] text-white flex items-center justify-center font-bold transition-all ${
          collapsed ? "h-10 w-10 mb-0 text-sm" : "h-14 w-14 mb-3 text-lg"
        }`}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {!collapsed && (
          <>
            <h4 className="font-bold text-sm text-[#1F1D1A] leading-tight mt-1 truncate max-w-full">{user?.fullName}</h4>
            <span className="text-[10px] text-[#7A7266] font-bold uppercase tracking-wider mt-1">Customer Profile</span>
          </>
        )}
      </div>

      {/* Navigation List */}
      <nav className={`flex-1 py-4 space-y-1.5 overflow-y-auto transition-all ${collapsed ? "px-2" : "px-4"}`}>
        {customerMenu.map((item, idx) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          if (item.isLogout) {
            return (
              <React.Fragment key={idx}>
                <button
                  type="button"
                  onClick={handleSwitchToProvider}
                  disabled={isSwitching}
                  className={`w-full flex items-center gap-3 text-xs font-bold py-3 rounded-xl text-[#C9A46A] hover:bg-[#FAF6F0] transition-all text-left cursor-pointer border-t border-[#E8DCC3]/60 ${
                    collapsed ? "justify-center px-0" : "px-4"
                  }`}
                  title={collapsed ? "Switch to Provider Account" : undefined}
                >
                  {isSwitching ? (
                    <Loader2 className="h-4.5 w-4.5 shrink-0 text-[#C9A46A] animate-spin" />
                  ) : (
                    <Briefcase className="h-4.5 w-4.5 shrink-0 text-[#C9A46A]" />
                  )}
                  {!collapsed && <span>{isSwitching ? "Switching..." : "Switch to Provider"}</span>}
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 text-xs font-bold py-3 rounded-xl text-[#8C4B3E] hover:bg-[#FAF6F0] transition-all text-left cursor-pointer ${
                    collapsed ? "justify-center px-0" : "px-4"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </React.Fragment>
            );
          }

          const destination = item.tab ? `${item.path}?tab=${item.tab}` : item.path;

          return (
            <Link
              key={idx}
              to={destination}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-3 text-xs font-bold py-3 rounded-xl transition-all ${
                collapsed ? "justify-center px-0" : "px-4"
              } ${
                active
                  ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                  : "text-[#5A5146] hover:bg-[#FAF6F0] hover:text-[#C9A46A]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-[#C9A46A]" : "text-[#7A7266]"}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
