import { createFileRoute } from "@tanstack/react-router";
import { Paperclip } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ContentTable, type ContentRow } from "@/components/admin/ContentTable";
import { ANNOUNCEMENTS } from "@/lib/data";

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({ meta: [{ title: "Pengumuman — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AnnouncementsAdmin,
});

const ITEMS: (ContentRow & { attachments: number })[] = ANNOUNCEMENTS.map((a) => ({
  id: a.id,
  image: a.image,
  title: a.title,
  slug: a.slug,
  category: a.category,
  date: a.date,
  author: a.author,
  status: a.status,
  attachments: a.attachments?.length ?? 0,
}));

function AnnouncementsAdmin() {
  return (
    <AdminLayout title="Pengumuman" breadcrumbs={[{ label: "Pengumuman" }]}>
      <ContentTable
        items={ITEMS}
        entityName="Pengumuman"
        extraColumn={{
          header: "Lampiran",
          render: (r) => (
            <span className="inline-flex items-center gap-1 text-sm">
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
              {(r as ContentRow & { attachments?: number }).attachments ?? 0}
            </span>
          ),
        }}
      />
    </AdminLayout>
  );
}
