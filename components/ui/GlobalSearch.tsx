"use client";

import { useEffect, useState } from "react";
import { Search, X, FileText, Folder, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelectorHook } from "@/hooks/useSelector";
import { useDispatch } from "react-redux";
import { toggleOpen } from "@/store/reducers/searchSlice";

type SearchResult = {
  id: string;
  title: string;
  type: "project" | "task" | "note";
  url: string;
};

export function GlobalSearch() {
  const {open} = useSelectorHook((s)=>s.openSearchSlice);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        dispatch(toggleOpen());
      }
      if (e.key === "Escape") {
        dispatch(toggleOpen());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Folder className="w-4 h-4" />;
      case "task":
        return <CheckSquare className="w-4 h-4" />;
      case "note":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl">
        <div className="bg-popover border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, tasks, notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => dispatch(toggleOpen())}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>
            ) : results.length === 0 && query.length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                No results found
              </div>
            ) : (
              <div className="p-2">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => dispatch(toggleOpen())}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="text-muted-foreground">
                      {getIcon(result.type)}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {result.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {result.type}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
              <span>Open</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}