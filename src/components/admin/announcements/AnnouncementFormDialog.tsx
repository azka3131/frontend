import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

export default function AnnouncementFormDialog({ open, onClose, onSuccess, initialData }: Props) {
  const isEdit = !!initialData
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Dipublikasikan')
  const [date, setDate] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<FileList | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!initialData) {
      setTitle(''); setStatus('Dipublikasikan'); setDate(new Date().toISOString().substring(0, 10))
      setExcerpt(''); setContent(''); setImage(null); setPreview(''); return
    }
    setTitle(initialData.title)
    setStatus(initialData.status)
    setDate(initialData.date.substring(0, 10))
    setExcerpt(initialData.excerpt || '')
    setContent(Array.isArray(initialData.content) ? initialData.content.join('\n\n') : initialData.content || '')
    setPreview(initialData.image || '')
  }, [initialData])

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan isi pengumuman wajib diisi')
      return
    }

    try {
      setLoading(true)
      const form = new FormData() // FORM HARUS DIBUAT DI SINI
      form.append('title', title)
      form.append('status', status)
      form.append('date', date)
      form.append('excerpt', excerpt)
      form.append('content', content)
      form.append('type', 'announcement')

      if (image) form.append('image', image)

      // Baru lampirkan file setelah form dibuat
      if (attachments) {
        Array.from(attachments).forEach((file) => {
          form.append('attachments[]', file)
        })
      }

      if (isEdit) {
        form.append('_method', 'PUT')
        await apiFetch(`/admin/news/${initialData!.id}`, { method: 'POST', body: form })
        toast.success('Pengumuman diperbarui')
      } else {
        await apiFetch('/admin/news', { method: 'POST', body: form })
        toast.success('Pengumuman ditambahkan')
      }

      onSuccess(); onClose()
    } catch (err) {
      toast.error('Gagal menyimpan pengumuman')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</DialogTitle></DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2"><label className="text-sm font-medium">Judul</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2"><label className="text-sm font-medium">Tanggal</label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full border rounded-lg h-10 px-3" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Dipublikasikan">Dipublikasikan</option>
                    <option value="Diarsipkan">Diarsipkan</option>
                </select>
             </div>
          </div>
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Lampiran (PDF, DOCX, ZIP)</label>
            <input type="file" multiple onChange={(e) => setAttachments(e.target.files)} className="block w-full text-sm" />
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Isi</label><Textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Gambar</label><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { setImage(f); setPreview(URL.createObjectURL(f)) } }} /></div>
        </div>
        <div className="flex justify-end gap-3 pt-5 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Simpan'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}