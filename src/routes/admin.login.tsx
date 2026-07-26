import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import logo from '@/assets/school-logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'

export const Route = createFileRoute('/admin/login')({
  head: () => ({
    meta: [
      { title: 'Admin Login' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminLogin,
})

function AdminLogin() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [schoolSettings, setSchoolSettings] = useState<any>(null)

  // Ambil identitas sekolah agar dinamis
  useEffect(() => {
    apiFetch('/settings')
      .then((res: any) => setSchoolSettings(res.data ?? res))
      .catch(() => {});
  }, []);

  const rawLogo = schoolSettings?.logo;
  const logoSrc = rawLogo && rawLogo.trim() !== "" 
    ? (rawLogo.trim().startsWith('http') ? rawLogo.trim() : `http://127.0.0.1:8000${rawLogo.trim()}`) 
    : logo;

  const schoolName = schoolSettings?.name && schoolSettings.name.trim() !== "" 
    ? schoolSettings.name.trim() 
    : "Memuat...";

  async function handleLogin() {
    try {
      setLoading(true)

      const response = await apiFetch<{
        user: any
        token: string
      }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      localStorage.setItem('token', response.token)
      toast.success('Login berhasil')
      navigate({ to: '/admin' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 35%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <img
            src={logoSrc}
            alt=""
            className="h-12 w-12 rounded-lg bg-white/10 p-1.5 object-contain"
          />
          <div>
            <div className="text-sm font-semibold opacity-80">Admin Panel</div>
            <div className="text-lg font-bold">{schoolName}</div>
          </div>
        </div>
        <div className="relative space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Kelola seluruh konten website sekolah dari satu tempat.
          </h2>
          <p className="max-w-md text-sm text-primary-foreground/85">
            Atur berita, pengumuman, galeri, prestasi, dan informasi PPDB dengan
            mudah dan aman.
          </p>
        </div>
        <div className="relative text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} {schoolName}. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={logoSrc} alt="" className="h-10 w-10 object-contain" />
            <div className="text-base font-bold text-primary">
              {schoolName}
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight">
              Selamat datang kembali
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Masuk ke akun administrator untuk mengelola website.
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault()
              await handleLogin()
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="admin@sekolah.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() =>
                    toast.info('Fitur reset password segera hadir')
                  }
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Toggle password visibility"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Ingat saya selama 30 hari
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Halaman ini khusus pengelola situs.{' '}
            <Link to="/" className="text-primary hover:underline">
              Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}