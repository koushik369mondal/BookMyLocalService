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
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">System Settings</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Configure global platform attributes, registration policies, and maintenance states</p>
          </div>
        </section>

        {/* SETTINGS CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#2B522B]" />
              <span>{successMsg}</span>
            </div>
          )}

          <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center gap-3">
              <div className="p-2.5 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">Admin Control Panel</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Adjust global operations switches</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6 space-y-6">
              
              {/* SECURITY & ACCESS CONTROL */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase text-[#7A7266] tracking-wider block">Security & Access Control</span>
                
                <div className="flex items-center justify-between border border-[#E8DCC3] p-4.5 rounded-2xl bg-white shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1F1D1A] block">Require Provider Verification</span>
                    <span className="text-[10px] text-[#5A5146] leading-relaxed font-medium">Force newly registered providers to be manually approved by admin before accepting bookings</span>
                  </div>
                  <Switch 
                    checked={requireVerification} 
                    onCheckedChange={setRequireVerification} 
                    className="data-[state=checked]:bg-[#C9A46A]"
                  />
                </div>

                <div className="flex items-center justify-between border border-[#E8DCC3] p-4.5 rounded-2xl bg-white shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1F1D1A] block">Enable Public Registrations</span>
                    <span className="text-[10px] text-[#5A5146] leading-relaxed font-medium">Allow new customer and provider sign-ups from the registration routes</span>
                  </div>
                  <Switch 
                    checked={allowRegistration} 
                    onCheckedChange={setAllowRegistration} 
                    className="data-[state=checked]:bg-[#C9A46A]"
                  />
                </div>
              </div>

              {/* SYSTEM STATUS */}
              <div className="space-y-4 border-t border-[#E8DCC3] pt-6">
                <span className="text-[10px] font-bold uppercase text-[#7A7266] tracking-wider block">System Status</span>
                
                <div className="flex items-center justify-between border border-[#E8DCC3] p-4.5 rounded-2xl bg-white shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#8C4B3E] block">Platform Maintenance Mode</span>
                    <span className="text-[10px] text-[#5A5146] leading-relaxed font-medium">Offline client-facing routes for general system updates, displaying maintenance landing page</span>
                  </div>
                  <Switch 
                    checked={maintenanceMode} 
                    onCheckedChange={setMaintenanceMode} 
                    className="data-[state=checked]:bg-[#8C4B3E]"
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 border-t border-[#E8DCC3] flex justify-end">
                <Button 
                  onClick={handleSave}
                  className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-2xs border border-[#E8DCC3] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save System Settings
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
