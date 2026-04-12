import { useState, useEffect, useMemo } from "react"
import {
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Cloud,
  HardDrive,
  Clock,
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { Separator } from "../ui/separator.jsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs.jsx"
import { cn } from "../../lib/utils.js"
import { getEventAttendanceTrend, getEvents } from "../../data/mock.js"

// ─── Shared constants ──────────────────────────────────────────────

const CATEGORIES = [
  { key: "Camp", color: "var(--chart-1)", label: "Camp" },
  { key: "Retreat", color: "var(--chart-2)", label: "Retreat" },
  { key: "Quarterly", color: "var(--chart-3)", label: "Quarterly" },
  { key: "Monthly", color: "var(--chart-4)", label: "Monthly" },
  { key: "Special", color: "var(--chart-5)", label: "Special" },
  { key: "Workshop", color: "var(--chart-6)", label: "Workshop" },
]

const categoryColorMap = {
  Camp: "chart-1",
  Retreat: "chart-2",
  Quarterly: "chart-3",
  Monthly: "chart-4",
  Special: "chart-5",
  Workshop: "chart-6"
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

// ─── Calendar helpers ──────────────────────────────────────────────

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

function formatDateFull(dateStr) {
  // Parse date string directly to avoid timezone issues
  const [year, month, day] = dateStr.split('-')
  const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  const dayStr = d.getUTCDate().toString().padStart(2, "0")
  const monthStr = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  const yearStr = d.getUTCFullYear()
  return `${dayStr} ${monthStr} ${yearStr}`
}

// ─── Trends chart tooltip ──────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-6 py-0.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.dataKey}</span>
          </div>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Calendar tab content ──────────────────────────────────────────

function CalendarView({ allEvents }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthLabel = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })

  const eventsByDay = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`
    const map = {}
    allEvents
      .filter((e) => e.event_date.startsWith(prefix))
      .forEach((event) => {
        const day = parseInt(event.event_date.split("-")[2], 10)
        if (!map[day]) map[day] = []
        map[day].push(event)
      })
    return map
  }, [allEvents, year, month])

  const calendarGrid = useMemo(() => getCalendarGrid(year, month), [year, month])

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null

  const selectedEvents = selectedDay ? eventsByDay[selectedDay] || [] : []

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const handleDayClick = (day) => {
    if (!day) return
    setSelectedDay((prev) => (prev === day ? null : day))
  }

  const totalEvents = Object.values(eventsByDay).reduce((sum, evts) => sum + evts.length, 0)
  const daysWithEvents = Object.keys(eventsByDay).length

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-end gap-1 mb-3">
        <Button variant="ghost" size="icon" className="size-7" onClick={handlePrevMonth}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium min-w-[140px] text-center">{monthLabel}</span>
        <Button variant="ghost" size="icon" className="size-7" onClick={handleNextMonth}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div key={`${label}-${i}`} className="size-10 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {calendarGrid.map((week, weekIdx) => (
        <div key={weekIdx} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day, dayIdx) => {
            const dayEvents = day ? eventsByDay[day] || [] : []
            const hasEvents = dayEvents.length > 0
            const isSelected = day === selectedDay

            return (
              <button
                key={dayIdx}
                disabled={!day}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "size-10 rounded-sm flex flex-col items-center justify-center text-xs transition-all relative",
                  day ? "cursor-pointer hover:bg-accent" : "bg-transparent cursor-default",
                  isSelected && "ring-2 ring-ring ring-offset-1 ring-offset-background bg-accent",
                  !day && "pointer-events-none"
                )}
              >
                {day && (
                  <>
                    <span className={cn("leading-none", hasEvents ? "font-semibold" : "text-muted-foreground")}>
                      {day}
                    </span>
                    {hasEvents && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <span key={i} className={cn("size-1.5 rounded-full", `bg-${categoryColorMap[event.category] || "chart-1"}`)} />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>
      ))}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 mb-3">
        <div className="text-center">
          <p className="text-2xl font-bold">{totalEvents}</p>
          <p className="text-xs text-muted-foreground">Total Events</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{daysWithEvents}</p>
          <p className="text-xs text-muted-foreground">Days with Events</p>
        </div>
      </div>

      {/* Category legend */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {Object.entries(categoryColorMap).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1">
            <span className={cn("size-2.5 rounded-full", `bg-${color}`)} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Selected day event list */}
      {selectedDay && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">{formatDateFull(selectedDateStr)}</h4>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {selectedEvents.length} {selectedEvents.length === 1 ? "event" : "events"}
              </Badge>
            </div>

            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No events on this date</p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEvents.map((event) => {
                  const catColor = categoryColorMap[event.category] || "chart-1"
                  const isSynced = Boolean(event.gcal_event_id)

                  return (
                    <div key={event.event_id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{event.event_name}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] px-1.5 py-0", `bg-${catColor}/20 text-${catColor} border-${catColor}/30`)}
                          >
                            {event.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] px-1.5 py-0 gap-0.5",
                              isSynced
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                            )}
                          >
                            {isSynced ? <Cloud className="size-2.5" /> : <HardDrive className="size-2.5" />}
                            {isSynced ? "Synced" : "Local"}
                          </Badge>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                      )}
                      {isSynced && event.gcal_link && (
                        <a
                          href={event.gcal_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Cloud className="size-3" />
                          View in Google Calendar
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────

export function EventAttendanceTrends() {
  const [rawData, setRawData] = useState([])
  const [allEvents, setAllEvents] = useState([])

  useEffect(() => {
    async function fetchData() {
      const [trendData, eventsData] = await Promise.all([
        getEventAttendanceTrend(),
        getEvents({ limit: 100 }),
      ])
      setRawData(trendData)
      setAllEvents(eventsData)
    }
    fetchData()
  }, [])

  const totalEvents = allEvents.length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Events</CardTitle>
        </div>
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="size-3" />
          {totalEvents} total
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends">
          <TabsList className="mb-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rawData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                  />
                  {CATEGORIES.map((cat) => (
                    <Line
                      key={cat.key}
                      type="monotone"
                      dataKey={cat.key}
                      stroke={cat.color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView allEvents={allEvents} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
