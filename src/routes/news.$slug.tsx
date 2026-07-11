import { createFileRoute, notFound } from "@tanstack/react-router";
import { findNews } from "@/lib/data";
import { NewsArticleView } from "@/components/NewsArticleView";

export const Route = createFileRoute("/news/$slug")({
  head: ({ params }) => {
    const article = findNews(params.slug);
    return {
      meta: [
        {
          title: article
            ? `${article.title} — SD Cendekia Harapan`
            : "Berita — SD Cendekia Harapan",
        },
        { name: "description", content: article?.excerpt ?? "Berita SD Cendekia Harapan." },
      ],
    };
  },
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const article = findNews(slug);
  if (!article || article.type !== "news") throw notFound();
  return (
    <NewsArticleView article={article} backTo="/news/school" backLabel="Berita Sekolah" />
  );
}
