import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttachmentList, type Attachment } from "@/components/AttachmentList";

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
  type?: string;
  attachments?: Attachment[];
}

interface Props {
  article: NewsArticle;
  backTo: "/news/school" | "/news/announcements";
  backLabel: string;
}

export function NewsArticleView({ article, backTo, backLabel }: Props) {
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

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-lg font-medium text-foreground/90">{article.excerpt}</p>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
          {article.content?.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {article.attachments && article.attachments.length > 0 && (
          <AttachmentList attachments={article.attachments} />
        )}

        <div className="mt-10 border-t border-border pt-6">
          <Button asChild variant="ghost">
            <Link to={backTo}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke {backLabel}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}