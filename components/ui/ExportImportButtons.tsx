"use client";

import { useState } from "react";
import { Download, Upload, FileDown, FileUp, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { useDispatchHook } from "@/hooks/useSelector";
import { toggleOpen } from "@/store/reducers/searchSlice";

interface ExportImportButtonsProps {
  projectId: string;
  userId:string;
}

export function ExportImportButtons({ projectId ,userId}: ExportImportButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async (type: "tasks" | "project" | "notes") => {
    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, projectId, format: "csv",userId }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${projectId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success(`Exported ${type} successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (type: "tasks" | "notes") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("projectId", projectId);
        formData.append('userId',userId);
        const res = await fetch("/api/import", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Import failed");

        toast.success(data.message);
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Import failed");
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };
  const dispatch = useDispatchHook();

  return (
    <div className="flex items-center gap-2   ">
      <div
        className="relative group mx-2 hover:bg-primary px-2 py-1 rounded-md"
        onClick={() => {
          dispatch(toggleOpen());
        }}
      >
        <button className="flex justify-center items-center gap-2  w-full h-full">
          <SearchIcon size={14} />
          <span>search</span>
        </button>
      </div>

      <div className="relative group">
        <button
          onClick={() => handleExport("tasks")}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 
          rounded-lg transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        <div className="absolute top-full right-0 mt-1 py-1 bg-popover border border-border
         rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible 
         transition-all z-10 min-w-[140px]">
          <button
            onClick={() => handleExport("tasks")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded-t-lg"
          >
            <FileDown className="w-4 h-4 inline mr-2" />
            Tasks (CSV)
          </button>
          <button
            onClick={() => handleExport("notes")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <FileDown className="w-4 h-4 inline mr-2" />
            Notes (CSV)
          </button>
          <button
            onClick={() => handleExport("project")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded-b-lg"
          >
            <FileDown className="w-4 h-4 inline mr-2" />
            Project (CSV)
          </button>
        </div>
      </div>

      <div className="relative group">
        <button
          onClick={() => handleImport("tasks")}
          disabled={importing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
        <div className="absolute top-full right-0 mt-1 py-1 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible
         group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[140px]">
          <button
            onClick={() => handleImport("tasks")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded-t-lg"
          >
            <FileUp className="w-4 h-4 inline mr-2" />
            Tasks (CSV)
          </button>
          <button
            onClick={() => handleImport("notes")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded-b-lg"
          >
            <FileUp className="w-4 h-4 inline mr-2" />
            Notes (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
