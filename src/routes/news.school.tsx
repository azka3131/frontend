import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { NewsGrid } from "@/components/NewsGrid";
import { apiFetch } from "@/lib/api";
import type { News } from "@/components/admin/news/types";

export const Route = createFileRoute("/news/school")({
  head: () => ({
    meta: [
      { title: "Berita Sekolah — SDN Dukuhbenda 02" },
      {
        name: "description",
        content: "Kegiatan dan kabar terbaru dari komunitas SDN Dukuhbenda 02.",
      },
    ],
  }),
  component: SchoolNews,
});

function SchoolNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Mengambil data dari API publik (tanpa parameter admin=true)
        const response = await apiFetch<any>('/news?type=news');
        // Laravel mengembalikan paginasi, jadi kita ambil array 'data'-nya
        setNews(response.data ?? response);
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <PageHeader
        title="Berita Sekolah"
        subtitle="Ikuti cerita dan kabar terbaru dari komunitas kami."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Memuat berita...</div>
        ) : news.length > 0 ? (
          <NewsGrid items={news} basePath="/news" />
        ) : (
          <div className="text-center py-20 text-gray-500">Belum ada berita yang dipublikasikan.</div>
        )}
      </section>
    </>
  );
}