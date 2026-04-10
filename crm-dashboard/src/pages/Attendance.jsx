import { useState, useMemo, useEffect } from "react"
import { Calendar, Check, Save, Filter, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { getCGFGroups, getCGFMembers, getAttendance, getMembers } from "../data/mock.js"
import { EmptyState } from "../components/ui/empty-state.jsx"

const STATUS_OPTIONS = [
  { value: "hadir", label: "Hadir" },
  { value: "izin", label: "Izin" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
  { value: "tamu", label: "Tamu" },
]

const STATUS_BADGE_VARIANT = {
  hadir: "success",
  izin: "warning",
  tidak_hadir: "destructive",
  tamu: "secondary",
}

const STATUS_LABEL = {
  hadir: "Hadir",
  izin: "Izin",
  tidak_hadir: "Tidak Hadir",
  tamu: "Tamu",
}

export function Attendance() {
  const [activeTab, setActiveTab] = useState("take")
  const cgfGroups = useMemo(() => getCGFGroups(), [])
  const [allMembers, setAllMembers] = useState([])

  useEffect(() => {
    async function fetchMembers() {
      const membersData = await getMembers()
      setAllMembers(membersData)
    }
    fetchMembers()
  }, [])

  // Take Attendance state
  const [selectedCGF, setSelectedCGF] = useState("")
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [loadedMembers, setLoadedMembers] = useState([])
  const [attendanceMap, setAttendanceMap] = useState({})
  const [saveMessage, setSaveMessage] = useState("")

  // Attendance History state
  const [historyCGF, setHistoryCGF] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  function handleLoadMembers() {
    if (!selectedCGF) return
    const members = getCGFMembers(Number(selectedCGF))
    setLoadedMembers(members)
    const defaultMap = {}
    members.forEach((m) => {
      defaultMap[m.no_jemaat] = "hadir"
    })
    setAttendanceMap(defaultMap)
    setSaveMessage("")
  }

  function handleStatusChange(no_jemaat, status) {
    setAttendanceMap((prev) => ({ ...prev, [no_jemaat]: status }))
  }

  function handleSaveAttendance() {
    setSaveMessage("Attendance saved successfully!")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  // Attendance History
  const historyRecords = useMemo(() => {
    const filters = {}
    if (historyCGF) filters.cg_id = Number(historyCGF)
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate
    return getAttendance(filters)
  }, [historyCGF, startDate, endDate])

  function getMemberName(no_jemaat) {
    const member = allMembers.find((m) => m.no_jemaat === no_jemaat)
    return member ? member.nama_jemaat : `Member #${no_jemaat}`
  }

  function getGroupName(cg_id) {
    const group = cgfGroups.find((g) => g.cg_id === cg_id)
    return group ? group.nama_cgf : `CGF #${cg_id}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Attendance Tracking</h1>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "take" ? "default" : "outline"}
          onClick={() => setActiveTab("take")}
        >
          <Check className="h-4 w-4" />
          Take Attendance
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "outline"}
          onClick={() => setActiveTab("history")}
        >
          <History className="h-4 w-4" />
          Attendance History
        </Button>
      </div>

      {/* Take Attendance Tab */}
      {activeTab === "take" && (
        <Card>
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Controls */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">CGF Group</label>
                <select
                  value={selectedCGF}
                  onChange={(e) => setSelectedCGF(e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Select CGF Group</option>
                  {cgfGroups.map((g) => (
                    <option key={g.cg_id} value={g.cg_id}>
                      {g.nama_cgf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                />
              </div>

              <Button onClick={handleLoadMembers} disabled={!selectedCGF}>
                Load Members
              </Button>
            </div>

            {/* Members Table */}
            {loadedMembers.length === 0 && selectedCGF === "" ? (
              <EmptyState
                title="Select a CGF group"
                description="Choose a CGF group above to load members and take attendance."
                illustration="/illustrations/empty-states/no-attendance.svg"
              />
            ) : loadedMembers.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadedMembers.map((member) => (
                      <TableRow key={member.no_jemaat}>
                        <TableCell>
                          {member.nama_jemaat}
                          {member.is_leader && (
                            <Badge variant="outline" className="ml-2">
                              Leader
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <select
                            value={attendanceMap[member.no_jemaat] || "hadir"}
                            onChange={(e) =>
                              handleStatusChange(member.no_jemaat, e.target.value)
                            }
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center gap-4">
                  <Button onClick={handleSaveAttendance}>
                    <Save className="h-4 w-4" />
                    Save Attendance
                  </Button>
                  {saveMessage && (
                    <span className="flex items-center gap-1 text-sm text-chart-1">
                      <Check className="h-4 w-4" />
                      {saveMessage}
                    </span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Attendance History Tab */}
      {activeTab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">CGF Group</label>
                <select
                  value={historyCGF}
                  onChange={(e) => setHistoryCGF(e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">All Groups</option>
                  {cgfGroups.map((g) => (
                    <option key={g.cg_id} value={g.cg_id}>
                      {g.nama_cgf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                />
              </div>
            </div>

            {/* History Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>CGF Group</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState
                        title="No attendance records"
                        description="Attendance records will appear here once meetings are recorded."
                        illustration="/illustrations/empty-states/no-attendance.svg"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  historyRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.tanggal}</TableCell>
                      <TableCell>{getMemberName(record.no_jemaat)}</TableCell>
                      <TableCell>{getGroupName(record.cg_id)}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE_VARIANT[record.keterangan]}>
                          {STATUS_LABEL[record.keterangan]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
