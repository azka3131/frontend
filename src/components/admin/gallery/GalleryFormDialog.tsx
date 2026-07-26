import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, ImagePlus, X, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'
import type { GalleryAlbum, GalleryImage } from './GalleryTable'

interface Props { 
  open: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
  initialData?: GalleryAlbum | null; 
}

export default function GalleryFormDialog({ open, onClose, onSuccess, initialData }: Props) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  // State khusus untuk menampung foto yang sudah ada dari database
  const [existingImages, setExistingImages] = useState<GalleryImage[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initialData) {
      setTitle(''); setFiles([]); setExistingImages([]); return;
    }
    setTitle(initialData.title);
    setFiles([]);
    setExistingImages(initialData.images || []);
  }, [initialData, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Fungsi menembak API hapus foto spesifik
  const removeExistingImage = async (imageId: number) => {
    if (!confirm('Hapus foto ini secara permanen dari album?')) return;
    try {
      // Pastikan endpoint ini sesuai dengan routes/api.php Anda
      await apiFetch(`/admin/gallery/${initialData!.id}/images/${imageId}`, { method: 'DELETE' });
      
      // Hilangkan gambar dari layar seketika tanpa harus memuat ulang
      setExistingImages((prev) => prev.filter(img => img.id !== imageId));
      toast.success('Foto berhasil dihapus');
      onSuccess(); // Diam-diam memperbarui jumlah foto di tabel belakang layar
    } catch (error) {
      toast.error('Gagal menghapus foto');
    }
  };

  async function handleSubmit() {
    if (!title.trim()) return toast.error('Nama Album wajib diisi');
    if (existingImages.length === 0 && files.length === 0) return toast.error('Pilih minimal 1 foto untuk album ini');

    try {
      setLoading(true);
      const form = new FormData();
      form.append('title', title);
      files.forEach((file) => form.append('images[]', file));

      if (isEdit) {
        form.append('_method', 'PUT');
        await apiFetch(`/admin/gallery/${initialData.id}`, { method: 'POST', body: form });
        toast.success('Album berhasil diperbarui!');
      } else {
        await apiFetch('/admin/gallery', { method: 'POST', body: form });
        toast.success('Album baru berhasil ditambahkan!');
      }
      
      onSuccess(); onClose();
    } catch { 
      toast.error('Gagal menyimpan data album'); 
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Album' : 'Tambah Album'}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {isEdit ? 'Ubah nama album, hapus foto lama, atau unggah foto tambahan baru.' : 'Unggah beberapa foto sekaligus untuk membuat album.'}
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Album</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Kegiatan Belajar" />
          </div>

          {/* MENAMPILKAN PREVIEW FOTO LAMA (MODE EDIT) */}
          {isEdit && existingImages.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Foto di Album Ini ({existingImages.length})</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border bg-slate-100 group shadow-sm">
                    <img 
                      src={img.url.startsWith('http') ? img.url : `http://127.0.0.1:8000${img.url}`} 
                      alt="Existing" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(img.id)} 
                        className="bg-red-500 text-white rounded-full p-2.5 hover:bg-red-600 transition hover:scale-110 shadow-lg"
                        title="Hapus Foto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AREA UNGGAH FOTO BARU */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{isEdit ? 'Unggah Foto Baru' : `Pilih Foto (${files.length} dipilih)`}</label>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                + Tambah Foto
              </Button>
            </div>

            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${files.length > 0 ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 cursor-pointer'}`}
              onClick={() => files.length === 0 && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
              
              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                  <ImagePlus className="h-10 w-10 mb-3 text-gray-400" />
                  <p className="font-semibold text-gray-700">Tarik & Lepas Foto ke Sini</p>
                  <p className="text-xs mt-1">Mendukung format PNG, JPG, WEBP</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-white shadow-sm group">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t mt-6 bg-white sticky bottom-0">
          <Button variant="ghost" onClick={() => { setFiles([]); setTitle(''); }}>Reset</Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {isEdit ? 'Simpan Perubahan' : 'Simpan Album'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}