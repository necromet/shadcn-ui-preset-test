import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select.jsx"
import { Badge } from "../ui/badge.jsx"
import { Separator } from "../ui/separator.jsx"
import {
  Calendar, MapPin, FileText, Users, BarChart3, PieChart as PieChartIcon, Layers, CheckCircle2,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend,
} from "recharts"
import { fetchEvents, fetchEventParticipantAnalytics } from "../../services/events.api.js"

const ROLE_COLORS = {
  Peserta: { bg: "bg-slate-100", text: "text-slate-700", chart: "var(--chart-1)" },
  Panitia: { bg: "bg-blue-100", text: "text-blue-700", chart: "var(--chart-2)" },
  Volunteer: { bg: "bg-emerald-100", text: "text-emerald-700", chart: "var(--chart-3)" },
}

function getChartColors() {
  const style = getComputedStyle(document.documentElement)
  return [
    style.getPropertyValue("--chart-1").trim(),
    style.getPropertyValue("--chart-2").trim(),
    style.getPropertyValue("--chart-3").trim(),
    style.getPropertyValue("--chart-4").trim(),
    style.getPropertyValue("--chart-5").trim(),
    style.getPropertyValue("--chart-6").trim(),
  ]
}

function formatDate(dateStr) {
  if (!dateStr) return "-"
  const [year, month, day] = dateStr.split("-")
  const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

function ChartEmpty() {
  return (
    <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
      No participant data available
    </div>
  )
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{d.name}</p>
      <p className="text-sm text-muted-foreground">
        {d.value} ({(d.percent * 100).toFixed(1)}%)
      </p>
    </div>
  )
}

function RoleChart({ roles }) {
  const data = roles.map((r) => ({
    name: r.role,
    value: r.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Participants">
          {data.map((entry) => (
            <Cell key={entry.name} fill={ROLE_COLORS[entry.name]?.chart || "var(--chart-1)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function AgeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} name="Participants" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SimplePieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
          nameKey="label"
          label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={getChartColors()[i % getChartColors().length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

function CGFPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
          nameKey="label"
          label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={getChartColors()[i % getChartColors().length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

function DomisiliChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="var(--chart-4)" radius={[6, 6, 0, 0]} name="Participants" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function EventAnalytics() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
    fetchEvents({ limit: 200 })
      .then((res) => {
        const list = res?.data ?? []
        setEvents(list)
      })
      .catch(() => {})
      .finally(() => setLoadingEvents(false))
  }, [])

  const loadAnalytics = useCallback((eventId) => {
    setLoadingAnalytics(true)
    setSelectedEvent(events.find((e) => e.event_id === eventId) || null)
    fetchEventParticipantAnalytics(eventId)
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics(null))
      .finally(() => setLoadingAnalytics(false))
  }, [events])

  function handleSelectEvent(value) {
    const eventId = parseInt(value, 10)
    setSelectedEventId(eventId)
    loadAnalytics(eventId)
  }

  const totalParticipants = analytics
    ? analytics.roles.reduce((sum, r) => sum + r.count, 0)
    : 0

  const roleCounts = { Peserta: 0, Panitia: 0, Volunteer: 0 }
  if (analytics) {
    analytics.roles.forEach((r) => {
      if (roleCounts[r.role] !== undefined) roleCounts[r.role] = r.count
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Event Analytics</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {selectedEvent && (
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="size-3" />
              {selectedEvent.event_name}
            </Badge>
          )}
          {analytics && (
            <>
              <Badge variant="outline" className="gap-1">
                <Users className="size-3" />
                {totalParticipants} participants
              </Badge>
              {Object.entries(roleCounts).map(([role, count]) => (
                <Badge key={role} variant="outline" className="gap-1 text-[10px]">
                  {count} {role}
                </Badge>
              ))}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Event Picker */}
        <div className="flex items-center gap-3">
          <Layers className="size-4 text-muted-foreground" />
          <Select
            value={selectedEventId ? String(selectedEventId) : undefined}
            onValueChange={handleSelectEvent}
            disabled={loadingEvents}
          >
            <SelectTrigger className="w-[360px]">
              <SelectValue placeholder={loadingEvents ? "Loading events..." : "Select an event"} />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.event_id} value={String(e.event_id)}>
                  {e.event_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedEventId && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Calendar className="size-10 mb-3 opacity-40" />
            <p className="text-sm">Select an event to view its analytics</p>
          </div>
        )}

        {selectedEventId && loadingAnalytics && (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
            Loading analytics...
          </div>
        )}

        {selectedEventId && !loadingAnalytics && selectedEvent && (
          <>
            {/* Event Info */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedEvent.event_name}</h3>
                <Badge variant="outline">{selectedEvent.category}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 shrink-0" />
                  <span>{formatDate(selectedEvent.event_date)}</span>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">{selectedEvent.location}</span>
                  </div>
                )}
              </div>
              {selectedEvent.description && (
                <>
                  <Separator className="my-2" />
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <FileText className="size-4 shrink-0 mt-0.5" />
                    <p>{selectedEvent.description}</p>
                  </div>
                </>
              )}
            </div>

            {/* Participant Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-3xl font-bold">{totalParticipants}</p>
                <p className="text-xs text-muted-foreground mt-1">Total</p>
              </div>
              {Object.entries(roleCounts).map(([role, count]) => (
                <div key={role} className="rounded-lg border p-3 text-center">
                  <p className="text-3xl font-bold" style={{ color: ROLE_COLORS[role]?.chart }}>
                    {count}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{role}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Role Distribution
                </h4>
                <RoleChart roles={analytics.roles} />
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Age Distribution
                </h4>
                {analytics.age.length === 0 ? <ChartEmpty /> : <AgeChart data={analytics.age} />}
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Jenis Kelamin
                </h4>
                {analytics.gender.length === 0 ? <ChartEmpty /> : <SimplePieChart data={analytics.gender} />}
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Kuliah vs Kerja
                </h4>
                {analytics.kuliah_kerja.length === 0 ? <ChartEmpty /> : <SimplePieChart data={analytics.kuliah_kerja} />}
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Ketertarikan CGF
                </h4>
                {analytics.ketertarikan_cgf.length === 0 ? <ChartEmpty /> : <CGFPieChart data={analytics.ketertarikan_cgf} />}
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Kategori Domisili
                </h4>
                {analytics.kategori_domisili.length === 0 ? <ChartEmpty /> : <DomisiliChart data={analytics.kategori_domisili} />}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
