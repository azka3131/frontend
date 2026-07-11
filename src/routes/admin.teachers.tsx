import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, DefaultForm, type Column } from "@/components/admin/CrudTable";
import { Badge } from "@/components/ui/badge";
import { TEACHERS } from "@/lib/data";

export const Route = createFileRoute("/admin/teachers")({
  head: () => ({ meta: [{ title: "Guru & Staf — Admin" }, { name: "robots", content: "noindex" }] }),
  component: TeachersAdmin,
});

interface Teacher {
  id: number;
  photo: string;
  name: string;
  position: string;
  bio: string;
  order: number;
  active: boolean;
}

const ITEMS: Teacher[] = TEACHERS.map((t, i) => ({
  id: i + 1,
  photo: t.photo,
  name: t.name,
  position: t.position,
  bio: t.bio,
  order: i + 1,
  active: true,
}));

function TeachersAdmin() {
  const columns: Column<Teacher>[] = [
    { key: "photo", header: "Foto", render: (r) => <img src={r.photo} alt="" className="h-10 w-10 rounded-full object-cover" /> },
    { key: "name", header: "Nama", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "position", header: "Jabatan" },
    { key: "order", header: "Urutan", className: "w-20" },
    { key: "active", header: "Status", render: (r) => (r.active ? <Badge>Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>) },
  ];

  return (
    <AdminLayout title="Guru & Staf" breadcrumbs={[{ label: "Teachers & Staff" }]}>
      <CrudTable
        items={ITEMS}
        columns={columns}
        entityName="Guru/Staf"
        searchKeys={["name", "position"]}
        renderForm={(item, onClose) => <DefaultForm item={item} onClose={onClose} />}
      />
    </AdminLayout>
  );
}
