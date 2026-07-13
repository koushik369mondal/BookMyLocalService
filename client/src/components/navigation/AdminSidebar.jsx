import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminMenu } from "../../config/navigationConfig";

export default function AdminSidebar({ collapsed }) {
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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full">
      {/* Header Profile Section */}
      <div className={`p-4 border-b border-slate-100 flex flex-col items-center text-center transition-all ${collapsed ? "py-6 px-2" : "p-6"}`}>
        <div className={`rounded-full overflow-hidden border-2 border-slate-100 shadow-xs bg-amber-500/10 flex items-center justify-center font-bold text-slate-800 transition-all ${
          collapsed ? "h-10 w-10 mb-0" : "h-16 w-16 mb-3"
        }`}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
          ) : (
            <span className={collapsed ? "text-sm" : "text-xl"}>{initials}</span>
          )}
        </div>
        {!collapsed && (
          <>
            <h4 className="font-extrabold text-sm text-slate-900 leading-tight mt-1">{user?.fullName}</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Admin Panel</span>
          </>
        )}
      </div>

      {/* Navigation List */}
      <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto transition-all ${collapsed ? "px-2" : "px-4"}`}>
        {adminMenu.map((item, idx) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          if (item.isLogout) {
            return (
              <button
                key={idx}
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 text-xs font-bold py-3 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-left ${
                  collapsed ? "justify-center px-0" : "px-4"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          }

          const destination = item.tab ? `${item.path}?tab=${item.tab}` : item.path;

          return (
            <Link
              key={idx}
              to={destination}
              className={`flex items-center gap-3 text-xs font-semibold py-3 rounded-xl transition-all ${
                collapsed ? "justify-center px-0" : "px-4"
              } ${
                active
                  ? "bg-slate-900 text-white font-extrabold shadow-sm shadow-slate-900/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
