import { useState, useEffect } from "react"
import {
  Calendar, MapPin, FileText, Tag, Sparkles, AlertCircle, CalendarPlus, CalendarClock,
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../ui/dialog.jsx"
import { Button } from "../ui/button.jsx"
import { Input } from "../ui/input.jsx"
import { Label } from "../ui/label.jsx"
import { DatePickerPopover } from "../ui/date-picker-popover.jsx"
import { cn } from "../../lib/utils.js"

const CATEGORIES = [
  { value: "Camp", label: "Camp", color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300", active: "bg-blue-100 border-blue-400 ring-2 ring-blue-400/30 dark:bg-blue-900/50 dark:border-blue-500" },
  { value: "Retreat", label: "Retreat", color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300", active: "bg-purple-100 border-purple-400 ring-2 ring-purple-400/30 dark:bg-purple-900/50 dark:border-purple-500" },
  { value: "Quarterly", label: "Quarterly", color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300", active: "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400/30 dark:bg-emerald-900/50 dark:border-emerald-500" },
  { value: "Monthly", label: "Monthly", color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300", active: "bg-orange-100 border-orange-400 ring-2 ring-orange-400/30 dark:bg-orange-900/50 dark:border-orange-500" },
  { value: "Special", label: "Special", color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 dark:bg-pink-950/40 dark:border-pink-800 dark:text-pink-300", active: "bg-pink-100 border-pink-400 ring-2 ring-pink-400/30 dark:bg-pink-900/50 dark:border-pink-500" },
  { value: "Workshop", label: "Workshop", color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300", active: "bg-amber-100 border-amber-400 ring-2 ring-amber-400/30 dark:bg-amber-900/50 dark:border-amber-500" },
]

const emptyForm = {
  event_name: "",
  event_date: "",
  category: "",
  location: "",
  description: "",
}

export function EventFormModal({ open, onOpenChange, event, onSubmit }) {
  const isEdit = Boolean(event)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (event) {
      setForm({
        event_name: event.event_name || "",
        event_date: event.event_date || "",
        category: event.category || "",
        location: event.location || "",
        description: event.description || "",
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
    setTouched({})
  }, [event, open])

  function validate() {
    const errs = {}
    if (!form.event_name.trim()) errs.event_name = "Event name is required"
    if (!form.event_date) errs.event_date = "Event date is required"
    if (!form.category) errs.category = "Category is required"
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setTouched({ event_name: true, event_date: true, category: true })
      return
    }
    setSubmitting(true)
    try {
      const data = {
        event_name: form.event_name.trim(),
        event_date: form.event_date,
        category: form.category,
      }
      const trimmedLocation = form.location.trim()
      if (trimmedLocation) data.location = trimmedLocation
      const trimmedDescription = form.description.trim()
      if (trimmedDescription) data.description = trimmedDescription
      await onSubmit(data)
    } catch {
      // Parent handles error toast; keep modal open
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const descLength = form.description.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:rounded-none max-sm:h-full max-sm:max-h-none">
        {/* Header Banner */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent border-b">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
              {isEdit ? (
                <CalendarClock className="size-5 text-primary" />
              ) : (
                <CalendarPlus className="size-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                {isEdit ? "Edit Event" : "Create New Event"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                {isEdit ? "Update the event details below." : "Fill in the details for your new church event."}
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Section: Essential Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Sparkles className="size-3" />
              Essential Details
            </div>

            {/* Event Name */}
            <div className="space-y-1.5">
              <Label htmlFor="event_name" className="text-sm font-medium">
                Event Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                <Input
                  id="event_name"
                  placeholder="e.g. Easter Retreat 2026"
                  value={form.event_name}
                  onChange={(e) => handleChange("event_name", e.target.value)}
                  onBlur={() => handleBlur("event_name")}
                  className={cn(
                    "pl-9 h-10 transition-all duration-200",
                    errors.event_name && touched.event_name && "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
              </div>
              {errors.event_name && touched.event_name && (
                <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="size-3" />
                  {errors.event_name}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Date <span className="text-destructive">*</span>
              </Label>
              <DatePickerPopover
                date={form.event_date}
                onDateChange={(d) => {
                  handleChange("event_date", d)
                  setTouched(prev => ({ ...prev, event_date: true }))
                }}
                placeholder="Select date"
                className="w-full h-10"
              />
              {errors.event_date && touched.event_date && (
                <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="size-3" />
                  {errors.event_date}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = form.category === cat.value
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        handleChange("category", cat.value)
                        setTouched(prev => ({ ...prev, category: true }))
                      }}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer",
                        isActive ? cat.active : cat.color,
                        isActive && "scale-[1.02]"
                      )}
                    >
                      <Tag className={cn("size-3", isActive && "animate-in zoom-in-50 duration-200")} />
                      {cat.label}
                    </button>
                  )
                })}
              </div>
              {errors.category && touched.category && (
                <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="size-3" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-[10px] text-muted-foreground uppercase tracking-widest">Optional</span>
            </div>
          </div>

          {/* Section: Optional Details */}
          <div className="space-y-4">
            {/* Location */}
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm font-medium text-muted-foreground">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                <Input
                  id="location"
                  placeholder="e.g. Gedung Gereja Utama"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <span className={cn(
                  "text-[10px] tabular-nums transition-colors",
                  descLength > 200 ? "text-amber-500" : "text-muted-foreground/50"
                )}>
                  {descLength}/500
                </span>
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-3 size-4 text-muted-foreground/60 pointer-events-none" />
                <textarea
                  id="description"
                  placeholder="Add details about this event..."
                  value={form.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) handleChange("description", e.target.value)
                  }}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none min-w-[140px]"
            >
              {submitting ? (
                <>
                  <svg className="size-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : isEdit ? (
                <>
                  <CalendarClock className="size-4 mr-2" />
                  Update Event
                </>
              ) : (
                <>
                  <CalendarPlus className="size-4 mr-2" />
                  Create Event
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
