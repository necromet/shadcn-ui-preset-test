import { useState, useMemo, useEffect } from "react"
import { ArrowRight, Download, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { Avatar, AvatarFallback } from "../components/ui/avatar.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.jsx"
import { getStatusHistory, getMembers } from "../data/mock.js"
import { cn } from "../lib/utils.js"

const PAGE_SIZE = 20

const STATUS_STYLES = {
  Active: { className: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-400" },
  Inactive: { className: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/25 dark:text-rose-400" },
  'No Information': { className: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/25 dark:text-amber-400" },
  Moved: { className: "bg-sky-500/15 text-sky-700 dark:bg-sky-500/25 dark:text-sky-400" },
  Sabbatical: { className: "bg-violet-500/15 text-violet-700 dark:bg-violet-500/25 dark:text-violet-400" },
}

function StatusBadge({ status }) {
  if (!status) return <span className="text-muted-foreground">—</span>
  const style = STATUS_STYLES[status] || {}
  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide",
      style.className
    )}>
      {status}
    </span>
  )
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + " " + date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function StatusLog() {
  const [statusHistory, setStatusHistory] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [historyData, membersData] = await Promise.all([
          getStatusHistory(),
          getMembers()
        ])
        setStatusHistory(historyData)
        setMembers(membersData)
      } catch (err) {
        console.error("Failed to load data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const enrichedHistory = useMemo(() => {
    return statusHistory.map(record => {
      const member = members.find(m => m.no_jemaat === record.no_jemaat)
      return {
        ...record,
        nama_jemaat: member ? member.nama_jemaat : 'Unknown',
      }
    })
  }, [statusHistory, members])

  const filteredHistory = useMemo(() => {
    let result = enrichedHistory
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(record => 
        record.nama_jemaat.toLowerCase().includes(query) ||
        (record.reason && record.reason.toLowerCase().includes(query))
      )
    }
    if (statusFilter !== "all") {
      result = result.filter(record => 
        record.status_after === statusFilter || record.status_before === statusFilter
      )
    }
    return result.sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))
  }, [enrichedHistory, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredHistory.length / PAGE_SIZE)
  const paginatedHistory = filteredHistory.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const statusOptions = ["Active", "Inactive", "Sabbatical", "Moved", "No Information"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Status Log</h1>
          <p className="text-muted-foreground">Complete history of member status changes</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search members or reasons..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {paginatedHistory.length} of {filteredHistory.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No records found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[250px]">Member</TableHead>
                    <TableHead className="w-[120px]">Status Before</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="w-[120px]">Status After</TableHead>
                    <TableHead className="w-[150px]">Changed At</TableHead>
                    <TableHead className="w-[200px]">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHistory.map((record) => (
                    <TableRow key={record.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border border-border/50">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {getInitials(record.nama_jemaat)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{record.nama_jemaat}</div>
                            <div className="text-xs text-muted-foreground">#{record.no_jemaat}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={record.status_before} />
                      </TableCell>
                      <TableCell>
                        <ArrowRight className="size-4 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={record.status_after} />
                      </TableCell>
                      <TableCell className="text-sm font-mono tracking-tight">
                        {formatDate(record.changed_at)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.reason || (
                          <span className="text-muted-foreground italic">No reason provided</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="size-4" />
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