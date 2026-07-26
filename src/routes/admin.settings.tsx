import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
// Tetap import logo bawaan sebagai cadangan jika di database kosong
import defaultLogo from "@/assets/school-logo.png"; 

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Pengaturan Website — Admin" }, { name: "robots", content: "noindex" }] }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", motto: "", tagline: "", address: "", email: "", 
    phone: "", hours: "", maps_embed_url: "", facebook_url: "", 
    instagram_url: "", youtube_url: "", footer_copyright: "", logo: ""
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch<any>('/settings');
        const data = response.data ?? response;
        if (data) {
          setFormData({
            name: data.name || "", motto: data.motto || "", tagline: data.tagline || "",
            address: data.address || "", email: data.email || "", phone: data.phone || "",
            hours: data.hours || "", maps_embed_url: data.maps_embed_url || "",
            facebook_url: data.facebook_url || "", instagram_url: data.instagram_url || "",
            youtube_url: data.youtube_url || "", footer_copyright: data.footer_copyright || "",
            logo: data.logo || ""
          });
        }
      } catch (error) {
        toast.error("Gagal memuat pengaturan website");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'logo') data.append(key, value);
      });

      if (logoFile) {
        data.append("logo", logoFile);
      }

      // Gunakan _method PUT karena kita mengirim FormData berisi File
      data.append("_method", "PUT");

      await apiFetch('/admin/settings', { method: 'POST', body: data });
      
      toast.success("Pengaturan website berhasil disimpan!");
      setLogoFile(null); 
    } catch (error) {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout title="Pengaturan Website"><div className="p-8 text-center text-muted-foreground">Memuat pengaturan...</div></AdminLayout>;
  }

  // Tentukan sumber gambar logo yang akan ditampilkan
  const logoSrc = logoFile 
    ? URL.createObjectURL(logoFile) 
    : (formData.logo ? (formData.logo.startsWith('http') ? formData.logo : `http://127.0.0.1:8000${formData.logo}`) : defaultLogo);

  return (
    <AdminLayout title="Pengaturan Website" breadcrumbs={[{ label: "Website Settings" }]}>
      <div className="grid gap-6 lg:grid-cols-2 pb-10">
        <Card>
          <CardHeader><CardTitle className="text-base">Identitas Sekolah</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={logoSrc} alt="Logo" className="h-16 w-16 rounded-lg border border-border bg-muted p-1 object-contain" />
              <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
              <Button variant="outline" type="button" onClick={() => logoInputRef.current?.click()}>
                Ganti Logo
              </Button>
            </div>
            <Field label="Nama Sekolah" name="name" value={formData.name} onChange={handleChange} />
            <Field label="Motto" name="motto" value={formData.motto} onChange={handleChange} />
            <Field label="Tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Kontak</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Alamat</Label>
              <Textarea name="address" value={formData.address} onChange={handleChange} rows={2} />
            </div>
            <Field label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
            <Field label="Telepon" name="phone" value={formData.phone} onChange={handleChange} />
            <Field label="Jam Operasional" name="hours" value={formData.hours} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Google Maps</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Embed URL</Label>
              <Textarea
                rows={3}
                name="maps_embed_url"
                value={formData.maps_embed_url}
                onChange={handleChange}
                placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12..."
              />
              <p className="text-xs text-muted-foreground">
                Tempel URL dari Google Maps → Share → Embed a map.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Media Sosial</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Facebook" name="facebook_url" value={formData.facebook_url} onChange={handleChange} />
            <Field label="Instagram" name="instagram_url" value={formData.instagram_url} onChange={handleChange} />
            <Field label="YouTube" name="youtube_url" value={formData.youtube_url} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Footer</CardTitle></CardHeader>
          <CardContent>
            <Field
              label="Teks Hak Cipta"
              name="footer_copyright"
              value={formData.footer_copyright}
              onChange={handleChange}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          Simpan Perubahan
        </Button>
      </div>
    </AdminLayout>
  );
}

// Komponen Field disesuaikan agar menerima name, value, dan onChange
function Field({ label, name, value, onChange, type = "text" }: { label: string; name: string; value: string; onChange: any; type?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={onChange} type={type} />
    </div>
  );
}