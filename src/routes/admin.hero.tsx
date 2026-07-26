import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, type Column } from "@/components/admin/CrudTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/admin/hero")({
  head: () => ({ meta: [{ title: "Hero Slider — Admin" }, { name: "robots", content: "noindex" }] }),
  component: HeroAdmin,
});

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  order: number;
  active: boolean | number;
}

// ==========================================
// KOMPONEN FORMULIR SLIDER (CREATE & EDIT)
// ==========================================
// KINI MENERIMA 'slides' UNTUK MENGECEK TABRAKAN URUTAN
function HeroForm({ 
  item, 
  onClose, 
  onSuccess, 
  slides 
}: { 
  item?: Partial<Slide> | null, 
  onClose: () => void, 
  onSuccess: () => void, 
  slides: Slide[] 
}) {
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxOrder = item?.id ? slides.length : slides.length + 1;
  const defaultOrder = item?.order ?? maxOrder; 

  const [formData, setFormData] = useState({
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    order: defaultOrder,
    active: item?.active === false || item?.active === 0 ? "0" : "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Judul slider wajib diisi");
    if (!item && !imageFile) return toast.error("Gambar slider wajib diunggah untuk data baru");

    const targetOrder = parseInt(formData.order.toString(), 10);
    if (targetOrder < 1) return toast.error("Urutan tidak boleh kurang dari 1");
    if (targetOrder > maxOrder) return toast.error(`Urutan maksimal saat ini adalah ${maxOrder}`);

    setSaving(true);
    try {
      // 1. CEK TABRAKAN: Apakah ada slider lain di urutan yang kita inginkan?
      const collidedSlide = slides.find(s => s.order === targetOrder && s.id !== item?.id);
      
      // 2. JIKA TABRAKAN: Kita pindahkan (swap) slider lama tersebut ke posisi yang ditinggalkan
      if (collidedSlide) {
        // Jika buat baru, pindahkan ke paling akhir. Jika edit, pindahkan ke urutan lama kita.
        const vacantOrder = item?.id ? item.order : maxOrder; 
        
        const swapData = new FormData();
        swapData.append("_method", "PUT");
        swapData.append("title", collidedSlide.title);
        swapData.append("subtitle", collidedSlide.subtitle || "");
        swapData.append("order", vacantOrder!.toString());
        swapData.append("active", collidedSlide.active ? "1" : "0");

        // Kirim perintah tukar posisi ke backend diam-diam
        await apiFetch(`/admin/hero-slides/${collidedSlide.id}`, { 
          method: "POST", 
          body: swapData 
        });
      }

      // 3. SIMPAN SLIDER KITA SEKARANG KE POSISI TARGET
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("order", targetOrder.toString());
      data.append("active", formData.active);
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (item?.id) {
        data.append("_method", "PUT");
        await apiFetch(`/admin/hero-slides/${item.id}`, { method: "POST", body: data });
      } else {
        await apiFetch(`/admin/hero-slides`, { method: "POST", body: data });
      }

      toast.success("Slider berhasil disimpan & diurutkan!");
      onSuccess(); // Refresh tabel agar urutan barunya terlihat
      onClose();   // Tutup modal
    } catch (error) {
      toast.error("Gagal menyimpan slider");
    } finally {
      setSaving(false);
    }
  };

  const previewImage = imageFile 
    ? URL.createObjectURL(imageFile) 
    : item?.image 
      ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`)
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Gambar Slider</Label>
        <div 
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => { if (e.target.files) setImageFile(e.target.files[0]) }} 
            accept="image/*" 
            className="hidden" 
          />
          {previewImage ? (
             <img src={previewImage} alt="Preview" className="h-32 w-auto object-cover rounded-md shadow-sm" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-1" />
              <p className="text-sm font-medium text-foreground">Klik untuk mengunggah gambar</p>
              <p className="text-xs text-muted-foreground">Mendukung JPG/PNG (Max. 4MB)</p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Judul Singkat</Label>
        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Selamat Datang" autoFocus />
      </div>

      <div className="space-y-2">
        <Label>Subjudul / Keterangan</Label>
        <Input name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Deskripsi singkat di bawah judul" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Urutan Tampil (Maks: {maxOrder})</Label>
          <Input 
            type="number" 
            name="order" 
            value={formData.order} 
            onChange={handleChange} 
            min={1} 
            max={maxOrder} 
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <select 
            name="active" 
            value={formData.active} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          Simpan Slider
        </Button>
      </div>
    </form>
  );
}

// ==========================================
// HALAMAN ADMIN UTAMA
// ==========================================
function HeroAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<any>('/hero-slides?all=1');
      setSlides((res.data ?? res) || []);
    } catch (error) {
      toast.error("Gagal memuat data slider");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (item: Slide) => {
    try {
      await apiFetch(`/admin/hero-slides/${item.id}`, { method: 'DELETE' });
      toast.success("Slider berhasil dihapus");
      fetchSlides();
    } catch (error) {
      toast.error("Gagal menghapus slider");
      throw error; 
    }
  };

  const columns: Column<Slide>[] = [
    {
      key: "image",
      header: "Gambar",
      render: (r) => (
        <img 
          src={r.image.startsWith('http') ? r.image : `http://127.0.0.1:8000${r.image}`} 
          alt="" 
          className="h-12 w-20 rounded object-cover shadow-sm border border-border/50" 
        />
      ),
    },
    { key: "title", header: "Judul", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "subtitle", header: "Subjudul", className: "max-w-xs truncate text-muted-foreground" },
    { key: "order", header: "Urutan", className: "w-16 text-center font-bold text-primary" },
    {
      key: "active",
      header: "Status",
      render: (r) =>
        r.active ? <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200">Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>,
    },
  ];

  if (loading) {
    return <AdminLayout title="Hero Slider"><div className="p-10 text-center text-muted-foreground">Memuat Slider...</div></AdminLayout>;
  }

  return (
    <AdminLayout
      title="Hero Slider"
      breadcrumbs={[{ label: "Website" }, { label: "Hero Slider" }]}
    >
      <CrudTable
        items={slides}
        columns={columns}
        entityName="Slider"
        searchKeys={["title", "subtitle"]}
        renderForm={(item, onClose) => (
          <HeroForm 
            item={item} 
            onClose={onClose} 
            onSuccess={fetchSlides} 
            slides={slides} 
          />
        )}
        onDelete={handleDelete} 
      />
    </AdminLayout>
  );
}