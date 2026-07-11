import { Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface NewsItem {
  id: number | string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
}

interface Props {
  items: NewsItem[];
  /** Base path for the detail link, e.g. "/news" or "/news/announcements". */
  basePath: "/news" | "/news/announcements";
}

export function NewsGrid({ items, basePath }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Belum ada konten untuk ditampilkan.
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((n) => {
        const to =
          basePath === "/news" ? "/news/$slug" : "/news/announcements/$slug";
        return (
          <Card
            key={n.id}
            className="group flex flex-col overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
          >
            <Link
              to={to}
              params={{ slug: n.slug }}
              className="aspect-[16/10] overflow-hidden"
            >
              <img
                src={n.image}
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
                to={to}
                params={{ slug: n.slug }}
                className="mt-3 line-clamp-2 text-lg font-semibold leading-snug hover:text-primary"
              >
                {n.title}
              </Link>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.excerpt}</p>
              <Link
                to={to}
                params={{ slug: n.slug }}
                className="mt-4 inline-flex w-fit text-sm font-medium text-primary hover:underline"
              >
                Baca selengkapnya →
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
