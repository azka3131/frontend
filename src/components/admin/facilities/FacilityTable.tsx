import { useState } from "react";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Facility {
  id: number;
  title: string;
  description: string;
  image: string | null;
  order: number;
}

interface Props {
  items: Facility[];
  onCreate: () => void;
  onEdit: (item: Facility) => void;
  onDelete: (item: Facility) => void;
}

// FUNGSI PINTAR UNTUK MEMBACA URL GAMBAR
const getImageUrl = (path: string | null) => {
  if (!path) return "https://placehold.co/150x100/e2e8f0/64748b?text=No+Foto";
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};

export default function FacilityTable({ items, onCreate, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");
  
  const filteredItems = items.filter((item) => 
    (item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-xl font-bold">Fasilitas Sekolah</h2>
          <p className="text-sm text-muted-foreground">Kelola daftar fasilitas dan infrastruktur</p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Fasilitas
        </Button>
      </div>

      <div className="p-5 border-b">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cari fasilitas..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left font-medium text-gray-500">Gambar</th>
              <th className="p-4 text-left font-medium text-gray-500">Nama Fasilitas</th>
              <th className="p-4 text-center font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50 transition">
                <td className="p-4">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = "https://placehold.co/150x100/e2e8f0/64748b?text=Error"; 
                    }}
                    className="h-16 w-24 rounded-lg object-cover shadow-sm bg-slate-100"
                  />
                </td>
                <td className="p-4 font-semibold text-gray-800">{item.title}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="text-gray-500 hover:text-blue-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="text-gray-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">Tidak ada data fasilitas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}