import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
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
  Info,
  Lock,
  ArrowLeft,
  AlertCircle,
  Coffee,
  Check
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

    // Check if date is already blocked
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

    // Simulate backend patch call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Confirm slots are not empty for active days
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
    // Current month is July 2026 for mock scheduling purposes
    const daysInMonth = 31;
    const startDayOffset = 3; // Wednesday (Wednesday offset is 3 days in grid)
    const weeksCount = Math.ceil((daysInMonth + startDayOffset) / 7);

    // Collect status of dates
    const calendarDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `2026-07-${i < 10 ? '0' + i : i}`;
      const isBlocked = blockedDates.some(b => b.date === dateStr);
      calendarDays.push({ dayNum: i, dateStr, isBlocked });
    }

    return (
      <div className="border border-slate-100 p-4.5 rounded-2xl bg-white shadow-2xs">
        <span className="text-xs font-bold text-slate-800 block mb-3 flex items-center gap-1">
          <CalendarIcon className="h-4 w-4 text-primary" /> Visual Month View (July 2026)
        </span>
        
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Day offsets */}
          {[...Array(startDayOffset)].map((_, idx) => (
            <span key={`offset-${idx}`} className="h-7"></span>
          ))}

          {/* Actual days */}
          {calendarDays.map(day => (
            <span 
              key={day.dayNum}
              className={`h-7 w-7 text-[10px] font-black rounded-lg flex items-center justify-center mx-auto transition-colors ${
                day.isBlocked
                  ? "bg-rose-500 text-white font-black shadow-2xs"
                  : "bg-emerald-50 text-emerald-800"
              }`}
              title={day.isBlocked ? "Blocked leave" : "Available day"}
            >
              {day.dayNum}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-500">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-50 border border-emerald-200"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500"></span>
            <span>Blocked / Off</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-primary via-secondary to-primary text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Availability & Scheduling</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Configure daily operational hours, add custom break windows, or block vacation days</p>
            </div>
            
            {/* Quick dashboard back button */}
            <Link to="/provider/dashboard">
              <Button size="sm" className="bg-white/10 hover:bg-white/15 border border-white/5 rounded-full text-white text-xs font-bold px-5 h-9.5 backdrop-blur-xs">
                <ArrowLeft className="h-4 w-4 text-white/60 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: WEEKLY AVAILABILITY GRID */}
            <div className="lg:col-span-7 space-y-6">
              
              <Card className="border border-slate-100 shadow-md bg-white rounded-2xl p-6">
                <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-primary/5 text-primary rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-extrabold text-slate-900">Weekly Shift Schedule</CardTitle>
                    <CardDescription className="text-xs">Configure daily slots. Gray indicates off-duty days.</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6 space-y-6">
                  {Object.keys(weeklySchedule).map((day) => {
                    const dayData = weeklySchedule[day];
                    return (
                      <div 
                        key={day} 
                        className={`p-4 border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4.5 transition-all ${
                          dayData.active 
                            ? "bg-white border-slate-200" 
                            : "bg-slate-50 border-slate-100 opacity-70"
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
                            <span className="text-xs font-black text-slate-900 block">{day}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              dayData.active ? "text-emerald-600" : "text-slate-400"
                            }`}>
                              {dayData.active ? "Available" : "Unavailable / Off"}
                            </span>
                          </div>
                        </div>

                        {/* Slots widgets */}
                        <div className="flex-1 w-full space-y-3.5">
                          {dayData.active ? (
                            dayData.slots.map((slot, index) => (
                              <div key={slot.id} className="flex items-center gap-2.5 flex-wrap">
                                
                                <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-1.5 rounded-xl text-xs font-semibold text-slate-700">
                                  {/* Start Time Option select */}
                                  <div className="relative">
                                    <select
                                      value={slot.start}
                                      onChange={(e) => handleModifySlot(day, slot.id, "start", e.target.value)}
                                      disabled={isSaving}
                                      className="h-7 border-0 bg-transparent text-xs font-bold text-slate-800 pr-5 appearance-none focus:outline-none"
                                    >
                                      {timeOptions.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 absolute right-0 top-[50%] translate-y-[-50%] pointer-events-none text-slate-400" />
                                  </div>

                                  <span className="text-slate-350">to</span>

                                  {/* End Time Option select */}
                                  <div className="relative">
                                    <select
                                      value={slot.end}
                                      onChange={(e) => handleModifySlot(day, slot.id, "end", e.target.value)}
                                      disabled={isSaving}
                                      className="h-7 border-0 bg-transparent text-xs font-bold text-slate-800 pr-5 appearance-none focus:outline-none"
                                    >
                                      {timeOptions.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 absolute right-0 top-[50%] translate-y-[-50%] pointer-events-none text-slate-400" />
                                  </div>

                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(day, slot.id)}
                                  disabled={isSaving}
                                  className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400 italic">No bookings accepted on this day</span>
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
                            className="border-slate-200 hover:bg-slate-50 text-slate-650 font-bold h-8 rounded-lg text-[9px] uppercase tracking-wide flex items-center gap-1 shrink-0 ml-auto"
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
                  className="border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs h-10 px-5 rounded-xl transition-all"
                >
                  <RotateCcw className="h-4 w-4 mr-1" /> Reset Defaults
                </Button>

                <Button
                  type="button"
                  onClick={handleSaveSchedule}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary text-white font-bold text-xs h-10 px-6 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
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
              <Card className="border border-slate-100 shadow-2xs bg-white rounded-2xl p-5 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2">Block Holidays / Leaves</span>
                
                <form onSubmit={handleAddBlockDate} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="blockDate" className="text-[11px] font-bold text-slate-700">Select Date</Label>
                    <Input
                      id="blockDate"
                      type="date"
                      value={newBlockDate}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="h-9.5 border-slate-200 focus:ring-2 focus:ring-primary rounded-xl text-xs bg-white"
                      disabled={isSaving}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="blockReason" className="text-[11px] font-bold text-slate-700">Reason / Holiday Name</Label>
                    <Input
                      id="blockReason"
                      placeholder="e.g. Summer Vacation, Doctor Visit"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      className="h-9.5 border-slate-200 focus:ring-2 focus:ring-primary rounded-xl text-xs bg-white"
                      disabled={isSaving}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-slate-900 hover:bg-black text-white h-9.5 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                  >
                    <Coffee className="h-4 w-4 text-amber-400" /> Block Selected Date
                  </Button>
                </form>
              </Card>

              {/* LIST OF BLOCKED DATES */}
              <Card className="border border-slate-100 shadow-2xs bg-white rounded-2xl p-5 space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-2">Blocked Dates List</span>
                
                {blockedDates.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-semibold text-center py-2.5">No holidays or leaves blocked for this month.</p>
                ) : (
                  <div className="space-y-2.5">
                    {blockedDates.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 border border-slate-150 rounded-xl bg-white shadow-2xs group hover:border-slate-250 transition-colors">
                        <div>
                          <span className="text-[9px] font-bold text-slate-450 block">{b.date}</span>
                          <h5 className="font-extrabold text-slate-800 text-xs mt-0.5">{b.reason}</h5>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBlockDate(b.id)}
                          disabled={isSaving}
                          className="text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity p-1.5"
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
    </MainLayout>
  );
}

// Chevron selector icon
function ChevronDown(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
