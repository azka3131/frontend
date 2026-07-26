import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/profile/history")({
  head: () => ({ meta: [{ title: "Sejarah Sekolah — SDN Dukuhbenda 02" }] }),
  component: History,
});

function History() {
  const [historyText, setHistoryText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<any>('/profile/history');
        const data = (response.data ?? response) || [];
        // Ambil data teks dari baris pertama jika ada
        if (data.length > 0) {
          setHistoryText(data[0].text);
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHeader title="Sejarah Sekolah" subtitle="Perjalanan panjang membentuk generasi penerus bangsa." />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 min-h-[50vh]">
        
        {loading ? (
          <div className="text-center text-muted-foreground">Memuat catatan sejarah...</div>
        ) : historyText ? (
          <div 
            className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed text-justify break-words"
            dangerouslySetInnerHTML={{ 
              __html: historyText.replace(/&nbsp;/g, ' ') 
            }}
          />
        ) : (
          <div className="text-center text-muted-foreground py-10">
            Belum ada catatan sejarah yang ditambahkan.
          </div>
        )}
        
      </section>
    </>
  );
}