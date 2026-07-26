import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, type Column } from "@/components/admin/CrudTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Pengguna — Admin" }, { name: "robots", content: "noindex" }] }),
  component: UsersAdmin,
});

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean | number;
}

// FORM KUSTOM UNTUK PENGGUNA
function UserForm({ item, onClose, onSuccess }: { item?: Partial<User> | null, onClose: () => void, onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    email: item?.email || "",
    password: "",
    role: item?.role || "Editor",
    active: item?.active !== undefined ? (item.active == 1 || item.active === true) : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return toast.error("Nama dan Email wajib diisi");
    if (!item?.id && !formData.password) return toast.error("Password wajib diisi untuk pengguna baru");

    setSaving(true);
    try {
      const payload = {
        ...formData,
        active: formData.active ? 1 : 0,
      };

      if (item?.id) {
        await apiFetch(`/admin/users/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/admin/users`, { method: "POST", body: JSON.stringify(payload) });
      }
      
      toast.success(item?.id ? "Pengguna diperbarui" : "Pengguna berhasil ditambahkan");
      onSuccess();
      onClose();
    } catch (error: any) {
      // Laravel mengembalikan error 403 jika yang login bukan Super Admin
      if (error.message && error.message.includes("403")) {
        toast.error("Akses Ditolak: Hanya Super Admin yang dapat mengelola pengguna.");
      } else {
        toast.error("Gagal menyimpan data pengguna. Email mungkin sudah digunakan.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nama Lengkap</Label>
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Budi Santoso" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="admin@sekolah.com" />
      </div>
      <div className="space-y-2">
        <Label>Password {item?.id && <span className="text-muted-foreground text-xs">(Kosongkan jika tidak ingin diubah)</span>}</Label>
        <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimal 8 karakter" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Peran (Role)</Label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Editor">Editor</option>
            <option value="Author">Author</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="block mb-2">Status Akun</Label>
          <div className="flex items-center gap-3 h-10">
            <Switch 
              checked={formData.active} 
              onCheckedChange={(c) => setFormData({ ...formData, active: c })} 
            />
            <span className="text-sm font-medium">{formData.active ? "Aktif" : "Nonaktif"}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          Simpan Pengguna
        </Button>
      </div>
    </form>
  );
}

// HALAMAN UTAMA ADMIN PENGGUNA
function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<any>('/admin/users');
      const data = res.data?.data || res.data || res || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (item: User) => {
    try {
      await apiFetch(`/admin/users/${item.id}`, { method: 'DELETE' });
      toast.success("Pengguna berhasil dihapus");
      fetchUsers();
    } catch (error: any) {
      if (error.message && error.message.includes("422")) {
        toast.error("Tidak dapat menghapus akun Anda sendiri.");
      } else if (error.message && error.message.includes("403")) {
        toast.error("Akses Ditolak: Hanya Super Admin.");
      } else {
        toast.error("Gagal menghapus pengguna");
      }
      throw error; 
    }
  };

  const columns: Column<User>[] = [
    { key: "name", header: "Nama Lengkap", render: (r) => (
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
          {r.name.charAt(0)}
        </div>
        <span className="font-medium">{r.name}</span>
      </div>
    )},
    { key: "email", header: "Email" },
    { key: "role", header: "Peran", render: (r) => {
        let color = "bg-slate-500";
        if (r.role === "Super Admin") color = "bg-purple-600";
        if (r.role === "Editor") color = "bg-blue-600";
        return <Badge className={`${color} text-white hover:opacity-90`}>{r.role}</Badge>
    }},
    { key: "active", header: "Status", render: (r) => (
      (r.active == 1 || r.active === true) 
        ? <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200">Aktif</Badge> 
        : <Badge variant="secondary">Nonaktif</Badge>
    ) },
  ];

  if (loading) return <AdminLayout title="Pengguna"><div className="p-10 text-center">Memuat Pengguna...</div></AdminLayout>;

  return (
    <AdminLayout title="Manajemen Pengguna" breadcrumbs={[{ label: "Pengaturan" }, { label: "Pengguna" }]}>
      <CrudTable
        items={users}
        columns={columns}
        entityName="Pengguna"
        searchKeys={["name", "email", "role"]}
        renderForm={(item, onClose) => <UserForm item={item} onClose={onClose} onSuccess={fetchUsers} />}
        onDelete={handleDelete} 
      />
    </AdminLayout>
  );
}