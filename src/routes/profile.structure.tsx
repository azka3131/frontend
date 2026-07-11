import { createFileRoute } from "@tanstack/react-router";
import { Network } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/profile/structure")({
  head: () => ({
    meta: [
      { title: "Struktur Organisasi — SD Cendekia Harapan" },
      { name: "description", content: "Bagan struktur organisasi SD Cendekia Harapan." },
    ],
  }),
  component: Structure,
});

function Structure() {
  return (
    <>
      <PageHeader
        title="Struktur Organisasi"
        subtitle="Susunan kepemimpinan dan tata kelola sekolah."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Large image placeholder — replaceable by admin later. */}
        <div className="overflow-hidden rounded-3xl border-2 border-dashed border-border bg-secondary/50 shadow-[var(--shadow-card)]">
          <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Network className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-foreground">Bagan Struktur Organisasi</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Placeholder gambar — administrator akan dapat mengunggah dan mengganti bagan struktur
              organisasi sekolah melalui dasbor admin.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Rekomendasi rasio gambar: 16:9 (mis. 1920×1080) dengan latar terang.
        </p>
      </section>
    </>
  );
}
