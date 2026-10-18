import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { customerMenu } from "../../config/navigationConfig";
import { getUserInitials } from "@/lib/utils";
import { getProviderImage } from "@/utils/imageUtils";

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
    <div className="flex flex-col h-full border-r border-border/70 bg-card/30 backdrop-blur-md w-full">
      {/* Header Profile Section */}
      <div
        className={`border-b border-border/70 flex flex-col items-center text-center transition-all shrink-0 ${
          collapsed ? "py-5 px-2" : "p-5"
        }`}
      >
        <div
          className={`rounded-full overflow-hidden border border-border bg-neutral-800 text-neutral-200 flex items-center justify-center font-display font-semibold transition-all ${
            collapsed ? "size-9 mb-0 text-xs" : "size-12 mb-2.5 text-base"
          }`}
        >
          {user?.avatar || user?.profileImage ? (
            <img
              src={getProviderImage(user, { width: 120, height: 120 })}
              alt={user.fullName}
              className="size-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {!collapsed && (
          <>
            <h4 className="font-display font-semibold text-xs text-foreground leading-tight truncate max-w-full">
              {user?.fullName}
            </h4>
            <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Customer account
            </span>
          </>
        )}
      </div>

      {/* Navigation List */}
      <nav
        className={`flex-1 py-3 space-y-1 overflow-y-auto ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
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
                  className={`w-full flex items-center gap-2.5 text-xs font-medium py-2 rounded-lg text-foreground hover:bg-card hover:text-brand transition-colors text-left cursor-pointer border-t border-border/60 mt-2 pt-2.5 ${
                    collapsed ? "justify-center px-0" : "px-3"
                  }`}
                  title={collapsed ? "Switch to provider" : undefined}
                >
                  {isSwitching ? (
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                  ) : (
                    <Briefcase className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  {!collapsed && (
                    <span>
                      {isSwitching ? "Switching..." : "Switch to provider"}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2.5 text-xs font-medium py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-left cursor-pointer ${
                    collapsed ? "justify-center px-0" : "px-3"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </React.Fragment>
            );
          }

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
    </div>
  );
}
