import { createFileRoute, notFound } from "@tanstack/react-router";
import { NewsArticleView } from "@/components/NewsArticleView";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/news/announcements/$slug")({
  // Ambil data langsung dari backend berdasarkan slug di URL
  loader: async ({ params }) => {
    try {
      const res = await apiFetch<any>(`/news/${params.slug}`);
      const data = res.data ?? res;
      if (!data) throw notFound();
      return data;
    } catch (error) {
      throw notFound();
    }
  },
  // Data dari loader langsung dipakai untuk SEO / Title tab browser
  head: ({ loaderData }) => {
    const article = loaderData;
    return {
      meta: [
        {
          title: article
            ? `${article.title} — SDN Dukuhbenda 02`
            : "Pengumuman — SDN Dukuhbenda 02",
        },
        { name: "description", content: article?.excerpt ?? "Pengumuman resmi sekolah." },
      ],
    };
  },
  component: AnnouncementDetail,
});

function AnnouncementDetail() {
  // Panggil data yang sudah ditarik oleh loader tadi
  const article = Route.useLoaderData();
  
  return (
    <NewsArticleView 
       article={article} 
       backTo="/news/announcements" 
       backLabel="Pengumuman" 
    />
  );
}