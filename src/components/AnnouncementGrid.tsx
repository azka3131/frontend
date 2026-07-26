import { Calendar, Paperclip, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Attachment {
  id: number;
  name: string;
  url: string;
  size?: string;
}

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string | string[];
  image: string | null;
  category: string;
  date: string;
  author: string;
  type: string;
  attachments?: Attachment[];
}

interface Props {
  items: NewsArticle[];
}

export function AnnouncementGrid({ items }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Belum ada pengumuman untuk ditampilkan.
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((n) => (
        <Card
          key={n.id}
          className="group flex flex-col overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
        >
          <Link
            to="/announcements/$slug"
            params={{ slug: n.slug }}
            className="aspect-[16/10] overflow-hidden"
          >
            <img
              src={n.image || "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image"}
              alt={n.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <CardContent className="flex flex-1 flex-col p-5">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-primary">
                {n.category}
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {n.date}
              </span>
            </div>
            <Link
              to="/announcements/$slug"
              params={{ slug: n.slug }}
              className="mt-3 line-clamp-2 text-lg font-semibold leading-snug hover:text-primary"
            >
              {n.title}
            </Link>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.excerpt}</p>
            {n.attachments && n.attachments.length > 0 && (
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Paperclip className="h-3 w-3" />
                {n.attachments.length} lampiran
              </p>
            )}
            <div className="mt-auto pt-4">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link to="/announcements/$slug" params={{ slug: n.slug }}>
                  Baca selengkapnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}