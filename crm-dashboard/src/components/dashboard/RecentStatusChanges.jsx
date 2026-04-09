import { useState, useEffect } from "react"
import { ArrowRight, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table.jsx"
import { Badge } from "../ui/badge.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"
import { cn } from "../../lib/utils.js"
import { getRecentStatusChanges, getStatusHistoryForMember } from "../../data/mock.js"

const STATUS_STYLES = {
  Active: { className: "bg-chart-1/20 text-chart-1" },
  Inactive: { className: "bg-destructive/20 text-destructive" },
  'No Information': { className: "bg-chart-3/20 text-chart-3" },
  Moved: { className: "bg-chart-4/20 text-chart-4" },
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

async function getPreviousStatus(no_jemaat, currentChangedAt) {
  const memberHistory = await getStatusHistoryForMember(no_jemaat);
  const filtered = memberHistory
    .filter((r) => new Date(r.changed_at) < new Date(currentChangedAt))
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))
  return filtered.length > 0 ? filtered[0].status : null
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || {}
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        style.className
      )}
    >
      {status}
    </span>
  )
}

export function RecentStatusChanges() {
  const [changes, setChanges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await getRecentStatusChanges(10)
        setChanges(data)
      } catch (err) {
        console.error("Failed to load recent status changes:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const [enrichedChanges, setEnrichedChanges] = useState([])

  useEffect(() => {
    async function enrichChanges() {
      const enriched = await Promise.all(
        changes.map(async (change) => ({
          ...change,
          previousStatus: await getPreviousStatus(change.no_jemaat, change.changed_at),
        }))
      )
      setEnrichedChanges(enriched)
    }
    if (changes.length > 0) {
      enrichChanges()
    } else {
      setEnrichedChanges([])
    }
  }, [changes])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="size-5" style={{ color: "var(--foreground)" }} />
          <CardTitle className="text-base">Recent Status Changes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Status Change</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrichedChanges.map((change) => (
              <TableRow key={change.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(change.nama_jemaat)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{change.nama_jemaat}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {change.previousStatus ? (
                      <>
                        <StatusBadge status={change.previousStatus} />
                        <ArrowRight className="size-3" style={{ color: "var(--muted-foreground)" }} />
                        <StatusBadge status={change.status} />
                      </>
                    ) : (
                      <StatusBadge status={change.status} />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {formatDate(change.changed_at)}
                </TableCell>
                <TableCell className="text-sm max-w-[200px]">
                  {change.reason || (
                    <span style={{ color: "var(--muted-foreground)" }}>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
