import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { providerMenu } from "../../config/navigationConfig";

export default function ProviderSidebar({ collapsed }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    logout();
    navigate("/");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 w-full shadow-xs">
      {/* Header Profile Section */}
      <div className={`p-4 border-b border-slate-100 flex flex-col items-center text-center transition-all duration-300 ${collapsed ? "py-5 px-2" : "p-6"}`}>
        <div className={`rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs bg-amber-500/10 flex items-center justify-center font-extrabold text-slate-800 transition-all duration-300 ${
          collapsed ? "h-10 w-10 mb-0" : "h-14 w-14 mb-3"
        }`}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
          ) : (
            <span className={collapsed ? "text-sm" : "text-lg text-amber-600"}>{initials}</span>
          )}
        </div>
        {!collapsed && (
          <>
            <h4 className="font-extrabold text-sm text-slate-900 leading-tight mt-1 truncate max-w-full">{user?.fullName}</h4>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-1 px-2 py-0.5 bg-amber-50 rounded-full border border-amber-200/60">
              Provider Account
            </span>
          </>
        )}
      </div>

      {/* Navigation List */}
      <nav className={`flex-1 py-5 space-y-1.5 overflow-y-auto transition-all ${collapsed ? "px-2" : "px-3.5"}`}>
        {providerMenu.map((item, idx) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          if (item.isLogout) {
            return (
              <button
                key={idx}
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 text-xs font-semibold py-3 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-left group ${
                  collapsed ? "justify-center px-0" : "px-3.5"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 duration-200" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          }

          const destination = item.tab ? `${item.path}?tab=${item.tab}` : item.path;

          return (
            <Link
              key={idx}
              to={destination}
              className={`relative flex items-center gap-3 text-xs font-semibold py-3 rounded-xl transition-all duration-200 group ${
                collapsed ? "justify-center px-0" : "px-3.5"
              } ${
                active
                  ? "bg-slate-900 text-white font-bold shadow-sm shadow-slate-900/10"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Thin Orange Accent Bar for active menu item */}
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-500 rounded-r-full shadow-xs"></span>
              )}

              <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 duration-200 ${
                active ? "text-amber-400" : "text-slate-400 group-hover:text-slate-700"
              }`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
