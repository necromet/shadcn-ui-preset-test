import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { buttonVariants } from "./button.jsx";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 40 + i);

const Calendar = React.forwardRef(({ className, classNames, selected, onSelect, maxDate, minDate, onSelectClose, ...props }, ref) => {
  const [currentMonth, setCurrentMonth] = React.useState(selected ? new Date(selected) : new Date());
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [showYearPicker, setShowYearPicker] = React.useState(false);

  const days = React.useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const daysArray = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      daysArray.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remainingDays = 42 - daysArray.length;
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return daysArray;
  }, [currentMonth]);

  const isDisabled = (date) => {
    if (maxDate && date > maxDate) return true;
    if (minDate && date < minDate) return true;
    return false;
  };

  const isSelected = (date) => {
    if (!selected) return false;
    const d = new Date(selected);
    return (
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleMonthChange = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
  };

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };

  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 px-2 text-sm font-medium"
              )}
            >
              {MONTHS[currentMonth.getMonth()]}
            </button>
            {showMonthPicker && (
              <div className="absolute top-full left-0 z-50 mt-1 w-[140px] max-h-[200px] overflow-y-auto rounded-lg border bg-popover p-1 shadow-lg">
                {MONTHS.map((month, idx) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthChange(idx)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors",
                      currentMonth.getMonth() === idx
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 px-2 text-sm font-medium min-w-[70px]"
              )}
            >
              {currentMonth.getFullYear()}
            </button>
            {showYearPicker && (
              <div className="absolute top-full left-0 z-50 mt-1 w-[100px] max-h-[200px] overflow-y-auto rounded-lg border bg-popover p-1 shadow-lg">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearChange(year)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors",
                      currentMonth.getFullYear() === year
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth }, idx) => {
          const disabled = isDisabled(date);
          const selectedDate = isSelected(date);
          const today = isToday(date);

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSelect?.(date);
                onSelectClose?.();
              }}
              className={cn(
                "h-8 w-8 text-sm rounded-md flex items-center justify-center transition-colors",
                !isCurrentMonth && "text-muted-foreground/40",
                isCurrentMonth && !disabled && "hover:bg-muted",
                disabled && "cursor-not-allowed opacity-40",
                selectedDate && "bg-primary text-primary-foreground hover:bg-primary",
                today && !selectedDate && "border border-primary"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
});
Calendar.displayName = "Calendar";

export { Calendar };
