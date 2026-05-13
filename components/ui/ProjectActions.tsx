"use client";

import { ExportImportButtons } from "@/components/ui/ExportImportButtons";

export function ProjectActions({ projectId ,userId}: { projectId: string ,userId:string }) {
  return <ExportImportButtons projectId={projectId} userId={userId} />;
}