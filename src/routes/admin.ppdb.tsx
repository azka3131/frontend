import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/admin/ppdb")({
  head: () => ({ meta: [{ title: "PPDB — Admin" }, { name: "robots", content: "noindex" }] }),
  component: PpdbAdmin,
});

function PpdbAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState("Penerimaan Peserta Didik Baru");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);
  
  const [brochureImage, setBrochureImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ambil data pengaturan saat ini dari database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiFetch<any>("/ppdb");
        const data = res.data ?? res;
        if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setActive(data.active === 1 || data.active === true);
          setBrochureImage(data.brochure_image);
        }
      } catch (error) {
        toast.error("Gagal memuat pengaturan PPDB");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Judul PPDB wajib diisi");

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT"); // Laravel mensyaratkan ini untuk update via form-data
      formData.append("title", title);
      formData.append("description", description);
      formData.append("active", active ? "1" : "0");
      
      if (imageFile) {
        formData.append("brochure_image", imageFile);
      }

      await apiFetch("/admin/ppdb", {
        method: "POST",
        body: formData,
      });

      toast.success("Pengaturan PPDB berhasil disimpan!");
      // Reset state file lokal setelah sukses tersimpan
      if (imageFile) {
        setBrochureImage(URL.createObjectURL(imageFile)); 
        setImageFile(null);
      }
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan PPDB");
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : brochureImage ? (brochureImage.startsWith('http') ? brochureImage : `http://127.0.0.1:8000${brochureImage}`) : null;

  if (loading) {
    return <AdminLayout title="Pengaturan PPDB"><div className="p-10 text-center">Memuat data...</div></AdminLayout>;
  }

  return (
    <AdminLayout title="Pengaturan PPDB" breadcrumbs={[{ label: "PPDB" }]}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AREA UNGGAH BROSUR */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Brosur PPDB</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-slate-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => { if (e.target.files) setImageFile(e.target.files[0]) }} 
                accept="image/*" 
                className="hidden" 
              />
              
              {previewUrl ? (
                <div className="space-y-3 w-full">
                  <img src={previewUrl} alt="Preview Brosur" className="w-full rounded-md object-contain max-h-64 shadow-sm border" />
                  <p className="text-xs text-muted-foreground">Klik gambar untuk mengganti brosur</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Unggah brosur gambar PPDB (PNG/JPG). Brosur ini akan ditampilkan jika status PPDB Aktif.
                  </p>
                  <Button type="button" variant="outline" size="sm">Pilih Gambar</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AREA TEKS PENGATURAN */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Detail Pendaftaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Informasi PPDB</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Contoh: Penerimaan Peserta Didik Baru 2026/2027" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Deskripsi Singkat / Pengumuman Tambahan</Label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan pesan pembuka, jadwal, atau informasi kontak panitia di sini..."
              />
            </div>
            
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-slate-50">
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2">
                  Status PPDB 
                  {active ? <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">DIBUKA</span> : <span className="text-xs text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">DITUTUP</span>}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Jika dimatikan, halaman akan menampilkan pesan bahwa "Pendaftaran Telah Ditutup" dan brosur akan disembunyikan.
                </p>
              </div>
              <Switch 
                checked={active} 
                onCheckedChange={setActive} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
           {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
           Simpan Perubahan
        </Button>
      </div>
    </AdminLayout>
  );
}