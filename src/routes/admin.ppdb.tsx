import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/ppdb")({
  head: () => ({ meta: [{ title: "PPDB — Admin" }, { name: "robots", content: "noindex" }] }),
  component: PpdbAdmin,
});

function PpdbAdmin() {
  return (
    <AdminLayout title="Pengaturan PPDB" breadcrumbs={[{ label: "PPDB" }]}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Brosur PPDB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-8 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Unggah brosur PPDB (PNG/JPG/PDF). Brosur ini menjadi sumber informasi utama
                bagi orang tua.
              </p>
              <Button variant="outline" size="sm">
                Pilih File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Detail Pendaftaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul PPDB</Label>
              <Input defaultValue="Penerimaan Peserta Didik Baru 2026/2027" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Singkat</Label>
              <Textarea
                rows={4}
                defaultValue="Pendaftaran siswa baru SD Cendekia Harapan tahun ajaran 2026/2027 telah dibuka. Pendaftaran dilakukan secara langsung di sekolah."
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label className="text-sm font-semibold">Status PPDB</Label>
                <p className="text-xs text-muted-foreground">
                  Aktifkan untuk menampilkan brosur PPDB pada website publik.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Pengaturan PPDB tersimpan")}>Simpan Perubahan</Button>
      </div>
    </AdminLayout>
  );
}
