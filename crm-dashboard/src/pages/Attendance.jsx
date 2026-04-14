import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "../lib/utils.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Progress } from "../components/ui/progress.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog.jsx";
import { Skeleton } from "../components/ui/skeleton.jsx";
import { MemberAvatar } from "../components/ui/member-avatar.jsx";
import {
  Users, MapPin, Clock, ArrowLeft, Check, X, CalendarDays,
  BarChart3, History, ClipboardList, Search, ChevronLeft, ChevronRight,
  UserCheck, UserX, TrendingUp, Save, RotateCcw,
  PencilIcon,
  ArrowUpRightFromCircle,
  ArrowUpRightIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  getAttendanceCGFList,
  getAttendanceCGFById,
  getAttendanceMembersWithStatus,
  getAttendanceHistory,
  getAttendanceStatsCGF,
  saveAttendance,
} from "../data/mock.js";

const DAYS = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function Attendance() {
  const [activeTab, setActiveTab] = useState("cgf-list");
  const [selectedCgId, setSelectedCgId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2026-04-11");

  const handleMarkAttendance = useCallback((cg_id) => {
    setSelectedCgId(cg_id);
    setActiveTab("mark");
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedCgId(null);
    setActiveTab("cgf-list");
  }, []);

  const handleSubmitted = useCallback(() => {
    setActiveTab("history");
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Absensi CGF</h2>
        <p className="text-sm text-muted-foreground">Kelola kehadiran Cell Group Fellowship</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="cgf-list" className="gap-1.5">
            <Users className="h-4 w-4" /> CGF
          </TabsTrigger>
          <TabsTrigger value="mark" className="gap-1.5" disabled={!selectedCgId}>
            <ClipboardList className="h-4 w-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
          {/* <TabsTrigger value="stats" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Statistics
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="cgf-list">
          <CGFListView onMarkAttendance={handleMarkAttendance} />
        </TabsContent>

        <TabsContent value="mark">
          {selectedCgId && (
            <MarkAttendanceView
              cgId={selectedCgId}
              date={selectedDate}
              onDateChange={setSelectedDate}
              onBack={handleBackToList}
              onSubmitted={handleSubmitted}
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          <HistoryView />
        </TabsContent>

        <TabsContent value="stats">
          <StatsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// CGF LIST VIEW
// ============================================================

function CGFListView({ onMarkAttendance }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dayFilter, setDayFilter] = useState("Semua");

  useEffect(() => {
    getAttendanceCGFList().then(data => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter(g => {
      const matchesSearch = g.nama_cgf.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.leader_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDay = dayFilter === "Semua" || g.hari === dayFilter;
      return matchesSearch && matchesDay;
    });
  }, [groups, searchQuery, dayFilter]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter><Skeleton className="h-9 w-full" /></CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari CGF atau leader..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Hari" />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map(day => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map(group => (
          <Card key={group.cg_id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{group.nama_cgf}</CardTitle>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" /> {group.member_count}
                </Badge>
              </div>
              <CardDescription>{group.leader_name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="truncate">{group.jadwal}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{group.lokasi}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">Tingkat Kehadiran</span>
                <Progress value={group.attendance_rate} className="h-2 flex-1" />
                <span className="text-xs font-medium">{group.attendance_rate}%</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => onMarkAttendance(group.cg_id)}>
                <PencilIcon className="h-4 w-4" />Mark Attendance
                <ArrowUpRightIcon className="h-4 w-4" /> 
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Tidak ada CGF yang ditemukan</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MARK ATTENDANCE VIEW — Roll Call Card Grid
// ============================================================

const CYCLE = [null, "hadir", "tidak_hadir"];

function MarkAttendanceView({ cgId, date, onDateChange, onBack, onSubmitted }) {
  const [members, setMembers] = useState([]);
  const [cgfDetail, setCgfDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [existingRecords, setExistingRecords] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [ripples, setRipples] = useState({});
  const [ctxMenu, setCtxMenu] = useState(null); // { x, y, no_jemaat }

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAttendanceCGFById(cgId),
      getAttendanceMembersWithStatus(cgId, date),
    ]).then(([detail, memberList]) => {
      setCgfDetail(detail);
      setMembers(memberList);
      setExistingRecords(memberList.some(m => m.today_status !== null));
      setLoading(false);
    });
  }, [cgId, date]);

  useEffect(() => {
    if (!ctxMenu) return;
    const handleClose = (e) => {
      if (e.type === "keydown" && e.key !== "Escape") return;
      setCtxMenu(null);
    };
    document.addEventListener("click", handleClose);
    document.addEventListener("keydown", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
      document.removeEventListener("keydown", handleClose);
    };
  }, [ctxMenu]);

  const cycleStatus = useCallback((no_jemaat) => {
    setMembers(prev => prev.map(m => {
      if (m.no_jemaat !== no_jemaat) return m;
      const cur = CYCLE.indexOf(m.today_status);
      return { ...m, today_status: CYCLE[(cur + 1) % CYCLE.length] };
    }));
    setRipples(prev => ({ ...prev, [no_jemaat]: Date.now() }));
    setTimeout(() => {
      setRipples(prev => { const n = { ...prev }; delete n[no_jemaat]; return n; });
    }, 600);
  }, []);

  const setStatusDirect = useCallback((no_jemaat, status) => {
    setMembers(prev => prev.map(m =>
      m.no_jemaat === no_jemaat ? { ...m, today_status: status } : m
    ));
  }, []);

  const handleBulkMarkPresent = useCallback(() => {
    setMembers(prev => prev.map(m =>
      m.today_status === null ? { ...m, today_status: "hadir" } : m
    ));
    toast.success("Semua ditandai hadir");
  }, []);

  const handleReset = useCallback(() => {
    setMembers(prev => prev.map(m => ({ ...m, today_status: null })));
  }, []);

  const stats = useMemo(() => {
    let hadir = 0, tidak_hadir = 0, unmarked = 0;
    members.forEach(m => {
      if (m.today_status === "hadir") hadir++;
      else if (m.today_status === "tidak_hadir") tidak_hadir++;
      else unmarked++;
    });
    return { hadir, tidak_hadir, unmarked, total: members.length };
  }, [members]);

  const progressPercent = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round(((stats.total - stats.unmarked) / stats.total) * 100);
  }, [stats]);

  const filteredMembers = useMemo(() => {
    if (activeFilter === "all") return members;
    if (activeFilter === "unmarked") return members.filter(m => m.today_status === null);
    return members.filter(m => m.today_status === activeFilter);
  }, [members, activeFilter]);

  const handleSubmit = useCallback(async () => {
    const attendances = members
      .filter(m => m.today_status !== null)
      .map(m => ({ no_jemaat: m.no_jemaat, keterangan: m.today_status }));

    if (attendances.length === 0) {
      toast.error("Pilih minimal satu anggota untuk dicatat");
      return;
    }

    setSubmitting(true);
    try {
      const result = await saveAttendance(cgId, date, attendances);
      setSubmitting(false);
      setShowConfirm(false);
      if (result.success) {
        toast.success(result.message);
        onSubmitted();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      setSubmitting(false);
      setShowConfirm(false);
      toast.error("Gagal menyimpan absensi");
    }
  }, [members, cgId, date, onSubmitted]);

  const getStatusLabel = (status) => {
    if (status === "hadir") return "Hadir";
    if (status === "tidak_hadir") return "Tidak Hadir";
    return "\u2014";
  };

  const getStatusColor = (status) => {
    if (status === "hadir") return "text-[oklch(0.75_0.18_160)]";
    if (status === "tidak_hadir") return "text-[oklch(0.65_0.22_25)]";
    return "text-muted-foreground";
  };

  const getRippleColor = (status) => {
    if (status === "hadir") return "rgba(0,229,160,0.3)";
    if (status === "tidak_hadir") return "rgba(255,77,109,0.3)";
    return "rgba(255,255,255,0.15)";
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20 w-full" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-xl font-bold tracking-tight">{cgfDetail?.nama_cgf} </h3>
            <p className="text-xs text-muted-foreground">
              {cgfDetail?.leader_name} &middot; {cgfDetail?.jadwal}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground leading-relaxed">
          <div className="flex items-center gap-2 justify-end">
            <input
              type="date"
              className="flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              max={todayStr}
            />
          </div>
          {existingRecords && (
            <span className="inline-block mt-1 text-[oklch(0.75_0.15_85)] tracking-wider">sudah dicatat</span>
          )}
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-0 rounded-xl border border-border bg-card overflow-hidden">
        <div className="stat-card-enter p-4 text-center border-r border-border">
          <p className="text-3xl font-bold tracking-tight leading-none text-[oklch(0.75_0.18_160)]">
            {stats.hadir}
          </p>
          <p className="text-[10px] text-muted-foreground tracking-[0.12em] mt-1">Hadir</p>
        </div>
        <div className="stat-card-enter p-4 text-center border-r border-border" style={{ animationDelay: "80ms" }}>
          <p className="text-3xl font-bold tracking-tight leading-none text-[oklch(0.65_0.22_25)]">
            {stats.tidak_hadir}
          </p>
          <p className="text-[10px] text-muted-foreground tracking-[0.12em] mt-1">Tidak Hadir</p>
        </div>
        <div className="stat-card-enter p-4 text-center" style={{ animationDelay: "160ms" }}>
          <p className="text-3xl font-bold text-foreground">
            {stats.total}
          </p>
          <p className="text-[10px] text-muted-foreground tracking-[0.12em] mt-1">Total</p>
        </div>
      </div>

      {/* ── Progress Bar ────────────────────────────────── */}
      <div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden flex">
          <div
            className="h-full rounded-full bg-[oklch(0.75_0.18_160)] transition-all duration-500 ease-out"
            style={{ width: `${stats.total ? (stats.hadir / stats.total) * 100 : 0}%` }}
          />
          <div
            className="h-full rounded-full bg-[oklch(0.65_0.22_25)] transition-all duration-500 ease-out"
            style={{ width: `${stats.total ? (stats.tidak_hadir / stats.total) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>Ringkasan Kehadiran</span>
          <span>{stats.unmarked > 0 ? `${stats.unmarked} belum dicatat` : "Semua tercatat \u2713"}</span>
        </div>
      </div>

      {/* ── Filter + Actions ────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {["all", "hadir", "tidak_hadir", "unmarked"].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "text-[11px] px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer",
              activeFilter === f
                ? "bg-foreground text-background border-foreground font-medium"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground bg-transparent"
            )}
          >
            {f === "all" ? "Semua" : f === "hadir" ? "Hadir" : f === "tidak_hadir" ? "Tidak Hadir" : "Belum Dicatat"}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={handleBulkMarkPresent}
          className="text-[11px] px-4 py-2 rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-all duration-200 cursor-pointer"
        >
          Tandai Semua Hadir
        </button>
        {stats.hadir + stats.tidak_hadir > 0 && (
          <button
            onClick={handleReset}
            className="text-[11px] px-3 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200 cursor-pointer bg-transparent"
          >
            <RotateCcw className="h-3 w-3 inline mr-1" />Reset
          </button>
        )}
      </div>

      {/* ── Card Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
        {filteredMembers.map((member, idx) => {
          const status = member.today_status;
          const isPresent = status === "hadir";
          const isAbsent = status === "tidak_hadir";

          return (
            <button
              key={member.no_jemaat}
              onClick={() => cycleStatus(member.no_jemaat)}
              onContextMenu={(e) => {
                e.preventDefault();
                setCtxMenu({
                  x: Math.min(e.clientX, window.innerWidth - 170),
                  y: Math.min(e.clientY, window.innerHeight - 180),
                  no_jemaat: member.no_jemaat,
                });
              }}
              className={cn(
                "attendance-card group relative flex flex-col items-center gap-2.5 rounded-[18px] border-[1.5px] p-4 pb-3 cursor-pointer select-none transition-all duration-200",
                "hover:-translate-y-0.5 active:scale-[0.97] overflow-hidden",
                "animate-in",
                isPresent && "border-[oklch(0.75_0.18_160)] bg-[oklch(0.75_0.18_160)/0.06] shadow-[0_0_24px_oklch(0.75_0.18_160/0.12),inset_0_1px_0_oklch(0.75_0.18_160/0.15)]",
                isAbsent && "border-[oklch(0.65_0.22_25)] bg-[oklch(0.65_0.22_25)/0.06] shadow-[0_0_24px_oklch(0.65_0.22_25/0.12),inset_0_1px_0_oklch(0.65_0.22_25/0.15)]",
                !status && "border-border bg-card hover:border-muted-foreground/40"
              )}
              style={{ animationDelay: `${Math.min(idx * 40, 400)}ms` }}
            >
              {/* Ripple effect */}
              {ripples[member.no_jemaat] && (
                <span
                  className="attendance-ripple"
                  style={{ background: getRippleColor(status) }}
                />
              )}

              {/* Avatar */}
              <div className="relative">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold transition-all duration-250 border-2 relative z-[1]",
                  isPresent && "border-[oklch(0.75_0.18_160)] shadow-[0_0_0_4px_oklch(0.75_0.18_160/0.15)]",
                  isAbsent && "border-[oklch(0.65_0.22_25)] shadow-[0_0_0_4px_oklch(0.65_0.22_25/0.15)]",
                  !status && "border-border bg-secondary"
                )}>
                  <MemberAvatar
                    name={member.nama_jemaat}
                    gender={member.jenis_kelamin}
                    size="md"
                  />
                </div>
                {/* Pulse ring for present */}
                {isPresent && (
                  <span className="attendance-pulse-ring" />
                )}
                {/* Status dot */}
                <span className={cn(
                  "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card z-[2] transition-colors duration-250",
                  isPresent && "bg-[oklch(0.75_0.18_160)]",
                  isAbsent && "bg-[oklch(0.65_0.22_25)]",
                  !status && "bg-border"
                )} />
              </div>

              {/* Name */}
              <span className="text-[13px] font-semibold text-center leading-tight text-foreground line-clamp-2">
                {member.nama_jemaat}
              </span>

              {/* Status label */}
              <span className={cn(
                "font-mono-ledger text-[10px] uppercase tracking-[0.1em] transition-colors duration-250",
                getStatusColor(status)
              )}>
                {getStatusLabel(status)}
              </span>

              {/* Leader badge */}
              {member.is_leader && (
                <span className="absolute top-2 left-2 font-mono-ledger text-[8px] uppercase tracking-wider text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                  Leader
                </span>
              )}

              {/* Cycle hint on hover */}
              <span className="font-mono-ledger text-[9px] text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors uppercase tracking-wider">
                tap to cycle
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Context Menu ──────────────────────────────── */}
      {ctxMenu && (
        <div
          className="fixed z-50 bg-card border border-border rounded-xl p-1.5 min-w-[160px] animate-in"
          style={{ left: ctxMenu.x, top: ctxMenu.y, animation: "scaleIn 0.15s ease" }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            { status: "hadir", label: "Hadir", dotClass: "bg-[oklch(0.75_0.18_160)]" },
            { status: "tidak_hadir", label: "Tidak Hadir", dotClass: "bg-[oklch(0.65_0.22_25)]" },
            { status: null, label: "Belum Dicatat", dotClass: "bg-border" },
          ].map(item => (
            <button
              key={item.label}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer text-left"
              onClick={() => {
                setStatusDirect(ctxMenu.no_jemaat, item.status);
                setCtxMenu(null);
              }}
            >
              <span className={cn("w-2 h-2 rounded-full shrink-0", item.dotClass)} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Tidak ada anggota dengan filter ini</p>
        </div>
      )}

      {/* ── Submit Footer ───────────────────────────────── */}
      <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-background/80 backdrop-blur-sm border-t border-border flex items-center gap-3">
        <span className="font-mono-ledger text-xs text-muted-foreground flex-1">
          {progressPercent}% tercatat &middot; Tap = siklus &middot; Klik kanan = atur langsung
        </span>
        <Button
          size="lg"
          onClick={() => setShowConfirm(true)}
          disabled={stats.hadir + stats.tidak_hadir === 0 || submitting}
          className="font-semibold tracking-tight"
        >
          <Save className="h-4 w-4 mr-2" /> Simpan Absensi
        </Button>
      </div>

      {/* ── Confirm Dialog ──────────────────────────────── */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Simpan Absensi</DialogTitle>
            <DialogDescription>
              {cgfDetail?.nama_cgf} &middot; {date}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-4">
            <div className="flex-1 text-center p-4 rounded-xl border border-[oklch(0.75_0.18_160)] bg-[oklch(0.75_0.18_160)/0.06]">
              <p className="text-3xl font-bold text-[oklch(0.75_0.18_160)]">{stats.hadir}</p>
              <p className="font-mono-ledger text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Hadir</p>
            </div>
            <div className="flex-1 text-center p-4 rounded-xl border border-[oklch(0.65_0.22_25)] bg-[oklch(0.65_0.22_25)/0.06]">
              <p className="text-3xl font-bold text-[oklch(0.65_0.22_25)]">{stats.tidak_hadir}</p>
              <p className="font-mono-ledger text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Tidak Hadir</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// HISTORY VIEW
// ============================================================

function HistoryView() {
  const [records, setRecords] = useState({ data: [], pagination: { page: 1, limit: 5000, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [cgfFilter, setCgfFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedCgf, setExpandedCgf] = useState({});
  const [expandedDates, setExpandedDates] = useState({});

  const [cgfList, setCgfList] = useState([]);

  useEffect(() => {
    getAttendanceCGFList().then(setCgfList);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await getAttendanceHistory({
      cg_id: cgfFilter === "all" ? undefined : cgfFilter,
      keterangan: statusFilter === "all" ? undefined : statusFilter,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: 1,
      limit: 5000,
    });
    console.log(result);
    setRecords(result);
    setLoading(false);
  }, [cgfFilter, statusFilter, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleQuickFilter = useCallback((range) => {
    const now = new Date('2026-04-14');
    let start = new Date(now);
    if (range === 'this-month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === '3-months') {
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    }
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  }, []);

  const toggleCgf = (cgf) => {
    setExpandedCgf(prev => ({ ...prev, [cgf]: !prev[cgf] }));
  };

  const toggleDate = (cgf, date) => {
    const key = `${cgf}__${date}`;
    setExpandedDates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const groupedByCgf = useMemo(() => {
    const groups = {};
    records.data.forEach(record => {
      if (!groups[record.nama_cgf]) {
        groups[record.nama_cgf] = { records: [], dates: {} };
      }
      groups[record.nama_cgf].records.push(record);

      if (!groups[record.nama_cgf].dates[record.tanggal]) {
        groups[record.nama_cgf].dates[record.tanggal] = [];
      }
      groups[record.nama_cgf].dates[record.tanggal].push(record);
    });
    return groups;
  }, [records.data]);

  const statusBadgeVariant = (status) => {
    if (status === "hadir") return "success";
    if (status === "izin") return "warning";
    if (status === "tamu") return "secondary";
    return "destructive";
  };

  const getStatusLabel = (status) => {
    if (status === "hadir") return "Hadir";
    if (status === "tidak_hadir") return "Tidak Hadir";
    if (status === "izin") return "Izin";
    if (status === "tamu") return "Tamu";
    return status;
  };

  const cgfKeys = Object.keys(groupedByCgf);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter Riwayat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select value={cgfFilter} onValueChange={(v) => setCgfFilter(v)}>
              <SelectTrigger className="full sm:w-44">
                <SelectValue placeholder="Semua CGF" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua CGF</SelectItem>
                {cgfList.map(g => (
                  <SelectItem key={g.cg_id} value={String(g.cg_id)}>{g.nama_cgf}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="hadir">Hadir</SelectItem>
                <SelectItem value="tidak_hadir">Tidak Hadir</SelectItem>
              </SelectContent>
            </Select>

            <input
              type="date"
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Dari"
            />
            <input
              type="date"
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Sampai"
            />

            <Button variant="outline" size="sm" onClick={() => handleQuickFilter('this-month')}>
              Bulan Ini
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter('3-months')}>
              3 Bulan Terakhir
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : cgfKeys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Tidak ada data absensi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cgfKeys.map(cgf => {
                const cgfData = groupedByCgf[cgf];
                const isCgfExpanded = expandedCgf[cgf];
                const dateKeys = Object.keys(cgfData.dates).sort((a, b) => new Date(b) - new Date(a));
                const totalRecords = cgfData.records.length;
                const hadirCount = cgfData.records.filter(r => r.keterangan === 'hadir').length;
                const tidakHadirCount = cgfData.records.filter(r => r.keterangan === 'tidak_hadir').length;

                return (
                  <div key={cgf} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleCgf(cgf)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer text-left"
                    >
                      <span className={cn(
                        "transition-transform duration-200",
                        isCgfExpanded && "rotate-90"
                      )}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm flex-1">{cgf}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="text-xs">{hadirCount} hadir</Badge>
                        <Badge variant="destructive" className="text-xs">{tidakHadirCount} tidak hadir</Badge>
                        <Badge variant="outline" className="text-xs">{dateKeys.length} tanggal</Badge>
                        <Badge variant="secondary" className="text-xs">{totalRecords} catatan</Badge>
                      </div>
                    </button>

                    {isCgfExpanded && (
                      <div className="divide-y divide-border">
                        {dateKeys.map(date => {
                          const dateRecords = cgfData.dates[date];
                          const dateKey = `${cgf}__${date}`;
                          const isDateExpanded = expandedDates[dateKey];
                          const dateHadir = dateRecords.filter(r => r.keterangan === 'hadir').length;
                          const dateTotal = dateRecords.length;

                          return (
                            <div key={date} className="pl-4">
                              <button
                                onClick={() => toggleDate(cgf, date)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer text-left"
                              >
                                <span className={cn(
                                  "transition-transform duration-200",
                                  isDateExpanded && "rotate-90"
                                )}>
                                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                </span>
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium flex-1">{date}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">{dateHadir}/{dateTotal} hadir</span>
                                  <Progress
                                    value={dateTotal > 0 ? (dateHadir / dateTotal) * 100 : 0}
                                    className="h-1.5 w-16"
                                  />
                                </div>
                              </button>

                              {isDateExpanded && (
                                <div className="pl-6 pb-2">
                                  <div className="border-border ml-2 pl-3">
                                    <Table>
                                      <TableBody>
                                        {dateRecords.map(record => (
                                          <TableRow key={record.id}>
                                            <TableCell className="w-10">
                                              <MemberAvatar
                                                name={record.nama_jemaat}
                                                size="sm"
                                              />
                                            </TableCell>
                                            <TableCell className="text-sm">{record.nama_jemaat}</TableCell>
                                            <TableCell className="text-center">
                                              <Badge variant={statusBadgeVariant(record.keterangan)}>
                                                {getStatusLabel(record.keterangan)}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// STATS VIEW
// ============================================================

function StatsView() {
  const [selectedCgId, setSelectedCgId] = useState("all");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cgfList, setCgfList] = useState([]);

  useEffect(() => {
    getAttendanceCGFList().then(setCgfList);
  }, []);

  useEffect(() => {
    if (cgfList.length === 0) return;
    setLoading(true);

    const loadStats = async () => {
      if (selectedCgId === "all") {
        const allStatsRaw = await Promise.all(
          cgfList.map(g => getAttendanceStatsCGF(g.cg_id))
        );
        const allStats = allStatsRaw.filter(Boolean);

        const aggregated = {
          cg_id: "all",
          nama_cgf: "Semua CGF",
          total_members: allStats.reduce((sum, s) => sum + s.total_members, 0),
          total_meetings: Math.max(...allStats.map(s => s.total_meetings), 0),
          total_records: allStats.reduce((sum, s) => sum + s.total_records, 0),
          hadir: allStats.reduce((sum, s) => sum + s.hadir, 0),
          tidak_hadir: allStats.reduce((sum, s) => sum + s.tidak_hadir, 0),
          attendance_rate: 0,
          monthly_summary: [],
          per_cgf: allStats,
        };
        aggregated.attendance_rate = aggregated.total_records > 0
          ? Math.round((aggregated.hadir / aggregated.total_records) * 100) : 0;

        const monthMap = {};
        allStats.forEach(s => {
          (s.monthly_summary || []).forEach(m => {
            if (!monthMap[m.bulan]) monthMap[m.bulan] = { bulan: m.bulan, hadir: 0, tidak_hadir: 0 };
            monthMap[m.bulan].hadir += m.hadir;
            monthMap[m.bulan].tidak_hadir += m.tidak_hadir;
          });
        });
        aggregated.monthly_summary = Object.values(monthMap);

        setStats(aggregated);
      } else {
        const s = await getAttendanceStatsCGF(String(selectedCgId));
        setStats(s);
      }
      setLoading(false);
    };

    loadStats();
  }, [selectedCgId, cgfList]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3">
        <Select value={selectedCgId} onValueChange={setSelectedCgId}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Pilih CGF" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua CGF</SelectItem>
            {cgfList.map(g => (
              <SelectItem key={g.cg_id} value={String(g.cg_id)}>{g.nama_cgf}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total Anggota</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_members}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total Pertemuan</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_meetings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Tingkat Kehadiran</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{stats.attendance_rate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total Catatan</span>
                </div>
                <p className="text-2xl font-bold">{stats.total_records}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribusi Kehadiran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm text-green-600 font-medium">Hadir</div>
                    <Progress value={stats.total_records > 0 ? (stats.hadir / stats.total_records) * 100 : 0} className="h-4 flex-1 [&>div]:bg-green-500" />
                    <div className="w-12 text-right text-sm font-medium">{stats.hadir}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-sm text-red-600 font-medium">Tidak Hadir</div>
                    <Progress value={stats.total_records > 0 ? (stats.tidak_hadir / stats.total_records) * 100 : 0} className="h-4 flex-1 [&>div]:bg-red-500" />
                    <div className="w-12 text-right text-sm font-medium">{stats.tidak_hadir}</div>
                  </div>
                  {stats.izin > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm text-yellow-600 font-medium">Izin</div>
                      <Progress value={stats.total_records > 0 ? (stats.izin / stats.total_records) * 100 : 0} className="h-4 flex-1 [&>div]:bg-yellow-500" />
                      <div className="w-12 text-right text-sm font-medium">{stats.izin}</div>
                    </div>
                  )}
                  {stats.tamu > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm text-blue-600 font-medium">Tamu</div>
                      <Progress value={stats.total_records > 0 ? (stats.tamu / stats.total_records) * 100 : 0} className="h-4 flex-1 [&>div]:bg-blue-500" />
                      <div className="w-12 text-right text-sm font-medium">{stats.tamu}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ringkasan Bulanan</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.monthly_summary.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada data</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bulan</TableHead>
                        <TableHead className="text-right">Hadir</TableHead>
                        <TableHead className="text-right">Tidak Hadir</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.monthly_summary.map((m, i) => {
                        const total = m.hadir + m.tidak_hadir;
                        const rate = total > 0 ? Math.round((m.hadir / total) * 100) : 0;
                        return (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{m.bulan}</TableCell>
                            <TableCell className="text-right text-green-600">{m.hadir}</TableCell>
                            <TableCell className="text-right text-red-600">{m.tidak_hadir}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={rate >= 75 ? "success" : rate >= 50 ? "warning" : "destructive"}>
                                {rate}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedCgId === "all" && stats.per_cgf && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Perbandingan CGF</CardTitle>
                <CardDescription>Tingkat kehadiran per CGF</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.per_cgf.map(s => (
                    <div key={s.cg_id} className="flex items-center gap-3">
                      <div className="w-32 sm:w-40 text-sm font-medium truncate">{s.nama_cgf}</div>
                      <Progress value={s.attendance_rate} className="h-3 flex-1" />
                      <div className="w-12 text-right text-sm font-medium">{s.attendance_rate}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Pilih CGF untuk melihat statistik</p>
        </div>
      )}
    </div>
  );
}
