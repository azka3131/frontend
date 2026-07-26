import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import 'react-quill-new/dist/quill.snow.css'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Trash2, Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'

const ReactQuill = lazy(() => import('react-quill-new'))

export const Route = createFileRoute('/admin/profile')({
  head: () => ({ meta: [{ title: 'Profil Sekolah — Admin' }] }),
  component: ProfileAdmin,
})

function ProfileAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('vision')

  // State: Visi & Misi
  const [vision, setVision] = useState('')
  const [missions, setMissions] = useState<string[]>([''])

  // State: Sejarah (Teks Sederhana)
  const [historyId, setHistoryId] = useState<number | null>(null)
  const [historyText, setHistoryText] = useState('')

  // State: Struktur Organisasi
  const [structure, setStructure] = useState<any>(null)
  const [structureFile, setStructureFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      // 1. Ambil Visi Misi
      const vmRes = await apiFetch<any>('/profile/vision-mission')
      const vmData = vmRes.data ?? vmRes
      if (vmData) {
        setVision(vmData.vision || '')
        setMissions(vmData.mission?.length > 0 ? vmData.mission : [''])
      }

      // 2. Ambil Sejarah (Ambil baris pertama saja)
      const histRes = await apiFetch<any>('/profile/history')
      const histData = (histRes.data ?? histRes) || []
      if (histData.length > 0) {
        setHistoryId(histData[0].id)
        setHistoryText(histData[0].text || '')
      }

      // 3. Ambil Struktur
      const structRes = await apiFetch<any>('/profile/structure')
      const structData = structRes.data ?? structRes
      if (structData && structData.length > 0) {
        setStructure(structData[0])
      }
    } catch (error) {
      toast.error('Gagal memuat data profil')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  // --- HANDLER VISI MISI ---
  const handleMissionChange = (index: number, value: string) => {
    const newMissions = [...missions]
    newMissions[index] = value
    setMissions(newMissions)
  }
  const removeMission = (index: number) => {
    if (missions.length === 1) return toast.error('Minimal harus ada 1 misi')
    setMissions(missions.filter((_, i) => i !== index))
  }
  const handleSaveVisionMission = async () => {
    if (!vision.trim()) return toast.error('Visi tidak boleh kosong')
    const validMissions = missions.filter((m) => m.trim() !== '')
    if (validMissions.length === 0) return toast.error('Isi minimal 1 misi')

    setSaving(true)
    try {
      await apiFetch('/admin/profile/vision-mission', {
        method: 'PUT',
        body: JSON.stringify({ vision, mission: validMissions }),
      })
      toast.success('Visi & Misi berhasil diperbarui!')
      setMissions(validMissions)
    } catch {
      toast.error('Gagal menyimpan Visi & Misi')
    } finally {
      setSaving(false)
    }
  }

  // --- HANDLER SEJARAH (TEKS BIASA) ---
  const handleSaveHistory = async () => {
    if (!historyText.trim()) return toast.error('Sejarah tidak boleh kosong')
    setSaving(true)
    try {
      const body = JSON.stringify({
        year: '-',
        title: 'Sejarah Sekolah',
        text: historyText,
        order: 0,
      })

      if (historyId) {
        await apiFetch(`/admin/profile/history/${historyId}`, {
          method: 'PUT',
          body,
        })
      } else {
        const res = await apiFetch<any>(`/admin/profile/history`, {
          method: 'POST',
          body,
        })
        const data = res.data ?? res
        setHistoryId(data.id)
      }
      toast.success('Sejarah berhasil diperbarui!')
    } catch {
      toast.error('Gagal menyimpan Sejarah')
    } finally {
      setSaving(false)
    }
  }

  // --- HANDLER STRUKTUR ORGANISASI ---
  const handleSaveStructure = async () => {
    if (!structureFile)
      return toast.success('Tidak ada perubahan gambar struktur')
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('photo', structureFile)
      formData.append('name', 'Bagan Utama')
      formData.append('position', 'Struktur Organisasi')

      if (structure?.id) {
        formData.append('_method', 'PUT')
        await apiFetch(`/admin/profile/structure/${structure.id}`, {
          method: 'POST',
          body: formData,
        })
      } else {
        await apiFetch(`/admin/profile/structure`, {
          method: 'POST',
          body: formData,
        })
      }
      toast.success('Gambar bagan struktur berhasil diperbarui!')
      setStructureFile(null)
      fetchProfileData()
    } catch {
      toast.error('Gagal menyimpan Bagan Struktur')
    } finally {
      setSaving(false)
    }
  }

  // --- HANDLER HAPUS STRUKTUR ---
  const handleDeleteStructure = async () => {
    if (!structure?.id) return
    if (!confirm('Yakin ingin menghapus bagan struktur organisasi ini?')) return

    setSaving(true)
    try {
      await apiFetch(`/admin/profile/structure/${structure.id}`, {
        method: 'DELETE',
      })
      toast.success('Bagan struktur berhasil dihapus')
      setStructure(null) // Bersihkan tampilan
    } catch {
      toast.error('Gagal menghapus bagan')
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <AdminLayout title="Profil Sekolah">
        <div className="p-8 text-center text-muted-foreground">
          Memuat data profil...
        </div>
      </AdminLayout>
    )

  return (
    <AdminLayout
      title="Profil Sekolah"
      breadcrumbs={[{ label: 'School Profile' }]}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="vision">Visi & Misi</TabsTrigger>
          <TabsTrigger value="history">Sejarah</TabsTrigger>
          <TabsTrigger value="structure">Struktur Organisasi</TabsTrigger>
        </TabsList>

        {/* TAB VISI & MISI */}
        <TabsContent value="vision" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visi</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={6}
                  placeholder="Tuliskan visi sekolah di sini..."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Misi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {missions.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={m}
                      onChange={(e) => handleMissionChange(i, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeMission(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMissions([...missions, ''])}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Misi
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveVisionMission} disabled={saving}>
              {saving ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              Simpan Visi & Misi
            </Button>
          </div>
        </TabsContent>

        {/* TAB SEJARAH */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sejarah Sekolah</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-md">
                <Suspense
                  fallback={
                    <div className="h-64 flex items-center justify-center border rounded-md text-muted-foreground">
                      Memuat Editor...
                    </div>
                  }
                >
                  <ReactQuill
                    theme="snow"
                    value={historyText}
                    onChange={setHistoryText}
                    placeholder="Ceritakan sejarah dan latar belakang sekolah di sini..."
                    className="h-64 mb-12"
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveHistory} disabled={saving}>
              {saving ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              Simpan Sejarah
            </Button>
          </div>
        </TabsContent>

        {/* TAB STRUKTUR */}
        <TabsContent value="structure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Bagan Struktur Organisasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border p-8 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) setStructureFile(e.target.files[0])
                  }}
                  accept="image/*"
                  className="hidden"
                />

                {structureFile ? (
                  <img
                    src={URL.createObjectURL(structureFile)}
                    alt="Preview"
                    className="max-h-96 rounded-lg object-contain shadow-sm"
                  />
                ) : structure?.photo ? (
                  <img
                    src={
                      structure.photo.startsWith('http')
                        ? structure.photo
                        : `http://127.0.0.1:8000${structure.photo}`
                    }
                    alt="Bagan"
                    className="max-h-96 rounded-lg object-contain shadow-sm"
                  />
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Klik untuk mengunggah gambar struktur
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mendukung PNG/JPG, disarankan rasio lanskap.
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tombol aksi dengan Hapus Bagan */}
          {/* Di dalam TabsContent value="structure" */}
          <div className="mt-6 flex justify-end gap-2">
            {structure?.id && (
              <Button
                variant="destructive"
                onClick={handleDeleteStructure}
                disabled={saving}
              >
                Hapus Bagan
              </Button>
            )}
            <Button onClick={handleSaveStructure} disabled={saving}>
              {saving ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              Simpan Bagan Struktur
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
