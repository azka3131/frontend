import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PRINCIPAL, STATS } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/homepage")({
  head: () => ({ meta: [{ title: "Homepage — Admin" }, { name: "robots", content: "noindex" }] }),
  component: HomepageAdmin,
});

function HomepageAdmin() {
  return (
    <AdminLayout
      title="Pengaturan Homepage"
      breadcrumbs={[{ label: "Website" }, { label: "Homepage" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sambutan Kepala Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={PRINCIPAL.photo} alt="" className="h-20 w-20 rounded-full object-cover" />
              <Button variant="outline" type="button">Ganti Foto</Button>
            </div>
            <Field label="Nama" defaultValue={PRINCIPAL.name} />
            <Field label="Jabatan" defaultValue={PRINCIPAL.title} />
            <Field label="Judul Sambutan" defaultValue="Sambutan Kepala Sekolah" />
            <div className="space-y-2">
              <Label>Pesan Sambutan</Label>
              <Textarea defaultValue={PRINCIPAL.message} rows={6} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statistik Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <Field key={i} label={s.label} defaultValue={s.value} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bagian Berita Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Jumlah artikel ditampilkan" defaultValue="3" type="number" />
            <Field label="ID artikel unggulan (pisahkan koma)" defaultValue="1, 2, 4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bagian Prestasi & Fasilitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Jumlah prestasi ditampilkan" defaultValue="3" type="number" />
            <Field label="Jumlah fasilitas ditampilkan" defaultValue="4" type="number" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Pengaturan homepage tersimpan")}>
          Simpan Perubahan
        </Button>
      </div>
    </AdminLayout>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} type={type} />
    </div>
  );
}
