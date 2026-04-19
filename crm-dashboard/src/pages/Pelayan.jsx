import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Check, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { MemberAvatar } from "../components/ui/member-avatar.jsx"
import { EmptyState } from "../components/ui/empty-state.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.jsx"
import { getMembers } from "../services/members.api.js"
import {
  getPelayanList,
  createPelayan,
  deletePelayan,
  bulkUpdatePelayanan,
  getPelayananForPelayan,
  ApiError,
} from "../services/pelayan.api.js"
import { fetchPelayananInfoFromAPI } from "../data/mock.js"

const PAGE_SIZE = 10

// Maps pelayanan_id to the boolean column name in the pelayan table
const PELAYANAN_ID_TO_COL = {
  '70001': 'is_wl',
  '70002': 'is_singer',
  '70003': 'is_pianis',
  '70004': 'is_saxophone',
  '70005': 'is_filler',
  '70006': 'is_bass_gitar',
  '70007': 'is_drum',
  '70008': 'is_mulmed',
  '70009': 'is_sound',
  '70010': 'is_caringteam',
  '70011': 'is_connexion_crew',
  '70012': 'is_supporting_crew',
  '70013': 'is_cforce',
  '70014': 'is_cg_leader',
  '70015': 'is_community_pic',
  '70016': 'is_others',
}

const EMPTY_FORM = {
  no_jemaat: null,
  nama_jemaat: "",
  selectedPelayananIds: [],
}

export function Pelayan() {
  const [pelayanList, setPelayanList] = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [ministryRoles, setMinistryRoles] = useState([])

  useEffect(() => {
    Promise.all([getPelayanList({ limit: 1000 }), getMembers({ limit: 1000 }), fetchPelayananInfoFromAPI()])
      .then(([pelayanData, membersData, pelayananData]) => {
        setPelayanList(pelayanData.data || [])
        setAllMembers(membersData.data || membersData || [])
        setMinistryRoles(pelayananData.map(p => ({
          key: PELAYANAN_ID_TO_COL[p.pelayanan_id] || `pel_${p.pelayanan_id}`,
          label: p.nama_pelayanan,
          pelayananId: p.pelayanan_id,
        })))
      })
      .catch((err) => console.error('Failed to fetch data:', err))
      .finally(() => setLoading(false))
  }, [])

  const roleBadgeLabels = useMemo(() => {
    return Object.fromEntries(ministryRoles.map(r => [r.key, r.label]))
  }, [ministryRoles])

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPelayan, setSelectedPelayan] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const availableMembers = useMemo(() => {
    const existingNoJemaat = new Set(pelayanList.map((p) => p.no_jemaat))
    return allMembers.filter((m) => !existingNoJemaat.has(m.no_jemaat))
  }, [allMembers, pelayanList])

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

  async function openEditDialog(p) {
    setSelectedPelayan(p)
    try {
      const pelayananList = await getPelayananForPelayan(p.no_jemaat)
      const activeIds = pelayananList
        .filter(pp => pp.is_active)
        .map(pp => pp.pelayanan_id)
      setFormData({
        no_jemaat: p.no_jemaat,
        nama_jemaat: p.nama_jemaat,
        selectedPelayananIds: activeIds,
      })
    } catch {
      // Fallback: derive from boolean columns if junction table fails
      const activeIds = ministryRoles
        .filter(r => p[r.key])
        .map(r => r.pelayananId)
      setFormData({
        no_jemaat: p.no_jemaat,
        nama_jemaat: p.nama_jemaat,
        selectedPelayananIds: activeIds,
      })
    }
    setShowEditDialog(true)
  }

  function openDeleteDialog(p) {
    setSelectedPelayan(p)
    setShowDeleteDialog(true)
  }

  function handleFormChange(field, value, namaValue) {
    if (namaValue !== undefined) {
      setFormData((prev) => ({ ...prev, [field]: value, nama_jemaat: namaValue }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  function togglePelayanan(pelayananId) {
    setFormData((prev) => {
      const ids = prev.selectedPelayananIds || []
      if (ids.includes(pelayananId)) {
        return { ...prev, selectedPelayananIds: ids.filter(id => id !== pelayananId) }
      }
      return { ...prev, selectedPelayananIds: [...ids, pelayananId] }
    })
  }

  async function handleAddPelayan(e) {
    e.preventDefault()
    const selectedIds = formData.selectedPelayananIds || []

    // Build boolean flags from selected pelayanan IDs (for backward compat with backend)
    const booleanFlags = {}
    ministryRoles.forEach(r => {
      booleanFlags[r.key] = selectedIds.includes(r.pelayananId)
    })

    const newPelayan = {
      no_jemaat: Number(formData.no_jemaat),
      nama_jemaat: formData.nama_jemaat,
      ...booleanFlags,
    }

    try {
      const response = await createPelayan(newPelayan, allMembers)
      if (response?.success) {
        setPelayanList((prev) => [...prev, response.data])
        setAllMembers((prev) => prev.filter((m) => m.no_jemaat !== formData.no_jemaat))
        setShowAddDialog(false)
        toast.success("Pelayan added successfully", {
          description: `${formData.nama_jemaat} has been added as a pelayan.`
        })
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Failed to add pelayan", {
          description: err.message
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  async function handleEditPelayan(e) {
    e.preventDefault()
    const noJemaat = Number(formData.no_jemaat)
    const selectedIds = formData.selectedPelayananIds || []
    const allPelayananIds = ministryRoles.map(r => r.pelayananId)

    const toAssign = selectedIds
    const toRemove = allPelayananIds.filter(id => !selectedIds.includes(id))

    try {
      await bulkUpdatePelayanan(noJemaat, { assign: toAssign, remove: toRemove })

      // Update local state - refresh pelayan list to get updated total_pelayanan
      const updatedPelayan = {
        ...selectedPelayan,
        total_pelayanan: selectedIds.length,
      }
      ministryRoles.forEach(r => {
        updatedPelayan[r.key] = selectedIds.includes(r.pelayananId)
      })

      setPelayanList((prev) => prev.map((p) => (p.no_jemaat === noJemaat ? updatedPelayan : p)))
      setShowEditDialog(false)
      setSelectedPelayan(null)
      toast.success("Pelayan updated successfully", {
        description: `${formData.nama_jemaat}'s roles have been updated.`
      })
    } catch (err) {
      console.error('Update error:', err)
      if (err instanceof ApiError) {
        toast.error("Failed to update pelayan", {
          description: err.message
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  async function handleDeletePelayan() {
    try {
      await deletePelayan(selectedPelayan.no_jemaat)
      setPelayanList((prev) => prev.filter((p) => p.no_jemaat !== selectedPelayan.no_jemaat))
      setShowDeleteDialog(false)
      setSelectedPelayan(null)
      toast.success("Pelayan deleted successfully", {
        description: `${selectedPelayan?.nama_jemaat} has been removed from pelayan.`
      })
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Failed to delete pelayan", {
          description: err.message
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  function getActiveRoles(p) {
    return ministryRoles.filter((r) => p[r.key])
  }

  function MemberSelectPopover({ value, onValueChange, options, placeholder, disabled }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const inputRef = useRef(null)

    const filteredOptions = useMemo(() => {
      if (!search.trim()) return options
      const q = search.toLowerCase()
      return options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(q) ||
          String(opt.no_jemaat).includes(q)
      )
    }, [options, search])

    const selectedOption = options.find((opt) => opt.no_jemaat === value)

    const handleSelect = (opt) => {
      onValueChange(opt.no_jemaat, opt.nama_jemaat)
      setOpen(false)
      setSearch("")
    }

    useEffect(() => {
      if (open && inputRef.current) {
        inputRef.current.focus()
      }
    }, [open])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-start text-left font-normal h-9 px-3"
          >
            {selectedOption ? (
              <span className="truncate">{selectedOption.label}</span>
            ) : (
              <span className="text-muted-foreground truncate">{placeholder || "Select member..."}</span>
            )}
            <ChevronDown className="h-4 w-4 ml-auto shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <div className="flex flex-col">
            <div className="flex items-center border-b px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by name or no. jemaat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-9 px-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="p-0.5 hover:bg-muted rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="max-h-[240px] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No members found
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.no_jemaat}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <MemberAvatar name={opt.label} size="sm" />
                        <div className="truncate">
                          <p className="font-medium truncate">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">#{opt.no_jemaat}</p>
                        </div>
                      </div>
                      {value === opt.no_jemaat && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  function renderPelayanForm(onSubmit, title) {
    const memberOptions = showEditDialog && selectedPelayan
      ? availableMembers.concat([{ no_jemaat: selectedPelayan.no_jemaat, nama_jemaat: selectedPelayan.nama_jemaat, label: selectedPelayan.nama_jemaat }])
      : availableMembers.map((m) => ({ no_jemaat: m.no_jemaat, nama_jemaat: m.nama_jemaat, label: m.nama_jemaat }))

    const selectedIds = formData.selectedPelayananIds || []

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
                <div className="h-9 rounded-md border bg-muted px-3 text-sm flex items-center text-muted-foreground">
                  {formData.no_jemaat ? `#${formData.no_jemaat}` : "-"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Nama</label>
                <MemberSelectPopover
                  value={formData.no_jemaat}
                  onValueChange={(noJemaat, namaJemaat) => handleFormChange("no_jemaat", noJemaat, namaJemaat)}
                  options={memberOptions}
                  placeholder="Select member..."
                  disabled={showEditDialog}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Total Pelayanan</label>
              <div className="h-9 rounded-md border bg-muted px-3 text-sm flex items-center">
                {selectedIds.length}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ministry Roles</label>
              <div className="grid grid-cols-2 gap-2">
                {ministryRoles.map((role) => (
                  <label key={role.pelayananId} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(role.pelayananId)}
                      onChange={() => togglePelayanan(role.pelayananId)}
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
              <Button type="submit" disabled={!formData.no_jemaat}>{showEditDialog ? "Save Changes" : "Add Pelayan"}</Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Loading pelayan...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pelayan</h1>
          <p className="text-sm text-muted-foreground">Manage ministry and their service roles</p>
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
                {ministryRoles.map((role) => (
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
                                {role.label}
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
