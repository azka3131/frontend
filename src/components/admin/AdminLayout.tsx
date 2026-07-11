import { type ReactNode, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Images,
  Home,
  BookOpen,
  Users,
  Newspaper,
  Megaphone,
  GraduationCap,
  Image as ImageIcon,
  Trophy,
  Building2,
  Mail,
  Settings,
  UserCog,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import logo from "@/assets/school-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SCHOOL } from "@/lib/data";

type MenuItem = {
  label: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; to: string }[];
};

const MENU: MenuItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  {
    label: "Website",
    icon: Home,
    children: [
      { label: "Hero Slider", to: "/admin/hero" },
      { label: "Beranda", to: "/admin/homepage" },
    ],
  },
  { label: "Profil Sekolah", to: "/admin/profile", icon: BookOpen },
  { label: "Guru & Staf", to: "/admin/teachers", icon: Users },
  { label: "Berita", to: "/admin/news", icon: Newspaper },
  { label: "Pengumuman", to: "/admin/announcements", icon: Megaphone },
  { label: "PPDB", to: "/admin/ppdb", icon: GraduationCap },
  { label: "Galeri", to: "/admin/gallery", icon: ImageIcon },
  { label: "Prestasi", to: "/admin/achievements", icon: Trophy },
  { label: "Fasilitas", to: "/admin/facilities", icon: Building2 },
  { label: "Pesan Masuk", to: "/admin/messages", icon: Mail },
  { label: "Pengaturan Website", to: "/admin/settings", icon: Settings },
  { label: "Pengguna", to: "/admin/users", icon: UserCog },
];

interface AdminLayoutProps {
  title: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminLayout({ title, breadcrumbs = [], actions, children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <img src={logo} alt="" className="h-9 w-9 shrink-0" />
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-sidebar-foreground">Admin Panel</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">{SCHOOL.name}</div>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {MENU.map((item) => {
          if (item.children) {
            const anyActive = item.children.some((c) => pathname.startsWith(c.to));
            return (
              <SidebarGroup
                key={item.label}
                item={item}
                collapsed={collapsed}
                defaultOpen={anyActive}
                pathname={pathname}
              />
            );
          }
          const active =
            item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to!);
          return (
            <Link
              key={item.to}
              to={item.to!}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => navigate({ to: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-destructive"
          title={collapsed ? "Keluar" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 lg:block ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {SidebarInner}
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
              <div className="flex items-center gap-2">
                <img src={logo} alt="" className="h-8 w-8" />
                <span className="text-sm font-bold">Admin Panel</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="rounded p-1.5 hover:bg-sidebar-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[calc(100%-4rem)]">{SidebarInner}</div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 hover:bg-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden rounded-md p-2 hover:bg-muted lg:inline-flex"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari…" className="pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-sm hover:bg-muted">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    A
                  </div>
                  <span className="hidden sm:inline">Administrator</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" })}>
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/admin/login" })}>
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="border-b border-border bg-background px-4 py-4 lg:px-6">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">
              Admin
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {b.to ? (
                  <Link to={b.to} className="hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarGroup({
  item,
  collapsed,
  defaultOpen,
  pathname,
}: {
  item: MenuItem;
  collapsed: boolean;
  defaultOpen: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (collapsed) {
    return (
      <div className="flex flex-col">
        <div
          className="flex items-center justify-center rounded-lg px-3 py-2 text-sidebar-foreground/60"
          title={item.label}
        >
          <item.icon className="h-4 w-4" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-1 ml-7 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
          {item.children!.map((c) => {
            const active = pathname.startsWith(c.to);
            return (
              <Link
                key={c.to}
                to={c.to}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
