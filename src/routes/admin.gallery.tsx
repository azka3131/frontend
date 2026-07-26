import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/api";
import GalleryTable, { type GalleryAlbum } from "@/components/admin/gallery/GalleryTable";
import GalleryFormDialog from "@/components/admin/gallery/GalleryFormDialog";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({ meta: [{ title: "Galeri — Admin" }, { name: "robots", content: "noindex" }] }),
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const [items, setItems] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk membuka tutup Dialog Form
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryAlbum | null>(null);

  const loadItems = async () => {
    try {
      // Pastikan endpoint ini sesuai dengan API Anda (misal: /gallery atau /gallery-albums)
      const response = await apiFetch<any>('/gallery'); 
      let data = response.data ?? response;
      
      // Urutkan data berdasarkan order (ascending)
      data.sort((a: GalleryAlbum, b: GalleryAlbum) => a.order - b.order);
      setItems(data);
    } catch (error) { 
      toast.error("Gagal memuat data galeri."); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleDelete = async (item: GalleryAlbum) => {
    if (!confirm(`Hapus album "${item.title}" beserta seluruh fotonya?`)) return;
    try {
      // Pastikan route ini sesuai dengan routes/api.php di Laravel Anda
      await apiFetch(`/admin/gallery/${item.id}`, { method: 'DELETE' });
      toast.success("Album berhasil dihapus");
      loadItems();
    } catch (error) { 
      toast.error("Gagal menghapus data album"); 
    }
  };

  return (
    <AdminLayout title="Galeri Sekolah" breadcrumbs={[{ label: "Galeri" }]}>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      ) : (
        <>
          <GalleryTable
            items={items}
            onCreate={() => { 
              setSelectedItem(null); 
              setOpen(true); // Membuka pop-up Tambah
            }}
            onEdit={(item) => { 
              setSelectedItem(item); 
              setOpen(true); // Membuka pop-up Edit
            }}
            onDelete={handleDelete}
          />
          
          {/* Ini adalah Form Dialog yang kita buat di pesan sebelumnya */}
          <GalleryFormDialog 
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