import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'
import type { Achievement } from './AchievementTable'

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Achievement | null;
}

export default function AchievementFormDialog({ open, onClose, onSuccess, initialData }: Props) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!initialData) {
        setTitle(''); 
        setYear(new Date().getFullYear().toString()); 
        setDescription(''); 
        setImage(null); 
        setPreview(''); 
        return;
    }
    
    setTitle(initialData.title);
    setYear(String(initialData.year)); 
    setDescription(initialData.description || '');
    setPreview(initialData.image || '');
  }, [initialData, open]);

  async function handleSubmit() {
    if (!title || !String(year).trim()) {
      toast.error('Judul dan Tahun wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append('title', title);
      form.append('year', String(year));
      form.append('description', description);
      form.append('order', '1'); // Memaksa urutan 0 agar backend mengurutkan berdasarkan tanggal terbaru otomatis

      if (image) form.append('image', image);

      if (isEdit) {
        form.append('_method', 'PUT');
        await apiFetch(`/admin/achievements/${initialData!.id}`, { method: 'POST', body: form });
        toast.success('Data prestasi diperbarui');
      } else {
        await apiFetch('/admin/achievements', { method: 'POST', body: form });
        toast.success('Data prestasi ditambahkan');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Prestasi" : "Tambah Prestasi Baru"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul Prestasi</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Juara 1 Olimpiade Sains Nasional" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tahun</label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Contoh: 2024" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Singkat</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Foto/Dokumentasi</label>
            <input
              type="file" accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100"
            />
            {preview && <img src={preview} alt="Preview" className="h-32 w-auto object-cover rounded-xl border mt-3" />}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-5 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}