import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, DefaultForm, type Column } from "@/components/admin/CrudTable";
import { GALLERY_ALBUMS } from "@/lib/data";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({ meta: [{ title: "Galeri — Admin" }, { name: "robots", content: "noindex" }] }),
  component: GalleryAdmin,
});

interface Album {
  id: number;
  cover: string;
  title: string;
  count: number;
}

const ITEMS: Album[] = GALLERY_ALBUMS.map((a, i) => ({
  id: i + 1,
  cover: a.cover,
  title: a.title,
  count: a.images.length,
}));

function GalleryAdmin() {
  const columns: Column<Album>[] = [
    { key: "cover", header: "Sampul", render: (r) => <img src={r.cover} alt="" className="h-12 w-16 rounded object-cover" /> },
    { key: "title", header: "Nama Album", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "count", header: "Jumlah Foto", render: (r) => `${r.count} foto` },
  ];

  return (
    <AdminLayout title="Galeri" breadcrumbs={[{ label: "Gallery" }]}>
      <CrudTable
        items={ITEMS}
        columns={columns}
        entityName="Album"
        searchKeys={["title"]}
        renderForm={(item, onClose) => <DefaultForm item={item} onClose={onClose} />}
      />
    </AdminLayout>
  );
}
