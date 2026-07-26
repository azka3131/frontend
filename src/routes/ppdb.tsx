import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileImage, Info, CalendarX2, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/ppdb")({
  head: () => ({
    meta: [
      { title: "Informasi PPDB — SDN Dukuhbenda 02" },
      {
        name: "description",
        content: "Informasi Penerimaan Peserta Didik Baru SDN Dukuhbenda 02.",
      },
    ],
  }),
  component: PPDB,
});

function PPDB() {
  const [setting, setSetting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk mengontrol animasi pop-up (Lightbox)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiFetch<any>("/ppdb");
        setSetting(res.data ?? res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader title="Informasi PPDB" subtitle="Memuat informasi pendaftaran..." />
        <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">Memuat data...</div>
      </>
    );
  }

  const isActive = setting?.active === 1 || setting?.active === true;
  const imageUrl = setting?.brochure_image ? (setting.brochure_image.startsWith('http') ? setting.brochure_image : `http://127.0.0.1:8000${setting.brochure_image}`) : null;

  return (
    <>
      <PageHeader
        title={setting?.title || "Penerimaan Peserta Didik Baru"}
        subtitle="Bergabunglah dengan keluarga besar SDN Dukuhbenda 02."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        
        {/* KONDISI 1: JIKA PPDB DITUTUP */}
        {!isActive && (
          <div className="overflow-hidden rounded-3xl border-2 border-border bg-slate-50 shadow-sm p-10 sm:p-16 text-center">
             <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                   <CalendarX2 className="h-10 w-10" />
                </div>
             </div>
             <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">Mohon Maaf, Pendaftaran Telah Ditutup</h2>
             <p className="text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
               Terima kasih atas antusiasme dan kepercayaan Bapak/Ibu. Saat ini periode Penerimaan Peserta Didik Baru (PPDB) belum dibuka atau telah berakhir. 
             </p>
             <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm border border-blue-100">
                <Info className="h-5 w-5 shrink-0" />
                <p className="text-left">
                  Silakan pantau halaman ini secara berkala atau hubungi kontak sekolah kami untuk mendapatkan informasi mengenai jadwal pendaftaran gelombang berikutnya.
                </p>
             </div>
          </div>
        )}

        {/* KONDISI 2: JIKA PPDB DIBUKA */}
        {isActive && (
          <>
            {/* Teks Deskripsi dari Admin */}
            {setting?.description && (
              <div className="mb-10 text-center max-w-3xl mx-auto">
                <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {setting.description}
                </p>
              </div>
            )}

            {/* Gambar Brosur */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] relative group cursor-pointer" onClick={() => imageUrl && setIsLightboxOpen(true)}>
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Brosur PPDB" className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" />
                  {/* Overlay efek hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 shadow-lg flex items-center gap-2">
                       <Eye className="w-4 h-4" /> Klik untuk memperbesar
                    </div>
                  </div>
                </>
              ) : (
                <div className="aspect-[3/4] w-full bg-[var(--gradient-hero)] sm:aspect-[16/10]">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center text-primary-foreground">
                    <FileImage className="h-16 w-16 opacity-90" />
                    <p className="text-2xl font-bold sm:text-3xl">Brosur Belum Tersedia</p>
                    <p className="max-w-md text-primary-foreground/85">
                      Pendaftaran telah dibuka, namun panitia belum mengunggah poster/brosur.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" variant="outline" disabled={!imageUrl} onClick={() => setIsLightboxOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Ukuran Penuh
              </Button>
              
              <Button asChild size="lg" disabled={!imageUrl}>
                <a 
                  href={imageUrl ?? "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-disabled={!imageUrl}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Unduh / Buka Brosur
                </a>
              </Button>
            </div>
            
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
              Seluruh informasi mengenai jadwal, persyaratan, alur pendaftaran, serta dokumen yang
              diperlukan dapat dilihat pada brosur PPDB di atas.
            </p>
          </>
        )}
      </section>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && imageUrl && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-full bg-white/10 p-2 text-white hover:bg-white/25 transition-colors z-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          
          <img 
            src={imageUrl} 
            alt="Brosur PPDB Full" 
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl animate-in zoom-in-50 duration-300" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
}