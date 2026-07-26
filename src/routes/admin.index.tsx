import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'
import {
  Newspaper,
  Megaphone,
  Users,
  Image as ImageIcon,
  Trophy,
  Mail,
  Plus,
  ArrowUpRight,
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/')({
  head: () => ({
    meta: [
      { title: 'Dashboard — Admin' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: DashboardHome,
})

function DashboardHome() {
  const [statsData, setStatsData] = useState({
    news_count: 0,
    announcements_count: 0,
    teachers_count: 0,
    gallery_count: 0,
    achievements_count: 0,
    new_messages_count: 0,
  })
  
  const [activities, setActivities] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      apiFetch<{
        news_count: number
        announcements_count: number
        teachers_count: number
        gallery_count: number
        achievements_count: number
        new_messages_count: number
      }>('/admin/dashboard'),

      apiFetch<any[]>('/admin/activity-logs?limit=5'),
      
      // Mengambil data pesan beneran dari backend
      apiFetch<any>('/admin/messages')
    ])
      .then(([dashboard, activityLogs, messagesRes]) => {
        setStatsData(dashboard)
        setActivities(activityLogs)
        
        // Ambil data pesan dan pastikan bentuknya array
        const msgData = messagesRes.data ?? messagesRes;
        setRecentMessages(Array.isArray(msgData) ? msgData : [])
      })
      .catch((error) => {
        console.error(error)
        toast.error('Gagal memuat data dashboard.')
      })
  }, [])

  const stats = [
    {
      label: 'Total Berita',
      value: statsData.news_count,
      icon: Newspaper,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Total Pengumuman',
      value: statsData.announcements_count,
      icon: Megaphone,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Total Guru & Staf',
      value: statsData.teachers_count,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Total Foto Galeri',
      value: statsData.gallery_count,
      icon: ImageIcon,
      color: 'text-pink-600 bg-pink-50',
    },
    {
      label: 'Total Prestasi',
      value: statsData.achievements_count,
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Total Pesan',
      value: statsData.new_messages_count,
      icon: Mail,
      color: 'text-violet-600 bg-violet-50',
    },
  ]

  const quickActions = [
    { label: 'Tulis Berita', to: '/admin/news' },
    { label: 'Buat Pengumuman', to: '/admin/announcements' },
    { label: 'Tambah Slider', to: '/admin/hero' },
    { label: 'Unggah Galeri', to: '/admin/gallery' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl ${s.color}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
            <Badge variant="secondary">{activities.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {activities.length === 0 ? (
                <li className="p-6 text-center text-sm text-muted-foreground">Tidak ada aktivitas.</li>
              ) : (
                activities.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 px-6 py-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {a.user?.name ?? 'System'}
                        </span>{' '}
                        <span className="text-muted-foreground">{a.action}</span>{' '}
                        <span className="font-medium">{a.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {quickActions.map((q) => (
              <Button
                key={q.to}
                asChild
                variant="outline"
                className="justify-start"
              >
                <Link to={q.to}>
                  <Plus className="mr-2 h-4 w-4" />
                  {q.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pesan Terbaru</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/messages">
              Lihat semua <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {recentMessages.length === 0 ? (
              <li className="p-6 text-center text-sm text-muted-foreground">Belum ada pesan masuk.</li>
            ) : (
              recentMessages.slice(0, 4).map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-start gap-3 px-6 py-3"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-sm font-bold uppercase">
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{m.name}</p>
                      {/* Asumsikan status 0 atau false berarti belum dibaca */}
                      {(!m.is_read || m.is_read === 0) && <Badge className="h-5">Baru</Badge>}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(m.created_at || m.date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {m.message}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}