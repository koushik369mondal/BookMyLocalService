import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatPrice } from "@/utils/currency";
import { servicesService } from "../../services/servicesService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesService.getServices();
      if (response.success && Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to load services in AdminServices:", err);
      toast.error("Failed to load services from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDeleteService = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}" from the database?`)) return;
    try {
      const response = await servicesService.deleteService(id);
      if (response.success) {
        toast.success(`Service "${title}" deleted from database.`);
        fetchServices();
      } else {
        toast.error(response.message || "Failed to delete service.");
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
      toast.error("Error deleting service from database.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-neutral-100">
        {/* HEADER */}
        <section className="card-chai p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Services directory</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-medium">Database catalog of all services published across providers</p>
          </div>
          <Button
            onClick={fetchServices}
            size="sm"
            variant="outline"
            className="text-xs h-9 px-3 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh database
          </Button>
        </section>

        {/* SERVICES LIST */}
        <div className="card-chai p-6 space-y-4">
          <div className="pb-4 border-b border-white/10 flex flex-row items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Active services ({services.length})</h2>
              <p className="text-xs text-neutral-400">Live service catalog synced directly with database</p>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="h-36 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
              </div>
            ) : services.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-xs text-neutral-400 font-medium">No services found in database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400 font-semibold uppercase tracking-wider text-[10px] pb-2">
                      <th className="py-2.5 px-2">ID</th>
                      <th className="py-2.5">Service name</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Provider</th>
                      <th className="py-2.5">Rate</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-normal text-neutral-300">
                    {services.map((svc) => (
                      <tr key={svc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-2 font-mono text-[10px] text-neutral-500 truncate max-w-[90px]">{svc.id}</td>
                        <td className="py-3 font-semibold text-white">{svc.title}</td>
                        <td className="py-3">
                          <span className="inline-block text-[10px] font-medium text-neutral-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                            {typeof svc.category === "object" ? (svc.category?.name || "General") : (svc.category || "General")}
                          </span>
                        </td>
                        <td className="py-3 text-neutral-300">{svc.provider?.fullName || "Specialist"}</td>
                        <td className="py-3 font-semibold text-white">{formatPrice(svc.price, { priceType: svc.priceType })}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDeleteService(svc.id, svc.title)}
                              className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete service"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
