import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  Coffee,
  ChevronDown
} from "lucide-react";

// Mock initial weekly schedule
const initialWeeklySchedule = {
  Monday: {
    active: true,
    slots: [
      { id: "1", start: "09:00 AM", end: "01:00 PM" },
      { id: "2", start: "02:00 PM", end: "06:00 PM" }
    ]
  },
  Tuesday: {
    active: true,
    slots: [
      { id: "3", start: "09:00 AM", end: "01:00 PM" },
      { id: "4", start: "02:00 PM", end: "06:00 PM" }
    ]
  },
  Wednesday: {
    active: true,
    slots: [
      { id: "5", start: "09:00 AM", end: "01:00 PM" }
    ]
  },
  Thursday: {
    active: true,
    slots: [
      { id: "6", start: "09:00 AM", end: "01:00 PM" },
      { id: "7", start: "02:00 PM", end: "06:00 PM" }
    ]
  },
  Friday: {
    active: true,
    slots: [
      { id: "8", start: "09:00 AM", end: "01:00 PM" }
    ]
  },
  Saturday: {
    active: false,
    slots: []
  },
  Sunday: {
    active: false,
    slots: []
  }
};

// Mock initial blocked dates (holidays/leaves)
const initialBlockedDates = [
  { id: "1", date: "2026-07-24", reason: "Summer Vacation Trip" },
  { id: "2", date: "2026-07-28", reason: "Dentist Appointment" }
];

export default function Availability() {
  const navigate = useNavigate();

  // Weekly schedule & blocked dates state
  const [weeklySchedule, setWeeklySchedule] = useState(initialWeeklySchedule);
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);

  // Form input for blocking a new date
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  // UI state messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Time slots parameters helper for selection options
  const timeOptions = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
  ];

  // Toggle Day active status
  const handleToggleDay = (day) => {
    setWeeklySchedule(prev => {
      const dayData = prev[day];
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

  // Add Time Slot for a day
  const handleAddSlot = (day) => {
    setWeeklySchedule(prev => {
      const dayData = prev[day];
      const newSlot = { id: Date.now().toString(), start: "09:00 AM", end: "05:00 PM" };
      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: [...dayData.slots, newSlot]
        }
      };
    });
  };

  // Modify slot details
  const handleModifySlot = (day, slotId, field, value) => {
    setWeeklySchedule(prev => {
      const dayData = prev[day];
      const updatedSlots = dayData.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s);
      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: updatedSlots
        }
      };
    });
  };

  // Delete slot details
  const handleDeleteSlot = (day, slotId) => {
    setWeeklySchedule(prev => {
      const dayData = prev[day];
      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: dayData.slots.filter(s => s.id !== slotId)
        }
      };
    });
  };

  // Add Block Date (holiday)
  const handleAddBlockDate = (e) => {
    e.preventDefault();
    if (!newBlockDate || !newBlockReason) return;

    if (blockedDates.some(b => b.date === newBlockDate)) {
      setErrorMsg("This date is already blocked.");
      setTimeout(() => setErrorMsg(""), 2500);
      return;
    }

    const block = {
      id: Date.now().toString(),
      date: newBlockDate,
      reason: newBlockReason
    };

    setBlockedDates([...blockedDates, block]);
    setNewBlockDate("");
    setNewBlockReason("");
  };

  // Remove Block Date
  const handleRemoveBlockDate = (id) => {
    setBlockedDates(blockedDates.filter(b => b.id !== id));
  };

  // Reset Schedule Changes
  const handleResetSchedule = () => {
    setWeeklySchedule(initialWeeklySchedule);
    setBlockedDates(initialBlockedDates);
    setSuccessMsg("Schedule reset to default presets.");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  // Save Schedule Changes
  const handleSaveSchedule = async () => {
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    await new Promise(resolve => setTimeout(resolve, 1500));

    let valid = true;
    Object.keys(weeklySchedule).forEach(day => {
      const dayData = weeklySchedule[day];
      if (dayData.active && dayData.slots.length === 0) {
        valid = false;
      }
    });

    if (!valid) {
      setErrorMsg("Active days must contain at least one time slot. Toggle inactive or add a slot.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setSuccessMsg("Availability configurations updated successfully!");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // Render Mini Calendar for visual representation
  const renderMiniCalendar = () => {
    const daysInMonth = 31;
    const startDayOffset = 3;

    const calendarDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `2026-07-${i < 10 ? '0' + i : i}`;
      const isBlocked = blockedDates.some(b => b.date === dateStr);
      calendarDays.push({ dayNum: i, dateStr, isBlocked });
    }

    return (
      <div className="border border-[#E8DCC3] p-5 rounded-2xl bg-white shadow-2xs">
        <span className="text-xs font-bold text-[#1F1D1A] block mb-3 flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-[#C9A46A]" /> Visual Month View (July 2026)
        </span>
        
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#7A7266] mb-2 uppercase tracking-wide">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {[...Array(startDayOffset)].map((_, idx) => (
            <span key={`offset-${idx}`} className="h-7"></span>
          ))}

          {calendarDays.map(day => (
            <span 
              key={day.dayNum}
              className={`h-7 w-7 text-[10px] font-bold rounded-lg flex items-center justify-center mx-auto transition-colors ${
                day.isBlocked
                  ? "bg-[#8C4B3E] text-white font-bold shadow-2xs"
                  : "bg-[#FAF6F0] text-[#1F1D1A] border border-[#E8DCC3]/60"
              }`}
              title={day.isBlocked ? "Blocked leave" : "Available day"}
            >
              {day.dayNum}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-semibold text-[#7A7266]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#FAF6F0] border border-[#E8DCC3]"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#8C4B3E]"></span>
            <span>Blocked / Off</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] border-b border-[#E8DCC3] py-8 text-[#1F1D1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">Availability & Scheduling</h1>
              <p className="text-[#5A5146] text-xs sm:text-sm font-medium">Configure daily operational hours, add custom break windows, or block vacation days</p>
            </div>
            
            <Link to="/provider/dashboard">
              <Button size="sm" className="bg-[#C9A46A] hover:bg-[#b89359] border border-[#E8DCC3] rounded-xl text-white text-xs font-bold px-5 h-9.5 shadow-2xs cursor-pointer">
                <ArrowLeft className="h-4 w-4 text-white mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#2B522B]" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl shadow-2xs">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#8C4B3E]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: WEEKLY AVAILABILITY GRID */}
            <div className="lg:col-span-7 space-y-6">
              
              <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-6">
                <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center gap-3">
                  <div className="p-2.5 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#1F1D1A]">Weekly Shift Schedule</CardTitle>
                    <CardDescription className="text-xs text-[#7A7266]">Configure daily slots. Gray indicates off-duty days.</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6 space-y-4 font-sans">
                  {Object.keys(weeklySchedule).map((day) => {
                    const dayData = weeklySchedule[day];
                    return (
                      <div 
                        key={day} 
                        className={`p-4 border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4.5 transition-all ${
                          dayData.active 
                            ? "bg-white border-[#E8DCC3] shadow-2xs" 
                            : "bg-[#FAF6F0] border-[#E8DCC3]/60 opacity-80"
                        }`}
                      >
                        
                        {/* Day & Toggle switch */}
                        <div className="flex items-center gap-3.5 shrink-0 min-w-[150px]">
                          <Switch 
                            checked={dayData.active} 
                            onCheckedChange={() => handleToggleDay(day)} 
                            disabled={isSaving}
                            className="data-[state=checked]:bg-[#C9A46A]"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#1F1D1A] block">{day}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              dayData.active ? "text-[#2B522B]" : "text-[#7A7266]"
                            }`}>
                              {dayData.active ? "Available" : "Unavailable / Off"}
                            </span>
                          </div>
                        </div>

                        {/* Slots widgets */}
                        <div className="flex-1 w-full space-y-3.5">
                          {dayData.active ? (
                            dayData.slots.map((slot) => (
                              <div key={slot.id} className="flex items-center gap-2.5 flex-wrap">
                                
                                <div className="flex items-center gap-2 border border-[#E8DCC3] bg-[#FAF6F0] p-1.5 rounded-xl text-xs font-semibold text-[#1F1D1A]">
                                  <div className="relative">
                                    <select
                                      value={slot.start}
                                      onChange={(e) => handleModifySlot(day, slot.id, "start", e.target.value)}
                                      disabled={isSaving}
                                      className="h-7 border-0 bg-transparent text-xs font-bold text-[#1F1D1A] pr-5 appearance-none focus:outline-none cursor-pointer"
                                    >
                                      {timeOptions.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 absolute right-0 top-[50%] translate-y-[-50%] pointer-events-none text-[#C9A46A]" />
                                  </div>

                                  <span className="text-[#5A5146] font-medium">to</span>

                                  <div className="relative">
                                    <select
                                      value={slot.end}
                                      onChange={(e) => handleModifySlot(day, slot.id, "end", e.target.value)}
                                      disabled={isSaving}
                                      className="h-7 border-0 bg-transparent text-xs font-bold text-[#1F1D1A] pr-5 appearance-none focus:outline-none cursor-pointer"
                                    >
                                      {timeOptions.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 absolute right-0 top-[50%] translate-y-[-50%] pointer-events-none text-[#C9A46A]" />
                                  </div>

                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(day, slot.id)}
                                  disabled={isSaving}
                                  className="text-[#8C4B3E] hover:underline p-1.5 transition-all cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                              </div>
                            ))
                          ) : (
                            <span className="text-[11px] font-medium text-[#7A7266] italic">No bookings accepted on this day</span>
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
                            className="border-[#E8DCC3] bg-[#FAF6F0] hover:bg-[#F0E7D5] text-[#1F1D1A] font-bold h-8 rounded-xl text-[10px] uppercase tracking-wide flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Slot
                          </Button>
                        )}

                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* SAVE / RESET PANEL */}
              <div className="flex items-center justify-end gap-3.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetSchedule}
                  disabled={isSaving}
                  className="border-[#E8DCC3] bg-[#FAF6F0] hover:bg-[#F0E7D5] text-[#5A5146] font-bold text-xs h-10 px-5 rounded-xl transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 mr-1" /> Reset Defaults
                </Button>

                <Button
                  type="button"
                  onClick={handleSaveSchedule}
                  disabled={isSaving}
                  className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-2xs cursor-pointer transition-all border border-[#E8DCC3] flex items-center justify-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-white" />
                      Save Shift Schedule
                    </>
                  )}
                </Button>
              </div>

            </div>

            {/* RIGHT COLUMN: HOLIDAYS LEAVES AND MINI CALENDAR */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* MINI CALENDAR VIEW */}
              {renderMiniCalendar()}

              {/* VACATION LEAVE BLOCKER */}
              <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider block border-b border-[#E8DCC3] pb-2.5">Block Holidays / Leaves</span>
                
                <form onSubmit={handleAddBlockDate} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="blockDate" className="text-xs font-bold text-[#1F1D1A]">Select Date</Label>
                    <Input
                      id="blockDate"
                      type="date"
                      value={newBlockDate}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                      disabled={isSaving}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="blockReason" className="text-xs font-bold text-[#1F1D1A]">Reason / Holiday Name</Label>
                    <Input
                      id="blockReason"
                      placeholder="e.g. Summer Vacation, Doctor Visit"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                      disabled={isSaving}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-[#C9A46A] hover:bg-[#b89359] text-white h-10 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs border border-[#E8DCC3]"
                  >
                    <Coffee className="h-4 w-4 text-white" /> Block Selected Date
                  </Button>
                </form>
              </Card>

              {/* LIST OF BLOCKED DATES */}
              <Card className="border border-[#E8DCC3] shadow-2xs bg-white rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider block border-b border-[#E8DCC3] pb-2.5">Blocked Dates List</span>
                
                {blockedDates.length === 0 ? (
                  <p className="text-xs text-[#7A7266] font-medium text-center py-2.5">No holidays or leaves blocked for this month.</p>
                ) : (
                  <div className="space-y-2.5">
                    {blockedDates.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 border border-[#E8DCC3] rounded-xl bg-[#FAF6F0] shadow-2xs group hover:border-[#C9A46A] transition-colors">
                        <div>
                          <span className="text-[10px] font-bold text-[#C9A46A] block">{b.date}</span>
                          <h5 className="font-bold text-[#1F1D1A] text-xs mt-0.5">{b.reason}</h5>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBlockDate(b.id)}
                          disabled={isSaving}
                          className="text-[#8C4B3E] hover:underline p-1.5 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
