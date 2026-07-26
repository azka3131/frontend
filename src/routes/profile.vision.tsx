import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/profile/vision")({
  head: () => ({ meta: [{ title: "Visi & Misi — SDN Dukuhbenda 02" }] }),
  component: VisionMission,
});

function VisionMission() {
  const [data, setData] = useState({ vision: "", mission: [] as string[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<any>('/profile/vision-mission');
        setData(response.data ?? response);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHeader title="Visi & Misi" subtitle="Arah dan langkah perjuangan kami dalam mendidik generasi penerus." />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? <div className="text-center text-muted-foreground">Memuat data...</div> : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-5 w-5" />
                  <h2 className="text-xl font-bold">Visi</h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-wrap">{data.vision}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  <h2 className="text-xl font-bold">Misi</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {data.mission?.map((m, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
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
        )}
      </section>
    </>
  );
}