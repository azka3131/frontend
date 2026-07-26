import { useState } from "react";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Teacher {
  id: number;
  name: string;
  position: string;
  bio: string;
  photo: string | null;
  order: number;
}

interface Props {
  items: Teacher[];
  onCreate: () => void;
  onEdit: (item: Teacher) => void;
  onDelete: (item: Teacher) => void;
}

export default function TeacherTable({ items, onCreate, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

  // Pencarian berdasarkan nama atau jabatan
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-xl font-bold">Guru & Staf</h2>
          <p className="text-sm text-muted-foreground">Kelola daftar tenaga pendidik</p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Guru
        </Button>
      </div>

      <div className="p-5 border-b">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cari nama atau jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left font-medium text-gray-500">Foto</th>
              <th className="p-4 text-left font-medium text-gray-500">Nama</th>
              <th className="p-4 text-left font-medium text-gray-500">Jabatan</th>
              <th className="p-4 text-center font-medium text-gray-500">Urutan</th>
              <th className="p-4 text-center font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50 transition">
                <td className="p-4">
                  <img
                    src={item.photo || "https://via.placeholder.com/150?text=Foto"}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://via.placeholder.com/150?text=Foto";
                    }}
                    className="h-12 w-12 rounded-full object-cover shadow-sm bg-slate-100"
                  />
                </td>
                <td className="p-4 font-semibold text-gray-800">{item.name}</td>
                <td className="p-4 text-gray-600">{item.position}</td>
                <td className="p-4 text-center font-bold text-blue-600">{item.order}</td>
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
                <td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada data guru.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}