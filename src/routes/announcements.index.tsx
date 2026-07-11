import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { AnnouncementGrid } from "@/components/AnnouncementGrid";
import { PUBLIC_ANNOUNCEMENTS } from "@/lib/data";

export const Route = createFileRoute("/announcements/")({
  head: () => ({
    meta: [
      { title: "Pengumuman — SD Cendekia Harapan" },
      {
        name: "description",
        content: "Pengumuman resmi dan berkas penting dari SD Cendekia Harapan.",
      },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Pengumuman"
        subtitle="Informasi resmi dan berkas penting untuk orang tua, siswa, dan masyarakat."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <AnnouncementGrid items={PUBLIC_ANNOUNCEMENTS} />
      </section>
    </>
  );
}
