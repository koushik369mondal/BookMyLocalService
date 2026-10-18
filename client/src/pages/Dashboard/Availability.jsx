import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { providerService } from "@/services/providerService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  Coffee,
  ChevronDown
} from "lucide-react";

export default function Availability() {
  const navigate = useNavigate();

  // Weekly schedule & blocked dates state
  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: { active: true, slots: [{ id: "1", start: "09:00 AM", end: "05:00 PM" }] },
    Tuesday: { active: true, slots: [{ id: "2", start: "09:00 AM", end: "05:00 PM" }] },
    Wednesday: { active: true, slots: [{ id: "3", start: "09:00 AM", end: "05:00 PM" }] },
    Thursday: { active: true, slots: [{ id: "4", start: "09:00 AM", end: "05:00 PM" }] },
    Friday: { active: true, slots: [{ id: "5", start: "09:00 AM", end: "05:00 PM" }] },
    Saturday: { active: false, slots: [] },
    Sunday: { active: false, slots: [] }
  });

  const [blockedDates, setBlockedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form input for blocking a new date
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  // UI state messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const timeOptions = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
  ];

  const fetchAvailability = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await providerService.getAvailability();
      if (response.success && response.data) {
        if (response.data.weeklySchedule) setWeeklySchedule(response.data.weeklySchedule);
        if (response.data.blockedDates) setBlockedDates(response.data.blockedDates);
      } else {
        setErrorMsg(response.message || "Failed to load availability configuration.");
      }
    } catch (err) {
      console.error("Fetch availability error:", err);
      setErrorMsg(err.message || "Failed to load availability configuration from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleToggleDay = (day) => {
    setWeeklySchedule((prev) => {
      const dayData = prev[day] || { active: false, slots: [] };
      const nextActive = !dayData.active;
      return {
        ...prev,
        [day]: {
          active: nextActive,
          slots: nextActive ? [{ id: Date.now().toString(), start: "09:00 AM", end: "05:00 PM" }] : []
        }
      };
    });
  };

  const handleAddSlot = (day) => {
    setWeeklySchedule((prev) => {
      const dayData = prev[day] || { active: true, slots: [] };
      const newSlot = { id: Date.now().toString(), start: "09:00 AM", end: "05:00 PM" };
      return {
        ...prev,
        [day]: {
          ...dayData,
          active: true,
          slots: [...dayData.slots, newSlot]
        }
      };
    });
  };

  const handleDeleteSlot = (day, slotId) => {
    setWeeklySchedule((prev) => {
      const dayData = prev[day] || { active: true, slots: [] };
      const updatedSlots = dayData.slots.filter((s) => s.id !== slotId);
      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: updatedSlots,
          active: updatedSlots.length > 0 ? dayData.active : false
        }
      };
    });
  };

  const handleModifySlot = (day, slotId, field, value) => {
    setWeeklySchedule((prev) => {
      const dayData = prev[day] || { active: true, slots: [] };
      const updatedSlots = dayData.slots.map((s) =>
        s.id === slotId ? { ...s, [field]: value } : s
      );
      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: updatedSlots
        }
      };
    });
  };

  const handleAddBlockDate = (e) => {
    e.preventDefault();
    if (!newBlockDate) return;
    const newEntry = {
      id: Date.now().toString(),
      date: newBlockDate,
      reason: newBlockReason || "Unavailable"
    };
    setBlockedDates((prev) => [...prev, newEntry]);
    setNewBlockDate("");
    setNewBlockReason("");
  };

  const handleRemoveBlockDate = (id) => {
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = { weeklySchedule, blockedDates };
      const res = await providerService.saveAvailability(payload);
      if (res.success) {
        setSuccessMsg("Weekly schedule & blocked leaves updated successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(res.message || "Failed to save schedule.");
      }
    } catch (err) {
      console.error("Save schedule error:", err);
      setErrorMsg(err.message || "Error saving availability configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Availability & scheduling</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Configure daily operational hours, add custom break windows, or block vacation days</p>
          </div>
          
          <Link to="/provider/dashboard">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Button>
          </Link>
        </div>

        {/* FEEDBACK */}
        {successMsg && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-400">Loading saved availability configuration...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: WEEKLY AVAILABILITY GRID */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="card-chai p-6 space-y-6">
                <div className="pb-4 border-b border-white/10 flex flex-row items-center gap-3">
                  <div className="p-2.5 bg-white/[0.04] text-neutral-200 rounded-xl border border-white/10">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Weekly shift schedule</h2>
                    <p className="text-xs text-neutral-400">Configure daily slots. Off toggle marks day as unavailable.</p>
                  </div>
                </div>

                <div className="space-y-3 font-sans">
                  {Object.keys(weeklySchedule).map((day) => {
                    const dayData = weeklySchedule[day] || { active: false, slots: [] };
                    return (
                      <div 
                        key={day} 
                        className={`p-4 border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                          dayData.active 
                            ? "border-white/10 bg-white/[0.02]" 
                            : "border-white/5 bg-transparent opacity-60"
                        }`}
                      >
                        
                        {/* Day & Toggle switch */}
                        <div className="flex items-center gap-3.5 shrink-0 min-w-[150px]">
                          <Switch 
                            checked={dayData.active} 
                            onCheckedChange={() => handleToggleDay(day)} 
                            disabled={isSaving}
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">{day}</span>
                            <span className={`text-[10px] font-medium uppercase tracking-wider ${
                              dayData.active ? "text-emerald-400" : "text-neutral-500"
                            }`}>
                              {dayData.active ? "Available" : "Unavailable / off"}
                            </span>
                          </div>
                        </div>

                        {/* Slots widgets */}
                        <div className="flex-1 w-full space-y-3">
                          {dayData.active ? (
                            dayData.slots.map((slot) => (
                              <div key={slot.id} className="flex items-center gap-2 flex-wrap">
                                
                                <div className="flex items-center gap-2 border border-white/10 bg-neutral-900/60 p-1.5 rounded-xl text-xs font-medium text-white">
                                  <div className="relative">
                                    <select
                                      value={slot.start}
                                      onChange={(e) => handleModifySlot(day, slot.id, "start", e.target.value)}
                                      disabled={isSaving}
                                      className="h-7 border-0 bg-transparent text-xs font-semibold text-white pr-5 appearance-none focus:outline-none cursor-pointer"
                                    >
                                      {timeOptions.map((t) => (
                                        <option key={t} value={t} className="bg-neutral-900 text-white">{t}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 absolute right-0 top-[50%] translate-y-[-50%] pointer-events-none text-neutral-400" />
                                  </div>

                                  <span className="text-neutral-500 text-xs">to</span>

                                  <div className="relative">
                                    <select
                                      value={slot.end}
                                      onChange={(e) => handleModifySlot(day, slot.id, "end", e.target.value)}
                                      disabled={isSaving}
                                      className="h-7 border-0 bg-transparent text-xs font-semibold text-white pr-5 appearance-none focus:outline-none cursor-pointer"
                                    >
                                      {timeOptions.map((t) => (
                                        <option key={t} value={t} className="bg-neutral-900 text-white">{t}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 absolute right-0 top-[50%] translate-y-[-50%] pointer-events-none text-neutral-400" />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(day, slot.id)}
                                  disabled={isSaving}
                                  className="text-neutral-500 hover:text-red-400 p-1.5 transition-all cursor-pointer"
                                  title="Delete slot"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                              </div>
                            ))
                          ) : (
                            <span className="text-[11px] font-normal text-neutral-500 italic">No bookings accepted on this day</span>
                          )}
                        </div>

                        {/* Add slot button */}
                        {dayData.active && (
                          <Button
                            type="button"
                            size="xs"
                            variant="outline"
                            onClick={() => handleAddSlot(day)}
                            disabled={isSaving}
                            className="text-[10px] uppercase tracking-wide flex items-center gap-1 shrink-0 ml-auto"
                          >
                            <Plus className="h-3 w-3" /> Add slot
                          </Button>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SAVE PANEL */}
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="solid"
                  onClick={handleSaveSchedule}
                  disabled={isSaving}
                  className="flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save shift schedule
                    </>
                  )}
                </Button>
              </div>

            </div>

            {/* RIGHT COLUMN: HOLIDAYS LEAVES */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* VACATION LEAVE BLOCKER */}
              <div className="card-chai p-5 space-y-4">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block border-b border-white/10 pb-2.5">Block holidays / leaves</span>
                
                <form onSubmit={handleAddBlockDate} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="blockDate" className="text-xs font-medium text-neutral-300">Select date</Label>
                    <Input
                      id="blockDate"
                      type="date"
                      value={newBlockDate}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      disabled={isSaving}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="blockReason" className="text-xs font-medium text-neutral-300">Reason / holiday name</Label>
                    <Input
                      id="blockReason"
                      placeholder="e.g. Vacation, maintenance"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      disabled={isSaving}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    variant="solid"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Coffee className="h-4 w-4" /> Block selected date
                  </Button>
                </form>
              </div>

              {/* LIST OF BLOCKED DATES */}
              <div className="card-chai p-5 space-y-4">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block border-b border-white/10 pb-2.5">Blocked dates list</span>
                
                {blockedDates.length === 0 ? (
                  <p className="text-xs text-neutral-500 font-medium text-center py-2.5">No holidays or leaves blocked.</p>
                ) : (
                  <div className="space-y-2">
                    {blockedDates.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.02]">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 block">{b.date}</span>
                          <h4 className="font-semibold text-white text-xs mt-0.5">{b.reason}</h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBlockDate(b.id)}
                          disabled={isSaving}
                          className="text-neutral-500 hover:text-red-400 p-1.5 cursor-pointer"
                          title="Remove blocked date"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
