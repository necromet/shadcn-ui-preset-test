import { useState, useMemo } from "react"
import { Calendar, Heart, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { Progress } from "../ui/progress.jsx"
import { Separator } from "../ui/separator.jsx"
import { cn } from "../../lib/utils.js"
import { getCareVisitData } from "../../data/mock.js"

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

function getVisitIntensityClass(count) {
  if (count === 0) return "bg-muted"
  if (count === 1) return "bg-primary/20"
  if (count === 2) return "bg-primary/40"
  if (count === 3) return "bg-primary/70"
  return "bg-primary"
}

function getCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const weeks = []
  let currentWeek = new Array(7).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDay + day - 1) % 7
    currentWeek[dayOfWeek] = day

    if (dayOfWeek === 6 || day === daysInMonth) {
      weeks.push(currentWeek)
      currentWeek = new Array(7).fill(null)
    }
  }

  return weeks
}

export function CareVisitTracker() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)) // April 2026

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthLabel = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })

  const allVisits = useMemo(() => getCareVisitData(), [])

  const monthVisits = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`
    return allVisits.filter((v) => v.date.startsWith(prefix))
  }, [allVisits, year, month])

  const visitCountsByDay = useMemo(() => {
    const counts = {}
    monthVisits.forEach((v) => {
      const day = parseInt(v.date.split("-")[2], 10)
      counts[day] = (counts[day] || 0) + 1
    })
    return counts
  }, [monthVisits])

  const calendarGrid = useMemo(() => getCalendarGrid(year, month), [year, month])

  const totalVisits = monthVisits.length
  const completionRate = 78
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const avgVisitsPerDay = daysInMonth > 0 ? (totalVisits / daysInMonth).toFixed(1) : 0

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Care Visit Tracker</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7" onClick={handlePrevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">{monthLabel}</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={handleNextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map((label, i) => (
            <div
              key={`${label}-${i}`}
              className="size-10 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {calendarGrid.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((day, dayIdx) => {
              const visitCount = day ? visitCountsByDay[day] || 0 : 0
              return (
                <div
                  key={dayIdx}
                  className={cn(
                    "size-10 rounded-sm flex items-center justify-center text-xs",
                    day ? getVisitIntensityClass(visitCount) : "bg-transparent",
                    day && visitCount >= 4 ? "text-primary-foreground font-medium" : "text-foreground"
                  )}
                >
                  {day || ""}
                </div>
              )
            })}
          </div>
        ))}

        <Separator className="my-4" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{totalVisits}</p>
            <p className="text-xs text-muted-foreground">Total Visits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Completion</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{avgVisitsPerDay}</p>
            <p className="text-xs text-muted-foreground">Avg/Day</p>
          </div>
        </div>

        {/* Completion progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Visit Completion Rate</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {[
            { label: "0", cls: "bg-muted" },
            { label: "1", cls: "bg-primary/20" },
            { label: "2", cls: "bg-primary/40" },
            { label: "3", cls: "bg-primary/70" },
            { label: "4+", cls: "bg-primary" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className={cn("size-3 rounded-sm", item.cls)} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
