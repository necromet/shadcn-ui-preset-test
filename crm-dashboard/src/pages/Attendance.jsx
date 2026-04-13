import { useState, useMemo, useEffect, useRef } from "react"
import { Calendar, Check, Save, History, Users, MapPin, Clock, TrendingUp, ArrowLeft, Loader2, RefreshCw, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { MemberAvatar } from "../components/ui/member-avatar.jsx"
import { EmptyState } from "../components/ui/empty-state.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { getMembers } from "../data/mock.js"

// ─── Constants ──────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL

const STATUS_OPTIONS = [
  { value: "hadir", label: "Hadir" },
  { value: "izin", label: "Izin" },
  { value: "alpha", label: "Alpha" },
]

const STATUS_BADGE_VARIANT = {
  hadir: "success",
  izin: "warning",
  alpha: "destructive",
}

const STATUS_LABEL = {
  hadir: "Hadir",
  izin: "Izin",
  alpha: "Alpha",
}

const MEETING_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

const QUICK_FILTERS = [
  { label: "Bulan Ini", value: "this_month" },
  { label: "3 Bulan Terakhir", value: "last_3_months" },
  { label: "Semua", value: "all" },
]

const DRAFT_STORAGE_KEY = "attendance_draft"

function getLocalDateString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// ─── API Functions ──────────────────────────────────────────────────────────

async function fetchCGFGroups() {
  const res = await fetch(`${API_BASE}/groups?limit=100`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message || "Failed to fetch CGF groups")
  return json.data || []
}

async function fetchAttendance(filters = {}) {
  const params = new URLSearchParams()
  if (filters.cg_id) params.set("cg_id", filters.cg_id)
  if (filters.start_date) params.set("start_date", filters.start_date)
  if (filters.end_date) params.set("end_date", filters.end_date)
  if (filters.keterangan) params.set("keterangan", filters.keterangan)
  if (filters.page) params.set("page", filters.page)
  if (filters.limit) params.set("limit", filters.limit)
  const query = params.toString()
  const res = await fetch(`${API_BASE}/attendance${query ? `?${query}` : ""}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message || "Failed to fetch attendance")
  return { data: json.data || [], meta: json.meta }
}

async function bulkCreateAttendance(cgId, tanggal, records) {
  const res = await fetch(`${API_BASE}/attendance/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cg_id: cgId, tanggal, records }),
  })
  const json = await res.json()
  if (!json.success) {
    const err = new Error(json.error?.message || "Failed to save attendance")
    err.code = json.error?.code
    throw err
  }
  return json.data
}

async function updateAttendance(id, data) {
  const res = await fetch(`${API_BASE}/attendance/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message || "Failed to update attendance")
  return json.data
}

// ─── Helper Functions ───────────────────────────────────────────────────────

function getDateRange(filter) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  function formatLocal(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  if (filter === "this_month") {
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    return {
      start_date: formatLocal(start),
      end_date: formatLocal(end),
    }
  }
  if (filter === "last_3_months") {
    const start = new Date(year, month - 2, 1)
    const end = new Date(year, month + 1, 0)
    return {
      start_date: formatLocal(start),
      end_date: formatLocal(end),
    }
  }
  return { start_date: "", end_date: "" }
}

function getInitials(name) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveDraft(draft) {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // localStorage full or disabled
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  } catch {
    // ignore
  }
}

function getUserFriendlyError(code, message) {
  const errorMessages = {
    ALREADY_MARKED: "Absensi untuk CGF ini pada tanggal tersebut sudah tercatat",
    INVALID_MEMBER: message || "Anggota tidak valid untuk CGF ini",
    FUTURE_DATE: "Tidak dapat mencatat absensi untuk tanggal mendatang",
    UNAUTHORIZED: "Hanya pemimpin CGF yang dapat mencatat absensi",
    OUTDATED_EDIT: "Tidak dapat mengubah absensi bulan sebelumnya",
  }
  return errorMessages[code] || message || "Terjadi kesalahan. Silakan coba lagi."
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function StatusToggle({ value, onChange, size = "md" }) {
  const sizeClasses = {
    sm: "h-8 min-w-[52px] text-xs px-2",
    md: "h-10 min-w-[64px] text-sm px-3",
  }

  return (
    <div className="flex gap-1">
      {STATUS_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? "default" : "outline"}
          size="sm"
          className={`${sizeClasses[size]} ${
            value === opt.value && opt.value === "hadir"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : value === opt.value && opt.value === "izin"
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : value === opt.value && opt.value === "alpha"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : ""
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}

function CgfCard({ group, memberCount, onMarkAttendance }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{group.nama_cgf}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {group.lokasi_1}
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {memberCount ?? "-"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <Clock className="h-3.5 w-3.5" />
          {group.hari}
        </div>
        <Button className="w-full" onClick={() => onMarkAttendance(group.id)}>
          <Check className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </CardContent>
    </Card>
  )
}

function AttendanceSummary({ attendanceMap, totalCount }) {
  const counts = useMemo(() => {
    const result = { hadir: 0, izin: 0, alpha: 0 }
    Object.values(attendanceMap).forEach((status) => {
      if (status === "hadir") result.hadir++
      else if (status === "izin") result.izin++
      else if (status === "alpha") result.alpha++
    })
    return result
  }, [attendanceMap])

  const unchecked = totalCount - (counts.hadir + counts.izin + counts.alpha)
  const rate = totalCount > 0 ? Math.round((counts.hadir / totalCount) * 100) : 0

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-green-600" />
        <span className="text-sm font-medium">Hadir: {counts.hadir}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="text-sm font-medium">Izin: {counts.izin}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-600" />
        <span className="text-sm font-medium">Alpha: {counts.alpha}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
        <span className="text-sm font-medium">Belum: {unchecked}</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm text-muted-foreground">Tingkat Kehadiran:</span>
        <span className="text-sm font-semibold">{rate}%</span>
      </div>
    </div>
  )
}

function MemberStatsCard({ member, allMembers }) {
  const [stats, setStats] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMemberStats() {
      setLoading(true)
      try {
        const { data: records } = await fetchAttendance({ limit: 200 })
        const memberRecords = records.filter((r) => r.no_jemaat === member.no_jemaat)

        const hadir = memberRecords.filter((r) => r.keterangan === "hadir").length
        const izin = memberRecords.filter((r) => r.keterangan === "izin").length
        const alpha = memberRecords.filter((r) => r.keterangan === "alpha").length
        const total = hadir + izin + alpha

        setStats({
          total,
          hadir,
          izin,
          alpha,
          rate: total > 0 ? Math.round((hadir / total) * 100) : 0,
        })

        setRecentRecords(
          memberRecords
            .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
            .slice(0, 10)
        )
      } catch {
        toast.error("Gagal memuat statistik anggota")
      } finally {
        setLoading(false)
      }
    }
    fetchMemberStats()
  }, [member.no_jemaat])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Personal Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <MemberAvatar name={member.nama_jemaat} size="lg" />
            <div>
              <h3 className="text-lg font-semibold">{member.nama_jemaat}</h3>
              <p className="text-sm text-muted-foreground">{member.nama_cgf || "Belum bergabung CGF"}</p>
              {member.is_leader && (
                <Badge variant="outline" className="mt-1">Pemimpin CGF</Badge>
              )}
            </div>
            <div className="ml-auto text-right">
              <div className="text-3xl font-bold">{stats?.rate ?? 0}%</div>
              <p className="text-sm text-muted-foreground">Tingkat Kehadiran</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.hadir ?? 0}</div>
            <p className="text-sm text-muted-foreground">Hadir</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats?.izin ?? 0}</div>
            <p className="text-sm text-muted-foreground">Izin</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-red-600">{stats?.alpha ?? 0}</div>
            <p className="text-sm text-muted-foreground">Alpha</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tingkat Kehadiran</span>
            <span className="text-sm text-muted-foreground">{stats?.rate ?? 0}%</span>
          </div>
          <Progress value={stats?.rate ?? 0} />
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">10 Pertemuan Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada data absensi</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentRecords.map((record, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{record.tanggal}</span>
                  <Badge variant={STATUS_BADGE_VARIANT[record.keterangan]}>
                    {STATUS_LABEL[record.keterangan]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function Attendance() {
  // ── Data State ──
  const [cgfGroups, setCgfGroups] = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [loading, setLoading] = useState(true)

  // ── View State ──
  const [activeTab, setActiveTab] = useState("cgf-list")
  const [selectedCGF, setSelectedCGF] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)

  // ── CGF List State ──
  const [dayFilter, setDayFilter] = useState("")

  // ── Mark Attendance State ──
  const [attendanceDate, setAttendanceDate] = useState(getLocalDateString())
  const [loadedMembers, setLoadedMembers] = useState([])
  const [attendanceMap, setAttendanceMap] = useState({})
  const [saving, setSaving] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(false)

  // ── History State ──
  const [historyCGF, setHistoryCGF] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [quickFilter, setQuickFilter] = useState("all")
  const [historyRecords, setHistoryRecords] = useState([])
  const [historyMeta, setHistoryMeta] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [historyPage, setHistoryPage] = useState(1)
  const [loadingHistory, setLoadingHistory] = useState(false)

  // ── Edit Dialog State ──
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [editStatus, setEditStatus] = useState("")

  // ── Refs ──
  const refreshIntervalRef = useRef(null)

  // ── Load initial data ──
  useEffect(() => {
    async function loadInitial() {
      setLoading(true)
      try {
        const [groups, members] = await Promise.all([
          fetchCGFGroups(),
          getMembers(),
        ])
        setCgfGroups(groups)
        setAllMembers(members)
      } catch (err) {
        toast.error("Gagal memuat data CGF")
      } finally {
        setLoading(false)
      }
    }
    loadInitial()
  }, [])

  // ── Restore draft on mount ──
  useEffect(() => {
    const draft = loadDraft()
    if (draft && draft.cgId && draft.attendanceMap) {
      setSelectedCGF(draft.cgId)
      setAttendanceDate(draft.date || getLocalDateString())
      setAttendanceMap(draft.attendanceMap)
      setActiveTab("mark")
      toast.info("Draft absensi dipulihkan")
    }
  }, [])

  // ── Auto-refresh history every 60s ──
  useEffect(() => {
    if (activeTab === "history") {
      loadHistory()
      refreshIntervalRef.current = setInterval(() => {
        loadHistory()
      }, 60000)
    }
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }
  }, [activeTab, historyCGF, startDate, endDate, statusFilter, quickFilter, historyPage])

  // ── CGF List Computed ──
  const filteredGroups = useMemo(() => {
    if (!dayFilter) return cgfGroups
    return cgfGroups.filter((g) => g.hari === dayFilter)
  }, [cgfGroups, dayFilter])

  const groupMemberCounts = useMemo(() => {
    const counts = {}
    allMembers.forEach((m) => {
      if (m.nama_cgf) {
        counts[m.nama_cgf] = (counts[m.nama_cgf] || 0) + 1
      }
    })
    return counts
  }, [allMembers])

  // ── Handlers: CGF List ──
  function handleMarkAttendance(cgId) {
    setSelectedCGF(cgId)
    setActiveTab("mark")
    loadMembersForAttendance(cgId, attendanceDate)
  }

  // ── Handlers: Mark Attendance ──
  async function loadMembersForAttendance(cgId, tanggal) {
    if (!cgId) return
    setLoadingMembers(true)
    setLoadedMembers([])
    setAttendanceMap({})

    try {
      const group = cgfGroups.find((g) => g.id === cgId)
      const groupMembers = group ? allMembers.filter((m) => m.nama_cgf === group.nama_cgf) : []

      const { data: attendanceData } = await fetchAttendance({
        cg_id: cgId,
        start_date: tanggal,
        end_date: tanggal,
      })

      const existingNoJemaatSet = new Set(attendanceData.map((r) => r.no_jemaat))
      const unmarkedMembers = groupMembers.filter((m) => !existingNoJemaatSet.has(m.no_jemaat))

      if (unmarkedMembers.length === 0) {
        toast.info("Semua anggota sudah memiliki absensi untuk tanggal ini")
        setLoadedMembers([])
        setLoadingMembers(false)
        return
      }

      setLoadedMembers(unmarkedMembers.map((m) => ({
        no_jemaat: m.no_jemaat,
        nama_jemaat: m.nama_jemaat || `Member #${m.no_jemaat}`,
        jenis_kelamin: m.jenis_kelamin || "Laki-laki",
        no_handphone: m.no_handphone || "",
      })))
      setAttendanceMap({})
    } catch {
      toast.error("Gagal memuat anggota CGF")
    } finally {
      setLoadingMembers(false)
    }
  }

  function handleStatusChange(noJemaat, status) {
    setAttendanceMap((prev) => {
      const updated = { ...prev, [noJemaat]: status }
      // Save draft to localStorage
      saveDraft({ cgId: selectedCGF, date: attendanceDate, attendanceMap: updated })
      return updated
    })
  }

  function handleBulkToggle(status) {
    const updated = {}
    if (status) {
      loadedMembers.forEach((m) => {
        updated[m.no_jemaat] = status
      })
    }
    setAttendanceMap(updated)
    saveDraft({ cgId: selectedCGF, date: attendanceDate, attendanceMap: updated })
    if (status) {
      toast.success(`Semua anggota diatur ke ${STATUS_LABEL[status]}`)
    } else {
      toast.success("Semua absensi dikosongkan")
    }
  }

  async function handleSaveAttendance() {
    if (!selectedCGF || !attendanceDate) return

    const validKeterangan = ['hadir', 'izin', 'tidak_hadir', 'tamu']
    const records = Object.entries(attendanceMap)
      .filter(([, keterangan]) => validKeterangan.includes(keterangan))
      .map(([noJemaat, keterangan]) => ({
        no_jemaat: Number(noJemaat),
        keterangan,
      }))

    if (records.length === 0) {
      toast.error("Tidak ada anggota untuk disimpan")
      return
    }

    setSaving(true)
    try {
      await bulkCreateAttendance(selectedCGF, attendanceDate, records)
      clearDraft()
      toast.success("Berhasil menyimpan absensi")
      // Reload to show only remaining unmarked members
      await loadMembersForAttendance(selectedCGF, attendanceDate)
    } catch (err) {
      toast.error(getUserFriendlyError(err.code, err.message))
    } finally {
      setSaving(false)
    }
  }

  // ── Handlers: History ──
  async function loadHistory() {
    setLoadingHistory(true)
    try {
      const filters = { page: historyPage, limit: 50 }
      if (historyCGF) filters.cg_id = historyCGF
      if (statusFilter) filters.keterangan = statusFilter

      // Apply quick filter
      if (quickFilter !== "all") {
        const range = getDateRange(quickFilter)
        if (range.start_date) filters.start_date = range.start_date
        if (range.end_date) filters.end_date = range.end_date
      } else {
        if (startDate) filters.start_date = startDate
        if (endDate) filters.end_date = endDate
      }

      const result = await fetchAttendance(filters)
      setHistoryRecords(result.data)
      setHistoryMeta(result.meta || { page: 1, limit: 50, total: 0, totalPages: 0 })
    } catch {
      toast.error("Gagal memuat riwayat absensi")
    } finally {
      setLoadingHistory(false)
    }
  }

  function handleQuickFilterChange(value) {
    setQuickFilter(value)
    setHistoryPage(1)
    if (value !== "all") {
      setStartDate("")
      setEndDate("")
    }
  }

  function handleEditRecord(record) {
    setEditRecord(record)
    setEditStatus(record.keterangan)
    setEditDialogOpen(true)
  }

  async function handleConfirmEdit() {
    if (!editRecord || !editStatus) return

    try {
      await updateAttendance(editRecord.id, { keterangan: editStatus })
      toast.success("Absensi berhasil diperbarui")
      setEditDialogOpen(false)
      loadHistory()
    } catch (err) {
      toast.error(getUserFriendlyError(err.code, err.message))
    }
  }

  // ── Handlers: Member Stats ──
  function handleMemberSelect(noJemaat) {
    const member = allMembers.find((m) => m.no_jemaat === Number(noJemaat))
    setSelectedMember(member || null)
  }

  function getMemberName(noJemaat) {
    const member = allMembers.find((m) => m.no_jemaat === noJemaat)
    return member ? member.nama_jemaat : `Member #${noJemaat}`
  }

  function getGroupName(cgId) {
    const group = cgfGroups.find((g) => g.id === cgId)
    return group ? group.nama_cgf : cgId
  }

  // ── Render ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Attendance Tracking</h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cgf-list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            CGF Groups
          </TabsTrigger>
          <TabsTrigger value="mark" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          {/* <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Member Stats
          </TabsTrigger> */}
        </TabsList>

        {/* ── CGF List Tab ── */}
        <TabsContent value="cgf-list">
          <Card>
            <CardHeader>
              <CardTitle>Daftar CGF</CardTitle>
              <CardDescription>Pilih CGF untuk mencatat absensi</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Filter by Day */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Filter Hari</label>
                  <Select value={dayFilter} onValueChange={setDayFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Semua Hari" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Semua Hari</SelectItem>
                      {MEETING_DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* CGF Card Grid */}
              {filteredGroups.length === 0 ? (
                <EmptyState
                  title="Tidak ada CGF"
                  description="Belum ada CGF yang terdaftar."
                  illustration="/illustrations/empty-states/no-attendance.svg"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGroups.map((group) => (
                    <CgfCard
                      key={group.id}
                      group={group}
                      memberCount={groupMemberCounts[group.nama_cgf]}
                      onMarkAttendance={handleMarkAttendance}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Mark Attendance Tab ── */}
        <TabsContent value="mark">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                {activeTab === "mark" && selectedCGF && (
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("cgf-list")}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <CardTitle>Mark Attendance</CardTitle>
                  <CardDescription>
                    {selectedCGF ? getGroupName(selectedCGF) : "Pilih CGF untuk mencatat absensi"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Controls */}
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">CGF Group</label>
                  <Select value={selectedCGF || ""} onValueChange={(val) => { setSelectedCGF(val); loadMembersForAttendance(val) }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Pilih CGF" />
                    </SelectTrigger>
                    <SelectContent>
                      {cgfGroups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.nama_cgf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Tanggal</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loadingMembers && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Memuat anggota...</span>
                </div>
              )}

              {/* Empty State */}
              {!loadingMembers && loadedMembers.length === 0 && !selectedCGF && (
                <EmptyState
                  title="Pilih CGF"
                  description="Pilih CGF di atas untuk memuat anggota dan mencatat absensi."
                  illustration="/illustrations/empty-states/no-attendance.svg"
                />
              )}

              {/* Members Table */}
              {!loadingMembers && loadedMembers.length > 0 && (
                <>
                  {/* Bulk Toggle */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">Atur semua:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggle("hadir")}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Pilih Semua
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggle("")}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Kosongkan
                    </Button>
                  </div>

                  {/* Summary */}
                  <AttendanceSummary attendanceMap={attendanceMap} totalCount={loadedMembers.length} />

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead>Nama Anggota</TableHead>
                        <TableHead className="w-[80px]">Hadir</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadedMembers.map((member, idx) => (
                        <TableRow key={member.no_jemaat}>
                          <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <MemberAvatar name={member.nama_jemaat} gender={member.jenis_kelamin} size="sm" />
                              <div>
                                <div className="font-medium">{member.nama_jemaat}</div>
                                {member.is_leader && (
                                  <Badge variant="outline" className="mt-0.5 text-xs">
                                    Pemimpin
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <input
                              type="checkbox"
                              checked={attendanceMap[member.no_jemaat] === "hadir"}
                              onChange={(e) => handleStatusChange(member.no_jemaat, e.target.checked ? "hadir" : "")}
                              className="h-4 w-4 rounded border"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Save Button */}
                  <div className="flex items-center gap-4">
                    <Button onClick={handleSaveAttendance} disabled={saving} size="lg" className="min-w-[200px]">
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Simpan Absensi
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── History Tab ── */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Riwayat Absensi</CardTitle>
                  <CardDescription>Lihat dan kelola catatan absensi</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadHistory} disabled={loadingHistory}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingHistory ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Filters */}
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">CGF Group</label>
                  <Select value={historyCGF} onValueChange={(val) => { setHistoryCGF(val); setHistoryPage(1) }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Semua CGF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Semua CGF</SelectItem>
                      {cgfGroups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.nama_cgf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setHistoryPage(1) }}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Semua Status</SelectItem>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Periode</label>
                  <Select value={quickFilter} onValueChange={handleQuickFilterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUICK_FILTERS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Date Range (only when quick filter is "all") */}
                {quickFilter === "all" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Dari Tanggal</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setHistoryPage(1) }}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Sampai Tanggal</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setHistoryPage(1) }}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* History Table */}
              {loadingHistory && historyRecords.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Nama Anggota</TableHead>
                      <TableHead>CGF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <EmptyState
                            title="Tidak ada data absensi"
                            description="Data absensi akan muncul di sini setelah absensi dicatat."
                            illustration="/illustrations/empty-states/no-attendance.svg"
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      historyRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.tanggal}</TableCell>
                          <TableCell>{record.nama_jemaat || getMemberName(record.no_jemaat)}</TableCell>
                          <TableCell>{record.nama_cgf || getGroupName(record.cg_id)}</TableCell>
                          <TableCell>
                            <Badge variant={STATUS_BADGE_VARIANT[record.keterangan]}>
                              {STATUS_LABEL[record.keterangan]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRecord(record)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              {/* Pagination */}
              {historyMeta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Menampilkan {((historyMeta.page - 1) * historyMeta.limit) + 1}-
                    {Math.min(historyMeta.page * historyMeta.limit, historyMeta.total)} dari {historyMeta.total} data
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={historyPage <= 1}
                      onClick={() => setHistoryPage((p) => p - 1)}
                    >
                      Sebelumnya
                    </Button>
                    <span className="text-sm">
                      Halaman {historyMeta.page} dari {historyMeta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={historyPage >= historyMeta.totalPages}
                      onClick={() => setHistoryPage((p) => p + 1)}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Member Stats Tab ── */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Anggota</CardTitle>
              <CardDescription>Lihat statistik kehadiran per anggota</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Member Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Pilih Anggota</label>
                <Select value={selectedMember?.no_jemaat?.toString() || ""} onValueChange={handleMemberSelect}>
                  <SelectTrigger className="w-full max-w-[300px]">
                    <SelectValue placeholder="Pilih anggota..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers.map((m) => (
                      <SelectItem key={m.no_jemaat} value={m.no_jemaat.toString()}>
                        {m.nama_jemaat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Member Stats */}
              {selectedMember ? (
                <MemberStatsCard member={selectedMember} allMembers={allMembers} />
              ) : (
                <EmptyState
                  title="Pilih anggota"
                  description="Pilih anggota di atas untuk melihat statistik kehadirannya."
                  illustration="/illustrations/empty-states/no-attendance.svg"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Absensi</DialogTitle>
            <DialogDescription>
              Ubah status kehadiran untuk {editRecord?.nama_jemaat || getMemberName(editRecord?.no_jemaat)} pada tanggal {editRecord?.tanggal}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <label className="text-sm font-medium">Status</label>
            <StatusToggle value={editStatus} onChange={setEditStatus} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirmEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
