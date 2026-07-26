import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttachmentList, type Attachment } from "@/components/AttachmentList";
import { apiFetch } from "@/lib/api";

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  image: string;
  category: string;
  date: string;
  author: string;
  type: string;
  attachments?: Attachment[];
}

export const Route = createFileRoute("/announcements/$slug")({
  loader: async ({ params }) => {
    let article: NewsArticle;

    try {
      article = await apiFetch<NewsArticle>(`/news/${params.slug}`);
    } catch {
      throw notFound();
    }

    if (article.type !== "announcement") {
      throw notFound();
    }

    return { article };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.article.title} — SDN Dukuhbenda 02`
          : "Pengumuman — SDN Dukuhbenda 02",
      },
      {
        name: "description",
        content: loaderData?.article.excerpt ?? "Pengumuman resmi sekolah.",
      },
    ],
  }),
  component: AnnouncementDetail,
});

function AnnouncementDetail() {
  const { article } = Route.useLoaderData();

  return (
    <article className="bg-background">
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-3xl px-4 pb-10 text-primary-foreground sm:px-6 lg:px-8">
            <Badge variant="secondary" className="text-primary">
              {article.category}
            </Badge>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/85">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {article.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-primary">
                Beranda
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li>
              <Link to="/announcements" className="hover:text-primary">
                Pengumuman
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li className="truncate text-foreground" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <p className="mt-8 text-lg font-medium text-foreground/90">{article.excerpt}</p>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
          {article.content?.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {article.attachments && article.attachments.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Lampiran</h2>
            <AttachmentList attachments={article.attachments} />
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6">
          <Button asChild variant="ghost">
            <Link to="/announcements">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Pengumuman
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}