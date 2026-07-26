import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Prestasi — SDN Dukuhbenda 02" },
      { name: "description", content: "Pencapaian dan penghargaan SDN Dukuhbenda 02." },
    ],
  }),
  component: Achievements,
});

interface Achievement {
  id: number;
  title: string;
  year: string;
  description: string;
  image: string | null;
  order: number;
}

// FUNGSI PINTAR: Menangani URL gambar dari backend dan anti spasi kosong
const getImageUrl = (path: string | null | undefined) => {
  if (!path || path.trim() === "") return "https://placehold.co/600x400/e2e8f0/64748b?text=Prestasi";
  if (path.trim().startsWith('http')) return path.trim();
  return `http://127.0.0.1:8000${path.trim()}`;
};

function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await apiFetch<any>('/achievements');
        let data = response.data ?? response;
        
        // Memastikan data diurutkan berdasarkan 'order' di frontend
        data.sort((a: Achievement, b: Achievement) => a.order - b.order);
        
        setAchievements(data);
      } catch (error) {
        console.error("Gagal mengambil data prestasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <>
      <PageHeader
        title="Prestasi"
        subtitle="Buah dari kerja keras siswa, guru, dan dukungan orang tua."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Memuat data prestasi...</div>
        ) : achievements.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => (
              <Card
                key={a.id}
                className="group overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={getImageUrl(a.image)}
                    alt={a.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Prestasi";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground shadow-sm">
                    {a.year}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-snug">{a.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">Belum ada data prestasi.</div>
        )}
      </section>
    </>
  );
}