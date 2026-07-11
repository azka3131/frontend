export type MessageStatus = "Baru" | "Sudah Dibaca" | "Sudah Dibalas";

export interface Message {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: MessageStatus;
}

export const MESSAGES: Message[] = [
  {
    id: 1,
    name: "Budi Santoso",
    phone: "0812-3456-7890",
    email: "budi@email.com",
    message: "Mohon informasi mengenai jadwal pendaftaran PPDB 2026/2027.",
    date: "28 Juni 2026",
    status: "Baru",
  },
  {
    id: 2,
    name: "Ani Wulandari",
    phone: "0813-2222-1111",
    email: "ani.w@email.com",
    message: "Apakah ada program beasiswa untuk siswa berprestasi?",
    date: "27 Juni 2026",
    status: "Baru",
  },
  {
    id: 3,
    name: "Hendra Kurniawan",
    phone: "0856-7878-9090",
    email: "hendra.k@email.com",
    message: "Saya ingin berkunjung untuk melihat fasilitas sekolah.",
    date: "25 Juni 2026",
    status: "Sudah Dibaca",
  },
  {
    id: 4,
    name: "Siti Maryam",
    phone: "0821-4545-6767",
    email: "siti.m@email.com",
    message: "Kapan jadwal pembagian rapor semester genap?",
    date: "22 Juni 2026",
    status: "Sudah Dibalas",
  },
  {
    id: 5,
    name: "Rizky Ananda",
    phone: "0857-3434-1212",
    email: "rizky@email.com",
    message: "Mohon info ekstrakurikuler yang tersedia tahun ajaran ini.",
    date: "20 Juni 2026",
    status: "Sudah Dibalas",
  },
];

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Author";
  active: boolean;
}

export const ADMIN_USERS: AdminUser[] = [
  { id: 1, name: "Siti Rahmawati", email: "kepsek@cendekiaharapan.sch.id", role: "Super Admin", active: true },
  { id: 2, name: "Andi Pratama", email: "wakasek@cendekiaharapan.sch.id", role: "Editor", active: true },
  { id: 3, name: "Maya Lestari", email: "maya@cendekiaharapan.sch.id", role: "Author", active: true },
  { id: 4, name: "Doni Hartono", email: "doni@cendekiaharapan.sch.id", role: "Editor", active: false },
];

export interface ActivityLog {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
}

export const ACTIVITIES: ActivityLog[] = [
  { id: 1, user: "Andi Pratama", action: "menambahkan berita", target: "Juara Olimpiade Sains", time: "10 menit lalu" },
  { id: 2, user: "Maya Lestari", action: "memperbarui pengumuman", target: "Jadwal UAS Genap 2026", time: "1 jam lalu" },
  { id: 3, user: "Siti Rahmawati", action: "mengunggah foto galeri", target: "Album Wisuda 2026", time: "3 jam lalu" },
  { id: 4, user: "Andi Pratama", action: "mengedit profil guru", target: "Ibu Putri Anggraini", time: "Kemarin" },
  { id: 5, user: "Maya Lestari", action: "menambahkan prestasi", target: "Medali Emas Festival Seni", time: "2 hari lalu" },
];
