export const SCHOOL = {
  name: "SD Cendekia Harapan",
  tagline: "Belajar, Berkembang, Berprestasi",
  motto: "Cerdas, Berkarakter, Berprestasi",
  welcome:
    "Selamat datang di SD Cendekia Harapan — sekolah dasar modern yang menumbuhkan rasa ingin tahu, karakter, dan kreativitas setiap anak.",
  address: "Jl. Pendidikan No. 123, Jakarta Selatan 12345",
  phone: "(021) 555-1234",
  email: "info@cendekiaharapan.sch.id",
  hours: "Senin – Jumat, 07.00 – 15.00",
};

// Principal welcome — admin will edit later via dashboard.
export const PRINCIPAL = {
  name: "Dra. Siti Rahmawati, M.Pd.",
  title: "Kepala Sekolah",
  photo: "https://i.pravatar.cc/400?img=47",
  message:
    "Assalamu'alaikum dan salam sejahtera. Atas nama keluarga besar SD Cendekia Harapan, kami menyambut hangat kehadiran Anda di laman resmi kami. Sekolah ini berkomitmen menumbuhkan karakter mulia, semangat belajar, dan kreativitas anak-anak kami melalui pembelajaran yang menyenangkan dan bermakna. Mari bersama membangun generasi penerus yang cerdas, berakhlak, dan siap menghadapi masa depan.",
};

// Hero slider images — admin will manage these later via dashboard.
export const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80",
    title: "Selamat Datang di SD Cendekia Harapan",
    subtitle: "Cerdas, Berkarakter, Berprestasi",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80",
    title: "Belajar dengan Penuh Semangat",
    subtitle: "Lingkungan ramah anak yang menumbuhkan rasa ingin tahu.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1920&q=80",
    title: "Membangun Generasi Masa Depan",
    subtitle: "Pendidikan karakter berlandaskan nilai luhur bangsa.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80",
    title: "Pendaftaran Siswa Baru Dibuka",
    subtitle: "Bergabunglah bersama keluarga besar kami tahun ini.",
  },
];

export const STATS = [
  { label: "Siswa Aktif", value: "820+" },
  { label: "Guru & Staf", value: "65" },
  { label: "Ruang Kelas", value: "30" },
  { label: "Tahun Berdiri", value: "1985" },
];

export const VISION =
  "Menjadi sekolah dasar unggulan yang membentuk generasi cerdas, berkarakter, dan siap menghadapi tantangan masa depan dengan nilai-nilai luhur bangsa.";

export const MISSION = [
  "Menyelenggarakan pembelajaran aktif, kreatif, dan menyenangkan.",
  "Menumbuhkan karakter religius dan peduli sosial.",
  "Mengembangkan literasi, numerasi, dan kompetensi digital.",
  "Membangun budaya cinta lingkungan dan hidup sehat.",
  "Menjalin kemitraan erat antara sekolah, keluarga, dan masyarakat.",
];

export const HISTORY = [
  {
    year: "1985",
    title: "Sekolah Didirikan",
    text: "Berawal dari 3 ruang kelas sederhana oleh sekelompok pendidik visioner.",
  },
  {
    year: "2002",
    title: "Kurikulum Berbasis Karakter",
    text: "Salah satu pelopor penerapan pendidikan karakter di Indonesia.",
  },
  {
    year: "2018",
    title: "Gedung Baru 3 Lantai",
    text: "Meresmikan gedung modern dengan lab komputer, sains, dan perpustakaan.",
  },
  {
    year: "2026",
    title: "Lebih dari 8.000 Alumni",
    text: "Lulusan tersebar di berbagai bidang dan jenjang pendidikan.",
  },
];

export type NewsType = "news" | "announcement";
export type AttachmentKind = "pdf" | "doc" | "docx" | "xls" | "xlsx" | "zip";
/**
 * Visibility status untuk berita & pengumuman.
 * Disiapkan agar mudah dipetakan ke kolom `status` pada MySQL dan dikelola
 * melalui Laravel REST API di masa depan.
 */
export type ContentStatus =
  | "Disematkan"
  | "Dipublikasikan"
  | "Disembunyikan"
  | "Diarsipkan";
export const CONTENT_STATUSES: ContentStatus[] = [
  "Disematkan",
  "Dipublikasikan",
  "Disembunyikan",
  "Diarsipkan",
];
export interface Attachment {
  name: string;
  size: string;
  kind: AttachmentKind;
  url: string;
}
export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  date: string;
  category: string;
  type: NewsType;
  excerpt: string;
  image: string;
  author: string;
  content: string[];
  attachments?: Attachment[];
  status: ContentStatus;
}

const lorem = (topic: string): string[] => [
  `${topic} menjadi salah satu agenda penting yang kami selenggarakan di SD Cendekia Harapan tahun ini. Kegiatan ini dirancang untuk memberikan pengalaman belajar yang bermakna bagi seluruh siswa serta memperkuat keterlibatan orang tua dan masyarakat sekitar.`,
  `Selama pelaksanaan, para siswa terlihat antusias mengikuti setiap rangkaian acara. Guru dan staf bekerja sama menyiapkan materi yang sesuai dengan tahap perkembangan anak, sehingga proses belajar menjadi menyenangkan sekaligus mendalam.`,
  `Kami percaya bahwa kegiatan seperti ini bukan sekadar seremonial, melainkan bagian dari upaya membentuk karakter, menumbuhkan rasa percaya diri, dan mengasah kemampuan berpikir kritis siswa sejak dini.`,
  `Terima kasih kepada seluruh pihak yang telah mendukung — guru, orang tua, mitra, dan tentu saja para siswa hebat kami. Sampai jumpa pada kegiatan berikutnya, dan terus dukung perjalanan belajar anak-anak kami.`,
];

const NEWS_DATA: NewsArticle[] = [
  {
    id: 1,
    slug: "juara-umum-olimpiade-sains-provinsi",
    title: "Juara Umum Olimpiade Sains Tingkat Provinsi",
    date: "12 Juni 2026",
    category: "Prestasi",
    type: "news",
    excerpt:
      "Tim sains SD Cendekia Harapan meraih juara umum dalam Olimpiade Sains Nasional tingkat provinsi tahun ini.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80",
    author: "Humas Sekolah",
    content: lorem("Olimpiade Sains Tingkat Provinsi"),
    status: "Disematkan",
  },
  {
    id: 2,
    slug: "pekan-literasi-festival-buku-anak-2026",
    title: "Pekan Literasi & Festival Buku Anak 2026",
    date: "5 Juni 2026",
    category: "Kegiatan",
    type: "news",
    excerpt:
      "Sepekan penuh kegiatan membaca, mendongeng, dan bertemu penulis cilik favorit siswa-siswi kami.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80",
    author: "Tim Perpustakaan",
    content: lorem("Pekan Literasi & Festival Buku Anak"),
    status: "Dipublikasikan",
  },
  {
    id: 3,
    slug: "pembukaan-ppdb-2026-2027",
    title: "Pembukaan Pendaftaran Siswa Baru 2026/2027",
    date: "1 Juni 2026",
    category: "Pengumuman",
    type: "announcement",
    excerpt:
      "PPDB tahun ajaran 2026/2027 resmi dibuka. Daftarkan putra-putri Anda untuk bergabung bersama kami.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80",
    author: "Panitia PPDB",
    content: lorem("Pembukaan PPDB 2026/2027"),
    attachments: [
      { name: "Formulir-Pendaftaran-PPDB-2026.pdf", size: "248 KB", kind: "pdf", url: "/attachments/Formulir-Pendaftaran-PPDB-2026.pdf" },
      { name: "Panduan-PPDB-2026.docx", size: "112 KB", kind: "docx", url: "/attachments/Panduan-PPDB-2026.docx" },
      { name: "Jadwal-Seleksi-PPDB.xlsx", size: "34 KB", kind: "xlsx", url: "/attachments/Jadwal-Seleksi-PPDB.xlsx" },
    ],
    status: "Disematkan",
  },
  {
    id: 4,
    slug: "kunjungan-edukatif-museum-nasional",
    title: "Kunjungan Edukatif ke Museum Nasional",
    date: "22 Mei 2026",
    category: "Kegiatan",
    type: "news",
    excerpt:
      "Siswa kelas 5 belajar sejarah secara langsung melalui kunjungan ke Museum Nasional Indonesia.",
    image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=1600&q=80",
    author: "Wali Kelas 5",
    content: lorem("Kunjungan Edukatif ke Museum Nasional"),
    status: "Dipublikasikan",
  },
  {
    id: 5,
    slug: "program-sekolah-hijau-diluncurkan",
    title: "Program Sekolah Hijau Diluncurkan",
    date: "15 Mei 2026",
    category: "Program",
    type: "news",
    excerpt: "Inisiatif ramah lingkungan baru untuk membentuk karakter peduli alam sejak dini.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80",
    author: "Tim Adiwiyata",
    content: lorem("Program Sekolah Hijau"),
    status: "Disembunyikan",
  },
  {
    id: 6,
    slug: "workshop-parenting-psikolog-anak",
    title: "Workshop Parenting Bersama Psikolog Anak",
    date: "8 Mei 2026",
    category: "Kegiatan",
    type: "news",
    excerpt:
      "Sesi diskusi bersama orang tua mengenai tumbuh kembang dan pendidikan emosional anak.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&q=80",
    author: "Komite Sekolah",
    content: lorem("Workshop Parenting Bersama Psikolog Anak"),
    status: "Diarsipkan",
  },
  {
    id: 7,
    slug: "libur-hari-raya-penyesuaian-jadwal",
    title: "Libur Hari Raya & Penyesuaian Jadwal Belajar",
    date: "20 April 2026",
    category: "Pengumuman",
    type: "announcement",
    excerpt:
      "Sekolah akan libur selama satu minggu. Pembelajaran daring akan diberikan untuk pekan berikutnya.",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1600&q=80",
    author: "Tata Usaha",
    content: lorem("Libur Hari Raya & Penyesuaian Jadwal"),
    attachments: [
      { name: "Surat-Edaran-Libur-Hari-Raya.pdf", size: "186 KB", kind: "pdf", url: "/attachments/Surat-Edaran-Libur-Hari-Raya.pdf" },
      { name: "Materi-Pembelajaran-Daring.zip", size: "4.2 MB", kind: "zip", url: "/attachments/Materi-Pembelajaran-Daring.zip" },
    ],
    status: "Dipublikasikan",
  },
  {
    id: 8,
    slug: "rapat-orang-tua-semester-genap",
    title: "Rapat Orang Tua Murid Semester Genap",
    date: "10 April 2026",
    category: "Pengumuman",
    type: "announcement",
    excerpt:
      "Diharapkan kehadiran seluruh orang tua/wali murid pada rapat semester genap di aula sekolah.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&q=80",
    author: "Komite Sekolah",
    content: lorem("Rapat Orang Tua Murid Semester Genap"),
    attachments: [
      { name: "Undangan-Rapat-Orang-Tua.pdf", size: "92 KB", kind: "pdf", url: "/attachments/Undangan-Rapat-Orang-Tua.pdf" },
      { name: "Agenda-Rapat-Semester-Genap.doc", size: "58 KB", kind: "doc", url: "/attachments/Agenda-Rapat-Semester-Genap.doc" },
    ],
    status: "Dipublikasikan",
  },
  {
    id: 9,
    slug: "jadwal-ujian-akhir-semester-genap",
    title: "Jadwal Ujian Akhir Semester Genap 2026",
    date: "2 April 2026",
    category: "Pengumuman",
    type: "announcement",
    excerpt:
      "Jadwal lengkap Ujian Akhir Semester Genap untuk seluruh jenjang kelas telah dirilis.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&q=80",
    author: "Bidang Kurikulum",
    content: lorem("Jadwal Ujian Akhir Semester Genap"),
    attachments: [
      { name: "Jadwal-UAS-Genap-2026.pdf", size: "164 KB", kind: "pdf", url: "/attachments/Surat-Edaran-Libur-Hari-Raya.pdf" },
      { name: "Kisi-Kisi-UAS.xlsx", size: "78 KB", kind: "xlsx", url: "/attachments/Jadwal-Seleksi-PPDB.xlsx" },
    ],
    status: "Disembunyikan",
  },
  {
    id: 10,
    slug: "vaksinasi-dan-pemeriksaan-kesehatan",
    title: "Vaksinasi & Pemeriksaan Kesehatan Berkala",
    date: "25 Maret 2026",
    category: "Pengumuman",
    type: "announcement",
    excerpt:
      "Bekerja sama dengan Puskesmas, sekolah akan mengadakan vaksinasi dan pemeriksaan kesehatan untuk seluruh siswa.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80",
    author: "Unit Kesehatan Sekolah",
    content: lorem("Vaksinasi & Pemeriksaan Kesehatan Berkala"),
    status: "Diarsipkan",
  },
];


export const NEWS = NEWS_DATA;
export const SCHOOL_NEWS = NEWS_DATA.filter((n) => n.type === "news");
export const ANNOUNCEMENTS = NEWS_DATA.filter((n) => n.type === "announcement");

/**
 * Urutkan konten agar `Disematkan` selalu berada di atas `Dipublikasikan`.
 * Hanya kedua status ini yang boleh tampil di halaman publik.
 */
export function sortPinnedFirst<T extends { status: ContentStatus }>(items: T[]): T[] {
  const order: Record<ContentStatus, number> = {
    Disematkan: 0,
    Dipublikasikan: 1,
    Disembunyikan: 2,
    Diarsipkan: 3,
  };
  return [...items].sort((a, b) => order[a.status] - order[b.status]);
}
/** Berita yang tampil di website publik (Disematkan + Dipublikasikan). */
export const PUBLIC_SCHOOL_NEWS = sortPinnedFirst(
  SCHOOL_NEWS.filter((n) => n.status === "Disematkan" || n.status === "Dipublikasikan"),
);
/** Pengumuman yang tampil di website publik (Disematkan + Dipublikasikan). */
export const PUBLIC_ANNOUNCEMENTS = sortPinnedFirst(
  ANNOUNCEMENTS.filter((n) => n.status === "Disematkan" || n.status === "Dipublikasikan"),
);

export function findNews(slug: string): NewsArticle | undefined {
  return NEWS_DATA.find((n) => n.slug === slug);
}

export const TEACHERS = [
  {
    name: "Dra. Siti Rahmawati, M.Pd.",
    position: "Kepala Sekolah",
    bio: "Lebih dari 25 tahun mengabdi di dunia pendidikan dasar.",
    photo: "https://i.pravatar.cc/300?img=47",
  },
  {
    name: "Bapak Andi Pratama, S.Pd.",
    position: "Wakil Kepala Sekolah",
    bio: "Mengkoordinasi kurikulum dan pengembangan akademik.",
    photo: "https://i.pravatar.cc/300?img=12",
  },
  {
    name: "Ibu Maya Lestari, S.Pd.",
    position: "Guru Kelas 1",
    bio: "Spesialis pembelajaran awal anak dan literasi dini.",
    photo: "https://i.pravatar.cc/300?img=45",
  },
  {
    name: "Bapak Reza Saputra, S.Pd.",
    position: "Guru Matematika",
    bio: "Membuat matematika menjadi menyenangkan dan aplikatif.",
    photo: "https://i.pravatar.cc/300?img=33",
  },
  {
    name: "Ibu Putri Anggraini, S.Pd.",
    position: "Guru Bahasa Inggris",
    bio: "Mengajak siswa percaya diri berbicara bahasa Inggris.",
    photo: "https://i.pravatar.cc/300?img=49",
  },
  {
    name: "Bapak Hadi Wijaya, S.Pd.",
    position: "Guru Olahraga",
    bio: "Menumbuhkan sportivitas dan gaya hidup sehat sejak dini.",
    photo: "https://i.pravatar.cc/300?img=15",
  },
  {
    name: "Ibu Nurul Aisyah, S.Pd.",
    position: "Guru Seni Budaya",
    bio: "Mengembangkan kreativitas melalui seni rupa dan musik.",
    photo: "https://i.pravatar.cc/300?img=44",
  },
  {
    name: "Bapak Doni Hartono, S.Kom.",
    position: "Guru Teknologi",
    bio: "Memperkenalkan literasi digital dan coding dasar.",
    photo: "https://i.pravatar.cc/300?img=11",
  },
];

// Gallery organized by albums.
export const GALLERY_ALBUMS = [
  {
    title: "Kegiatan Belajar",
    cover: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    ],
  },
  {
    title: "Perayaan & Pentas Seni",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
      "https://images.unsplash.com/photo-1522661067900-ab829854a57f?w=800&q=80",
    ],
  },
  {
    title: "Olahraga & Outdoor",
    cover: "https://images.unsplash.com/photo-1526676037777-05a232554d77?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1526676037777-05a232554d77?w=800&q=80",
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80",
      "https://images.unsplash.com/photo-1610484826917-0f101a7a64fc?w=800&q=80",
    ],
  },
  {
    title: "Wisuda & Prestasi",
    cover: "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800&q=80",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
    ],
  },
];

export const ACHIEVEMENTS = [
  {
    title: "Juara 1 Olimpiade Sains Nasional",
    year: 2026,
    description: "Tingkat Provinsi DKI Jakarta kategori IPA.",
    image: "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800&q=80",
  },
  {
    title: "Juara 2 Lomba Cerdas Cermat",
    year: 2025,
    description: "Tingkat Kota Jakarta Selatan jenjang SD.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
  },
  {
    title: "Medali Emas Festival Seni",
    year: 2025,
    description: "Kategori paduan suara tingkat nasional.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  },
  {
    title: "Juara Umum Pekan Olahraga Pelajar",
    year: 2024,
    description: "Cabang atletik, renang, dan bulutangkis.",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554d77?w=800&q=80",
  },
  {
    title: "Sekolah Adiwiyata Nasional",
    year: 2024,
    description: "Penghargaan sekolah peduli lingkungan.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
  },
  {
    title: "Juara 1 Coding Competition",
    year: 2023,
    description: "Tingkat SD se-Jabodetabek.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  },
];

export const FACILITIES = [
  {
    title: "Perpustakaan Modern",
    description: "Ribuan koleksi buku anak, ruang baca nyaman, dan area mendongeng.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
  },
  {
    title: "Laboratorium Komputer",
    description: "30 unit komputer terbaru untuk pembelajaran teknologi dan coding.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  },
  {
    title: "Laboratorium Sains",
    description: "Ruang eksperimen aman dan lengkap untuk siswa kelas atas.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
  },
  {
    title: "Lapangan Olahraga",
    description: "Lapangan multi-fungsi untuk futsal, basket, dan upacara.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
  },
  {
    title: "Aula Serbaguna",
    description: "Tempat pertunjukan seni, seminar, dan kegiatan sekolah.",
    image: "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=800&q=80",
  },
  {
    title: "Ruang Kelas Ber-AC",
    description: "Ruangan luas, terang, dan nyaman dengan smart board interaktif.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  },
  {
    title: "Kantin Sehat",
    description: "Menyajikan menu bergizi dengan standar kebersihan tinggi.",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80",
  },
  {
    title: "Klinik Sekolah",
    description: "Layanan kesehatan dasar dengan perawat siaga setiap hari.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
  },
];

// Navigation with nested dropdowns. Each entry is a top-level menu item; if
// `children` is present it renders as a dropdown.
export type NavChild = { to: string; label: string };
export type NavItem = { to: string; label: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Beranda" },
  {
    to: "/profile",
    label: "Profil",
    children: [
      { to: "/profile/vision", label: "Visi & Misi" },
      { to: "/profile/history", label: "Sejarah Sekolah" },
      { to: "/profile/structure", label: "Struktur Organisasi" },
    ],
  },
  { to: "/teachers", label: "Guru & Staf" },
  {
    to: "/news",
    label: "Berita",
    children: [
      { to: "/news/school", label: "Berita Sekolah" },
      { to: "/announcements", label: "Pengumuman" },
    ],
  },
  { to: "/ppdb", label: "PPDB" },
  { to: "/gallery", label: "Galeri" },
  { to: "/achievements", label: "Prestasi" },
  { to: "/facilities", label: "Fasilitas" },
];

// Flat list of routes for the footer "quick links" section.
export const FOOTER_LINKS: NavChild[] = [
  { to: "/", label: "Beranda" },
  { to: "/profile/vision", label: "Visi & Misi" },
  { to: "/teachers", label: "Guru & Staf" },
  { to: "/news/school", label: "Berita Sekolah" },
  { to: "/announcements", label: "Pengumuman" },
  { to: "/ppdb", label: "PPDB" },
  { to: "/gallery", label: "Galeri" },
  { to: "/achievements", label: "Prestasi" },
  { to: "/facilities", label: "Fasilitas" },
];
