import { useState, useMemo, useEffect } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "../components/ui/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx"
import { Button } from "../components/ui/button.jsx"
import { EmptyState } from "../components/ui/empty-state.jsx"
import { getPelayananInfo, createPelayananInfo, updatePelayananInfo, deletePelayananInfo } from "../data/mock.js"

const PAGE_SIZE = 10

const EMPTY_FORM = {
  pelayanan_id: "",
  nama_pelayanan: "",
}

export function PelayananInfo() {
  const [pelayananList, setPelayananList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPelayanan, setSelectedPelayanan] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.resolve(getPelayananInfo())
      .then((data) => {
        setPelayananList(data)
      })
      .catch((err) => {
        console.error('Failed to fetch pelayanan info:', err)
        toast.error("Failed to load pelayanan info")
      })
      .finally(() => setLoading(false))
  }, [])

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

  function getNextPelayananId() {
    if (pelayananList.length === 0) return "70001"
    const maxId = Math.max(...pelayananList.map((p) => Number(p.pelayanan_id) || 0))
    return String(maxId + 1)
  }

  function openAddDialog() {
    setFormData({
      pelayanan_id: getNextPelayananId(),
      nama_pelayanan: "",
    })
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

  async function handleAddPelayanan(e) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await createPelayananInfo({
        pelayanan_id: formData.pelayanan_id,
        nama_pelayanan: formData.nama_pelayanan,
      })

      if (response?.success) {
        setPelayananList((prev) => [...prev, response.data])
        setShowAddDialog(false)
        setFormData(EMPTY_FORM)
        toast.success("Pelayanan added successfully", {
          description: `${formData.nama_pelayanan} has been added.`
        })
      }
    } catch (err) {
      toast.error("Failed to add pelayanan", {
        description: err.message || "An unexpected error occurred"
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditPelayanan(e) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await updatePelayananInfo(selectedPelayanan.pelayanan_id, {
        pelayanan_id: formData.pelayanan_id,
        nama_pelayanan: formData.nama_pelayanan,
      })

      if (response?.success) {
        setPelayananList((prev) =>
          prev.map((p) => (p.pelayanan_id === selectedPelayanan.pelayanan_id ? response.data : p))
        )
        setShowEditDialog(false)
        setSelectedPelayanan(null)
        setFormData(EMPTY_FORM)
        toast.success("Pelayanan updated successfully", {
          description: `${formData.nama_pelayanan} has been updated.`
        })
      }
    } catch (err) {
      toast.error("Failed to update pelayanan", {
        description: err.message || "An unexpected error occurred"
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeletePelayanan() {
    setSubmitting(true)

    try {
      const response = await deletePelayananInfo(selectedPelayanan.pelayanan_id)

      if (response?.success) {
        setPelayananList((prev) =>
          prev.filter((p) => p.pelayanan_id !== selectedPelayanan.pelayanan_id)
        )
        setShowDeleteDialog(false)
        setSelectedPelayanan(null)
        toast.success("Pelayanan deleted successfully", {
          description: `${selectedPelayanan?.nama_pelayanan} has been removed.`
        })
      }
    } catch (err) {
      toast.error("Failed to delete pelayanan", {
        description: err.message || "An unexpected error occurred"
      })
    } finally {
      setSubmitting(false)
    }
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
                readOnly
                disabled
                value={formData.pelayanan_id}
                className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-not-allowed opacity-70 bg-muted"
              />
              <p className="text-xs text-muted-foreground">Cannot be changed</p>
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
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : (showEditDialog ? "Save Changes" : "Add Pelayanan")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Loading pelayanan info...</p>
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
              <Button variant="destructive" onClick={handleDeletePelayanan} disabled={submitting}>
                <Trash2 className="h-4 w-4" />
                {submitting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
