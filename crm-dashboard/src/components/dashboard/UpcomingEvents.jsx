import { useState, useEffect, useMemo } from "react"
import { Calendar, MapPin, Cloud, HardDrive, Filter, PlusCircleIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { Separator } from "../ui/separator.jsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx"
import { cn } from "../../lib/utils.js"
import { getUpcomingEvents } from "../../data/mock.js"

const categoryColors = {
  Camp: "chart-1",
  Retreat: "chart-2",
  Quarterly: "chart-3",
  Monthly: "chart-4",
  Special: "chart-5",
  Workshop: "chart-6"
}

const categories = ["Camp", "Retreat", "Quarterly", "Monthly", "Special", "Workshop"]

function formatDate(dateStr) {
  // Parse date string directly to avoid timezone issues
  const [year, month, day] = dateStr.split('-')
  const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  const dayStr = d.getUTCDate().toString().padStart(2, "0")
  const monthStr = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })
  const yearStr = d.getUTCFullYear()
  return `${dayStr} ${monthStr} ${yearStr}`
}

function formatRelativeDate(dateStr) {
  // Parse date string directly to avoid timezone issues
  const [year, month, day] = dateStr.split('-')
  const eventDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0))
  const now = new Date()
  now.setUTCHours(12, 0, 0, 0)
  const diffMs = eventDate - now
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
  return `In ${diffDays} days`
}

export function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [sourceFilter, setSourceFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    async function fetchEvents() {
      const eventsData = await getUpcomingEvents(7)
      setEvents(eventsData)
    }
    fetchEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Source filter
      if (sourceFilter === "google" && !event.gcal_event_id) return false
      if (sourceFilter === "local" && event.gcal_event_id) return false

      // Category filter
      if (categoryFilter !== "all" && event.category !== categoryFilter) return false

      return true
    })
  }, [events, sourceFilter, categoryFilter])

  const hasActiveFilters = sourceFilter !== "all" || categoryFilter !== "all"

  function clearFilters() {
    setSourceFilter("all")
    setCategoryFilter("all")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-muted-foreground" />
            <CardTitle>Upcoming Events</CardTitle>
          </div>
        </div>
        <CardDescription>What&apos;s happening in the next 7 days</CardDescription>

        {/* Smart Filters */}
        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span>Filter:</span>
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="google">
                <span className="flex items-center gap-1.5">
                  <Cloud className="size-3.5" />
                  Google Calendar
                </span>
              </SelectItem>
              <SelectItem value="local">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="size-3.5" />
                  Local Only
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
              onClick={clearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="size-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? "No events match your filters"
                : "No upcoming events in the next 7 days"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="link"
                size="sm"
                className="mt-1 text-xs"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          filteredEvents.map((event, idx) => {
            const catColor = categoryColors[event.category] || "chart-1"
            const isSynced = Boolean(event.gcal_event_id)

            return (
              <div key={event.event_id}>
                {idx > 0 && <Separator className="mb-4" />}
                <div className="flex flex-col gap-3">
                  {/* Header: title + badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{event.event_name}</CardTitle>
                        {/* Sync Status Badge */}
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 gap-1 text-[10px] px-1.5 py-0",
                            isSynced
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                          )}
                        >
                          {isSynced ? (
                            <Cloud className="size-3" />
                          ) : (
                            <HardDrive className="size-3" />
                          )}
                          {isSynced ? "Synced" : "Local"}
                        </Badge>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5" />
                          {formatDate(event.event_date)}
                        </span>
                        <span className="text-xs font-medium text-foreground/60">
                          {formatRelativeDate(event.event_date)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {event.location}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0",
                        `bg-${catColor}/20 text-${catColor} border-${catColor}/30`
                      )}
                    >
                      {event.category}
                    </Badge>
                  </div>

                  {/* GCal link when synced */}
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
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
