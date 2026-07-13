import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Layers, Trash2 } from "lucide-react";

const mockAllServices = [
  { id: 1, name: "Deep Home Cleaning Service", category: "Home Cleaning", basePrice: 35.00, activeProviders: 18 },
  { id: 2, name: "Expert Plumbing & Leak Repair", category: "Plumbing", basePrice: 45.00, activeProviders: 12 },
  { id: 3, name: "Window Washing Service", category: "Home Cleaning", basePrice: 30.00, activeProviders: 6 }
];

export default function AdminServices() {
  return (
    <DashboardLayout>
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Services Directory</h1>
            <p className="text-slate-350 text-xs mt-1.5 font-medium">Configure global service categories, rates, and parameters</p>
          </div>
          <Button size="xs" className="bg-white text-slate-900 hover:bg-slate-50 rounded-xl h-8.5 text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-md">
            <Plus className="h-3.5 w-3.5" /> Create Service
          </Button>
        </div>
      </section>

      {/* SERVICES LIST */}
      <div className="space-y-6">
        <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-slate-50">
            <CardTitle className="text-base font-extrabold text-slate-900">Active Service Classes</CardTitle>
            <CardDescription className="text-xs">Manage active services and base pricing catalogs</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-2">
                    <th className="py-2.5 px-1">ID</th>
                    <th className="py-2.5">Service Name</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Base Rate (/hr)</th>
                    <th className="py-2.5">Providers Enrolled</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {mockAllServices.map((svc) => (
                    <tr key={svc.id} className="hover:bg-slate-55/30 transition-colors">
                      <td className="py-3 px-1 font-bold text-slate-900">#{svc.id}</td>
                      <td className="py-3 font-extrabold text-slate-800">{svc.name}</td>
                      <td className="py-3">
                        <span className="inline-block text-[10px] font-bold text-slate-900 bg-slate-900/5 px-2 py-0.5 rounded-lg border border-slate-900/10">
                          {svc.category}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-slate-800">${svc.basePrice.toFixed(2)}</td>
                      <td className="py-3 text-slate-500 font-semibold">{svc.activeProviders} active</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="xs" className="h-7 border-slate-200 text-[10px] rounded-lg">
                            Edit
                          </Button>
                          <button className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
