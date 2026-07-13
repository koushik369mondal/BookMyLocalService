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
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white py-12 relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Provider Portal Settings</h1>
          <p className="text-slate-350 text-xs mt-1.5 font-medium">Configure alert triggers, operational modes, and security rules</p>
        </div>
      </section>

      {/* SETTINGS CARD */}
      <div className="space-y-6">
        <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2">
            <div className="p-2 bg-slate-900/5 text-slate-900 rounded-xl">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900">Portal Settings</CardTitle>
              <CardDescription className="text-xs">Manage system options and notifications rules</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6 space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Operational Controls</span>
              
              <div className="flex items-center justify-between border border-slate-100 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Instant Job Auto-Acceptance</span>
                  <span className="text-[10px] text-slate-450 leading-relaxed font-semibold">Automatically approve customer dispatches that match active calendar schedules</span>
                </div>
                <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Dispatch Notifications</span>
              
              <div className="flex items-center justify-between border border-slate-100 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Email Dispatch Alerts</span>
                  <span className="text-[10px] text-slate-450 leading-relaxed font-semibold">Receive details about newly booked service requests via email</span>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>

              <div className="flex items-center justify-between border border-slate-100 p-4.5 rounded-2xl bg-white shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">SMS Dispatch Alerts</span>
                  <span className="text-[10px] text-slate-450 leading-relaxed font-semibold">Receive mobile notifications when bookings are scheduled</span>
                </div>
                <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 flex justify-end">
              <Button className="bg-slate-900 hover:bg-black text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-1.5">
                <Save className="h-4 w-4" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
