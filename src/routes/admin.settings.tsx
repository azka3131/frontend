import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/school-logo.png";
import { SCHOOL } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Pengaturan Website — Admin" }, { name: "robots", content: "noindex" }] }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  return (
    <AdminLayout title="Pengaturan Website" breadcrumbs={[{ label: "Website Settings" }]}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Identitas Sekolah</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="" className="h-16 w-16 rounded-lg border border-border bg-muted p-1" />
              <Button variant="outline" type="button">Ganti Logo</Button>
            </div>
            <Field label="Nama Sekolah" defaultValue={SCHOOL.name} />
            <Field label="Motto" defaultValue={SCHOOL.motto} />
            <Field label="Tagline" defaultValue={SCHOOL.tagline} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Kontak</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Alamat</Label>
              <Textarea defaultValue={SCHOOL.address} rows={2} />
            </div>
            <Field label="Email" defaultValue={SCHOOL.email} type="email" />
            <Field label="Telepon" defaultValue={SCHOOL.phone} />
            <Field label="Jam Operasional" defaultValue={SCHOOL.hours} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Google Maps</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Embed URL</Label>
              <Textarea
                rows={3}
                defaultValue="https://www.google.com/maps/embed?pb=!1m18!1m12..."
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
            <Field label="Facebook" defaultValue="https://facebook.com/cendekiaharapan" />
            <Field label="Instagram" defaultValue="https://instagram.com/cendekiaharapan" />
            <Field label="YouTube" defaultValue="https://youtube.com/@cendekiaharapan" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Footer</CardTitle></CardHeader>
          <CardContent>
            <Field
              label="Teks Hak Cipta"
              defaultValue={`© ${new Date().getFullYear()} ${SCHOOL.name}. All rights reserved.`}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Pengaturan tersimpan")}>Simpan Perubahan</Button>
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
