import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, DefaultForm, type Column } from "@/components/admin/CrudTable";
import { ACHIEVEMENTS } from "@/lib/data";

export const Route = createFileRoute("/admin/achievements")({
  head: () => ({ meta: [{ title: "Prestasi — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AchievementsAdmin,
});

interface Row {
  id: number;
  image: string;
  title: string;
  year: number;
  description: string;
}

const ITEMS: Row[] = ACHIEVEMENTS.map((a, i) => ({ id: i + 1, ...a }));

function AchievementsAdmin() {
  const columns: Column<Row>[] = [
    { key: "image", header: "Gambar", render: (r) => <img src={r.image} alt="" className="h-12 w-16 rounded object-cover" /> },
    { key: "title", header: "Judul", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "year", header: "Tahun", className: "w-24" },
    { key: "description", header: "Deskripsi", className: "max-w-md" },
  ];

  return (
    <AdminLayout title="Prestasi" breadcrumbs={[{ label: "Achievements" }]}>
      <CrudTable
        items={ITEMS}
        columns={columns}
        entityName="Prestasi"
        searchKeys={["title", "description"]}
        renderForm={(item, onClose) => <DefaultForm item={item} onClose={onClose} />}
      />
    </AdminLayout>
  );
}
