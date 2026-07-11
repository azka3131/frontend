import { Download, FileText, FileSpreadsheet, FileArchive, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Attachment, AttachmentKind } from "@/lib/data";

const ICONS: Record<AttachmentKind, typeof FileIcon> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  zip: FileArchive,
};

const COLORS: Record<AttachmentKind, string> = {
  pdf: "text-red-600 bg-red-50",
  doc: "text-blue-600 bg-blue-50",
  docx: "text-blue-600 bg-blue-50",
  xls: "text-emerald-600 bg-emerald-50",
  xlsx: "text-emerald-600 bg-emerald-50",
  zip: "text-amber-600 bg-amber-50",
};

interface Props {
  attachments: Attachment[];
}

export function AttachmentList({ attachments }: Props) {
  if (!attachments.length) return null;
  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Lampiran</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Unduh berkas terkait pengumuman ini.
      </p>
      <ul className="mt-4 divide-y divide-border">
        {attachments.map((att) => {
          const Icon = ICONS[att.kind] ?? FileIcon;
          return (
            <li
              key={att.name}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${COLORS[att.kind] ?? "text-muted-foreground bg-muted"}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{att.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {att.kind} · {att.size}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <a href={att.url} download={att.name}>
                  <Download className="mr-2 h-4 w-4" />
                  Unduh
                </a>
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
