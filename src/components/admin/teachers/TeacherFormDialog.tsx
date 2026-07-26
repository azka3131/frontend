import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'

// Tambahkan totalItems di props (default 0 jika kosong)
export default function TeacherFormDialog({ open, onClose, onSuccess, initialData, totalItems = 0 }: any) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);

  // RUMUS DINAMIS URUTAN: 
  // Jika Edit -> Maksimal urutan adalah total data saat ini.
  // Jika Tambah Baru -> Maksimal urutan adalah total data + 1.
  const maxAvailableOrder = isEdit ? Math.max(totalItems, 1) : totalItems + 1;

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [order, setOrder] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!initialData) {
        setName(''); 
        setPosition(''); 
        setBio(''); 
        // Otomatis arahkan ke angka urutan paling ujung saat mau tambah guru baru
        setOrder(maxAvailableOrder); 
        setPhoto(null); 
        setPreview(''); 
        return;
    }
    setName(initialData.name);
    setPosition(initialData.position);
    setBio(initialData.bio || '');
    setOrder(initialData.order || 1);
    setPreview(initialData.photo || '');
  }, [initialData, open, maxAvailableOrder]);

  async function handleSubmit() {
    if (!name.trim() || !position.trim()) {
      toast.error('Nama dan Jabatan wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append('name', name);
      form.append('position', position);
      form.append('bio', bio);
      form.append('order', order.toString());
      form.append('active', '1'); 

      if (photo) form.append('photo', photo);

      if (isEdit) {
        form.append('_method', 'PUT');
        await apiFetch(`/admin/teachers/${initialData.id}`, { method: 'POST', body: form });
        toast.success('Data guru diperbarui');
      } else {
        await apiFetch('/admin/teachers', { method: 'POST', body: form });
        toast.success('Data guru ditambahkan');
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
            <DialogTitle>{isEdit ? "Edit Data Guru" : "Tambah Guru Baru"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Dra. Siti Rahmawati" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Jabatan</label>
            <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Contoh: Kepala Sekolah" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio Singkat</label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Urutan Tampil</label>
            <select 
              className="w-full border rounded-lg h-10 px-3 bg-white" 
              value={order} 
              onChange={(e) => setOrder(Number(e.target.value))}
            >
              {/* Opsi yang dirender sekarang dijamin mentok di batas logika yang Anda buat */}
              {Array.from({ length: maxAvailableOrder }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>Urutan ke-{num}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Foto Profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPhoto(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100"
            />
            {preview && <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-full border mt-3" />}
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