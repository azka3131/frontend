import { createFileRoute } from "@tanstack/react-router";
import { Eye, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { MISSION, VISION } from "@/lib/data";

export const Route = createFileRoute("/profile/vision")({
  head: () => ({
    meta: [
      { title: "Visi & Misi — SD Cendekia Harapan" },
      { name: "description", content: "Visi dan misi SD Cendekia Harapan." },
    ],
  }),
  component: VisionMission,
});

function VisionMission() {
  return (
    <>
      <PageHeader
        title="Visi & Misi"
        subtitle="Arah dan langkah perjuangan kami dalam mendidik generasi penerus."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="h-5 w-5" />
                <h2 className="text-xl font-bold">Visi</h2>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">{VISION}</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                <h2 className="text-xl font-bold">Misi</h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {MISSION.map((m, i) => (
                  <li key={m} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
