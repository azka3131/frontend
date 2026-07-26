import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'
import { News } from '../news/types'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: News | null
}

export default function NewsFormDialog({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const isEdit = !!initialData
  const [loading, setLoading] = useState(false)

  // State tanpa attachments
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Kegiatan')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('Dipublikasikan')
  const [date, setDate] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!initialData) {
      setTitle('')
      setCategory('Kegiatan')
      setAuthor('')
      setStatus('Dipublikasikan')
      setDate(new Date().toISOString().substring(0, 10))
      setExcerpt('')
      setContent('')
      setImage(null)
      setPreview('')
      return
    }

    setTitle(initialData.title)
    setCategory(initialData.category || 'Kegiatan')
    setAuthor(initialData.author || '')
    setStatus(initialData.status)
    setDate(initialData.date.substring(0, 10))
    setExcerpt(initialData.excerpt || '')
    setContent(
      Array.isArray(initialData.content)
        ? initialData.content.join('\n\n')
        : initialData.content || '',
    )
    setPreview(initialData.image || '')
  }, [initialData])

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan isi wajib diisi')
      return
    }

    try {
      setLoading(true)
      const form = new FormData() 
      
      form.append('title', title)
      form.append('category', category)
      form.append('author', author)
      form.append('status', status)
      form.append('date', date)
      form.append('excerpt', excerpt)
      form.append('content', content)
      form.append('type', 'news')

      if (image) form.append('image', image)

      if (isEdit) {
        form.append('_method', 'PUT')
        await apiFetch(`/admin/news/${initialData!.id}`, { method: 'POST', body: form })
        toast.success('Berita berhasil diperbarui')
      } else {
        await apiFetch('/admin/news', { method: 'POST', body: form })
        toast.success('Berita berhasil ditambahkan')
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Gagal menyimpan berita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Berita' : 'Tambah Berita'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <select className="w-full border rounded-lg h-10 px-3 bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Program">Program</option>
                    <option value="Berita Utama">Berita Utama</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Penulis</label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full border rounded-lg h-10 px-3 bg-white" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Dipublikasikan">Dipublikasikan</option>
                    <option value="Diarsipkan">Diarsipkan</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ringkasan</label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Isi Berita</label>
            <Textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gambar Cover Berita</label>
            <div 
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
              onClick={() => document.getElementById('news-image-upload')?.click()}
            >
              <input 
                id="news-image-upload"
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={(e) => { 
                  const f = e.target.files?.[0]; 
                  if(f) { 
                    setImage(f); 
                    setPreview(URL.createObjectURL(f));
                  } 
                }} 
                className="hidden" 
              />
              {preview ? (
                 <img src={preview} alt="Preview" className="h-32 w-auto object-cover rounded-md shadow-sm" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">Klik untuk mengunggah gambar</p>
                  <p className="text-xs text-muted-foreground">Hanya menerima JPG, PNG, WEBP</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Simpan'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}