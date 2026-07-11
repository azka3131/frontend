import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Trophy, Building2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HeroSlider } from "@/components/HeroSlider";
import { toast } from "sonner";
import { ACHIEVEMENTS, FACILITIES, HERO_SLIDES, PUBLIC_SCHOOL_NEWS, STATS, SCHOOL, PRINCIPAL } from "@/lib/data";
import { Quote } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SD Cendekia Harapan — Beranda" },
      {
        name: "description",
        content:
          "Sekolah dasar modern yang menumbuhkan rasa ingin tahu, karakter, dan kreativitas.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Pesan terkirim", {
        description: "Terima kasih, tim kami akan menghubungi Anda secepatnya.",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
      setSending(false);
    }, 600);
  }

  return (
    <>
      {/* Full-width hero image slider */}
      <HeroSlider slides={HERO_SLIDES}>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to="/profile/vision">
              Learn More <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Link to="/ppdb">PPDB Registration</Link>
          </Button>
        </div>
      </HeroSlider>

      {/* Principal Welcome */}
      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[auto_1fr] lg:gap-14 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5" />
              <img
                src={PRINCIPAL.photo}
                alt={PRINCIPAL.name}
                className="relative h-64 w-64 rounded-3xl object-cover shadow-[var(--shadow-card)] sm:h-72 sm:w-72"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sambutan Kepala Sekolah
            </p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Selamat datang di {SCHOOL.name}
            </h2>
            <div className="mt-5 flex gap-3 text-muted-foreground">
              <Quote className="h-6 w-6 shrink-0 text-primary/60" />
              <p className="text-base leading-relaxed">{PRINCIPAL.message}</p>
            </div>
            <div className="mt-6">
              <div className="font-semibold text-foreground">{PRINCIPAL.name}</div>
              <div className="text-sm text-primary">{PRINCIPAL.title}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Berita Terbaru"
          title="Apa yang sedang terjadi di sekolah"
          link={{ to: "/news/school", label: "Lihat semua berita" }}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PUBLIC_SCHOOL_NEWS.slice(0, 3).map((n) => (
            <Card
              key={n.id}
              className="group overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <Link
                to="/news/$slug"
                params={{ slug: n.slug }}
                className="block aspect-[16/10] overflow-hidden"
              >
                <img
                  src={n.image}
                  alt={n.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-primary">
                    {n.category}
                  </Badge>
                  <span>{n.date}</span>
                </div>
                <Link
                  to="/news/$slug"
                  params={{ slug: n.slug }}
                  className="mt-3 line-clamp-2 block text-lg font-semibold leading-snug hover:text-primary"
                >
                  {n.title}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{n.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements preview */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Prestasi"
            title="Pencapaian membanggakan kami"
            link={{ to: "/achievements", label: "Semua prestasi" }}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {ACHIEVEMENTS.slice(0, 3).map((a) => (
              <Card
                key={a.title}
                className="group overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                    {a.year}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-snug">{a.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Fasilitas"
          title="Sarana penunjang pembelajaran"
          link={{ to: "/facilities", label: "Semua fasilitas" }}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITIES.slice(0, 4).map((f) => (
            <Card
              key={f.title}
              className="group overflow-hidden border-border/60 pt-0 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Building2 className="h-4 w-4" />
                  <h3 className="text-base font-semibold">{f.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Hubungi & Lokasi (dipindah dari halaman /contact) ── */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Hubungi Kami
            </p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Mari berkunjung ke {SCHOOL.name}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Tim kami siap menyambut Anda untuk tur sekolah, konsultasi pendaftaran, atau sekadar
              berbincang tentang pendidikan anak.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Kiri: Form Kirim Pesan */}
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold">Kirim Pesan</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Isi formulir di bawah ini dan tim kami akan segera merespons.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nama Lengkap</Label>
                    <Input
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Nomor Telepon</Label>
                    <Input
                      id="contact-phone"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Pesan</Label>
                    <Textarea
                      id="contact-message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tuliskan pesan Anda di sini..."
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={sending}>
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Kanan: Peta + Info Sekolah */}
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
                <iframe
                  title="Lokasi Sekolah"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3!2d106.8!3d-6.26!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2sJakarta!5e0!3m2!1sen!2sid!4v1700000000000"
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">Informasi Sekolah</h3>
                  <ul className="mt-4 space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-medium text-foreground">Alamat</div>
                        <div className="text-muted-foreground">{SCHOOL.address}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <Phone className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-medium text-foreground">Telepon</div>
                        <div className="text-muted-foreground">{SCHOOL.phone}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <div className="text-muted-foreground">{SCHOOL.email}</div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Tombol PPDB */}
              <Button asChild size="lg">
                <Link to="/ppdb">Daftar PPDB</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {link && (
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to={link.to}>
            {link.label} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
