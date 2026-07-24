import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, ShieldAlert, Check } from "lucide-react";

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireVerification, setRequireVerification] = useState(true);

  return (
    <DashboardLayout>
      {/* HEADER */}
      <section className="bg-[#8C4B3E] text-white p-6 rounded-2xl mb-6">
        <h1 className="text-xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-[#7A7266] text-xs mt-1">Configure global platform attributes, registration policies, and maintenance states</p>
      </section>

      {/* SETTINGS CARD */}
      <div className="space-y-6">
        <Card className="border border-[#5A5146]/20 rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center gap-2">
            <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Admin Control Panel</CardTitle>
              <CardDescription className="text-xs">Adjust global operations switches</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6 space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-[#7A7266] tracking-wider block">Security & Access Control</span>
              
              <div className="flex items-center justify-between border border-[#5A5146]/15 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-[#1F1D1A] block">Require Provider Verification</span>
                  <span className="text-[10px] text-[#7A7266] leading-relaxed font-semibold">Force newly registered providers to be manually approved by admin before accepting bookings</span>
                </div>
                <Switch checked={requireVerification} onCheckedChange={setRequireVerification} />
              </div>

              <div className="flex items-center justify-between border border-[#5A5146]/15 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-[#1F1D1A] block">Enable Public Registrations</span>
                  <span className="text-[10px] text-[#7A7266] leading-relaxed font-semibold">Allow new customer and provider sign-ups from the registration routes</span>
                </div>
                <Switch checked={allowRegistration} onCheckedChange={setAllowRegistration} />
              </div>
            </div>

            <div className="space-y-4 border-t border-[#5A5146]/15 pt-6">
              <span className="text-[10px] font-black uppercase text-[#7A7266] tracking-wider block">System Status</span>
              
              <div className="flex items-center justify-between border border-rose-100 p-4.5 rounded-2xl bg-rose-50/20 shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-rose-800 block">Platform Maintenance Mode</span>
                  <span className="text-[10px] text-[#7A7266] leading-relaxed font-semibold">Offline client-facing routes for general system updates, displaying maintenance landing page</span>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-50 flex justify-end">
              <Button className="bg-[#8C4B3E] hover:bg-black text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-1.5">
                <Save className="h-4 w-4" /> Save System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
