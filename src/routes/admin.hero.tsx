import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, DefaultForm, type Column } from "@/components/admin/CrudTable";
import { Badge } from "@/components/ui/badge";
import { HERO_SLIDES } from "@/lib/data";

export const Route = createFileRoute("/admin/hero")({
  head: () => ({ meta: [{ title: "Hero Slider — Admin" }, { name: "robots", content: "noindex" }] }),
  component: HeroAdmin,
});

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  order: number;
  active: boolean;
}

const SLIDES: Slide[] = HERO_SLIDES.map((s, i) => ({
  id: s.id,
  image: s.image,
  title: s.title,
  subtitle: s.subtitle,
  buttonText: i === 3 ? "Daftar Sekarang" : "Pelajari Lebih",
  buttonUrl: i === 3 ? "/ppdb" : "/profile/vision",
  order: i + 1,
  active: true,
}));

function HeroAdmin() {
  const columns: Column<Slide>[] = [
    {
      key: "image",
      header: "Gambar",
      render: (r) => (
        <img src={r.image} alt="" className="h-12 w-20 rounded object-cover" />
      ),
    },
    { key: "title", header: "Judul", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "subtitle", header: "Subjudul", className: "max-w-xs truncate" },
    { key: "order", header: "Urutan", className: "w-20" },
    {
      key: "active",
      header: "Status",
      render: (r) =>
        r.active ? <Badge>Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>,
    },
  ];

  return (
    <AdminLayout
      title="Hero Slider"
      breadcrumbs={[{ label: "Website" }, { label: "Hero Slider" }]}
    >
      <CrudTable
        items={SLIDES}
        columns={columns}
        entityName="Slider"
        searchKeys={["title", "subtitle"]}
        renderForm={(item, onClose) => <DefaultForm item={item} onClose={onClose} />}
      />
    </AdminLayout>
  );
}
