import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Images, ZoomIn } from "lucide-react";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Galeri — SDN Dukuhbenda 02" }] }),
  component: GalleryPage,
});

interface GalleryImage {
  id: number;
  url: string;
}

interface GalleryAlbum {
  id: number;
  title: string;
  cover: string;
  images: GalleryImage[];
}

function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk album yang sedang dibuka
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  
  // STATE BARU: Untuk foto tunggal yang di-klik (Lightbox)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await apiFetch<any>('/gallery');
        setAlbums(response.data ?? response);
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <>
      <PageHeader title="Galeri" subtitle="Potret keceriaan dan kegiatan inspiratif di sekolah kami." />
      
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Memuat galeri...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      album.cover 
                        ? (album.cover.startsWith('http') ? album.cover : `http://127.0.0.1:8000${album.cover}`) 
                        : "https://placehold.co/600x400/e2e8f0/64748b?text=No+Cover"
                    }
                    alt={album.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 mb-1">
                    <Images className="h-4 w-4" />
                    <span>{album.images?.length || 0} foto</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight">{album.title}</h3>
                </div>
              </div>
            ))}
            {albums.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">Belum ada album galeri.</div>
            )}
          </div>
        )}
      </section>

      {/* DIALOG 1: MODAL ALBUM (Kumpulan Foto) */}
      <Dialog open={!!selectedAlbum} onOpenChange={(open) => !open && setSelectedAlbum(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedAlbum?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {selectedAlbum?.images?.map((img) => (
              <div 
                key={img.id} 
                onClick={() => setSelectedImage(img)} // AKSI: Buka gambar saat di-klik
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted cursor-pointer"
              >
                <img 
                  src={img.url.startsWith('http') ? img.url : `http://127.0.0.1:8000${img.url}`} 
                  alt="Gallery item" 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  loading="lazy" 
                />
                {/* Efek hover untuk memberi tahu bahwa foto bisa di-klik */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 drop-shadow-md" />
                </div>
              </div>
            ))}
            {selectedAlbum?.images?.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">Belum ada foto di album ini.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: LIGHTBOX (Preview Foto Tunggal) */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        {/* bg-transparent dan border-none membuat pop-up ini terlihat seperti melayang */}
        <DialogContent className="max-w-5xl bg-transparent border-none shadow-none p-0 flex justify-center items-center">
          <DialogTitle className="sr-only">Pratinjau Foto</DialogTitle>
          {selectedImage && (
            <img
              src={selectedImage.url.startsWith('http') ? selectedImage.url : `http://127.0.0.1:8000${selectedImage.url}`}
              alt="Pratinjau penuh"
              className="max-h-[85vh] w-auto max-w-full rounded-md object-contain shadow-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}