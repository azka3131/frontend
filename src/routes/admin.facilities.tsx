import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/api";
import FacilityTable, { type Facility } from "@/components/admin/facilities/FacilityTable";
import FacilityFormDialog from "@/components/admin/facilities/FacilityFormDialog";

export const Route = createFileRoute("/admin/facilities")({
  head: () => ({ meta: [{ title: "Fasilitas — Admin" }, { name: "robots", content: "noindex" }] }),
  component: FacilitiesAdmin,
});

function FacilitiesAdmin() {
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Facility | null>(null);

  const loadItems = async () => {
    try {
      const response = await apiFetch<any>('/facilities');
      let data = response.data ?? response;
      setItems(data);
    } catch (error) { toast.error("Gagal memuat data fasilitas."); } finally { setLoading(false); }
  };

  useEffect(() => { loadItems(); }, []);

  const handleDelete = async (item: Facility) => {
    if (!confirm(`Hapus fasilitas "${item.title}"?`)) return;
    try {
      await apiFetch(`/admin/facilities/${item.id}`, { method: 'DELETE' });
      toast.success("Fasilitas dihapus");
      loadItems();
    } catch (error) { toast.error("Gagal menghapus data"); }
  };

  return (
    <AdminLayout title="Fasilitas Sekolah" breadcrumbs={[{ label: "Fasilitas" }]}>
      {loading ? <div className="p-8 text-center text-gray-500">Memuat data...</div> : (
        <>
          <FacilityTable
            items={items}
            onCreate={() => { setSelectedItem(null); setOpen(true); }}
            onEdit={(item) => { setSelectedItem(item); setOpen(true); }}
            onDelete={handleDelete}
          />
          <FacilityFormDialog open={open} initialData={selectedItem} onClose={() => setOpen(false)} onSuccess={loadItems} />
        </>
      )}
    </AdminLayout>
  );
}