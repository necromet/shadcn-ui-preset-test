import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, UserCheck, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { Progress } from "../ui/progress.jsx"
import { Separator } from "../ui/separator.jsx"
import { cn } from "../../lib/utils.js"
import { getUpcomingEvents, event_participation } from "../../data/mock.js"

const categoryColors = {
  Camp: "chart-1",
  Retreat: "chart-2",
  Quarterly: "chart-3",
  Monthly: "chart-4",
  Special: "chart-5",
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDate().toString().padStart(2, "0")
  const month = d.toLocaleString("en-US", { month: "short" })
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export function UpcomingEvents() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    async function fetchEvents() {
      const eventsData = await getUpcomingEvents(3)
      setEvents(eventsData)
    }
    fetchEvents()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-muted-foreground" />
          <CardTitle>Upcoming Events</CardTitle>
        </div>
        <CardDescription>Next 3 events on the calendar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {events.map((event, idx) => {
          const catColor = categoryColors[event.category] || "chart-1"
          const participation = event_participation.filter(
            (ep) => ep.event_id === event.event_id
          )
          const panitiaCount = participation.filter(
            (ep) => ep.role === "Panitia"
          ).length
          const volunteerCount = participation.filter(
            (ep) => ep.role === "Volunteer"
          ).length
          const capacityPercent = Math.min(
            Math.round((event.participantCount / 50) * 100),
            100
          )

          return (
            <div key={event.event_id}>
              {idx > 0 && <Separator className="mb-4" />}
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{event.event_name}</CardTitle>
                    <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {formatDate(event.event_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {event.location}
                      </span>
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

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="size-3.5" />
                    {event.participantCount} participants
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <UserCheck className="size-3.5" />
                    {panitiaCount} panitia
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="size-3.5" />
                    {volunteerCount} volunteers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Progress value={capacityPercent} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {event.participantCount}/50
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <Calendar className="size-4" />
          View All Events
        </Button>
      </CardFooter>
    </Card>
  )
}
