import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AnnouncementGrid } from "@/components/AnnouncementGrid";
import { apiFetch } from "@/lib/api";

// Definisikan interface NewsArticle secara lokal
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
}

interface PaginatedResponse<T> {
  data: T[];
}

export const Route = createFileRoute("/announcements/")({
  loader: async () => {
    const response = await apiFetch<PaginatedResponse<NewsArticle>>(
      "/news?type=announcement&per_page=50",
    );
    return { items: response.data };
  },
  head: () => ({
    meta: [
      { title: "Pengumuman — SDN Dukuhbenda 02" },
      {
        name: "description",
        content: "Pengumuman resmi dan berkas penting dari SDN Dukuhbenda 02.",
      },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const { items } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        title="Pengumuman"
        subtitle="Informasi resmi dan berkas penting untuk orang tua, siswa, dan masyarakat."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <AnnouncementGrid items={items} />
      </section>
    </>
  );
}