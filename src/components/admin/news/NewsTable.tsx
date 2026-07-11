import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { News } from "./types";

interface Props {
  items: News[];
  onCreate: () => void;
  onEdit: (news: News) => void;
  onDelete: (news: News) => void;
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Prestasi":
      return "bg-yellow-100 text-yellow-700";
    case "Program":
      return "bg-green-100 text-green-700";
    case "Kegiatan":
      return "bg-blue-100 text-blue-700";
    case "Pengumuman":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Dipublikasikan":
      return "bg-green-100 text-green-700";
    case "Disematkan":
      return "bg-blue-100 text-blue-700";
    case "Disembunyikan":
      return "bg-gray-100 text-gray-700";
    case "Diarsipkan":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function NewsTable({
  items,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-xl font-bold">Berita</h2>
          <p className="text-sm text-muted-foreground">
            Kelola seluruh berita sekolah
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Berita
        </Button>
      </div>

      <div className="p-5 border-b">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Thumbnail</th>
              <th className="p-4 text-left">Judul</th>
              <th className="p-4 text-left">Kategori</th>
              <th className="p-4 text-left">Tanggal</th>
              <th className="p-4 text-left">Penulis</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Aksi</th>
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
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                    className="h-16 w-24 rounded-lg object-cover shadow-sm bg-slate-100"
                  />
                </td>
                <td className="p-4">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-500">/{item.slug}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">{item.author}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Tidak ada berita yang sesuai dengan "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}