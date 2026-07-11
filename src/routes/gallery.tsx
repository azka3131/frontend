import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, Images } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GALLERY_ALBUMS } from "@/lib/data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galeri — SD Cendekia Harapan" },
      { name: "description", content: "Momen-momen berharga di SD Cendekia Harapan." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const album = openAlbum !== null ? GALLERY_ALBUMS[openAlbum] : null;

  return (
    <>
      <PageHeader
        title="Galeri"
        subtitle="Potret keseharian dan kegiatan istimewa di sekolah kami."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GALLERY_ALBUMS.map((a, i) => (
            <button
              key={a.title}
              onClick={() => setOpenAlbum(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary text-left shadow-sm transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <img
                src={a.cover}
                alt={a.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                <div className="flex items-center gap-2 text-xs opacity-90">
                  <Images className="h-3.5 w-3.5" />
                  {a.images.length} foto
                </div>
                <h3 className="mt-1 text-lg font-bold">{a.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {album && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
          onClick={() => setOpenAlbum(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{album.title}</h3>
              <button
                onClick={() => setOpenAlbum(null)}
                aria-label="Close album"
                className="rounded-full p-2 hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {album.images.map((src, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-border bg-secondary"
                >
                  <img
                    src={src}
                    alt={`${album.title} ${idx + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
