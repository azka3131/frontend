import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { NewsGrid } from "@/components/NewsGrid";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/news/announcements/")({
  head: () => ({
    meta: [
      { title: "Pengumuman — SDN Dukuhbenda 02" },
      { name: "description", content: "Pengumuman resmi dari SDN Dukuhbenda 02." },
    ],
  }),
  component: Announcements,
});

function Announcements() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await apiFetch<any>('/announcements'); 
        const data = res.data?.data || res.data || res || [];
        
        // Filter: Hanya tampilkan berita yang kategorinya "Pengumuman"
        setItems(data);
      } catch (error) {
        console.error("Gagal memuat pengumuman:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <PageHeader
        title="Pengumuman"
        subtitle="Informasi resmi untuk orang tua, siswa, dan masyarakat."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Belum ada pengumuman saat ini.
          </div>
        ) : (
          <NewsGrid items={items} basePath="/news/announcements" />
        )}
      </section>
    </>
  );
}