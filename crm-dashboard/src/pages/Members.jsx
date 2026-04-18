import { useState, useMemo, useEffect, useCallback } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, UserPlus, CalendarDays, MessageCircle, CircleArrowOutUpRightIcon, ArrowUpRightFromSquareIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { SelectPopover } from "../components/ui/select-popover.jsx"
import { DatePickerPopover } from "../components/ui/date-picker-popover.jsx"
import { invalidateCache, fetchMembersFromAPI, fetchCGFFromAPI, getNextNoJemaat } from "../data/mock.js"
import { MemberAvatar } from "../components/ui/member-avatar.jsx"
import { EmptyState } from "../components/ui/empty-state.jsx"
import { createMember, updateMember, deleteMember, ApiError } from "../services/members.api.js"

const PAGE_SIZE = 10

const EMPTY_FORM = {
  nama_jemaat: "",
  jenis_kelamin: "Laki-laki",
  tanggal_lahir: "",
  kuliah_kerja: "Kerja",
  no_handphone: "",
  ketertarikan_cgf: "Belum Mau Join",
  nama_cgf: "",
  kategori_domisili: "",
  alamat_domisili: "",
  status_aktif: "",
  status_keterangan: "",
}

/**
 * Parse tanggal_lahir from database (which is stored as timestamp with timezone)
 * The database stores dates at 17:00:00 UTC, which is 00:00 in UTC+7 (midnight).
 * We need to extract the correct date part accounting for this.
 * @param {string} dateStr - Date string from database like "1990-05-14T17:00:00.000Z"
 * @returns {string} - Date string in YYYY-MM-DD format
 */
function parseTanggalLahir(dateStr) {
  if (!dateStr) return "";
  // Extract YYYY-MM-DD from the string directly
  const datePart = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  // Parse as UTC+7 by adding 7 hours offset
  const [year, month, day] = datePart.split("-").map(Number);
  // Create date at noon UTC, then subtract 7 hours to get UTC+7 midnight
  // This ensures we get the correct date in UTC+7 timezone
  const utcDate = new Date(Date.UTC(year, month - 1, day, 17, 0, 0, 0));
  const localDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
  const localYear = localDate.getUTCFullYear();
  const localMonth = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const localDay = String(localDate.getUTCDate()).padStart(2, "0");
  return `${localYear}-${localMonth}-${localDay}`;
}

function toWhatsAppNumber(phone) {
  if (!phone) return ""
  return phone.startsWith("0") ? "62" + phone.slice(1) : phone
}

export function Members() {
  const [members, setMembers] = useState([])
  const [cgfGroups, setCgfGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nextNoJemaat = useMemo(() => getNextNoJemaat(members), [members])

  const fetchMembers = useCallback(async () => {
    setIsLoading(true)
    try {
      const membersData = await fetchMembersFromAPI()
      setMembers(membersData)
    } catch (error) {
      toast.error("Failed to load members", {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCGFGroups = useCallback(async () => {
    try {
      const groupsData = await fetchCGFFromAPI()
      setCgfGroups(groupsData)
    } catch (error) {
      console.error("Failed to load CGF groups:", error)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
    fetchCGFGroups()
  }, [fetchMembers, fetchCGFGroups])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ gender: "", cgfStatus: "", domisili: "" })
  const [currentPage, setCurrentPage] = useState(1)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const domisiliOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.kategori_domisili).filter(Boolean))
    return [...set].sort()
  }, [members])

  const filteredMembers = useMemo(() => {
    let result = members

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.nama_jemaat.toLowerCase().includes(q) ||
          (m.no_handphone && m.no_handphone.includes(q)) ||
          String(m.no_jemaat).includes(q)
      )
    }

    if (filters.gender) {
      result = result.filter((m) => m.jenis_kelamin === filters.gender)
    }

    if (filters.cgfStatus) {
      result = result.filter((m) => m.ketertarikan_cgf === filters.cgfStatus)
    }

    if (filters.domisili) {
      result = result.filter((m) => m.kategori_domisili === filters.domisili)
    }

    return result
  }, [members, searchQuery, filters])

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE))
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function resetFilters() {
    setSearchQuery("")
    setFilters({ gender: "", cgfStatus: "", domisili: "" })
    setCurrentPage(1)
  }

  function openAddDialog() {
    setFormData({ ...EMPTY_FORM, jenis_kelamin: "Laki-laki" })
    setShowAddDialog(true)
  }

  function openEditDialog(member) {
    setSelectedMember(member)
    setFormData({
      nama_jemaat: member.nama_jemaat,
      jenis_kelamin: member.jenis_kelamin || "Laki-laki",
      tanggal_lahir: parseTanggalLahir(member.tanggal_lahir),
      kuliah_kerja: member.kuliah_kerja || "Kerja",
      no_handphone: member.no_handphone || "",
      ketertarikan_cgf: member.ketertarikan_cgf || "Belum Mau Join",
      nama_cgf: member.nama_cgf || "",
      kategori_domisili: member.kategori_domisili || "",
      alamat_domisili: member.alamat_domisili || "",
      status_aktif: member.status_aktif || "",
      status_keterangan: member.status_keterangan || "",
    })
    setShowEditDialog(true)
  }

  function openDeleteDialog(member) {
    setSelectedMember(member)
    setShowDeleteDialog(true)
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleAddMember(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const tanggalLahir = formData.tanggal_lahir;
      const memberData = {
        no_jemaat: nextNoJemaat,
        nama_jemaat: formData.nama_jemaat,
        jenis_kelamin: formData.jenis_kelamin,
        tanggal_lahir: tanggalLahir,
        tahun_lahir: tanggalLahir ? parseInt(tanggalLahir.slice(0, 4), 10) : undefined,
        bulan_lahir: tanggalLahir ? parseInt(tanggalLahir.slice(5, 7), 10) : undefined,
        kuliah_kerja: formData.kuliah_kerja || undefined,
        no_handphone: formData.no_handphone || undefined,
        ketertarikan_cgf: formData.ketertarikan_cgf || undefined,
        nama_cgf: formData.nama_cgf || undefined,
        kategori_domisili: formData.kategori_domisili || undefined,
        alamat_domisili: formData.alamat_domisili || undefined,
        status_aktif: formData.status_aktif || undefined,
        status_keterangan: formData.status_keterangan || undefined,
      }

      await createMember(memberData)
      
      // Invalidate cache and refresh data
      invalidateCache()
      await fetchMembers()
      
      setShowAddDialog(false)
      toast.success("Member added successfully", {
        description: `${formData.nama_jemaat} has been added as member #${nextNoJemaat}.`
      })
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Failed to add member", {
          description: error.message
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditMember(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const tanggalLahir = formData.tanggal_lahir;
      const memberData = {
        nama_jemaat: formData.nama_jemaat,
        jenis_kelamin: formData.jenis_kelamin,
        tanggal_lahir: tanggalLahir,
        tahun_lahir: tanggalLahir ? parseInt(tanggalLahir.slice(0, 4), 10) : undefined,
        bulan_lahir: tanggalLahir ? parseInt(tanggalLahir.slice(5, 7), 10) : undefined,
        kuliah_kerja: formData.kuliah_kerja || undefined,
        no_handphone: formData.no_handphone || undefined,
        ketertarikan_cgf: formData.ketertarikan_cgf || undefined,
        nama_cgf: formData.nama_cgf || undefined,
        kategori_domisili: formData.kategori_domisili || undefined,
        alamat_domisili: formData.alamat_domisili || undefined,
        status_aktif: formData.status_aktif || undefined,
        status_keterangan: formData.status_keterangan || undefined,
      }

      await updateMember(selectedMember.no_jemaat, memberData)
      
      // Invalidate cache and refresh data
      invalidateCache()
      await fetchMembers()
      
      setShowEditDialog(false)
      setSelectedMember(null)
      toast.success("Member updated successfully", {
        description: `${formData.nama_jemaat}'s information has been updated.`
      })
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Failed to update member", {
          description: error.message
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteMember() {
    setIsSubmitting(true)
    
    try {
      await deleteMember(selectedMember.no_jemaat)
      
      // Invalidate cache and refresh data
      invalidateCache()
      await fetchMembers()
      
      setShowDeleteDialog(false)
      setSelectedMember(null)
      toast.success("Member deleted successfully", {
        description: `${selectedMember.nama_jemaat} has been removed from the system.`
      })
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Failed to delete member", {
          description: error.message
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function getCgfStatusBadge(status) {
    if (status === "Sudah Join") return <Badge variant="success">Sudah Join</Badge>
    if (status === "Mau Join") return <Badge variant="warning">Mau Join</Badge>
    if (status === "Sudah Tidak Join") return <Badge variant="destructive">Sudah Tidak Join</Badge>
    return <Badge variant="secondary">Belum Mau Join</Badge>
  }

  function renderMemberForm(onSubmit, title) {
    const isEditMode = showEditDialog
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddDialog(false)
                setShowEditDialog(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">No. Jemaat</label>
                {isEditMode ? (
                  <input
                    type="number"
                    value={selectedMember?.no_jemaat || ""}
                    disabled
                    className="h-9 rounded-md border bg-muted px-3 text-sm text-muted-foreground"
                  />
                ) : (
                  <input
                    type="number"
                    value={nextNoJemaat}
                    disabled
                    className="h-9 rounded-md border bg-muted px-3 text-sm text-muted-foreground"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Nama</label>
                <input
                  type="text"
                  required
                  value={formData.nama_jemaat}
                  onChange={(e) => handleFormChange("nama_jemaat", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Gender</label>
                <SelectPopover
                  value={formData.jenis_kelamin}
                  onValueChange={(v) => handleFormChange("jenis_kelamin", v)}
                  options={[
                    { value: "Laki-laki", label: "Laki-laki" },
                    { value: "Perempuan", label: "Perempuan" },
                  ]}
                  placeholder="Pilih gender"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tanggal Lahir</label>
                <DatePickerPopover
                  date={formData.tanggal_lahir}
                  onDateChange={(d) => handleFormChange("tanggal_lahir", d)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Kuliah / Kerja</label>
                <SelectPopover
                  value={formData.kuliah_kerja}
                  onValueChange={(v) => handleFormChange("kuliah_kerja", v)}
                  options={[
                    { value: "Kerja", label: "Kerja" },
                    { value: "Kuliah", label: "Kuliah" },
                  ]}
                  placeholder="Pilih..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">No. Handphone</label>
                <input
                  type="text"
                  required
                  value={formData.no_handphone}
                  onChange={(e) => handleFormChange("no_handphone", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">CGF Status</label>
                <SelectPopover
                  value={formData.ketertarikan_cgf}
                  onValueChange={(v) => handleFormChange("ketertarikan_cgf", v)}
                  options={[
                    { value: "Belum Mau Join", label: "Belum Mau Join" },
                    { value: "Mau Join", label: "Mau Join" },
                    { value: "Sudah Join", label: "Sudah Join" },
                    { value: "Sudah Tidak Join", label: "Sudah Tidak Join" },
                  ]}
                  placeholder="Pilih status"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Nama CGF</label>
                <SelectPopover
                  value={formData.nama_cgf}
                  onValueChange={(v) => handleFormChange("nama_cgf", v)}
                  options={[
                    { value: "", label: "-" },
                    ...cgfGroups.map((g) => ({ value: g.nama_cgf, label: g.nama_cgf })),
                  ]}
                  placeholder="Pilih CGF"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Kategori Domisili</label>
              <SelectPopover
                value={formData.kategori_domisili}
                onValueChange={(v) => handleFormChange("kategori_domisili", v)}
                options={domisiliOptions.map((d) => ({ value: d, label: d }))}
                placeholder="Pilih domisili"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Alamat Domisili</label>
              <input
                type="text"
                value={formData.alamat_domisili}
                onChange={(e) => handleFormChange("alamat_domisili", e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Status Aktif</label>
                <SelectPopover
                  value={formData.status_aktif}
                  onValueChange={(v) => handleFormChange("status_aktif", v)}
                  options={[
                    { value: "", label: "-" },
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                    { value: "Sabbatical", label: "Sabbatical" },
                    { value: "Moved", label: "Moved" },
                    { value: "No Information", label: "No Information" },
                  ]}
                  placeholder="Pilih status"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Status Keterangan</label>
                <input
                  type="text"
                  value={formData.status_keterangan}
                  onChange={(e) => handleFormChange("status_keterangan", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false)
                  setShowEditDialog(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {showEditDialog ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  showEditDialog ? "Save Changes" : "Add Member"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground">Manage church members and CGF memberships</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, phone, or no. jemaat..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SelectPopover
                value={filters.gender}
                onValueChange={(v) => {
                  setFilters((prev) => ({ ...prev, gender: v }))
                  setCurrentPage(1)
                }}
                options={[
                  { value: "", label: "All Gender" },
                  { value: "Laki-laki", label: "Laki-laki" },
                  { value: "Perempuan", label: "Perempuan" },
                ]}
                placeholder="All Gender"
              />
              <SelectPopover
                value={filters.cgfStatus}
                onValueChange={(v) => {
                  setFilters((prev) => ({ ...prev, cgfStatus: v }))
                  setCurrentPage(1)
                }}
                options={[
                  { value: "", label: "All CGF Status" },
                  { value: "Sudah Join", label: "Sudah Join" },
                  { value: "Belum Mau Join", label: "Belum Mau Join" },
                  { value: "Mau Join", label: "Mau Join" },
                  { value: "Sudah Tidak Join", label: "Sudah Tidak Join" },
                ]}
                placeholder="All CGF Status"
              />
              <SelectPopover
                value={filters.domisili}
                onValueChange={(v) => {
                  setFilters((prev) => ({ ...prev, domisili: v }))
                  setCurrentPage(1)
                }}
                options={[
                  { value: "", label: "All Domisili" },
                  ...domisiliOptions.map((d) => ({ value: d, label: d })),
                ]}
                placeholder="All Domisili"
              />
              {(searchQuery || filters.gender || filters.cgfStatus || filters.domisili) && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>CGF Status</TableHead>
                  <TableHead>Domisili</TableHead>
                  <TableHead>Alamat Domisili</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="ml-3 text-muted-foreground">Loading members...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <EmptyState
                        title="No members found"
                        description="Start by adding your first church member to the system, or adjust your search filters."
                        illustration="/illustrations/empty-states/no-members.svg"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member) => (
                    <TableRow key={member.no_jemaat}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <MemberAvatar
                            name={member.nama_jemaat}
                            gender={member.jenis_kelamin}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium">{member.nama_jemaat}</p>
                            <p className="text-xs text-muted-foreground">#{member.no_jemaat}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.jenis_kelamin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 ">
                          <span>{member.no_handphone}</span>
                          {member.no_handphone && (
                            <a
                              href={`https://wa.me/${toWhatsAppNumber(member.no_handphone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 transition-colors"
                            >
                              <ArrowUpRightFromSquareIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getCgfStatusBadge(member.ketertarikan_cgf)}</TableCell>
                      <TableCell>{member.kategori_domisili}</TableCell>
                      <TableCell className="max-w-[100px] truncate">{member.alamat_domisili}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(member)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(member)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedMembers.length} of {filteredMembers.length} members
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAddDialog && renderMemberForm(handleAddMember, "Add New Member")}
      {showEditDialog && renderMemberForm(handleEditMember, "Edit Member")}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Delete Member</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{selectedMember?.nama_jemaat}</strong> (
              {selectedMember?.no_jemaat})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteMember} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
