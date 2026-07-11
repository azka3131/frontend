import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
import { News } from './types'

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
    setAuthor(initialData.author)
    setStatus(initialData.status)
    setDate(initialData.date.substring(0, 10))
    setExcerpt(initialData.excerpt)
    setContent(
      Array.isArray(initialData.content)
        ? initialData.content.join('\n\n')
        : initialData.content || '',
    )
    setPreview(initialData.image || '')
  }, [initialData])

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error('Judul wajib diisi')
      return
    }
    if (!category) {
      toast.error('Kategori wajib dipilih')
      return
    }
    if (!content.trim()) {
      toast.error('Isi berita wajib diisi')
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

      if (image) {
        form.append('image', image)
      }

      if (isEdit) {
        form.append('_method', 'PUT')

        await apiFetch(`/admin/news/${initialData!.id}`, {
          method: 'POST',
          body: form,
        })

        toast.success('Berita berhasil diperbarui')
      } else {
        await apiFetch('/admin/news', {
          method: 'POST',
          body: form,
        })

        toast.success('Berita berhasil ditambahkan')
      }

      // Bersihkan state gambar setelah berhasil simpan
      setImage(null)
      setPreview('')

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
          {/* Judul */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul Berita</label>
            <Input
              placeholder="Masukkan judul berita"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Kategori */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                className="w-full border rounded-lg h-11 px-3 bg-white outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Pilih kategori</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Program">Program</option>
                <option value="Pengumuman">Pengumuman</option>
              </select>
            </div>

            {/* Penulis */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Penulis</label>
              <Input
                placeholder="Nama penulis"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Tanggal */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status Publikasi</label>
              <select
                className="w-full border rounded-lg h-11 px-3 bg-white outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Dipublikasikan">Dipublikasikan</option>
                <option value="Disematkan">Disematkan</option>
                <option value="Disembunyikan">Disembunyikan</option>
                <option value="Diarsipkan">Diarsipkan</option>
              </select>
            </div>
          </div>

          {/* Ringkasan */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ringkasan</label>
            <Textarea
              rows={3}
              placeholder="Ringkasan singkat berita..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Isi Berita */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Isi Berita</label>
            <Textarea
              rows={8}
              placeholder="Tulis isi berita di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Upload Thumbnail */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">
              Thumbnail Berita
            </label>

            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-slate-100 file:text-slate-700
                hover:file:bg-slate-200 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                // Validasi Tipe Gambar
                if (!file.type.startsWith("image/")) {
                  toast.error("File harus berupa gambar");
                  return;
                }

                // Validasi Ukuran Maksimal 2MB
                if (file.size > 2 * 1024 * 1024) {
                  toast.error("Ukuran gambar maksimal 2 MB");
                  return;
                }

                setImage(file);
                setPreview(URL.createObjectURL(file));
              }}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-sm h-52 object-cover rounded-xl border shadow mt-3"
              />
            )}
          </div>
        </div>

        {/* Tombol Simpan Full Width di Mobile */}
        <div className="flex justify-end gap-3 pt-5 border-t w-full">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !title || !category || !content}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}