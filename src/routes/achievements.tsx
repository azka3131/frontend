import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/data";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Prestasi — SD Cendekia Harapan" },
      { name: "description", content: "Pencapaian dan penghargaan SD Cendekia Harapan." },
    ],
  }),
  component: Achievements,
});

function Achievements() {
  return (
    <>
      <PageHeader
        title="Prestasi"
        subtitle="Buah dari kerja keras siswa, guru, dan dukungan orang tua."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => (
            <Card
              key={a.title}
              className="group overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                  {a.year}
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-snug">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
