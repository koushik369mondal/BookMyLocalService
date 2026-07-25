import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Sliders, CheckCircle2 } from "lucide-react";

export default function ProviderSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = () => {
    setSuccessMsg("Settings and preferences saved successfully!");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A] mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Provider Portal Settings</h1>
            <p className="text-[#5A5146] text-xs sm:text-sm mt-1 font-medium">Configure alert triggers, operational modes, and security rules</p>
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
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-[#1F1D1A]">Portal Settings</CardTitle>
                <CardDescription className="text-xs text-[#7A7266]">Manage system options and notifications rules</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6 space-y-6">
              
              {/* OPERATIONAL CONTROLS */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase text-[#7A7266] tracking-wider block">Operational Controls</span>
                
                <div className="flex items-center justify-between border border-[#E8DCC3] p-4.5 rounded-2xl bg-white shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1F1D1A] block">Instant Job Auto-Acceptance</span>
                    <span className="text-[10px] text-[#5A5146] leading-relaxed font-medium">Automatically approve customer dispatches that match active calendar schedules</span>
                  </div>
                  <Switch 
                    checked={autoAccept} 
                    onCheckedChange={setAutoAccept}
                    className="data-[state=checked]:bg-[#C9A46A]"
                  />
                </div>
              </div>

              {/* DISPATCH NOTIFICATIONS */}
              <div className="space-y-4 border-t border-[#E8DCC3] pt-6">
                <span className="text-[10px] font-bold uppercase text-[#7A7266] tracking-wider block">Dispatch Notifications</span>
                
                <div className="flex items-center justify-between border border-[#E8DCC3] p-4.5 rounded-2xl bg-white shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1F1D1A] block">Email Dispatch Alerts</span>
                    <span className="text-[10px] text-[#5A5146] leading-relaxed font-medium">Receive details about newly booked service requests via email</span>
                  </div>
                  <Switch 
                    checked={emailAlerts} 
                    onCheckedChange={setEmailAlerts}
                    className="data-[state=checked]:bg-[#C9A46A]"
                  />
                </div>

                <div className="flex items-center justify-between border border-[#E8DCC3] p-4.5 rounded-2xl bg-white shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1F1D1A] block">SMS Dispatch Alerts</span>
                    <span className="text-[10px] text-[#5A5146] leading-relaxed font-medium">Receive mobile notifications when bookings are scheduled</span>
                  </div>
                  <Switch 
                    checked={smsAlerts} 
                    onCheckedChange={setSmsAlerts}
                    className="data-[state=checked]:bg-[#C9A46A]"
                  />
                </div>
              </div>

              {/* SAVE PREFERENCES */}
              <div className="pt-2 border-t border-[#E8DCC3] flex justify-end">
                <Button 
                  onClick={handleSave}
                  className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-2xs border border-[#E8DCC3] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save Preferences
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
