import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Sliders, CheckCircle2 } from "lucide-react";

export default function ProviderSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = () => {
    setSuccessMsg("Settings and preferences saved successfully.");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* HEADER */}
        <div className="pb-4 border-b border-white/10">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Provider settings</h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">Configure alert triggers, operational modes, and security rules</p>
        </div>

        {/* SETTINGS CONTENT */}
        <div className="space-y-6">

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="card-chai p-6 space-y-6">
            <div className="pb-4 border-b border-white/10 flex flex-row items-center gap-3">
              <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Portal preferences</h2>
                <p className="text-xs text-neutral-400">Manage operational controls and notification rules</p>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* OPERATIONAL CONTROLS */}
              <div className="space-y-3">
                <span className="text-[10px] font-semibold uppercase text-neutral-400 tracking-wider block">Operational controls</span>
                
                <div className="flex items-center justify-between border border-white/10 p-4 rounded-2xl bg-white/[0.02]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Instant job auto-acceptance</span>
                    <span className="text-[10px] text-neutral-400 leading-relaxed font-normal">Automatically approve customer dispatches that match active calendar schedules</span>
                  </div>
                  <Switch 
                    checked={autoAccept} 
                    onCheckedChange={setAutoAccept}
                  />
                </div>
              </div>

              {/* DISPATCH NOTIFICATIONS */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                <span className="text-[10px] font-semibold uppercase text-neutral-400 tracking-wider block">Dispatch notifications</span>
                
                <div className="flex items-center justify-between border border-white/10 p-4 rounded-2xl bg-white/[0.02]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Email dispatch alerts</span>
                    <span className="text-[10px] text-neutral-400 leading-relaxed font-normal">Receive details about newly booked service requests via email</span>
                  </div>
                  <Switch 
                    checked={emailAlerts} 
                    onCheckedChange={setEmailAlerts}
                  />
                </div>

                <div className="flex items-center justify-between border border-white/10 p-4 rounded-2xl bg-white/[0.02]">
                  <div>
                    <span className="text-xs font-semibold text-white block">SMS dispatch alerts</span>
                    <span className="text-[10px] text-neutral-400 leading-relaxed font-normal">Receive mobile notifications when bookings are scheduled</span>
                  </div>
                  <Switch 
                    checked={smsAlerts} 
                    onCheckedChange={setSmsAlerts}
                  />
                </div>
              </div>

              {/* SAVE PREFERENCES */}
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <Button 
                  onClick={handleSave}
                  variant="solid"
                  className="flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save preferences
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
