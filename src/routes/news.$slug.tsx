import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { NewsArticleView } from "@/components/NewsArticleView";
import { apiFetch } from "@/lib/api";
import type { News } from "@/components/admin/news/types";

export const Route = createFileRoute("/news/$slug")({
  // Catatan: Karena kita sekarang mengambil data dari API, tag <head> 
  // dibuat statis sementara agar tidak memicu error saat rendering awal.
  head: () => {
    return {
      meta: [
        { title: "Berita — SDN Dukuhbenda 02" },
        { name: "description", content: "Berita SDN Dukuhbenda 02." },
      ],
    };
  },
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Mengambil detail berita berdasarkan slug
        const data = await apiFetch<News>(`/news/${slug}`);
        setArticle(data);
      } catch (err) {
        console.error("Gagal memuat detail berita:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-32 text-gray-500">Memuat artikel...</div>;
  }

  if (error || !article) {
    return <div className="text-center py-32 text-gray-500 font-semibold">Berita tidak ditemukan.</div>;
  }

  return (
    <NewsArticleView article={article as any} backTo="/news/school" backLabel="Berita Sekolah" />
  );
}