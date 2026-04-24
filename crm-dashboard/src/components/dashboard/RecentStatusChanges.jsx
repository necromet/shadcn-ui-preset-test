import { useState, useEffect } from "react"
import { ArrowRight, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table.jsx"
import { Badge } from "../ui/badge.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"
import { cn } from "../../lib/utils.js"
import { getRecentStatusChanges } from "../../data/mock.js"

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
            {changes.map((change) => (
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
                    {change.status_before ? (
                      <>
                        <StatusBadge status={change.status_before} />
                        <ArrowRight className="size-3" style={{ color: "var(--muted-foreground)" }} />
                        <StatusBadge status={change.status_after} />
                      </>
                    ) : (
                      <StatusBadge status={change.status_after} />
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
