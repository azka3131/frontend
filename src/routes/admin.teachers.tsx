import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/api";
import TeacherTable from "@/components/admin/teachers/TeacherTable";
import TeacherFormDialog from "@/components/admin/teachers/TeacherFormDialog";

export const Route = createFileRoute("/admin/teachers")({
  head: () => ({ meta: [{ title: "Guru & Staf — Admin" }, { name: "robots", content: "noindex" }] }),
  component: TeachersAdmin,
});

interface Teacher {
  id: number;
  photo: string | null;
  name: string;
  position: string;
  bio: string;
  order: number;
}

function TeachersAdmin() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const loadTeachers = async () => {
    try {
      const response = await apiFetch<any>('/teachers');
      let data = response.data ?? response;
      data.sort((a: Teacher, b: Teacher) => a.order - b.order);
      setItems(data);
    } catch (error) {
      toast.error("Gagal memuat data guru.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleDelete = async (item: Teacher) => {
    if (!confirm(`Hapus data ${item.name}?`)) return;
    try {
      await apiFetch(`/admin/teachers/${item.id}`, { method: 'DELETE' });
      toast.success("Data berhasil dihapus");
      loadTeachers();
    } catch (error) {
      toast.error("Gagal menghapus data");
    }
  };

  return (
    <AdminLayout title="Guru & Staf" breadcrumbs={[{ label: "Guru & Staf" }]}>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      ) : (
        <>
          <TeacherTable
            items={items}
            onCreate={() => {
              setSelectedTeacher(null);
              setOpen(true);
            }}
            onEdit={(item) => {
              setSelectedTeacher(item);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />

          <TeacherFormDialog
            open={open}
            initialData={selectedTeacher}
            onClose={() => setOpen(false)}
            onSuccess={loadTeachers}
            totalItems={items.length} /* <--- INI KUNCI UTAMANYA: Mengirim total data ke form */
          />
        </>
      )}
    </AdminLayout>
  );
}