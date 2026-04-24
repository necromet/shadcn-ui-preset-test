import { useState, useEffect, useMemo } from "react"
import { Users, Plus, Trash2, UserCog, MapPin, Calendar, Cloud, HardDrive } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../ui/dialog.jsx"
import { Button } from "../ui/button.jsx"
import { Badge } from "../ui/badge.jsx"
import { Separator } from "../ui/separator.jsx"
import { Input } from "../ui/input.jsx"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select.jsx"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../ui/table.jsx"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../ui/alert-dialog.jsx"
import { cn } from "../../lib/utils.js"

const CATEGORY_COLORS = {
  Camp: "bg-blue-100 text-blue-800",
  Retreat: "bg-purple-100 text-purple-800",
  Quarterly: "bg-green-100 text-green-800",
  Monthly: "bg-orange-100 text-orange-800",
  Special: "bg-pink-100 text-pink-800",
  Workshop: "bg-yellow-100 text-yellow-800",
}

const ROLE_COLORS = {
  Peserta: "bg-slate-100 text-slate-700",
  Panitia: "bg-blue-100 text-blue-700",
  Volunteer: "bg-emerald-100 text-emerald-700",
}

const ROLES = ["Peserta", "Panitia", "Volunteer"]

function formatDate(dateStr) {
  if (!dateStr) return "-"
  const [year, month, day] = dateStr.split("-")
  const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
}

export function EventDetailModal({
  open,
  onOpenChange,
  event,
  participants,
  members: allMembers,
  onAddParticipant,
  onUpdateParticipant,
  onRemoveParticipant,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [selectedRole, setSelectedRole] = useState("Peserta")
  const [removeTarget, setRemoveTarget] = useState(null)
  const [editRoleTarget, setEditRoleTarget] = useState(null)
  const [editRoleValue, setEditRoleValue] = useState("")

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setSearchQuery("")
        setShowAddForm(false)
        setSelectedMemberId("")
        setSelectedRole("Peserta")
        setRemoveTarget(null)
        setEditRoleTarget(null)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [open])

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants
    const q = searchQuery.toLowerCase()
    return participants.filter(
      (p) =>
        (p.nama_jemaat && p.nama_jemaat.toLowerCase().includes(q)) ||
        (p.nama_cgf && p.nama_cgf.toLowerCase().includes(q)) ||
        (p.role && p.role.toLowerCase().includes(q))
    )
  }, [participants, searchQuery])

  const availableMembers = useMemo(() => {
    const registeredIds = new Set(participants.map((p) => p.no_jemaat))
    return allMembers.filter((m) => !registeredIds.has(m.no_jemaat))
  }, [allMembers, participants])

  const roleCounts = useMemo(() => {
    const counts = { Peserta: 0, Panitia: 0, Volunteer: 0 }
    participants.forEach((p) => { if (counts[p.role] !== undefined) counts[p.role]++ })
    return counts
  }, [participants])

  async function handleAddParticipant() {
    if (!selectedMemberId) return
    try {
      await onAddParticipant({
        event_id: event.event_id,
        no_jemaat: parseInt(selectedMemberId, 10),
        role: selectedRole,
      })
      setSelectedMemberId("")
      setSelectedRole("Peserta")
      setShowAddForm(false)
    } catch {
      // Error toast handled by parent
    }
  }

  async function handleRemoveParticipant() {
    if (!removeTarget) return
    try {
      await onRemoveParticipant(removeTarget.id)
      setRemoveTarget(null)
    } catch {
      // Error toast handled by parent
    }
  }

  async function handleUpdateRole() {
    if (!editRoleTarget || !editRoleValue) return
    try {
      await onUpdateParticipant(editRoleTarget.id, { role: editRoleValue })
      setEditRoleTarget(null)
      setEditRoleValue("")
    } catch {
      // Error toast handled by parent
    }
  }

  if (!event) return null

  const isSynced = Boolean(event.gcal_event_id)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              {event.event_name}
            </DialogTitle>
            <DialogDescription>Event details and participant management</DialogDescription>
          </DialogHeader>

          {/* Event Info */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={CATEGORY_COLORS[event.category] || ""}>
                {event.category}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 text-[10px]",
                  isSynced
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                )}
              >
                {isSynced ? <Cloud className="size-3" /> : <HardDrive className="size-3" />}
                {isSynced ? "Synced" : "Local"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}

            {isSynced && event.gcal_link && (
              <a
                href={event.gcal_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <Cloud className="size-3" />
                View in Google Calendar
              </a>
            )}
          </div>

          <Separator />

          {/* Participant Summary */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center rounded-lg border p-3">
              <p className="text-2xl font-bold">{participants.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="text-center rounded-lg border p-3">
              <p className="text-2xl font-bold text-slate-600">{roleCounts.Peserta}</p>
              <p className="text-xs text-muted-foreground">Peserta</p>
            </div>
            <div className="text-center rounded-lg border p-3">
              <p className="text-2xl font-bold text-blue-600">{roleCounts.Panitia}</p>
              <p className="text-xs text-muted-foreground">Panitia</p>
            </div>
            <div className="text-center rounded-lg border p-3">
              <p className="text-2xl font-bold text-emerald-600">{roleCounts.Volunteer}</p>
              <p className="text-xs text-muted-foreground">Volunteer</p>
            </div>
          </div>

          {/* Participant List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Participants</h4>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="size-3 mr-1" />
                Add
              </Button>
            </div>

            {/* Add Participant Form */}
            {showAddForm && (
              <div className="rounded-lg border p-3 bg-muted/30 space-y-3">
                <div className="grid grid-cols-[1fr_140px_auto] gap-2">
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.length === 0 ? (
                        <SelectItem value="__none" disabled>All members registered</SelectItem>
                      ) : (
                        availableMembers.map((m) => (
                          <SelectItem key={m.no_jemaat} value={String(m.no_jemaat)}>
                            {m.nama_jemaat}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleAddParticipant} disabled={!selectedMemberId}>
                    Add
                  </Button>
                </div>
              </div>
            )}

            {/* Search */}
            {participants.length > 5 && (
              <Input
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-sm"
              />
            )}

            {/* Table */}
            {filteredParticipants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                {participants.length === 0 ? "No participants registered yet" : "No matching participants"}
              </p>
            ) : (
              <div className="rounded-md border max-h-[250px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>CGF</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium text-sm">{p.nama_jemaat}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.nama_cgf || "-"}</TableCell>
                        <TableCell>
                          {editRoleTarget?.id === p.id ? (
                            <div className="flex items-center gap-1">
                              <Select value={editRoleValue} onValueChange={setEditRoleValue}>
                                <SelectTrigger className="h-7 w-[100px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={handleUpdateRole}>
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setEditRoleTarget(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="secondary" className={ROLE_COLORS[p.role] || ""}>
                              {p.role}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => { setEditRoleTarget(p); setEditRoleValue(p.role) }}
                            >
                              <UserCog className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() => setRemoveTarget(p)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog open={!!removeTarget} onOpenChange={(v) => !v && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Participant</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{removeTarget?.nama_jemaat}</strong> from this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveParticipant} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
