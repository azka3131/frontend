import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { NewsGrid } from "@/components/NewsGrid";
import { PUBLIC_ANNOUNCEMENTS } from "@/lib/data";

export const Route = createFileRoute("/news/announcements/")({
  head: () => ({
    meta: [
      { title: "Pengumuman — SD Cendekia Harapan" },
      { name: "description", content: "Pengumuman resmi dari SD Cendekia Harapan." },
    ],
  }),
  component: Announcements,
});

function Announcements() {
  return (
    <>
      <PageHeader
        title="Pengumuman"
        subtitle="Informasi resmi untuk orang tua, siswa, dan masyarakat."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <NewsGrid items={PUBLIC_ANNOUNCEMENTS} basePath="/news/announcements" />
      </section>
    </>
  );
}
