import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.jsx";
import { Button } from "./button.jsx";

function SelectPopover({ value, onValueChange, options, placeholder, className, align = "start" }) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optValue) => {
    onValueChange(optValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("justify-start text-left font-normal", className)}
        >
          {selectedOption?.label || placeholder || "Select..."}
          <ChevronDown className="h-4 w-4 ml-auto shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-1" align={align}>
        <div className="flex flex-col gap-0.5">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer",
                value === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { SelectPopover };
