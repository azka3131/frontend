import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FACILITIES } from "@/lib/data";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Fasilitas — SD Cendekia Harapan" },
      {
        name: "description",
        content: "Sarana dan prasarana penunjang pembelajaran di SD Cendekia Harapan.",
      },
    ],
  }),
  component: Facilities,
});

function Facilities() {
  return (
    <>
      <PageHeader
        title="Fasilitas"
        subtitle="Lingkungan belajar yang aman, modern, dan menginspirasi."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FACILITIES.map((f) => (
            <Card
              key={f.title}
              className="group overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
