import { useState } from "react";
import { Pencil, Trash2, Search, Plus, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface GalleryImage {
  id: number;
  url: string;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  cover: string;
  order: number;
  images: GalleryImage[];
}

interface Props {
  items: GalleryAlbum[];
  onCreate: () => void;
  onEdit: (item: GalleryAlbum) => void;
  onDelete: (item: GalleryAlbum) => void;
}

export default function GalleryTable({ items, onCreate, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const filteredItems = items.filter((item) => 
    (item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-xl font-bold">Galeri Sekolah</h2>
          <p className="text-sm text-muted-foreground">Kelola album foto dan dokumentasi kegiatan</p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Album
        </Button>
      </div>

      <div className="p-5 border-b">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cari nama album..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left font-medium text-gray-500">Sampul Album</th>
              <th className="p-4 text-left font-medium text-gray-500">Nama Album</th>
              <th className="p-4 text-center font-medium text-gray-500">Jumlah Foto</th>
              <th className="p-4 text-center font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50 transition">
                <td className="p-4">
                  {/* --- PERBAIKAN URL GAMBAR --- */}
                  <img
                    src={
                      item.cover 
                        ? (item.cover.startsWith('http') ? item.cover : `http://127.0.0.1:8000${item.cover}`) 
                        : "https://placehold.co/150x150/e2e8f0/64748b?text=No+Cover"
                    } 
                    alt={item.title}
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = "https://placehold.co/150x150/e2e8f0/64748b?text=No+Cover"; 
                    }}
                    className="h-16 w-24 rounded-lg object-cover shadow-sm bg-slate-100"
                  />
                </td>
                <td className="p-4 font-semibold text-gray-800">{item.title}</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700">
                    <Images className="h-3.5 w-3.5" />
                    {item.images?.length || 0}
                  </span>
                </td>
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
                <td colSpan={5} className="p-8 text-center text-gray-500">Belum ada album galeri.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}