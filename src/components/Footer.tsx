import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import defaultLogo from "@/assets/school-logo.png";
import { apiFetch } from "@/lib/api";

// Definisikan navigasi footer secara lokal pengganti lib/data.ts
const FOOTER_LINKS = [
  { label: "Beranda", to: "/" },
  { label: "Visi & Misi", to: "/profile/vision" },
  { label: "Sejarah", to: "/profile/history" },
  { label: "Struktur Organisasi", to: "/profile/structure" },
  { label: "Guru & Staf", to: "/teachers" },
  { label: "Berita", to: "/news/school" },
  { label: "Pengumuman", to: "/announcements" },
  { label: "Galeri", to: "/gallery" },
  { label: "Prestasi", to: "/achievements" },
  { label: "Fasilitas", to: "/facilities" },
  { label: "PPDB", to: "/ppdb" },
];

export function Footer() {
  const [settings, setSettings] = useState({
    name: "Memuat...",
    motto: "Sekolah dasar modern yang menumbuhkan rasa ingin tahu, karakter, dan kreativitas setiap anak sejak dini.",
    address: "Jl. Pendidikan No. 123",
    phone: "(021) 555-1234",
    email: "info@sekolah.com",
    hours: "Senin - Jumat, 07.00 - 15.00",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    footer_copyright: `© ${new Date().getFullYear()} SDN Dukuhbenda 02. Hak cipta dilindungi undang-undang.`,
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
            motto: data.motto || settings.motto,
            address: data.address || settings.address,
            phone: data.phone || settings.phone,
            email: data.email || settings.email,
            hours: data.hours || settings.hours,
            facebook_url: data.facebook_url || "",
            instagram_url: data.instagram_url || "",
            youtube_url: data.youtube_url || "",
            footer_copyright: data.footer_copyright || settings.footer_copyright,
            logo: data.logo || ""
          });
        }
      } catch (error) {
        console.error("Gagal memuat footer settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const logoSrc = settings.logo 
    ? (settings.logo.startsWith('http') ? settings.logo : `http://127.0.0.1:8000${settings.logo}`) 
    : defaultLogo;

  const socialMedias = [
    { icon: Facebook, url: settings.facebook_url },
    { icon: Instagram, url: settings.instagram_url },
    { icon: Youtube, url: settings.youtube_url },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-secondary/30 to-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:gap-10 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Logo" className="h-11 w-11 object-contain" width={44} height={44} />
            <span className="font-display text-base font-bold tracking-tight text-primary">
              {settings.name}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {settings.motto}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Navigasi Cepat
          </h4>
          <ul className="mt-5 grid grid-cols-2 gap-y-2.5 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Kontak</h4>
          <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="leading-relaxed">{settings.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{settings.email}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Ikuti Kami
          </h4>
          <div className="mt-5 flex gap-2.5">
            {socialMedias.map((social, i) => (
              social.url ? (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="social"
                  className="grid h-10 w-10 place-items-center rounded-full bg-background text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ) : null
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Jam operasional: <span className="text-foreground/80">{settings.hours}</span>
          </p>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <span>
            {settings.footer_copyright}
          </span>
          <span className="text-muted-foreground/70">Made With ❤.</span>
        </div>
      </div>
    </footer>
  );
}