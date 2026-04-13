import { useState, useEffect, useMemo } from "react"
import { Search, Plus, Pencil, Trash2, Calendar, MapPin, ExternalLink, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { getEvents } from "../data/mock.js"
import { EmptyState } from "../components/ui/empty-state.jsx"

const PAGE_SIZE = 10

const CATEGORY_COLORS = {
  Camp: "bg-blue-100 text-blue-800",
  Retreat: "bg-purple-100 text-purple-800",
  Quarterly: "bg-green-100 text-green-800",
  Monthly: "bg-orange-100 text-orange-800",
  Special: "bg-pink-100 text-pink-800",
  Workshop: "bg-yellow-100 text-yellow-800",
}

export function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (err) {
        console.error("Failed to fetch events:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category))
    return [...set].sort()
  }, [events])

  const filteredEvents = useMemo(() => {
    let result = events

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.event_name.toLowerCase().includes(q) ||
          (e.location && e.location.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q))
      )
    }

    if (categoryFilter) {
      result = result.filter((e) => e.category === categoryFilter)
    }

    return result
  }, [events, searchQuery, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE))
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function resetFilters() {
    setSearchQuery("")
    setCategoryFilter("")
    setCurrentPage(1)
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-"
    const [year, month, day] = dateStr.split('-')
    const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
  }

  function formatRelativeDate(dateStr) {
    if (!dateStr) return ""
    const [year, month, day] = dateStr.split('-')
    const eventDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0))
    const now = new Date()
    now.setUTCHours(12, 0, 0, 0)
    const diffMs = eventDate - now
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return "Past"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `In ${diffDays} days`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage church events and activities</p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Events</CardTitle>
          <CardDescription>
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 text-sm border rounded-md bg-background"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {(searchQuery || categoryFilter) && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <Filter className="size-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No events found"
              description={searchQuery || categoryFilter ? "Try adjusting your filters" : "Events will appear here once added"}
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Sync</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <TableRow key={event.event_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.event_name}</p>
                          {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description.length > 30 ? `${event.description.substring(0, 30)}...` : event.description}
                        </p>
                      )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatDate(event.event_date)}</p>
                          <p className="text-xs text-muted-foreground">{formatRelativeDate(event.event_date)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={CATEGORY_COLORS[event.category] || ""}>
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {event.location ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="size-3 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{event.location}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.gcal_event_id ? (
                          <a
                            href={event.gcal_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="size-3" />
                            Google Cal
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not synced</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="size-8">
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
