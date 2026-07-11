import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { HISTORY } from "@/lib/data";

export const Route = createFileRoute("/profile/history")({
  head: () => ({
    meta: [
      { title: "Sejarah Sekolah — SD Cendekia Harapan" },
      { name: "description", content: "Perjalanan SD Cendekia Harapan dari masa ke masa." },
    ],
  }),
  component: History,
});

function History() {
  return (
    <>
      <PageHeader
        title="Sejarah Sekolah"
        subtitle="Perjalanan panjang membentuk generasi penerus bangsa."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="prose prose-sm max-w-none text-muted-foreground sm:prose-base">
          <p>
            SD Cendekia Harapan didirikan pada tahun 1985 oleh sekelompok pendidik yang memimpikan
            sekolah dasar dengan pendekatan pembelajaran yang humanis dan modern. Berawal dari 3
            ruang kelas sederhana, sekolah ini berkembang menjadi salah satu institusi pendidikan
            dasar terpercaya di Jakarta Selatan.
          </p>
          <p>
            Pada tahun 2002, sekolah ini menjadi salah satu pelopor penerapan kurikulum berbasis
            karakter di Indonesia. Di tahun 2018, kami meresmikan gedung baru tiga lantai dengan
            fasilitas laboratorium komputer, sains, serta perpustakaan modern.
          </p>
          <p>
            Hingga kini, lebih dari 8.000 alumni telah dihasilkan dan tersebar di berbagai bidang.
            Kami terus berinovasi untuk memberikan pendidikan terbaik bagi generasi penerus bangsa.
          </p>
        </div>

        <ol className="relative mt-12 space-y-8 border-l-2 border-primary/30 pl-6">
          {HISTORY.map((h) => (
            <li key={h.year} className="relative">
              <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                ●
              </span>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                {h.year}
              </div>
              <h3 className="mt-1 text-lg font-semibold">{h.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
