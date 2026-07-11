import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import NewsFormDialog from '@/components/admin/news/NewsFormDialog'

import { apiFetch } from '@/lib/api'
import { AdminLayout } from '@/components/admin/AdminLayout'
import NewsTable from '@/components/admin/news/NewsTable'
import type { News } from '@/components/admin/news/types'

export const Route = createFileRoute('/admin/news')({
  head: () => ({
    meta: [{ title: 'Berita — Admin' }, { name: 'robots', content: 'noindex' }],
  }),
  component: NewsAdmin,
})

function NewsAdmin() {
  const [items, setItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const response = await apiFetch<any>('/news?type=news&admin=true')
      const data = response.data ?? response
      setItems(data)
    } catch (error) {
      console.error(error)
      toast.error('Gagal memuat data berita.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Berita" breadcrumbs={[{ label: 'Berita' }]}>
      {loading ? (
        <div className="p-8 text-center">Memuat data...</div>
      ) : (
        // 👇 Tambahkan React Fragment di sini
        <>
          <NewsTable
            items={items}
            onCreate={() => {
              setSelectedNews(null)
              setOpen(true)
            }}
            onEdit={(news) => {
              setSelectedNews(news)
              setOpen(true)
            }}
            onDelete={async (news) => {
              if (!confirm(`Hapus "${news.title}"?`)) return

              try {
                await apiFetch(`/admin/news/${news.id}`, {
                  method: 'DELETE',
                })

                toast.success('Berita berhasil dihapus')
                loadNews()
              } catch (err) {
                toast.error('Gagal menghapus berita')
              }
            }}
          />
          <NewsFormDialog
            open={open}
            initialData={selectedNews}
            onClose={() => setOpen(false)}
            onSuccess={loadNews}
          />
        </>
        // 👆 Tutup Fragment di sini
      )}
    </AdminLayout>
  )
}