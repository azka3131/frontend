import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'
import type { Facility } from './FacilityTable'

interface Props { open: boolean; onClose: () => void; onSuccess: () => void; initialData?: Facility | null; }

export default function FacilityFormDialog({ open, onClose, onSuccess, initialData }: Props) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!initialData) {
        setTitle(''); setDescription(''); setImage(null); setPreview(''); return;
    }
    setTitle(initialData.title || '');
    setDescription(initialData.description || '');
    setPreview(initialData.image || '');
  }, [initialData, open]);

  async function handleSubmit() {
    if (!title.trim()) return toast.error('Nama fasilitas wajib diisi');
    try {
      setLoading(true);
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('order', '1'); // Memaksa urutan 0
      if (image) form.append('image', image);
      if (isEdit) form.append('_method', 'PUT');

      const url = isEdit ? `/admin/facilities/${initialData.id}` : '/admin/facilities';
      await apiFetch(url, { method: 'POST', body: form });
      
      toast.success(`Fasilitas ${isEdit ? 'diperbarui' : 'ditambahkan'}`);
      onSuccess(); onClose();
    } catch { toast.error('Gagal menyimpan data'); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{isEdit ? "Edit Fasilitas" : "Tambah Fasilitas"}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Fasilitas</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Laboratorium Komputer" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Singkat</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Foto Fasilitas</label>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)); } }} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100" />
            {preview && <img src={preview} alt="Preview" className="h-32 w-auto object-cover rounded-xl border mt-3" />}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-5 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null} Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}