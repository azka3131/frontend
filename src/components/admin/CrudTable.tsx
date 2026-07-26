import { type ReactNode, useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface CrudTableProps<T extends { id: string | number }> {
  items: T[];
  columns: Column<T>[];
  entityName: string;
  searchKeys?: (keyof T)[];
  renderForm?: (item: Partial<T> | null, onClose: () => void) => ReactNode;
  hideActions?: boolean;
  onDelete?: (item: T) => Promise<void>; // <-- TAMBAHAN BARU: Agar bisa hapus dari database
}

export function CrudTable<T extends { id: string | number }>({
  items: initial,
  columns,
  entityName,
  searchKeys = [],
  renderForm,
  hideActions = false,
  onDelete, // <-- TAMBAHAN BARU
}: CrudTableProps<T>) {
  const [items, setItems] = useState<T[]>(initial);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  // <-- TAMBAHAN BARU: Memastikan tabel selalu sinkron dengan database
  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const filtered = items.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q));
  });

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
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
        {!hideActions && (
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah {entityName}
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={String(c.key)} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
              {!hideActions && <TableHead className="w-24 text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hideActions ? 0 : 1)}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={String(c.key)} className={c.className}>
                      {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                    </TableCell>
                  ))}
                  {!hideActions && (
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
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(row.id)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {renderForm && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editing ? `Edit ${entityName}` : `Tambah ${entityName}`}
              </DialogTitle>
              <DialogDescription>
                Lengkapi data di bawah ini untuk menyimpan perubahan ke server.
              </DialogDescription>
            </DialogHeader>
            {renderForm(editing, () => {
              setDialogOpen(false);
            })}
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteId !== null) {
                  // <-- TAMBAHAN BARU: Logika Delete yang sesungguhnya ke database
                  if (onDelete) {
                    const itemToDelete = items.find((i) => i.id === deleteId);
                    if (itemToDelete) {
                      try {
                        await onDelete(itemToDelete);
                      } catch (error) {
                        setDeleteId(null);
                        return; // Berhenti jika gagal hapus di database
                      }
                    }
                  } else {
                    // Fallback untuk UI statis lama jika onDelete tidak disediakan
                    setItems((s) => s.filter((i) => i.id !== deleteId));
                    toast.success(`${entityName} dihapus`);
                  }
                }
                setDeleteId(null);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function DefaultForm({ onClose }: { item?: any; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Form akan tersedia setelah integrasi backend. Demo UI ini menampilkan struktur CRUD.
      </p>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="button" onClick={onClose}>
          Simpan
        </Button>
      </DialogFooter>
    </div>
  );
}