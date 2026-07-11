import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { Eye, Trash2, Mail, MessageCircle } from "lucide-react";
import { MESSAGES, type Message, type MessageStatus } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Pesan Masuk — Admin" }, { name: "robots", content: "noindex" }] }),
  component: MessagesAdmin,
});

// Convert Indonesian phone like "0812-3456-7890" -> "628123456789"
function toWaNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

function waLink(phone: string) {
  return `https://wa.me/${toWaNumber(phone)}`;
}

function gmailComposeLink(email: string) {
  const subject = encodeURIComponent("Balasan Pesan dari SD Negeri Dukuhbenda 02");
  const body = encodeURIComponent(
    "Yth. Bapak/Ibu,\n\nTerima kasih telah menghubungi SD Negeri Dukuhbenda 02.\n\nPesan Anda telah kami terima dan berikut adalah tanggapan dari pihak sekolah.\n\n--------------------------------------------------\n\n(Tulis balasan di sini)\n\n--------------------------------------------------\n\nHormat kami,\nOperator Website\nSD Negeri Dukuhbenda 02"
  );
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
}

function statusBadge(status: MessageStatus) {
  if (status === "Baru")
    return <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Baru</Badge>;
  if (status === "Sudah Dibaca")
    return <Badge variant="secondary">Sudah Dibaca</Badge>;
  return (
    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600/90">Sudah Dibalas</Badge>
  );
}

function MessagesAdmin() {
  const [items, setItems] = useState<Message[]>(MESSAGES);
  const [viewing, setViewing] = useState<Message | null>(null);

  const setStatus = (id: number, status: MessageStatus) =>
    setItems((s) => s.map((m) => (m.id === id ? { ...m, status } : m)));

  const openView = (m: Message) => {
    setViewing(m);
    if (m.status === "Baru") setStatus(m.id, "Sudah Dibaca");
  };

  const remove = (id: number) => {
    setItems((s) => s.filter((m) => m.id !== id));
    toast.success("Pesan dihapus");
  };

  const handleWa = (m: Message) => {
    window.open(waLink(m.phone), "_blank", "noopener,noreferrer");
    setStatus(m.id, "Sudah Dibalas");
  };

  const handleEmail = (m: Message) => {
    window.open(gmailComposeLink(m.email), "_blank", "noopener,noreferrer");
    setStatus(m.id, "Sudah Dibalas");
  };

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
                {items.map((m) => (
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
                      <a
                        href={gmailComposeLink(m.email)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setStatus(m.id, "Sudah Dibalas")}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {m.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={waLink(m.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setStatus(m.id, "Sudah Dibalas")}
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        {m.phone}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">{m.message}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.date}</TableCell>
                    <TableCell>{statusBadge(m.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-emerald-600 hover:text-emerald-600"
                          onClick={() => handleWa(m)}
                          aria-label="Chat via WhatsApp"
                          title="Chat via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEmail(m)}
                          aria-label="Kirim Email"
                          title="Kirim Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openView(m)}
                          aria-label="Lihat Pesan"
                          title="Lihat Pesan"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => remove(m.id)}
                          aria-label="Hapus"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pesan dari {viewing?.name}</DialogTitle>
            <DialogDescription>{viewing?.date}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Nama</span>
                <span className="col-span-2 font-medium">{viewing.name}</span>
                <span className="text-muted-foreground">Email</span>
                <a
                  href={gmailComposeLink(viewing.email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {viewing.email}
                </a>
                <span className="text-muted-foreground">Nomor Telepon</span>
                <a
                  href={waLink(viewing.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 inline-flex items-center gap-1.5 font-medium text-emerald-600 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {viewing.phone}
                </a>
                <span className="text-muted-foreground">Tanggal</span>
                <span className="col-span-2 font-medium">{viewing.date}</span>
                <span className="text-muted-foreground">Status</span>
                <span className="col-span-2">{statusBadge(viewing.status)}</span>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">Isi Pesan</div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 leading-relaxed">
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
                <Button variant="outline" onClick={() => handleEmail(viewing)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Kirim Email
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-600/90"
                  onClick={() => handleWa(viewing)}
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
