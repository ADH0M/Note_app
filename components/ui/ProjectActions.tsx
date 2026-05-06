"use client";

import { ExportImportButtons } from "@/components/ui/ExportImportButtons";

export function ProjectActions({ projectId }: { projectId: string }) {
  return <ExportImportButtons projectId={projectId} />;
}