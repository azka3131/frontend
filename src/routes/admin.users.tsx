import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable, DefaultForm, type Column } from "@/components/admin/CrudTable";
import { Badge } from "@/components/ui/badge";
import { ADMIN_USERS, type AdminUser } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Pengguna — Admin" }, { name: "robots", content: "noindex" }] }),
  component: UsersAdmin,
});

function UsersAdmin() {
  const columns: Column<AdminUser>[] = [
    { key: "name", header: "Nama", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold">
          {r.name.charAt(0)}
        </div>
        <span className="font-medium">{r.name}</span>
      </div>
    ) },
    { key: "email", header: "Email" },
    { key: "role", header: "Peran", render: (r) => <Badge variant="secondary">{r.role}</Badge> },
    { key: "active", header: "Status", render: (r) => (r.active ? <Badge>Aktif</Badge> : <Badge variant="outline">Nonaktif</Badge>) },
  ];

  return (
    <AdminLayout title="Pengguna" breadcrumbs={[{ label: "Users" }]}>
      <CrudTable
        items={ADMIN_USERS}
        columns={columns}
        entityName="Pengguna"
        searchKeys={["name", "email", "role"]}
        renderForm={(item, onClose) => <DefaultForm item={item} onClose={onClose} />}
      />
    </AdminLayout>
  );
}
