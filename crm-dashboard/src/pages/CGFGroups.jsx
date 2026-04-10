import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.jsx";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Plus, Pencil, Users, MapPin, Clock, ArrowLeft, UserPlus, Trash2, Crown } from "lucide-react";
import { MemberAvatar } from "../components/ui/member-avatar.jsx";
import { EmptyState } from "../components/ui/empty-state.jsx";
import { getCGFGroups, getCGFMembers, getMembers, getAttendance } from "../data/mock.js";

export function CGFGroups() {
  const [groups, setGroups] = useState(getCGFGroups());
  const [allMembers, setAllMembers] = useState([]);
  const [cgfMemberAssignments, setCgfMemberAssignments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const membersData = await getMembers()
      setAllMembers(membersData)
      
      // Load CGF member assignments
      const groupsList = getCGFGroups();
      const assignments = [];
      for (const g of groupsList) {
        const members = await getCGFMembers(g.cg_id);
        members.forEach(m => {
          assignments.push({ no_jemaat: m.no_jemaat, cg_id: g.cg_id, is_leader: m.is_leader });
        });
      }
      setCgfMemberAssignments(assignments);
    }
    fetchData()
  }, [])

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);

  const selectedGroup = useMemo(
    () => groups.find(g => g.cg_id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  const groupMembers = useMemo(() => {
    if (!selectedGroupId) return [];
    const assignments = cgfMemberAssignments.filter(a => a.cg_id === selectedGroupId);
    return assignments.map(a => {
      const member = allMembers.find(m => m.no_jemaat === a.no_jemaat);
      return { ...member, is_leader: a.is_leader };
    });
  }, [selectedGroupId, cgfMemberAssignments, allMembers]);

  const unassignedMembers = useMemo(() => {
    const assignedIds = new Set(cgfMemberAssignments.map(a => a.no_jemaat));
    return allMembers.filter(m => !assignedIds.has(m.no_jemaat));
  }, [allMembers, cgfMemberAssignments]);

  const attendanceHistory = useMemo(() => {
    if (!selectedGroupId) return [];
    return getAttendance({ cg_id: selectedGroupId }).slice(0, 10);
  }, [selectedGroupId]);

  const getMemberName = (no_jemaat) => {
    const m = allMembers.find(x => x.no_jemaat === no_jemaat);
    return m ? m.nama_jemaat : `#${no_jemaat}`;
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setShowGroupDialog(true);
  };

  const handleEditGroup = (group) => {
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
        { cg_id: newId, ...formData, created_at: new Date().toISOString() },
      ]);
    }
    setShowGroupDialog(false);
    setEditingGroup(null);
  };

  const handleRemoveMember = (no_jemaat) => {
    setCgfMemberAssignments(prev =>
      prev.filter(a => !(a.no_jemaat === no_jemaat && a.cg_id === selectedGroupId))
    );
  };

  const handleAddMember = (no_jemaat) => {
    setCgfMemberAssignments(prev => [
      ...prev,
      { no_jemaat, cg_id: selectedGroupId, is_leader: false },
    ]);
    setShowAddMemberDialog(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusBadgeVariant = (status) => {
    if (status === "hadir") return "success";
    if (status === "izin") return "warning";
    if (status === "tamu") return "secondary";
    return "destructive";
  };

  if (selectedGroup) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedGroupId(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">{selectedGroup.nama_cgf}</h2>
            <p className="text-sm text-muted-foreground">{selectedGroup.leader_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" /> Jadwal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{selectedGroup.jadwal}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{selectedGroup.lokasi}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" /> Jumlah Anggota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{groupMembers.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Anggota CGF</CardTitle>
              <CardDescription>Daftar anggota {selectedGroup.nama_cgf}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAddMemberDialog(true)}>
              <UserPlus className="h-4 w-4 mr-1" /> Tambah Anggota
            </Button>
          </CardHeader>
          <CardContent>
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
                {groupMembers.map((member) => (
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Kehadiran</CardTitle>
            <CardDescription>10 pertemuan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell>{getMemberName(record.no_jemaat)}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(record.keterangan)}>
                        {record.keterangan}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showAddMemberDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Tambah Anggota</CardTitle>
                <CardDescription>Pilih jemaat untuk ditambahkan ke {selectedGroup.nama_cgf}</CardDescription>
              </CardHeader>
              <CardContent className="max-h-80 overflow-y-auto">
                {unassignedMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Tidak ada jemaat yang belum terdaftar.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {unassignedMembers.map((member) => (
                      <div
                        key={member.no_jemaat}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleAddMember(member.no_jemaat)}
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
                <Button variant="outline" className="w-full" onClick={() => setShowAddMemberDialog(false)}>
                  Tutup
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
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
          {groups.map((group) => {
          const memberCount = cgfMemberAssignments.filter(a => a.cg_id === group.cg_id).length;
          return (
            <Card key={group.cg_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{group.nama_cgf}</CardTitle>
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" /> {memberCount}
                  </Badge>
                </div>
                <CardDescription>{group.leader_name}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{group.jadwal}</span>
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
                <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
              </CardFooter>
            </Card>
          );
        })}
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

function GroupFormDialog({ group, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nama_cgf: group?.nama_cgf || "",
    leader_name: group?.leader_name || "",
    jadwal: group?.jadwal || "",
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
              <label className="text-sm font-medium">Jadwal</label>
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Setiap Sabtu, 18:00 WIB"
                value={formData.jadwal}
                onChange={(e) => setFormData(prev => ({ ...prev, jadwal: e.target.value }))}
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
