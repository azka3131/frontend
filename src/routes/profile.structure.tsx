import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Network } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/profile/structure")({
  head: () => ({ meta: [{ title: "Struktur Organisasi — SDN Dukuhbenda 02" }] }),
  component: Structure,
});

function Structure() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<any>('/profile/structure');
        const data = response.data ?? response;
        if (data && data.length > 0 && data[0].photo) {
          setPhoto(data[0].photo);
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHeader title="Struktur Organisasi" subtitle="Susunan kepemimpinan dan tata kelola sekolah." />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Memuat bagan...</div>
        ) : photo ? (
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg bg-white p-4">
            <img 
              src={photo.startsWith('http') ? photo : `http://127.0.0.1:8000${photo}`} 
              alt="Bagan Struktur Organisasi" 
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border-2 border-dashed border-border bg-secondary/50 shadow-[var(--shadow-card)]">
            <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Network className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold text-foreground">Bagan Belum Tersedia</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Administrator belum mengunggah gambar bagan struktur organisasi.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}