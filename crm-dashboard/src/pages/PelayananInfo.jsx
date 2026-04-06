import { useState, useMemo } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Card, CardContent } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { EmptyState } from "../components/ui/empty-state.jsx"
import { getPelayananInfo } from "../data/mock.js"

const PAGE_SIZE = 10

const EMPTY_FORM = {
  pelayanan_id: "",
  nama_pelayanan: "",
}

export function PelayananInfo() {
  const [pelayananList, setPelayananList] = useState(() => getPelayananInfo())
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPelayanan, setSelectedPelayanan] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const filteredPelayanan = useMemo(() => {
    let result = pelayananList

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.nama_pelayanan.toLowerCase().includes(q) ||
          p.pelayanan_id.toLowerCase().includes(q)
      )
    }

    return result
  }, [pelayananList, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredPelayanan.length / PAGE_SIZE))
  const paginatedPelayanan = filteredPelayanan.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function openAddDialog() {
    setFormData({ ...EMPTY_FORM })
    setShowAddDialog(true)
  }

  function openEditDialog(pelayanan) {
    setSelectedPelayanan(pelayanan)
    setFormData({
      pelayanan_id: pelayanan.pelayanan_id,
      nama_pelayanan: pelayanan.nama_pelayanan,
    })
    setShowEditDialog(true)
  }

  function openDeleteDialog(pelayanan) {
    setSelectedPelayanan(pelayanan)
    setShowDeleteDialog(true)
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleAddPelayanan(e) {
    e.preventDefault()
    const newPelayanan = {
      pelayanan_id: formData.pelayanan_id,
      nama_pelayanan: formData.nama_pelayanan,
    }
    setPelayananList((prev) => [...prev, newPelayanan])
    setShowAddDialog(false)
  }

  function handleEditPelayanan(e) {
    e.preventDefault()
    const updated = {
      pelayanan_id: formData.pelayanan_id,
      nama_pelayanan: formData.nama_pelayanan,
    }
    setPelayananList((prev) =>
      prev.map((p) => (p.pelayanan_id === selectedPelayanan.pelayanan_id ? updated : p))
    )
    setShowEditDialog(false)
    setSelectedPelayanan(null)
  }

  function handleDeletePelayanan() {
    setPelayananList((prev) =>
      prev.filter((p) => p.pelayanan_id !== selectedPelayanan.pelayanan_id)
    )
    setShowDeleteDialog(false)
    setSelectedPelayanan(null)
  }

  function renderPelayananForm(onSubmit, title) {
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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Pelayanan ID</label>
              <input
                type="text"
                required
                value={formData.pelayanan_id}
                onChange={(e) => handleFormChange("pelayanan_id", e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Nama Pelayanan</label>
              <input
                type="text"
                required
                value={formData.nama_pelayanan}
                onChange={(e) => handleFormChange("nama_pelayanan", e.target.value)}
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
              <Button type="submit">{showEditDialog ? "Save Changes" : "Add Pelayanan"}</Button>
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
          <h1 className="text-2xl font-semibold">Pelayanan Info</h1>
          <p className="text-sm text-muted-foreground">Manage ministry and service type records</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Pelayanan
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by pelayanan ID or name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pelayanan ID</TableHead>
                  <TableHead>Nama Pelayanan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPelayanan.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <EmptyState
                        title="No pelayanan found"
                        description="Start by adding your first ministry or service type, or adjust your search filters."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPelayanan.map((pelayanan) => (
                    <TableRow key={pelayanan.pelayanan_id}>
                      <TableCell className="font-medium">{pelayanan.pelayanan_id}</TableCell>
                      <TableCell>{pelayanan.nama_pelayanan}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(pelayanan)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(pelayanan)}
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
              Showing {paginatedPelayanan.length} of {filteredPelayanan.length} records
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

      {showAddDialog && renderPelayananForm(handleAddPelayanan, "Add New Pelayanan")}
      {showEditDialog && renderPelayananForm(handleEditPelayanan, "Edit Pelayanan")}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Delete Pelayanan</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{selectedPelayanan?.nama_pelayanan}</strong> (
              {selectedPelayanan?.pelayanan_id})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePelayanan}>
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
