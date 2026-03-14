import { useState, useRef } from "react";
import { usePatternStore } from "../../hooks/usePatternStore";
import PatternCard from "./PatternCard";

export default function PatternList({ onLoadPattern }) {
  const { patterns, loadPattern, deletePattern, importPatterns, exportAll, newPattern } =
    usePatternStore();
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  const filtered = patterns.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (p.name || "").toLowerCase().includes(q) ||
      (p.yarn?.name || "").toLowerCase().includes(q) ||
      (p.garmentType || "").toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    const json = exportAll();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knitshift-patterns.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      importPatterns(ev.target.result);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleLoad = (id) => {
    loadPattern(id);
    onLoadPattern();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this pattern? This cannot be undone.")) {
      deletePattern(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patterns..."
          className="flex-1 min-w-[200px] px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              newPattern();
              onLoadPattern();
            }}
            className="px-4 py-2 text-sm rounded-md bg-machine-700 text-white hover:bg-machine-800 transition-colors"
          >
            New Pattern
          </button>
          <button
            onClick={handleExport}
            disabled={patterns.length === 0}
            className="px-4 py-2 text-sm rounded-md border border-knit-300 text-machine-600 hover:bg-knit-100 transition-colors disabled:opacity-50"
          >
            Export All
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm rounded-md border border-knit-300 text-machine-600 hover:bg-knit-100 transition-colors"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-machine-500">
            {patterns.length === 0
              ? "No saved patterns yet. Create one from the Pattern Input tab."
              : "No patterns match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PatternCard
              key={p.id}
              pattern={p}
              onLoad={() => handleLoad(p.id)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
