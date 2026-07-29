import React from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const timeSlots = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM"
];

export function BookingSchedulePicker({
  selectedDate,
  onDateChange,
  selectedTimeSlot,
  onTimeChange,
  dateAlert,
  timeAlert
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4 bg-white p-6 rounded-3xl border border-[#E8DCC3] shadow-sm">
      <h3 className="text-sm font-extrabold text-[#1F1D1A]">Choose Date & Time Slot</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1F1D1A] flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#8C4B3E]" />
            Service Date *
          </label>
          <Input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className={`h-11 border-[#E8DCC3] rounded-xl text-xs bg-[#FAF6F0]/40 ${
              dateAlert ? "border-rose-500 focus:ring-rose-500" : ""
            }`}
          />
          {dateAlert && (
            <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              Please select a service date
            </p>
          )}
        </div>

        {/* Time Slot Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1F1D1A] flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#8C4B3E]" />
            Preferred Time Slot *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeChange(slot)}
                  className={`h-9 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#8C4B3E] text-white border-[#8C4B3E] shadow-xs"
                      : "bg-[#FAF6F0] text-[#5A5146] border-[#E8DCC3] hover:border-[#8C4B3E]"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {timeAlert && (
            <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              Please select a preferred time slot
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
