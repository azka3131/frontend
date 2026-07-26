import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2, Mail, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Pesan Masuk — Admin" }, { name: "robots", content: "noindex" }] }),
  component: MessagesAdmin,
});

function toWaNumber(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

function waLink(phone: string) {
  return `https://wa.me/${toWaNumber(phone)}`;
}

// Tambahkan parameter schoolName agar dinamis
function gmailComposeLink(email: string, schoolName: string) {
  if (!email) return "#";
  const subject = encodeURIComponent(`Balasan Pesan dari ${schoolName}`);
  const body = encodeURIComponent(
    `Yth. Bapak/Ibu,\n\nTerima kasih telah menghubungi ${schoolName}.\n\nPesan Anda telah kami terima dan berikut adalah tanggapan dari pihak sekolah.\n\n--------------------------------------------------\n\n(Tulis balasan di sini)\n\n--------------------------------------------------\n\nHormat kami,\nAdmin Website\n${schoolName}`
  );
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
}

function statusBadge(status: string) {
  if (status === "Baru")
    return <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Baru</Badge>;
  if (status === "Sudah Dibaca")
    return <Badge variant="secondary">Sudah Dibaca</Badge>;
  return (
    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600/90">Sudah Dibalas</Badge>
  );
}

function MessagesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<any | null>(null);
  const [schoolName, setSchoolName] = useState("Sekolah");

  // Ambil pesan sekaligus identitas sekolah
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<any>("/admin/messages");
      
      const rawData = res.data?.data || res.data || res || [];
      setItems(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      toast.error("Gagal memuat pesan masuk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Tarik nama sekolah untuk template Email
    apiFetch('/settings').then((res: any) => {
      const data = res.data ?? res;
      if (data?.name) setSchoolName(data.name);
    }).catch(() => {});
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      setItems((s) => s.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
      await apiFetch(`/admin/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      toast.error("Gagal memperbarui status pesan");
      fetchMessages(); 
    }
  };

  const openView = (m: any) => {
    setViewing(m);
    if (m.status === "Baru") {
      updateStatus(m.id, "Sudah Dibaca");
    }
  };

  const handleWa = (m: any) => {
    window.open(waLink(m.phone), "_blank", "noopener,noreferrer");
    updateStatus(m.id, "Sudah Dibalas");
  };

  const handleEmail = (m: any) => {
    // Oper schoolName ke fungsi gmailComposeLink
    window.open(gmailComposeLink(m.email, schoolName), "_blank", "noopener,noreferrer");
    updateStatus(m.id, "Sudah Dibalas");
  };

  const remove = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;
    try {
      await apiFetch(`/admin/messages/${id}`, { method: "DELETE" });
      setItems((s) => s.filter((m) => m.id !== id));
      toast.success("Pesan berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus pesan");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Pesan Masuk">
        <div className="p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat pesan...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pesan Masuk" breadcrumbs={[{ label: "Pesan Masuk" }]}>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nama Pengirim</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nomor Telepon</TableHead>
                  <TableHead>Pesan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      Belum ada pesan masuk.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((m) => (
                    <TableRow key={m.id} className={m.status === "Baru" ? "bg-primary/5" : ""}>
                      <TableCell>
                        <Mail
                          className={`h-4 w-4 ${
                            m.status === "Baru" ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={m.status === "Baru" ? "font-semibold" : "font-medium"}>
                          {m.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {m.email ? (
                          <a
                            href={gmailComposeLink(m.email, schoolName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => updateStatus(m.id, "Sudah Dibalas")}
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {m.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {m.phone ? (
                          <a
                            href={waLink(m.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => updateStatus(m.id, "Sudah Dibalas")}
                            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            {m.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">{m.message}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {m.created_at ? new Date(m.created_at).toLocaleDateString("id-ID") : "-"}
                      </TableCell>
                      <TableCell>{statusBadge(m.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-emerald-600 hover:text-emerald-600"
                            onClick={() => handleWa(m)}
                            disabled={!m.phone}
                            title="Chat via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEmail(m)}
                            disabled={!m.email}
                            title="Kirim Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openView(m)}
                            title="Lihat Pesan"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => remove(m.id)}
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pesan dari {viewing?.name}</DialogTitle>
            <DialogDescription>
              {viewing?.created_at ? new Date(viewing.created_at).toLocaleString("id-ID") : ""}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Nama</span>
                <span className="col-span-2 font-medium">{viewing.name}</span>
                <span className="text-muted-foreground">Email</span>
                <span className="col-span-2 font-medium">{viewing.email || "-"}</span>
                <span className="text-muted-foreground">Nomor Telepon</span>
                <span className="col-span-2 font-medium">{viewing.phone || "-"}</span>
                <span className="text-muted-foreground">Status</span>
                <span className="col-span-2">{statusBadge(viewing.status)}</span>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">Isi Pesan</div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 leading-relaxed whitespace-pre-wrap">
                  {viewing.message}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setViewing(null)}>
              Tutup
            </Button>
            {viewing && (
              <>
                <Button variant="outline" onClick={() => handleEmail(viewing)} disabled={!viewing.email}>
                  <Mail className="mr-2 h-4 w-4" />
                  Kirim Email
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-600/90"
                  onClick={() => handleWa(viewing)}
                  disabled={!viewing.phone}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat via WhatsApp
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}