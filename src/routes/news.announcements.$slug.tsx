import { createFileRoute, notFound } from "@tanstack/react-router";
import { findNews } from "@/lib/data";
import { NewsArticleView } from "@/components/NewsArticleView";

export const Route = createFileRoute("/news/announcements/$slug")({
  head: ({ params }) => {
    const article = findNews(params.slug);
    return {
      meta: [
        {
          title: article
            ? `${article.title} — SD Cendekia Harapan`
            : "Pengumuman — SD Cendekia Harapan",
        },
        { name: "description", content: article?.excerpt ?? "Pengumuman resmi sekolah." },
      ],
    };
  },
  component: AnnouncementDetail,
});

function AnnouncementDetail() {
  const { slug } = Route.useParams();
  const article = findNews(slug);
  if (!article || article.type !== "announcement") throw notFound();
  return (
    <NewsArticleView article={article} backTo="/news/announcements" backLabel="Pengumuman" />
  );
}
