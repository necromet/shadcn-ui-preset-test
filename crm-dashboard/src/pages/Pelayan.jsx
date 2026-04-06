import { useState, useMemo } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Card, CardContent } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { MemberAvatar } from "../components/ui/member-avatar.jsx"
import { EmptyState } from "../components/ui/empty-state.jsx"
import { getPelayan } from "../data/mock.js"

const PAGE_SIZE = 10

const MINISTRY_ROLES = [
  { key: 'is_wl', label: 'Worship Leader' },
  { key: 'is_singer', label: 'Singer' },
  { key: 'is_pianis', label: 'Pianist' },
  { key: 'is_saxophone', label: 'Saxophone' },
  { key: 'is_filler', label: 'Filler' },
  { key: 'is_bass_gitar', label: 'Bass Guitar' },
  { key: 'is_drum', label: 'Drummer' },
  { key: 'is_mulmed', label: 'Multimedia' },
  { key: 'is_sound', label: 'Sound' },
  { key: 'is_caringteam', label: 'Caring Team' },
  { key: 'is_connexion_crew', label: 'CNX Crew' },
  { key: 'is_supporting_crew', label: 'Supporting' },
  { key: 'is_cforce', label: 'CForce' },
  { key: 'is_cg_leader', label: 'CG Leader' },
  { key: 'is_community_pic', label: 'Community PIC' },
  { key: 'is_others', label: 'Others' },
]

const ROLE_BADGE_LABELS = {
  is_wl: 'WL',
  is_singer: 'Singer',
  is_pianis: 'Pianist',
  is_saxophone: 'Sax',
  is_filler: 'Filler',
  is_bass_gitar: 'Bass',
  is_drum: 'Drum',
  is_mulmed: 'Mulmed',
  is_sound: 'Sound',
  is_caringteam: 'Caring',
  is_connexion_crew: 'CNX Crew',
  is_supporting_crew: 'Support',
  is_cforce: 'CForce',
  is_cg_leader: 'CG Leader',
  is_community_pic: 'PIC',
  is_others: 'Others',
}

const EMPTY_FORM = {
  no_jemaat: "",
  nama_jemaat: "",
  is_wl: false,
  is_singer: false,
  is_pianis: false,
  is_saxophone: false,
  is_filler: false,
  is_bass_gitar: false,
  is_drum: false,
  is_mulmed: false,
  is_sound: false,
  is_caringteam: false,
  is_connexion_crew: false,
  is_supporting_crew: false,
  is_cforce: false,
  is_cg_leader: false,
  is_community_pic: false,
  is_others: false,
  total_pelayanan: 0,
}

export function Pelayan() {
  const [pelayanList, setPelayanList] = useState(() => getPelayan())
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPelayan, setSelectedPelayan] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const filteredPelayan = useMemo(() => {
    let result = pelayanList

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.nama_jemaat.toLowerCase().includes(q) ||
          String(p.no_jemaat).includes(q)
      )
    }

    if (roleFilter) {
      result = result.filter((p) => p[roleFilter])
    }

    return result
  }, [pelayanList, searchQuery, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filteredPelayan.length / PAGE_SIZE))
  const paginatedPelayan = filteredPelayan.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function resetFilters() {
    setSearchQuery("")
    setRoleFilter("")
    setCurrentPage(1)
  }

  function openAddDialog() {
    setFormData({ ...EMPTY_FORM })
    setShowAddDialog(true)
  }

  function openEditDialog(p) {
    setSelectedPelayan(p)
    setFormData({
      no_jemaat: p.no_jemaat,
      nama_jemaat: p.nama_jemaat,
      is_wl: p.is_wl,
      is_singer: p.is_singer,
      is_pianis: p.is_pianis,
      is_saxophone: p.is_saxophone,
      is_filler: p.is_filler,
      is_bass_gitar: p.is_bass_gitar,
      is_drum: p.is_drum,
      is_mulmed: p.is_mulmed,
      is_sound: p.is_sound,
      is_caringteam: p.is_caringteam,
      is_connexion_crew: p.is_connexion_crew,
      is_supporting_crew: p.is_supporting_crew,
      is_cforce: p.is_cforce,
      is_cg_leader: p.is_cg_leader,
      is_community_pic: p.is_community_pic,
      is_others: p.is_others || false,
      total_pelayanan: p.total_pelayanan,
    })
    setShowEditDialog(true)
  }

  function openDeleteDialog(p) {
    setSelectedPelayan(p)
    setShowDeleteDialog(true)
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleAddPelayan(e) {
    e.preventDefault()
    const newPelayan = {
      ...formData,
      no_jemaat: Number(formData.no_jemaat),
      total_pelayanan: Number(formData.total_pelayanan),
    }
    setPelayanList((prev) => [...prev, newPelayan])
    setShowAddDialog(false)
  }

  function handleEditPelayan(e) {
    e.preventDefault()
    const updated = {
      ...formData,
      no_jemaat: Number(formData.no_jemaat),
      total_pelayanan: Number(formData.total_pelayanan),
    }
    setPelayanList((prev) => prev.map((p) => (p.no_jemaat === selectedPelayan.no_jemaat ? updated : p)))
    setShowEditDialog(false)
    setSelectedPelayan(null)
  }

  function handleDeletePelayan() {
    setPelayanList((prev) => prev.filter((p) => p.no_jemaat !== selectedPelayan.no_jemaat))
    setShowDeleteDialog(false)
    setSelectedPelayan(null)
  }

  function getActiveRoles(p) {
    return MINISTRY_ROLES.filter((r) => p[r.key])
  }

  function renderPelayanForm(onSubmit, title) {
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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Total Pelayanan</label>
              <input
                type="number"
                required
                value={formData.total_pelayanan}
                onChange={(e) => handleFormChange("total_pelayanan", e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ministry Roles</label>
              <div className="grid grid-cols-2 gap-2">
                {MINISTRY_ROLES.map((role) => (
                  <label key={role.key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData[role.key]}
                      onChange={(e) => handleFormChange(role.key, e.target.checked)}
                      className="h-4 w-4 rounded border"
                    />
                    {role.label}
                  </label>
                ))}
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
              <Button type="submit">{showEditDialog ? "Save Changes" : "Add Pelayan"}</Button>
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
          <h1 className="text-2xl font-semibold">Pelayan</h1>
          <p className="text-sm text-muted-foreground">Manage ministry servants and their service roles</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Pelayan
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or no. jemaat..."
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
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All Roles</option>
                {MINISTRY_ROLES.map((role) => (
                  <option key={role.key} value={role.key}>
                    {role.label}
                  </option>
                ))}
              </select>
              {(searchQuery || roleFilter) && (
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
                  <TableHead>Member</TableHead>
                  <TableHead>Ministry Roles</TableHead>
                  <TableHead>Total Pelayanan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPelayan.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState
                        title="No pelayan found"
                        description="Start by adding your first ministry servant, or adjust your search filters."
                        illustration="/illustrations/empty-states/no-members.svg"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPelayan.map((p) => (
                    <TableRow key={p.no_jemaat}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <MemberAvatar
                            name={p.nama_jemaat}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium">{p.nama_jemaat}</p>
                            <p className="text-xs text-muted-foreground">#{p.no_jemaat}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getActiveRoles(p).length === 0 ? (
                            <span className="text-xs text-muted-foreground">-</span>
                          ) : (
                            getActiveRoles(p).map((role) => (
                              <Badge key={role.key} variant="secondary" className="text-xs">
                                {ROLE_BADGE_LABELS[role.key]}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{p.total_pelayanan}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(p)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(p)}
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
              Showing {paginatedPelayan.length} of {filteredPelayan.length} pelayan
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

      {showAddDialog && renderPelayanForm(handleAddPelayan, "Add New Pelayan")}
      {showEditDialog && renderPelayanForm(handleEditPelayan, "Edit Pelayan")}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Delete Pelayan</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{selectedPelayan?.nama_jemaat}</strong> (
              {selectedPelayan?.no_jemaat})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePelayan}>
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
