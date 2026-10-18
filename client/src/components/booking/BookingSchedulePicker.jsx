import React from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const timeSlots = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
];

export function BookingSchedulePicker({
  selectedDate,
  onDateChange,
  selectedTimeSlot,
  onTimeChange,
  dateAlert,
  timeAlert,
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="card-chai p-6 space-y-4">
      <h3 className="font-display font-semibold text-sm text-foreground">
        Choose date and time
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5 text-muted-foreground" />
            Service date *
          </label>
          <Input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className={`h-9 border-border bg-card/40 rounded-md text-xs ${
              dateAlert ? "border-red-500" : ""
            }`}
          />
          {dateAlert && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" />
              Please select a service date
            </p>
          )}
        </div>

        {/* Time Slot Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground" />
            Preferred time slot *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeChange(slot)}
                  className={`h-8.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold border-primary"
                      : "bg-card/40 text-muted-foreground border-border/80 hover:bg-card hover:text-foreground"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {timeAlert && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="size-3" />
              Please select a preferred time slot
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
