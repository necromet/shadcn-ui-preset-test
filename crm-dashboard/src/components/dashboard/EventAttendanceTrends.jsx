import { useState, useEffect, useMemo } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Cloud,
  HardDrive,
  Clock,
  Cake,
  Gift,
  ArrowUpRightFromSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { Separator } from "../ui/separator.jsx"
import { cn } from "../../lib/utils.js"
import { getEvents, getBirthdayMembers } from "../../data/mock.js"

const API_BASE = import.meta.env.VITE_API_URL

// ─── Shared constants ──────────────────────────────────────────────

const CATEGORIES = [
  { key: "Camp", color: "var(--chart-1)", label: "Camp" },
  { key: "Retreat", color: "var(--chart-2)", label: "Retreat" },
  { key: "Quarterly", color: "var(--chart-3)", label: "Quarterly" },
  { key: "Monthly", color: "var(--chart-4)", label: "Monthly" },
  { key: "Special", color: "var(--chart-5)", label: "Special" },
  { key: "Workshop", color: "var(--chart-6)", label: "Workshop" },
  { key: "Birthday", color: "var(--chart-7)", label: "Birthday" },
]

const categoryColorVar = {
  Camp: "var(--chart-1)",
  Retreat: "var(--chart-2)",
  Quarterly: "var(--chart-3)",
  Monthly: "var(--chart-4)",
  Special: "var(--chart-5)",
  Workshop: "var(--chart-6)",
  Birthday: "var(--chart-7)",
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

// ─── Helpers ───────────────────────────────────────────────────────

function toWhatsAppNumber(phone) {
  if (!phone) return ""
  return phone.startsWith("0") ? "62" + phone.slice(1) : phone
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

function formatDateFull(dateStr) {
  const [year, month, day] = dateStr.split('-')
  const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  const dayStr = d.getUTCDate().toString().padStart(2, "0")
  const monthStr = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  const yearStr = d.getUTCFullYear()
  return `${dayStr} ${monthStr} ${yearStr}`
}

function formatShortDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  return d.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
}

// ─── Calendar view ─────────────────────────────────────────────────

function CalendarView({ allEvents, birthdayMembers }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthLabel = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })

  const eventsByDay = useMemo(() => {
    const map = {}
    allEvents
      .filter((e) => {
        const eventDate = new Date(e.event_date)
        return eventDate.getFullYear() === year && eventDate.getMonth() === month
      })
      .forEach((event) => {
        const day = new Date(event.event_date).getDate()
        if (!map[day]) map[day] = []
        map[day].push({ ...event, _type: "event" })
      })
    birthdayMembers
      .filter((m) => m.bulan_lahir === month + 1)
      .forEach((member) => {
        const day = new Date(member.tanggal_lahir).getDate()
        if (!map[day]) map[day] = []
        map[day].push({
          _type: "birthday",
          event_id: `bday-${member.no_jemaat}`,
          event_name: member.nama_jemaat,
          event_date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          category: "Birthday",
          location: null,
          description: `Birthday - ${member.nama_jemaat}`,
          gcal_event_id: null,
          gcal_link: null,
          no_handphone: member.no_handphone,
        })
      })
    return map
  }, [allEvents, birthdayMembers, year, month])

  const calendarGrid = useMemo(() => getCalendarGrid(year, month), [year, month])

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null

  const selectedItems = selectedDay ? eventsByDay[selectedDay] || [] : []

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

  const monthEvents = allEvents.filter((e) => {
    const d = new Date(e.event_date)
    return d.getFullYear() === year && d.getMonth() === month
  }).sort((a, b) => new Date(a.event_date) - new Date(b.event_date))

  const monthBirthdays = birthdayMembers
    .filter((m) => m.bulan_lahir === month + 1)
    .sort((a, b) => new Date(a.tanggal_lahir).getDate() - new Date(b.tanggal_lahir).getDate())

  const totalItems = monthEvents.length + monthBirthdays.length
  const daysWithItems = Object.keys(eventsByDay).length

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Calendar */}
      <div className="flex-1 min-w-0">
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
              const dayItems = day ? eventsByDay[day] || [] : []
              const hasItems = dayItems.length > 0
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
                      <span className={cn("leading-none", hasItems ? "font-semibold" : "text-muted-foreground")}>
                        {day}
                      </span>
                      {hasItems && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayItems.slice(0, 3).map((item, i) => (
                            <span
                              key={i}
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: categoryColorVar[item.category] || "var(--chart-1)" }}
                            />
                          ))}
                          {dayItems.length > 3 && (
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
            <p className="text-2xl font-bold">{totalItems}</p>
            <p className="text-xs text-muted-foreground">Events & Birthdays</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{daysWithItems}</p>
            <p className="text-xs text-muted-foreground">Days with Items</p>
          </div>
        </div>

        {/* Category legend */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="flex items-center gap-1">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-muted-foreground">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">{formatDateFull(selectedDateStr)}</h4>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"}
                </Badge>
              </div>

              {selectedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No events on this date</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {selectedItems.map((item) => {
                    const color = categoryColorVar[item.category] || "var(--chart-1)"

                    if (item._type === "birthday") {
                      const waNumber = toWhatsAppNumber(item.no_handphone)
                      return (
                        <div
                          key={item.event_id}
                          className="rounded-lg border p-3 space-y-2"
                          style={{ borderColor: `color-mix(in srgb, ${color} 30%, transparent)` }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <Cake className="size-4" style={{ color }} />
                            <p className="text-sm font-semibold">{item.event_name}</p>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                                color: color,
                                borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
                              }}
                            >
                              Birthday
                            </Badge>
                          </div>
                          {waNumber && (
                            <a
                              href={`https://wa.me/${waNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors"
                            >
                              <ArrowUpRightFromSquare className="size-3" />
                              WhatsApp
                            </a>
                          )}
                        </div>
                      )
                    }

                    const isSynced = Boolean(item.gcal_event_id)

                    return (
                      <div key={item.event_id} className="rounded-lg border p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{item.event_name}</p>
                            {item.location && (
                              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3" />
                                  {item.location}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                                color: color,
                                borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
                              }}
                            >
                              {item.category}
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
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                        {isSynced && item.gcal_link && (
                          <a
                            href={item.gcal_link}
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

      {/* Right: Monthly events list */}
      <div className="lg:w-[280px] shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">This Month</h4>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">
            {monthEvents.length + monthBirthdays.length}
          </Badge>
        </div>

        {monthEvents.length === 0 && monthBirthdays.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No events or birthdays this month</p>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {monthEvents.map((event) => {
              const color = categoryColorVar[event.category] || "var(--chart-1)"
              return (
                <div key={event.event_id} className="flex items-start gap-2.5 p-2 rounded-md hover:bg-accent/50 transition-colors">
                  <span className="size-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight truncate">{event.event_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatShortDate(event.event_date)}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1 py-0 shrink-0"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                      color: color,
                      borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
                    }}
                  >
                    {event.category}
                  </Badge>
                </div>
              )
            })}
            {monthBirthdays.map((member) => {
              const color = "var(--chart-7)"
              const waNumber = toWhatsAppNumber(member.no_handphone)
              return (
                <div key={`bday-${member.no_jemaat}`} className="flex items-start gap-2.5 p-2 rounded-md hover:bg-accent/50 transition-colors">
                  <span className="size-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium leading-tight truncate">{member.nama_jemaat}</p>
                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 transition-colors shrink-0"
                        >
                          <ArrowUpRightFromSquare className="size-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatShortDate(member.tanggal_lahir)} · Birthday
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1 py-0 shrink-0"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                      color: color,
                      borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
                    }}
                  >
                    <Cake className="size-2.5 mr-0.5" />
                    Bday
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────

export function EventAttendanceTrends() {
  const [allEvents, setAllEvents] = useState([])
  const [birthdayMembers, setBirthdayMembers] = useState([])

  useEffect(() => {
    async function fetchData() {
      const [eventsData, bdays] = await Promise.all([
        getEvents({ limit: 100 }),
        getBirthdayMembers(),
      ])
      setAllEvents(eventsData)
      setBirthdayMembers(bdays)
    }
    fetchData()
  }, [])

  const totalEvents = allEvents.length
  const totalBirthdays = birthdayMembers.length

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Events</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar className="size-3" />
            {totalEvents} events
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Cake className="size-3" />
            {totalBirthdays} birthdays
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarView allEvents={allEvents} birthdayMembers={birthdayMembers} />
      </CardContent>
    </Card>
  )
}
