import { useState, useMemo } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { getMembers, getCGFGroups } from "../data/mock.js"
import { MemberAvatar } from "../components/ui/member-avatar.jsx"
import { EmptyState } from "../components/ui/empty-state.jsx"

const PAGE_SIZE = 10

const EMPTY_FORM = {
  no_jemaat: "",
  nama_jemaat: "",
  jenis_kelamin: "Laki-laki",
  tanggal_lahir: "",
  kuliah_kerja: "Kerja",
  no_handphone: "",
  ketertarikan_cgf: "Belum Join",
  nama_cgf: "",
  kategori_domisili: "",
  alamat_domisili: "",
}

export function Members() {
  const [members, setMembers] = useState(() => getMembers())
  const cgfGroups = useMemo(() => getCGFGroups(), [])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ gender: "", cgfStatus: "", domisili: "" })
  const [currentPage, setCurrentPage] = useState(1)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const domisiliOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.kategori_domisili))
    return [...set].sort()
  }, [members])

  const filteredMembers = useMemo(() => {
    let result = members

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.nama_jemaat.toLowerCase().includes(q) ||
          m.no_handphone.includes(q) ||
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
    setFormData({ ...EMPTY_FORM })
    setShowAddDialog(true)
  }

  function openEditDialog(member) {
    setSelectedMember(member)
    setFormData({
      no_jemaat: member.no_jemaat,
      nama_jemaat: member.nama_jemaat,
      jenis_kelamin: member.jenis_kelamin,
      tanggal_lahir: member.tanggal_lahir,
      kuliah_kerja: member.kuliah_kerja,
      no_handphone: member.no_handphone,
      ketertarikan_cgf: member.ketertarikan_cgf,
      nama_cgf: member.nama_cgf || "",
      kategori_domisili: member.kategori_domisili,
      alamat_domisili: member.alamat_domisili,
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

  function handleAddMember(e) {
    e.preventDefault()
    const newMember = {
      ...formData,
      no_jemaat: Number(formData.no_jemaat),
      tahun_lahir: formData.tanggal_lahir ? Number(formData.tanggal_lahir.slice(0, 4)) : 0,
      bulan_lahir: formData.tanggal_lahir ? Number(formData.tanggal_lahir.slice(5, 7)) : 0,
    }
    setMembers((prev) => [...prev, newMember])
    setShowAddDialog(false)
  }

  function handleEditMember(e) {
    e.preventDefault()
    const updated = {
      ...formData,
      no_jemaat: Number(formData.no_jemaat),
      tahun_lahir: formData.tanggal_lahir ? Number(formData.tanggal_lahir.slice(0, 4)) : 0,
      bulan_lahir: formData.tanggal_lahir ? Number(formData.tanggal_lahir.slice(5, 7)) : 0,
    }
    setMembers((prev) => prev.map((m) => (m.no_jemaat === selectedMember.no_jemaat ? updated : m)))
    setShowEditDialog(false)
    setSelectedMember(null)
  }

  function handleDeleteMember() {
    setMembers((prev) => prev.filter((m) => m.no_jemaat !== selectedMember.no_jemaat))
    setShowDeleteDialog(false)
    setSelectedMember(null)
  }

  function getCgfStatusBadge(status) {
    if (status === "Sudah Join") return <Badge variant="success">Sudah Join</Badge>
    if (status === "Tertarik") return <Badge variant="warning">Tertarik</Badge>
    return <Badge variant="secondary">Belum Join</Badge>
  }

  function renderMemberForm(onSubmit, title) {
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
                <input
                  type="number"
                  required
                  value={formData.no_jemaat}
                  onChange={(e) => handleFormChange("no_jemaat", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
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
                <select
                  value={formData.jenis_kelamin}
                  onChange={(e) => handleFormChange("jenis_kelamin", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tanggal Lahir</label>
                <input
                  type="date"
                  required
                  value={formData.tanggal_lahir}
                  onChange={(e) => handleFormChange("tanggal_lahir", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Kuliah / Kerja</label>
                <select
                  value={formData.kuliah_kerja}
                  onChange={(e) => handleFormChange("kuliah_kerja", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Kerja">Kerja</option>
                  <option value="Kuliah">Kuliah</option>
                </select>
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
                <select
                  value={formData.ketertarikan_cgf}
                  onChange={(e) => handleFormChange("ketertarikan_cgf", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Belum Join">Belum Join</option>
                  <option value="Sudah Join">Sudah Join</option>
                  <option value="Tertarik">Tertarik</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Nama CGF</label>
                <select
                  value={formData.nama_cgf}
                  onChange={(e) => handleFormChange("nama_cgf", e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">-</option>
                  {cgfGroups.map((g) => (
                    <option key={g.cg_id} value={g.nama_cgf}>
                      {g.nama_cgf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Kategori Domisili</label>
              <input
                type="text"
                required
                value={formData.kategori_domisili}
                onChange={(e) => handleFormChange("kategori_domisili", e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
              <Button type="submit">{showEditDialog ? "Save Changes" : "Add Member"}</Button>
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
              <select
                value={filters.gender}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, gender: e.target.value }))
                  setCurrentPage(1)
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <select
                value={filters.cgfStatus}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, cgfStatus: e.target.value }))
                  setCurrentPage(1)
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All CGF Status</option>
                <option value="Sudah Join">Sudah Join</option>
                <option value="Belum Join">Belum Join</option>
                <option value="Tertarik">Tertarik</option>
              </select>
              <select
                value={filters.domisili}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, domisili: e.target.value }))
                  setCurrentPage(1)
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All Domisili</option>
                {domisiliOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
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
                      <TableCell>{member.no_handphone}</TableCell>
                      <TableCell>{getCgfStatusBadge(member.ketertarikan_cgf)}</TableCell>
                      <TableCell>{member.kategori_domisili}</TableCell>
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
              <Button variant="destructive" onClick={handleDeleteMember}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
