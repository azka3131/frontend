import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/admin/homepage")({
  head: () => ({ meta: [{ title: "Homepage — Admin" }, { name: "robots", content: "noindex" }] }),
  component: HomepageAdmin,
});

function HomepageAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- STATE KEPALA SEKOLAH ---
  const [principal, setPrincipal] = useState({
    name: "",
    title: "",
    message: "",
    photo: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE STATISTIK ---
  const [stats, setStats] = useState<any[]>([]);

  // 1. Fungsi Mengambil Data dari API
  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      // Mengambil semua data langsung dari endpoint /home
      const res = await apiFetch<any>("/home");
      const data = (res.data ?? res) || {};

      if (data.principal) {
        setPrincipal({
          name: data.principal.name || "",
          title: data.principal.title || "",
          message: data.principal.message || "",
          photo: data.principal.photo || "",
        });
      }

      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      toast.error("Gagal memuat data homepage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  // 2. Fungsi Handler Perubahan Teks
  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrincipal({ ...principal, [e.target.name]: e.target.value });
  };

  const handleStatChange = (id: number, value: string) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  // 3. Fungsi Menyimpan Data
  const handleSave = async () => {
    if (!principal.name) return toast.error("Nama Kepala Sekolah wajib diisi");
    if (!principal.message) return toast.error("Pesan Sambutan wajib diisi");

    setSaving(true);
    try {
      // --- A. SIMPAN DATA KEPALA SEKOLAH ---
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", principal.name);
      formData.append("title", principal.title);
      formData.append("message", principal.message);
      
      if (imageFile) {
        formData.append("photo", imageFile);
      }
      
      // Hit endpoint admin/principal
      await apiFetch("/admin/principal", { method: "POST", body: formData });

      // --- B. SIMPAN DATA STATISTIK ---
      // Karena ada 4 kotak, kita kirimkan request PUT secara paralel untuk tiap id statistik
      if (stats.length > 0) {
        const statPromises = stats.map((stat) =>
          apiFetch(`/admin/stats/${stat.id}`, {
            method: "PUT",
            body: JSON.stringify({ 
              label: stat.label, 
              value: stat.value, 
              order: stat.order 
            }),
          })
        );
        await Promise.all(statPromises); // Tunggu sampai semuanya selesai
      }

      toast.success("Pengaturan homepage berhasil disimpan!");
      
      if (imageFile) setImageFile(null); // Reset file upload
      fetchHomepageData(); // Refresh UI untuk mendapatkan gambar terbaru dari URL
      
    } catch (error) {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = imageFile 
    ? URL.createObjectURL(imageFile) 
    : principal.photo 
      ? (principal.photo.startsWith("http") ? principal.photo : `http://127.0.0.1:8000${principal.photo}`) 
      : null;

  if (loading) {
    return (
      <AdminLayout title="Pengaturan Homepage">
        <div className="p-10 text-center text-muted-foreground">Memuat data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Pengaturan Homepage"
      breadcrumbs={[{ label: "Website" }, { label: "Homepage" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* KARTU 1: KEPALA SEKOLAH */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sambutan Kepala Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => { if (e.target.files) setImageFile(e.target.files[0]) }} 
                accept="image/*" 
                className="hidden" 
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Kepala Sekolah" className="h-20 w-20 rounded-full object-cover border shadow-sm" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-slate-100 border border-dashed flex items-center justify-center text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
              )}
              <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                Ganti Foto
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Nama</Label>
              <Input name="name" value={principal.name} onChange={handlePrincipalChange} placeholder="Nama lengkap..." />
            </div>
            
            <div className="space-y-2">
              <Label>Jabatan</Label>
              <Input name="title" value={principal.title} onChange={handlePrincipalChange} placeholder="Contoh: Kepala Sekolah" />
            </div>
            
            <div className="space-y-2">
              <Label>Pesan Sambutan</Label>
              <Textarea 
                name="message" 
                value={principal.message} 
                onChange={handlePrincipalChange} 
                rows={6} 
                placeholder="Tuliskan pesan sambutan di sini..." 
              />
            </div>
          </CardContent>
        </Card>

        {/* KARTU 2: STATISTIK SEKOLAH */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statistik Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {stats.length > 0 ? (
              stats.map((stat) => (
                <div key={stat.id} className="space-y-2">
                  {/* Label mengambil dari database (tidak bisa diubah admin agar desain tidak rusak) */}
                  <Label>{stat.label}</Label> 
                  <Input 
                    value={stat.value} 
                    onChange={(e) => handleStatChange(stat.id, e.target.value)} 
                    placeholder={`Angka untuk ${stat.label}`}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-sm text-muted-foreground">Belum ada data statistik di database.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TOMBOL SIMPAN (Menyimpan 2 kartu sekaligus) */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          Simpan Perubahan
        </Button>
      </div>
    </AdminLayout>
  );
}