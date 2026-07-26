import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'

export default function TeacherForm({ item, onClose, onSuccess }: any) {
  const isEdit = !!item;
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(item?.name || '');
  const [position, setPosition] = useState(item?.position || '');
  const [bio, setBio] = useState(item?.bio || '');
  const [order, setOrder] = useState(item?.order || 1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState(item?.photo || '');

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
      
      // Kita kirim "1" di balik layar agar backend Laravel tidak rewel
      form.append('active', '1'); 

      if (photo) form.append('photo', photo);

      if (isEdit) {
        form.append('_method', 'PUT');
        await apiFetch(`/admin/teachers/${item.id}`, { method: 'POST', body: form });
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
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nama Lengkap</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Budi Santoso, S.Pd." />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Jabatan</label>
        <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Contoh: Guru Matematika" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bio Singkat</label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Urutan Tampil</label>
        <Input 
          type="number" 
          min="1" // Mencegah angka minus atau nol di antarmuka HTML
          value={order} 
          onChange={(e) => {
            const val = parseInt(e.target.value);
            // Validasi di React: Jika dihapus/bukan angka atau di bawah 1, paksakan jadi 1
            setOrder(isNaN(val) || val < 1 ? 1 : val);
          }} 
        />
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
        {preview && <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-full border mt-3" />}
      </div>

      <div className="flex justify-end gap-3 pt-5 border-t">
        <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          Simpan
        </Button>
      </div>
    </div>
  )
}