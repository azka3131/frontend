import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, DefaultForm, type Column } from "@/components/admin/CrudTable";
import { FACILITIES } from "@/lib/data";

export const Route = createFileRoute("/admin/facilities")({
  head: () => ({ meta: [{ title: "Fasilitas — Admin" }, { name: "robots", content: "noindex" }] }),
  component: FacilitiesAdmin,
});

interface Row {
  id: number;
  image: string;
  title: string;
  description: string;
}

const ITEMS: Row[] = FACILITIES.map((f, i) => ({ id: i + 1, ...f }));

function FacilitiesAdmin() {
  const columns: Column<Row>[] = [
    { key: "image", header: "Gambar", render: (r) => <img src={r.image} alt="" className="h-12 w-16 rounded object-cover" /> },
    { key: "title", header: "Nama Fasilitas", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "description", header: "Deskripsi", className: "max-w-md" },
  ];

  return (
    <AdminLayout title="Fasilitas" breadcrumbs={[{ label: "Facilities" }]}>
      <CrudTable
        items={ITEMS}
        columns={columns}
        entityName="Fasilitas"
        searchKeys={["title", "description"]}
        renderForm={(item, onClose) => <DefaultForm item={item} onClose={onClose} />}
      />
    </AdminLayout>
  );
}
