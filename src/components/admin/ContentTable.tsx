import { useMemo, useState, type ReactNode } from "react";
import { Archive, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { DefaultForm } from "@/components/admin/CrudTable";

export type ContentStatus = 'Disematkan' | 'Dipublikasikan' | 'Disembunyikan' | 'Diarsipkan';
export const CONTENT_STATUSES: ContentStatus[] = [
  'Disematkan',
  'Dipublikasikan',
  'Disembunyikan',
  'Diarsipkan',
];

const STATUS_STYLES: Record<ContentStatus, string> = {
  Disematkan: "bg-primary/15 text-primary border-primary/20",
  Dipublikasikan: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
  Disembunyikan: "bg-muted text-muted-foreground border-border",
  Diarsipkan: "bg-destructive/10 text-destructive border-destructive/20",
};

type FilterValue = "Semua" | ContentStatus;
const FILTER_TABS: FilterValue[] = [
  "Semua",
  "Disematkan",
  "Dipublikasikan",
  "Disembunyikan",
  "Diarsipkan",
];

export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  date: string;
  author: string;
  category: string;
  status: ContentStatus;
}

export interface ContentRow extends Pick<
  NewsArticle,
  "id" | "slug" | "title" | "image" | "date" | "author" | "category" | "status"
> {
  attachments?: number;
}

interface Props {
  items: ContentRow[];
  setItems: React.Dispatch<React.SetStateAction<ContentRow[]>>;
  entityName: "Berita" | "Pengumuman";
  extraColumn?: {
    header: string;
    render: (row: ContentRow) => ReactNode;
    className?: string;
  };
}

// PENDETEKSI GAMBAR SUPER AMAN
const getImageUrl = (path: string | null | undefined) => {
  if (!path || path.trim() === "") return "https://placehold.co/150x100/e2e8f0/64748b?text=No+Foto";
  if (path.trim().startsWith('http')) return path.trim();
  return `http://127.0.0.1:8000${path.trim()}`;
};

export function ContentTable({ items, setItems, entityName, extraColumn }: Props) {
  const [filter, setFilter] = useState<FilterValue>("Semua");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ContentRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [archiveId, setArchiveId] = useState<number | null>(null);

  const counts = useMemo(() => {
    const c: Record<FilterValue, number> = {
      Semua: items.length,
      Disematkan: 0,
      Dipublikasikan: 0,
      Disembunyikan: 0,
      Diarsipkan: 0,
    };
    for (const it of items) {
      if (c[it.status] !== undefined) {
        c[it.status]++;
      }
    }
    return c;
  }, [items]);

  const filtered = items.filter((row) => {
    if (filter !== "Semua" && row.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      row.title.toLowerCase().includes(q) ||
      row.author.toLowerCase().includes(q) ||
      row.category.toLowerCase().includes(q)
    );
  });

  function updateStatus(id: number, status: ContentStatus) {
    setItems((s) => s.map((i) => (i.id === id ? { ...i, status } : i)));
    toast.success(`Status ${entityName.toLowerCase()} diperbarui`, {
      description: `Menjadi "${status}".`,
    });
  }

  const deleteDesc =
    entityName === "Berita"
      ? "Tindakan ini akan menghapus berita secara permanen. Apakah Anda yakin?"
      : "Tindakan ini akan menghapus pengumuman secara permanen. Apakah Anda yakin?";
  const archiveDesc =
    entityName === "Berita"
      ? "Berita akan dipindahkan ke Arsip dan tidak akan tampil di website. Lanjutkan?"
      : "Pengumuman akan dipindahkan ke Arsip dan tidak akan tampil di website. Lanjutkan?";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
          <TabsList className="flex flex-wrap justify-start gap-1 bg-muted/60">
            {FILTER_TABS.map((t) => (
              <TabsTrigger key={t} value={t} className="gap-2">
                {t}
                <span className="rounded bg-background/70 px-1.5 text-[10px] font-semibold text-muted-foreground">
                  {counts[t]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Cari ${entityName.toLowerCase()}…`}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah {entityName}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Judul</TableHead>
              {extraColumn && <TableHead className={extraColumn.className}>{extraColumn.header}</TableHead>}
              <TableHead>Tanggal</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead className="w-48">Status</TableHead>
              <TableHead className="w-40 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={extraColumn ? 7 : 6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <img 
                      src={getImageUrl(row.image) || "https://placehold.co/150x100/e2e8f0/64748b?text=No+Foto"} 
                      alt="Thumbnail" 
                      className="h-12 w-16 rounded object-cover bg-slate-100" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/150x100/e2e8f0/64748b?text=No+Foto";
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{row.title}</div>
                    <div className="text-xs text-muted-foreground">/{row.slug}</div>
                  </TableCell>
                  {extraColumn && <TableCell>{extraColumn.render(row)}</TableCell>}
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.author}</TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onValueChange={(v) => updateStatus(row.id, v as ContentStatus)}
                    >
                      <SelectTrigger
                        aria-label="Ubah Status"
                        className={`h-9 border ${STATUS_STYLES[row.status] || ""}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            <Badge variant="outline" className={STATUS_STYLES[s]}>
                              {s}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditing(row);
                          setDialogOpen(true);
                        }}
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setArchiveId(row.id)}
                        aria-label="Arsipkan"
                        title="Arsipkan"
                        disabled={row.status === "Diarsipkan"}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(row.id)}
                        aria-label="Hapus"
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${entityName}` : `Tambah ${entityName}`}
            </DialogTitle>
            <DialogDescription>
              Lengkapi data berikut.
            </DialogDescription>
          </DialogHeader>
          <DefaultForm
            item={editing}
            onClose={() => {
              setDialogOpen(false);
              toast.success(editing ? `${entityName} diperbarui` : `${entityName} ditambahkan`);
            }}
          />
          <DialogFooter />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>{deleteDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId !== null) {
                  setItems((s) => s.filter((i) => i.id !== deleteId));
                  toast.success(`${entityName} dihapus`);
                }
                setDeleteId(null);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={archiveId !== null} onOpenChange={(o) => !o && setArchiveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arsipkan {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>{archiveDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (archiveId !== null) {
                  setItems((s) =>
                    s.map((i) => (i.id === archiveId ? { ...i, status: "Diarsipkan" } : i)),
                  );
                  toast.success(`${entityName} diarsipkan`);
                }
                setArchiveId(null);
              }}
            >
              Arsipkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}