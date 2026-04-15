import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Skeleton } from "../components/ui/skeleton.jsx";
import { Plus, Pencil, Users, MapPin, Clock, ArrowLeft, UserPlus, Trash2, Crown } from "lucide-react";
import { MemberAvatar } from "../components/ui/member-avatar.jsx";
import { EmptyState } from "../components/ui/empty-state.jsx";
import {
  getAttendanceCGFList,
  getAttendanceCGFById,
  getAttendanceHistory,
} from "../data/mock.js";

const API_BASE = import.meta.env.VITE_API_URL;

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

  const handleSaveGroup = (formData) => {
    if (editingGroup) {
      setGroups(prev =>
        prev.map(g =>
          g.cg_id === editingGroup.cg_id ? { ...g, ...formData } : g
        )
      );
    } else {
      const newId = Math.max(...groups.map(g => g.cg_id)) + 1;
      setGroups(prev => [
        ...prev,
        { cg_id: newId, ...formData },
      ]);
    }
    setShowGroupDialog(false);
    setEditingGroup(null);
  };

  const handleGroupUpdated = useCallback((cgId, formData) => {
    setGroups(prev =>
      prev.map(g => g.cg_id === cgId ? { ...g, ...formData } : g)
    );
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
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">CGF Groups</h2>
          <p className="text-sm text-muted-foreground">Kelola Cell Group Fellowship</p>
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
    </div>
  );
}

function GroupDetailView({ group, onBack, onGroupUpdated }) {
  const [detail, setDetail] = useState(null);
  const [members, setMembers] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    setLoading(true);
    const cgId = String(group.cg_id);
    Promise.all([
      getAttendanceCGFById(cgId),
      fetch(`${API_BASE}/groups/${cgId}/members`).then(r => r.json()),
      getAttendanceHistory({ cg_id: cgId, limit: 20 }),
    ]).then(([detailData, membersRes, historyRes]) => {
      setDetail(detailData);
      setMembers(membersRes.data || []);
      setAttendanceHistory(historyRes.data || []);
      setLoading(false);
    });
  }, [group.cg_id]);
  console.log(members);

  const handleRemoveMember = useCallback(async (no_jemaat) => {
    const cgId = String(group.cg_id);
    try {
      await fetch(`${API_BASE}/groups/${cgId}/members/${no_jemaat}`, { method: 'DELETE' });
      setMembers(prev => prev.filter(m => m.no_jemaat !== no_jemaat));
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  }, [group.cg_id]);

  const handleAddMember = useCallback(async (no_jemaat) => {
    const cgId = String(group.cg_id);
    try {
      const res = await fetch(`${API_BASE}/groups/${cgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no_jemaat, nama_cgf: group.nama_cgf, is_leader: false }),
      });
      const json = await res.json();
      if (json.success) {
        const membersRes = await fetch(`${API_BASE}/groups/${cgId}/members`).then(r => r.json());
        setMembers(membersRes.data || []);
      }
    } catch (err) {
      console.error('Failed to add member:', err);
    }
    setShowAddMemberDialog(false);
  }, [group.cg_id, group.nama_cgf]);

  const statusBadgeVariant = (status) => {
    if (status === "hadir") return "success";
    if (status === "izin") return "warning";
    if (status === "tamu") return "secondary";
    return "destructive";
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Anggota CGF</CardTitle>
            <CardDescription>Daftar anggota {detail?.nama_cgf || group.nama_cgf}</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddMemberDialog(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Tambah Anggota
          </Button>
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
                  <TableHead className="text-right">Aksi</TableHead>
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.no_jemaat)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

      {showAddMemberDialog && (
        <AddMemberDialog
          cgId={group.cg_id}
          onAdd={handleAddMember}
          onClose={() => setShowAddMemberDialog(false)}
        />
      )}

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
    </div>
  );
}

function AddMemberDialog({ cgId, onAdd, onClose }) {
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/members?limit=1000`).then(r => r.json()),
      fetch(`${API_BASE}/groups/${cgId}/members`).then(r => r.json()),
    ]).then(([membersRes, groupMembersRes]) => {
      const allMembers = membersRes.data || [];
      const groupMemberIds = new Set((groupMembersRes.data || []).map(m => m.no_jemaat));
      setUnassigned(allMembers.filter(m => !groupMemberIds.has(m.no_jemaat)));
      setLoading(false);
    });
  }, [cgId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Tambah Anggota</CardTitle>
          <CardDescription>Pilih jemaat untuk ditambahkan</CardDescription>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : unassigned.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Tidak ada jemaat yang belum terdaftar.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {unassigned.map((member) => (
                <div
                  key={member.no_jemaat}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => onAdd(member.no_jemaat)}
                >
                  <div className="flex items-center gap-2">
                    <MemberAvatar
                      name={member.nama_jemaat}
                      gender={member.jenis_kelamin}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium">{member.nama_jemaat}</p>
                      <p className="text-xs text-muted-foreground">#{member.no_jemaat}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-3 w-3 mr-1" /> Tambah
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Tutup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function GroupFormDialog({ group, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nama_cgf: group?.nama_cgf || "",
    leader_name: group?.leader_name || "",
    hari: group?.hari || "",
    lokasi: group?.lokasi || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{group ? "Edit CGF Group" : "Create CGF Group"}</CardTitle>
            <CardDescription>
              {group ? "Perbarui informasi group" : "Buat group CGF baru"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Nama CGF</label>
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="CGF Kasih"
                value={formData.nama_cgf}
                onChange={(e) => setFormData(prev => ({ ...prev, nama_cgf: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Nama Leader</label>
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Andreas Wijaya"
                value={formData.leader_name}
                onChange={(e) => setFormData(prev => ({ ...prev, leader_name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Hari</label>
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Sabtu"
                value={formData.hari}
                onChange={(e) => setFormData(prev => ({ ...prev, hari: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Lokasi</label>
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Rumah Andreas - Kemang"
                value={formData.lokasi}
                onChange={(e) => setFormData(prev => ({ ...prev, lokasi: e.target.value }))}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {group ? "Simpan" : "Buat Group"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
