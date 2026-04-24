import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.jsx";
import { Button } from "./button.jsx";
import { Calendar } from "./calendar.jsx";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/utils.js";

/**
 * Parse a date string safely without timezone issues.
 * Handles "YYYY-MM-DD" format by parsing as local time.
 */
function parseLocalDate(dateStr) {
  if (!dateStr) return undefined;
  const dateOnly = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
  return new Date(year, month - 1, day);
}

function DatePickerPopover({ date, onDateChange, maxDate, placeholder, className }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (d) => {
    // Format as YYYY-MM-DD in local timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    onDateChange(`${year}-${month}-${day}`);
    setOpen(false);
  };

  const selectedDate = parseLocalDate(date);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9 justify-start text-left font-normal", className)}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          {date || placeholder || "Pilih tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={selectedDate}
          onSelect={handleSelect}
          maxDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePickerPopover };
