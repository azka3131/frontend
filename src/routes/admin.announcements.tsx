import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AnnouncementFormDialog from '@/components/admin/announcements/AnnouncementFormDialog'
import { apiFetch } from '@/lib/api'
import { AdminLayout } from '@/components/admin/AdminLayout'
import AnnouncementTable from '@/components/admin/announcements/AnnouncementTable'
import type { News } from '@/components/admin/news/types'

export const Route = createFileRoute('/admin/announcements')({
  head: () => ({ meta: [{ title: 'Pengumuman — Admin' }, { name: 'robots', content: 'noindex' }] }),
  component: AnnouncementsAdmin,
})

function AnnouncementsAdmin() {
  const [items, setItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<News | null>(null)

  useEffect(() => { loadItems() }, [])

  const loadItems = async () => {
    try {
      // Mengambil HANYA yang type-nya announcement
      const response = await apiFetch<any>('/news?type=announcement&admin=true')
      setItems(response.data ?? response)
    } catch (error) {
      toast.error('Gagal memuat data pengumuman.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await apiFetch(`/admin/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      toast.success(`Status diubah menjadi ${newStatus}`)
      loadItems()
    } catch (err) {
      toast.error('Gagal mengubah status')
    }
  }

  return (
    <AdminLayout title="Pengumuman" breadcrumbs={[{ label: 'Pengumuman' }]}>
      {loading ? (
        <div className="p-8 text-center">Memuat data...</div>
      ) : (
        <>
          <AnnouncementTable
            items={items}
            onCreate={() => { setSelectedItem(null); setOpen(true) }}
            onEdit={(item) => { setSelectedItem(item); setOpen(true) }}
            onDelete={async (item) => {
              if (!confirm(`Hapus "${item.title}"?`)) return
              try {
                await apiFetch(`/admin/news/${item.id}`, { method: 'DELETE' })
                toast.success('Pengumuman dihapus')
                loadItems()
              } catch (err) { toast.error('Gagal menghapus') }
            }}
            onStatusChange={handleStatusChange}
          />
          <AnnouncementFormDialog open={open} initialData={selectedItem} onClose={() => setOpen(false)} onSuccess={loadItems} />
        </>
      )}
    </AdminLayout>
  )
}