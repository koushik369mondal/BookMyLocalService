import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireVerification, setRequireVerification] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = () => {
    setSuccessMsg("System configuration saved successfully!");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#0a0a0a] min-h-screen pb-16 font-sans text-neutral-100">
        
        {/* HEADER */}
        <section className="bg-neutral-900/40 border-b border-white/10 py-8 mb-8">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">System settings</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-medium">Configure global platform attributes, registration policies, and maintenance states</p>
          </div>
        </section>

        {/* SETTINGS CONTENT */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="card-chai p-6 space-y-6">
            <div className="pb-4 border-b border-white/10 flex flex-row items-center gap-3">
              <div className="p-2.5 bg-white/5 text-neutral-300 rounded-xl border border-white/10">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Admin control panel</h2>
                <p className="text-xs text-neutral-400">Adjust global operations switches</p>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* SECURITY & ACCESS CONTROL */}
              <div className="space-y-4">
                <span className="text-[10px] font-semibold uppercase text-neutral-400 tracking-wider block">Security and access control</span>
                
                <div className="flex items-center justify-between border border-white/10 p-4.5 rounded-2xl bg-white/[0.03]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Require provider verification</span>
                    <span className="text-[10px] text-neutral-400 leading-relaxed font-normal">Force newly registered providers to be manually approved by admin before accepting bookings</span>
                  </div>
                  <Switch 
                    checked={requireVerification} 
                    onCheckedChange={setRequireVerification} 
                  />
                </div>

                <div className="flex items-center justify-between border border-white/10 p-4.5 rounded-2xl bg-white/[0.03]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Enable public registrations</span>
                    <span className="text-[10px] text-neutral-400 leading-relaxed font-normal">Allow new customer and provider sign-ups from the registration routes</span>
                  </div>
                  <Switch 
                    checked={allowRegistration} 
                    onCheckedChange={setAllowRegistration} 
                  />
                </div>
              </div>

              {/* SYSTEM STATUS */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <span className="text-[10px] font-semibold uppercase text-neutral-400 tracking-wider block">System status</span>
                
                <div className="flex items-center justify-between border border-white/10 p-4.5 rounded-2xl bg-white/[0.03]">
                  <div>
                    <span className="text-xs font-semibold text-rose-400 block">Platform maintenance mode</span>
                    <span className="text-[10px] text-neutral-400 leading-relaxed font-normal">Offline client-facing routes for general system updates, displaying maintenance landing page</span>
                  </div>
                  <Switch 
                    checked={maintenanceMode} 
                    onCheckedChange={setMaintenanceMode} 
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <Button 
                  onClick={handleSave}
                  variant="solid"
                  className="text-xs h-10 px-6 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save system settings
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
