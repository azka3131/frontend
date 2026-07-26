import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/api";
import AchievementTable, { type Achievement } from "@/components/admin/achievements/AchievementTable";
import AchievementFormDialog from "@/components/admin/achievements/AchievementFormDialog";

export const Route = createFileRoute("/admin/achievements")({
  head: () => ({ meta: [{ title: "Prestasi — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AchievementsAdmin,
});

function AchievementsAdmin() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Achievement | null>(null);

  const loadItems = async () => {
    try {
      const response = await apiFetch<any>('/achievements');
      let data = response.data ?? response;
      setItems(data);
    } catch (error) {
      toast.error("Gagal memuat data prestasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleDelete = async (item: Achievement) => {
    if (!confirm(`Hapus prestasi "${item.title}"?`)) return;
    try {
      await apiFetch(`/admin/achievements/${item.id}`, { method: 'DELETE' });
      toast.success("Prestasi dihapus");
      loadItems();
    } catch (error) {
      toast.error("Gagal menghapus data");
    }
  };

  return (
    <AdminLayout title="Prestasi Sekolah" breadcrumbs={[{ label: "Prestasi" }]}>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      ) : (
        <>
          <AchievementTable
            items={items}
            onCreate={() => { setSelectedItem(null); setOpen(true); }}
            onEdit={(item) => { setSelectedItem(item); setOpen(true); }}
            onDelete={handleDelete}
          />

          <AchievementFormDialog
            open={open}
            initialData={selectedItem}
            onClose={() => setOpen(false)}
            onSuccess={loadItems}
          />
        </>
      )}
    </AdminLayout>
  );
}