import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileImage } from "lucide-react";

export const Route = createFileRoute("/ppdb")({
  head: () => ({
    meta: [
      { title: "PPDB 2026/2027 — SD Cendekia Harapan" },
      {
        name: "description",
        content: "Informasi Penerimaan Peserta Didik Baru tahun ajaran 2026/2027.",
      },
    ],
  }),
  component: PPDB,
});

// Brochure — admin akan mengunggah/mengganti berkas ini melalui dashboard.
const BROCHURE_IMAGE: string | null = null;
const BROCHURE_URL: string | null = null;

function PPDB() {
  return (
    <>
      <PageHeader
        title="PPDB 2026/2027"
        subtitle="Bergabunglah dengan keluarga besar SD Cendekia Harapan."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Large brochure preview — becomes the main focus of the page. */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
          {BROCHURE_IMAGE ? (
            <img src={BROCHURE_IMAGE} alt="Brosur PPDB 2026/2027" className="block w-full" />
          ) : (
            <div className="aspect-[3/4] w-full bg-[var(--gradient-hero)] sm:aspect-[16/10]">
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center text-primary-foreground">
                <FileImage className="h-16 w-16 opacity-90" />
                <p className="text-2xl font-bold sm:text-3xl">Brosur PPDB 2026/2027</p>
                <p className="max-w-md text-primary-foreground/85">
                  Brosur akan ditampilkan di sini. Administrator dapat mengunggah gambar atau PDF
                  brosur melalui dashboard.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="outline" disabled={!BROCHURE_URL}>
            <a
              href={BROCHURE_URL ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!BROCHURE_URL}
            >
              <Eye className="mr-2 h-4 w-4" />
              Lihat Brosur
            </a>
          </Button>
          <Button asChild size="lg" disabled={!BROCHURE_URL}>
            <a href={BROCHURE_URL ?? "#"} download aria-disabled={!BROCHURE_URL}>
              <Download className="mr-2 h-4 w-4" />
              Unduh Brosur
            </a>
          </Button>
        </div>

        {/* Info note */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          Seluruh informasi mengenai jadwal, persyaratan, alur pendaftaran, serta dokumen yang
          diperlukan dapat dilihat pada brosur PPDB di atas.
        </p>
      </section>
    </>
  );
}
