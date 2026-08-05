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
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-violet-950 via-violet-800 to-violet-950 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Services Directory</h1>
            <p className="text-[#7A7266] text-xs mt-1.5 font-medium">Database catalog of all services published across providers</p>
          </div>
          <Button onClick={fetchServices} size="xs" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20 rounded-xl h-8.5 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Live DB
          </Button>
        </div>
      </section>

      {/* SERVICES LIST */}
      <div className="space-y-6">
        <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-stone-50">
            <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Active Database Services ({services.length})</CardTitle>
            <CardDescription className="text-xs">Live service catalog synced directly with PostgreSQL Service table</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            {loading ? (
              <div className="h-36 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#8C4B3E]" />
              </div>
            ) : services.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-xs text-stone-500 font-semibold">No services found in database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-stone-50 text-[#7A7266] font-bold uppercase tracking-wider text-[9px] pb-2">
                      <th className="py-2.5 px-1">ID</th>
                      <th className="py-2.5">Service Name</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Provider</th>
                      <th className="py-2.5">Rate</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50 font-medium">
                    {services.map((svc) => (
                      <tr key={svc.id} className="hover:bg-slate-55/30 transition-colors">
                        <td className="py-3 px-1 font-bold text-[#1F1D1A] text-[10px] truncate max-w-[90px]">{svc.id}</td>
                        <td className="py-3 font-extrabold text-[#1F1D1A]">{svc.title}</td>
                        <td className="py-3">
                          <span className="inline-block text-[10px] font-bold text-[#1F1D1A] bg-[#8C4B3E]/5 px-2 py-0.5 rounded-lg border border-violet-950/10">
                            {typeof svc.category === "object" ? (svc.category?.name || "General") : (svc.category || "General")}
                          </span>
                        </td>
                        <td className="py-3 text-[#5A5146] font-semibold">{svc.provider?.fullName || "Specialist"}</td>
                        <td className="py-3 font-bold text-[#1F1D1A]">{formatPrice(svc.price, { priceType: svc.priceType })}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDeleteService(svc.id, svc.title)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
