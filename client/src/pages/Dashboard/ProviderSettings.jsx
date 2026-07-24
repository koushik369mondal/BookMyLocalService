import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, Bell, Shield, Sliders } from "lucide-react";

export default function ProviderSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  return (
    <DashboardLayout>
      {/* HEADER */}
      <section className="bg-[#8C4B3E] text-white p-6 rounded-2xl mb-6">
        <h1 className="text-xl font-extrabold tracking-tight">Provider Portal Settings</h1>
        <p className="text-[#7A7266] text-xs mt-1">Configure alert triggers, operational modes, and security rules</p>
      </section>

      {/* SETTINGS CARD */}
      <div className="space-y-6">
        <Card className="border border-[#5A5146]/20 rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center gap-2">
            <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Portal Settings</CardTitle>
              <CardDescription className="text-xs">Manage system options and notifications rules</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6 space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-[#7A7266] tracking-wider block">Operational Controls</span>
              
              <div className="flex items-center justify-between border border-[#5A5146]/15 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-[#1F1D1A] block">Instant Job Auto-Acceptance</span>
                  <span className="text-[10px] text-[#7A7266] leading-relaxed font-semibold">Automatically approve customer dispatches that match active calendar schedules</span>
                </div>
                <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
              </div>
            </div>

            <div className="space-y-4 border-t border-[#5A5146]/15 pt-6">
              <span className="text-[10px] font-black uppercase text-[#7A7266] tracking-wider block">Dispatch Notifications</span>
              
              <div className="flex items-center justify-between border border-[#5A5146]/15 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-[#1F1D1A] block">Email Dispatch Alerts</span>
                  <span className="text-[10px] text-[#7A7266] leading-relaxed font-semibold">Receive details about newly booked service requests via email</span>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>

              <div className="flex items-center justify-between border border-[#5A5146]/15 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-[#1F1D1A] block">SMS Dispatch Alerts</span>
                  <span className="text-[10px] text-[#7A7266] leading-relaxed font-semibold">Receive mobile notifications when bookings are scheduled</span>
                </div>
                <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-50 flex justify-end">
              <Button className="bg-[#8C4B3E] hover:bg-black text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-1.5">
                <Save className="h-4 w-4" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
