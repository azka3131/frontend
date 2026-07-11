import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { TEACHERS } from "@/lib/data";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Guru & Staf — SD Cendekia Harapan" },
      { name: "description", content: "Profil para pendidik dan staf SD Cendekia Harapan." },
    ],
  }),
  component: Teachers,
});

function Teachers() {
  return (
    <>
      <PageHeader
        title="Guru & Staf"
        subtitle="Pendidik berdedikasi yang menjadikan setiap hari di sekolah bermakna."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TEACHERS.map((t) => (
            <Card
              key={t.name}
              className="overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={t.photo}
                  alt={t.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-5 text-center">
                <h3 className="text-base font-semibold leading-tight">{t.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{t.position}</p>
                <p className="mt-2 text-xs text-muted-foreground">{t.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
