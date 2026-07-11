import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { NewsGrid } from "@/components/NewsGrid";
import { PUBLIC_SCHOOL_NEWS } from "@/lib/data";

export const Route = createFileRoute("/news/school")({
  head: () => ({
    meta: [
      { title: "Berita Sekolah — SD Cendekia Harapan" },
      {
        name: "description",
        content: "Kegiatan dan kabar terbaru dari komunitas SD Cendekia Harapan.",
      },
    ],
  }),
  component: SchoolNews,
});

function SchoolNews() {
  return (
    <>
      <PageHeader
        title="Berita Sekolah"
        subtitle="Ikuti cerita dan kabar terbaru dari komunitas kami."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <NewsGrid items={PUBLIC_SCHOOL_NEWS} basePath="/news" />
      </section>
    </>
  );
}
