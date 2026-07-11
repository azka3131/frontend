export interface News {
  id: number

  title: string

  slug: string

  category: string

  type: "news" | "announcement"

  excerpt: string

  content: string[]

  image: string

  author: string

  status:
    | "Dipublikasikan"
    | "Disematkan"
    | "Disembunyikan"
    | "Diarsipkan"

  date: string

  attachments?: {
    id: number
    name: string
    url: string
    size: string
    kind: string
  }[]
}