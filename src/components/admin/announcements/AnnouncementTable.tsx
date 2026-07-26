import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { News } from '../news/types' // Kita pakai tipe data yang sama dengan News

interface Props {
  items: News[]
  onCreate: () => void
  onEdit: (item: News) => void
  onDelete: (item: News) => void
  onStatusChange: (id: number, newStatus: string) => void
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Dipublikasikan':
      return 'bg-green-100 text-green-700'
    case 'Disematkan':
      return 'bg-blue-100 text-blue-700'
    case 'Disembunyikan':
      return 'bg-gray-100 text-gray-700'
    case 'Diarsipkan':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function AnnouncementTable({
  items,
  onCreate,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Semua')

  const statuses = ['Semua', 'Dipublikasikan', 'Diarsipkan']

  const counts = {
    Semua: items.length,
    Disematkan: items.filter((i) => i.status === 'Disematkan').length,
    Dipublikasikan: items.filter((i) => i.status === 'Dipublikasikan').length,
    Disembunyikan: items.filter((i) => i.status === 'Disembunyikan').length,
    Diarsipkan: items.filter((i) => i.status === 'Diarsipkan').length,
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesTab = activeTab === 'Semua' || item.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-xl font-bold">Pengumuman</h2>
          <p className="text-sm text-muted-foreground">
            Kelola seluruh pengumuman sekolah
          </p>
        </div>
      </div>

      <div className="p-5 border-b space-y-4">
        <div className="inline-flex items-center p-1 space-x-1 bg-slate-50 border rounded-xl overflow-x-auto max-w-full">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === status
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === status
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {counts[status as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cari pengumuman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={onCreate} className="rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left font-medium text-gray-500">
                Thumbnail
              </th>
              <th className="p-4 text-left font-medium text-gray-500">Judul</th>
              <th className="p-4 text-left font-medium text-gray-500">
                Tanggal
              </th>
              <th className="p-4 text-left font-medium text-gray-500">
                Status
              </th>
              <th className="p-4 text-center font-medium text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-4">
                  <img
                    src={
                      item.image ||
                      'https://via.placeholder.com/150?text=No+Image'
                    }
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src =
                        'https://via.placeholder.com/150?text=No+Image'
                    }}
                    className="h-16 w-24 rounded-lg object-cover shadow-sm bg-slate-100"
                  />
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-400">/{item.slug}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </td>
                <td className="p-4">
                  <Select
                    defaultValue={item.status}
                    onValueChange={(value) => onStatusChange(item.id, value)}
                  >
                    <SelectTrigger
                      className={`w-[145px] h-8 rounded-full border-0 font-semibold text-xs focus:ring-0 focus:ring-offset-0 ${getStatusColor(item.status)}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dipublikasikan">
                        Dipublikasikan
                      </SelectItem>
                      <SelectItem value="Diarsipkan" className="text-red-600">
                        Diarsipkan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Tidak ada pengumuman yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
