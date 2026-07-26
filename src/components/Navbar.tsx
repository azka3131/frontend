import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import defaultLogo from "@/assets/school-logo.png";

// Definisikan tipe dan data navigasi secara lokal pengganti lib/data.ts
export interface NavItem {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", to: "/" },
  {
    label: "Profil",
    to: "/profile",
    children: [
      { label: "Visi & Misi", to: "/profile/vision" },
      { label: "Sejarah", to: "/profile/history" },
      { label: "Struktur Organisasi", to: "/profile/structure" },
    ],
  },
  { label: "Guru & Staf", to: "/teachers" },
  { label: "Berita", to: "/news/school" },
  { label: "Pengumuman", to: "/announcements" },
  { label: "Galeri", to: "/gallery" },
  { label: "Prestasi", to: "/achievements" },
  { label: "Fasilitas", to: "/facilities" },
  { label: "PPDB", to: "/ppdb" },
];

function isActivePath(pathname: string, item: NavItem): boolean {
  if (item.to === "/") return pathname === "/";
  if (pathname === item.to) return true;
  if (pathname.startsWith(item.to + "/")) return true;
  return item.children?.some((c) => pathname === c.to || pathname.startsWith(c.to + "/")) ?? false;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [settings, setSettings] = useState({
    name: "Memuat...",
    tagline: "Cerdas, Berkarakter, Berprestasi",
    logo: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch<any>('/settings');
        const data = response.data ?? response;
        if (data) {
          setSettings({
            name: data.name || "SDN Dukuhbenda 02",
            tagline: data.tagline || "",
            logo: data.logo || ""
          });
        }
      } catch (error) {
        console.error("Gagal memuat navbar settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const logoSrc = settings.logo 
    ? (settings.logo.startsWith('http') ? settings.logo : `http://127.0.0.1:8000${settings.logo}`) 
    : defaultLogo;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65 shadow-[0_1px_0_0_oklch(0.92_0.015_250/0.6)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <img
            src={logoSrc}
            alt="Logo"
            className="h-10 w-10 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
            width={40}
            height={40}
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold tracking-tight text-primary sm:text-base">
              {settings.name}
            </div>
            <div className="hidden text-xs text-muted-foreground sm:block">{settings.tagline}</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item);
            if (item.children) {
              return (
                <div key={item.to} className="group relative">
                  <button
                    className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-secondary text-primary"
                        : "text-foreground/75 hover:bg-secondary/70 hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="pointer-events-none invisible absolute left-0 top-full z-50 min-w-[230px] pt-2 opacity-0 transition-[opacity,visibility] duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                    <div className="dropdown-panel overflow-hidden rounded-2xl border border-border/70 bg-popover/95 py-2 shadow-[var(--shadow-soft)] backdrop-blur">
                      {item.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          activeProps={{ className: "bg-secondary text-primary" }}
                          inactiveProps={{ className: "text-foreground/80" }}
                          className="block px-4 py-2.5 text-sm transition-colors hover:bg-secondary/70 hover:text-primary hover:pl-5"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary bg-secondary" }}
                inactiveProps={{
                  className: "text-foreground/70 hover:text-primary hover:bg-secondary/60",
                }}
                className="rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden xl:block">
          <Button asChild size="sm">
            <Link to="/ppdb">Daftar PPDB</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-foreground/80 hover:bg-secondary lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item);
              if (item.children) {
                const expanded = mobileExpanded === item.to;
                return (
                  <div key={item.to} className="border-b border-border/40 last:border-0">
                    <button
                      onClick={() => setMobileExpanded(expanded ? null : item.to)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium ${
                        active ? "text-primary" : "text-foreground/80"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expanded && (
                      <div className="ml-3 flex flex-col border-l border-border pb-2 pl-3">
                        {item.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            onClick={() => setOpen(false)}
                            activeProps={{ className: "text-primary" }}
                            inactiveProps={{ className: "text-foreground/70" }}
                            className="rounded-md px-3 py-2 text-sm"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary bg-secondary" }}
                  inactiveProps={{ className: "text-foreground/80" }}
                  className="rounded-md px-3 py-2.5 text-sm font-medium"
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-3">
              <Link to="/ppdb" onClick={() => setOpen(false)}>
                Daftar PPDB
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}