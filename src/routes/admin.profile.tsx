import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VISION, MISSION, HISTORY } from "@/lib/data";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Profil Sekolah — Admin" }, { name: "robots", content: "noindex" }] }),
  component: ProfileAdmin,
});

function ProfileAdmin() {
  return (
    <AdminLayout title="Profil Sekolah" breadcrumbs={[{ label: "School Profile" }]}>
      <Tabs defaultValue="vision">
        <TabsList>
          <TabsTrigger value="vision">Visi & Misi</TabsTrigger>
          <TabsTrigger value="history">Sejarah</TabsTrigger>
          <TabsTrigger value="structure">Struktur Organisasi</TabsTrigger>
        </TabsList>

        <TabsContent value="vision" className="mt-4 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Visi</CardTitle></CardHeader>
            <CardContent>
              <Textarea defaultValue={VISION} rows={6} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Misi</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {MISSION.map((m, i) => (
                <Input key={i} defaultValue={m} />
              ))}
              <Button variant="outline" size="sm">+ Tambah Misi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {HISTORY.map((h, i) => (
            <Card key={i}>
              <CardContent className="grid gap-3 p-4 sm:grid-cols-4">
                <div className="space-y-2"><Label>Tahun</Label><Input defaultValue={h.year} /></div>
                <div className="space-y-2 sm:col-span-3"><Label>Judul</Label><Input defaultValue={h.title} /></div>
                <div className="space-y-2 sm:col-span-4"><Label>Deskripsi</Label><Textarea defaultValue={h.text} rows={2} /></div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline">+ Tambah Periode</Button>
        </TabsContent>

        <TabsContent value="structure" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Bagan Struktur Organisasi</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-12 text-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Unggah gambar struktur organisasi (PNG/JPG, maks 2MB)</p>
                <Button variant="outline">Pilih File</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Profil sekolah tersimpan")}>Simpan Perubahan</Button>
      </div>
    </AdminLayout>
  );
}
