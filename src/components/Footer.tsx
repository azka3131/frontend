import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/school-logo.png";
import { FOOTER_LINKS, SCHOOL } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-secondary/30 to-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:gap-10 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-11 w-11" width={44} height={44} />
            <span className="font-display text-base font-bold tracking-tight text-primary">
              {SCHOOL.name}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sekolah dasar modern yang menumbuhkan rasa ingin tahu, karakter, dan kreativitas setiap
            anak sejak dini.
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
              <span className="leading-relaxed">{SCHOOL.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{SCHOOL.phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{SCHOOL.email}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Ikuti Kami
          </h4>
          <div className="mt-5 flex gap-2.5">
            {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="grid h-10 w-10 place-items-center rounded-full bg-background text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Jam operasional: <span className="text-foreground/80">{SCHOOL.hours}</span>
          </p>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <span>
            © {new Date().getFullYear()} {SCHOOL.name}. Hak cipta dilindungi undang-undang.
          </span>
          <span className="text-muted-foreground/70">Dibuat dengan ❤ untuk pendidikan anak.</span>
        </div>
      </div>
    </footer>
  );
}
