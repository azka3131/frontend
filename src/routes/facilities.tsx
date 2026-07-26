import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Fasilitas — SDN Dukuhbenda 02" },
      { name: "description", content: "Fasilitas dan infrastruktur di SDN Dukuhbenda 02." },
    ],
  }),
  component: FacilitiesPage,
});
interface Facility {
  id: number;
  title: string; // Selaras dengan database
  description: string;
  image: string | null;
  order: number;
}

function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await apiFetch<any>('/facilities');
        let data = response.data ?? response;
        
        // Memastikan fasilitas diurutkan secara otomatis dari angka terkecil ke terbesar
        data.sort((a: Facility, b: Facility) => a.order - b.order);
        
        setFacilities(data);
      } catch (error) {
        console.error("Gagal mengambil data fasilitas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <>
      <PageHeader
        title="Fasilitas Sekolah"
        subtitle="Infrastruktur dan ruang pendukung untuk memaksimalkan potensi siswa."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Memuat data fasilitas...</div>
        ) : facilities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <Card
                key={f.id}
                className="group overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={f.image || "https://via.placeholder.com/600x400?text=Fasilitas"}
                    alt={f.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://via.placeholder.com/600x400?text=Fasilitas";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold leading-snug text-gray-900">{f.title}</h3>
                  {f.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {f.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">Belum ada data fasilitas.</div>
        )}
      </section>
    </>
  );
}