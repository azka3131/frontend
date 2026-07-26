import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Guru & Staf — SDN Dukuhbenda 02" },
      { name: "description", content: "Mengenal lebih dekat para pendidik dan staf di SDN Dukuhbenda 02." },
    ],
  }),
  component: TeachersPage,
});

// Hapus field 'active'
interface Teacher {
  id: number;
  name: string;
  position: string;
  bio: string;
  photo: string | null;
  order: number;
}

function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await apiFetch<any>('/teachers');
        let data = response.data ?? response;
        
        // KUNCI PERBAIKAN: Mengurutkan data berdasarkan urutan secara otomatis (Ascending)
        data.sort((a: Teacher, b: Teacher) => a.order - b.order);
        
        setTeachers(data);
      } catch (error) {
        console.error("Gagal mengambil data guru:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <>
      <PageHeader
        title="Guru & Staf"
        subtitle="Mengenal lebih dekat para pendidik dan staf yang berdedikasi."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Memuat data guru...</div>
        ) : teachers.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm transition-all hover:shadow-[var(--shadow-card)]"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={t.photo || "https://via.placeholder.com/400x500?text=Foto+Guru"}
                    alt={t.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://via.placeholder.com/400x500?text=Foto+Guru";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold leading-tight">{t.name}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">{t.position}</p>
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">Belum ada data guru.</div>
        )}
      </section>
    </>
  );
}