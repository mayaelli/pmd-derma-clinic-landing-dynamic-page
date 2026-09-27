"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppointmentPickerProps {
  onSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export function AppointmentPicker({ onSelect, selectedDate, selectedTime }: AppointmentPickerProps) {
  const today = new Date();
  const [date, setDate] = useState<Date>(selectedDate || today);
  const [time, setTime] = useState<string | null>(selectedTime || null);
  const [open, setOpen] = useState(false);

  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "12:30 PM", available: true },
    { time: "01:00 PM", available: true },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "02:30 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "03:30 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "04:30 PM", available: true },
    { time: "05:00 PM", available: true },
  ];

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setTime(null);
    }
  };

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
    onSelect(date, selectedTime);
    setOpen(false); // Close popover after selection
  };

  const displayText = selectedDate && selectedTime
    ? `${format(selectedDate, "MMM d, yyyy")} at ${selectedTime}`
    : "Select date & time";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-auto p-3 border-2 hover:border-slate-300",
            !selectedDate && !selectedTime && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="p-3 sm:pe-5"
            disabled={[{ before: today }]}
          />
          <div className="relative w-full max-sm:h-56 sm:w-44">
            <div className="absolute inset-0 border-slate-200 py-4 max-sm:border-t sm:border-l">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-4">
                    <p className="text-sm font-semibold text-slate-700">
                      {format(date, "EEEE, d")}
                    </p>
                  </div>
                  <div className="grid gap-2 px-4 pb-4">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        type="button"
                        variant={time === timeSlot ? "default" : "outline"}
                        size="sm"
                        className={`w-full ${time === timeSlot
                            ? "bg-[#CD9581] hover:bg-[#B8846F] text-white"
                            : ""
                          }`}
                        onClick={() => handleTimeSelect(timeSlot)}
                        disabled={!available}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
