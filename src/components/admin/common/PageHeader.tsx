import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
}

export default function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <Button onClick={onAction}>
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}