import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Skeleton } from "../components/ui/skeleton.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select.jsx";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../components/ui/alert-dialog.jsx";
import { Plus, Pencil, Users, MapPin, Clock, ArrowLeft, Trash2, Crown } from "lucide-react";
import { MemberAvatar } from "../components/ui/member-avatar.jsx";
import { EmptyState } from "../components/ui/empty-state.jsx";
import {
  getAttendanceCGFList,
  getAttendanceCGFById,
  getAttendanceHistory,
} from "../data/mock.js";

const API_BASE = import.meta.env.VITE_API_URL;

const HARI_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (response.status === 204) {
    return null;
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `HTTP ${response.status}`);
  }
  return data;
}

function generateGroupId(existingIds) {
  const maxId = existingIds.length > 0
    ? Math.max(...existingIds.map(id => parseInt(id, 10)))
    : 80000;
  return String(maxId + 1).padStart(5, "0");
}

export function CGFGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAttendanceCGFList().then(data => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectedGroup = useMemo(
    () => groups.find(g => g.cg_id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setShowGroupDialog(true);
  };

  const handleEditGroupFromList = (group) => {
    setEditingGroup(group);
    setShowGroupDialog(true);
  };

  const handleDeleteGroup = async () => {
    if (!deleteTarget) return;
    try {
      const cgId = String(deleteTarget.cg_id);
      await apiRequest(`/groups/${cgId}`, { method: "DELETE" });
      toast.success("Group deleted successfully");
      const refreshed = await getAttendanceCGFList();
      setGroups(refreshed);
    } catch (err) {
      console.error("Failed to delete group:", err);
      toast.error("Failed to delete group");
    }
    setDeleteTarget(null);
  };

  const handleSaveGroup = async (formData) => {
    try {
      if (editingGroup) {
        const cgId = String(editingGroup.cg_id);
        await apiRequest(`/groups/${cgId}`, {
          method: "PUT",
          body: JSON.stringify({
            nama_cgf: formData.nama_cgf,
            lokasi_1: formData.lokasi_1,
            lokasi_2: formData.lokasi_2 || undefined,
            hari: formData.hari,
          }),
        });
        toast.success("Group updated successfully");
      } else {
        const newId = generateGroupId(groups.map(g => String(g.cg_id)));
        await apiRequest("/groups", {
          method: "POST",
          body: JSON.stringify({
            id: newId,
            nama_cgf: formData.nama_cgf,
            lokasi_1: formData.lokasi_1,
            lokasi_2: formData.lokasi_2 || undefined,
            hari: formData.hari,
          }),
        });
        toast.success("Group created successfully");
      }
      const refreshed = await getAttendanceCGFList();
      setGroups(refreshed);
    } catch (err) {
      console.error("Failed to save group:", err);
      toast.error(editingGroup ? "Failed to update group" : "Failed to create group");
    }
    setShowGroupDialog(false);
    setEditingGroup(null);
  };

  const handleGroupUpdated = useCallback(async (cgId, formData) => {
    try {
      await apiRequest(`/groups/${cgId}`, {
        method: "PUT",
        body: JSON.stringify({
          nama_cgf: formData.nama_cgf,
          lokasi_1: formData.lokasi_1,
          lokasi_2: formData.lokasi_2 || undefined,
          hari: formData.hari,
        }),
      });
      toast.success("Group updated successfully");
      const refreshed = await getAttendanceCGFList();
      setGroups(refreshed);
    } catch (err) {
      console.error("Failed to update group:", err);
      toast.error("Failed to update group");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    );
  }

  if (selectedGroup) {
    return (
      <GroupDetailView
        group={selectedGroup}
        onBack={() => setSelectedGroupId(null)}
        onGroupUpdated={handleGroupUpdated}
        onDelete={() => setSelectedGroupId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">CGF Groups</h2>
          <p className="text-sm text-muted-foreground">Manage CGF</p>
        </div>
        <Button onClick={handleCreateGroup}>
          <Plus className="h-4 w-4 mr-1" /> Create Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          title="No CGF groups"
          description="Create your first small group to organize members."
          illustration="/illustrations/empty-states/no-groups.svg"
          actionLabel="Create Group"
          onAction={handleCreateGroup}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group.cg_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{group.nama_cgf}</CardTitle>
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" /> {group.member_count}
                  </Badge>
                </div>
                <CardDescription>{group.leader_name}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{group.hari}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{group.lokasi}</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedGroupId(group.cg_id)}>
                  View Details
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEditGroupFromList(group)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteTarget(group)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {showGroupDialog && (
        <GroupFormDialog
          group={editingGroup}
          onSave={handleSaveGroup}
          onClose={() => { setShowGroupDialog(false); setEditingGroup(null); }}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.nama_cgf}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function GroupDetailView({ group, onBack, onGroupUpdated, onDelete }) {
  const [detail, setDetail] = useState(null);
  const [members, setMembers] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cgId = String(group.cg_id);
    Promise.all([
      getAttendanceCGFById(cgId),
      fetch(`${API_BASE}/groups/${cgId}/members`).then(r => r.json()),
      getAttendanceHistory({ cg_id: cgId, limit: 20 }),
    ]).then(([detailData, membersRes, historyRes]) => {
      if (cancelled) return;
      setDetail(detailData);
      setMembers(membersRes.data || []);
      setAttendanceHistory(historyRes.data || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [group.cg_id]);

  const statusBadgeVariant = (status) => {
    if (status === "hadir") return "success";
    if (status === "izin") return "warning";
    if (status === "tamu") return "secondary";
    return "destructive";
  };

  const handleDelete = async () => {
    try {
      await apiRequest(`/groups/${group.cg_id}`, { method: "DELETE" });
      toast.success("Group deleted successfully");
      onDelete?.();
    } catch (err) {
      console.error("Failed to delete group:", err);
      toast.error("Failed to delete group");
    }
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{detail?.nama_cgf || group.nama_cgf}</h2>
          <p className="text-sm text-muted-foreground">{detail?.leader_name || group.leader_name}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="text-destructive" onClick={() => setShowDeleteConfirm(true)}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Hari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{detail?.hari || group.hari}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{detail?.lokasi || group.lokasi}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Jumlah Anggota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{members.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Anggota CGF</CardTitle>
            <CardDescription>Daftar anggota {detail?.nama_cgf || group.nama_cgf}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada anggota.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Jemaat</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.no_jemaat}>
                    <TableCell className="font-medium">{member.no_jemaat}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MemberAvatar
                          name={member.nama_jemaat}
                          gender={member.jenis_kelamin}
                          size="sm"
                        />
                        <span>{member.nama_jemaat}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.jenis_kelamin}</TableCell>
                    <TableCell>
                      {member.is_leader ? (
                        <Badge variant="default" className="gap-1">
                          <Crown className="h-3 w-3" /> Leader
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Member</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Kehadiran</CardTitle>
          <CardDescription>{attendanceHistory.length} catatan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada data kehadiran.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.tanggal}</TableCell>
                    <TableCell>{record.nama_jemaat || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(record.keterangan)}>
                        {record.keterangan}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showEditDialog && (
        <GroupFormDialog
          group={detail || group}
          onSave={(formData) => {
            onGroupUpdated(group.cg_id, formData);
            setShowEditDialog(false);
          }}
          onClose={() => setShowEditDialog(false)}
        />
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{detail?.nama_cgf || group.nama_cgf}</strong>? This will also remove all members from this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function GroupFormDialog({ group, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nama_cgf: group?.nama_cgf || "",
    lokasi_1: group?.lokasi || group?.lokasi_1 || "",
    lokasi_2: group?.lokasi_2 || "",
    hari: group?.hari || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{group ? "Edit CGF Group" : "Create CGF Group"}</CardTitle>
            <CardDescription>
              {group ? "Edit/Update CGF Group Information" : "Create New CGF Group"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nama_cgf">Nama CGF</Label>
              <Input
                id="nama_cgf"
                placeholder="CGF Kasih"
                value={formData.nama_cgf}
                onChange={(e) => setFormData(prev => ({ ...prev, nama_cgf: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lokasi_1">Lokasi</Label>
              <Input
                id="lokasi_1"
                placeholder="BSD"
                value={formData.lokasi_1}
                onChange={(e) => setFormData(prev => ({ ...prev, lokasi_1: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lokasi_2">Lokasi 2 (opsional)</Label>
              <Input
                id="lokasi_2"
                placeholder="Gading Serpong"
                value={formData.lokasi_2}
                onChange={(e) => setFormData(prev => ({ ...prev, lokasi_2: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Hari</Label>
              <Select
                value={formData.hari}
                onValueChange={(value) => setFormData(prev => ({ ...prev, hari: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {HARI_OPTIONS.map((hari) => (
                    <SelectItem key={hari} value={hari}>{hari}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting || !formData.nama_cgf || !formData.lokasi_1 || !formData.hari}>
              {submitting ? "Menyimpan..." : group ? "Simpan" : "Buat Group"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
