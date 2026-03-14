export default function PatternCard({ pattern, onLoad, onDelete }) {
  const date = new Date(pattern.updatedAt || pattern.createdAt);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-lg border border-knit-200 p-4 hover:border-knit-400 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-machine-800 truncate">
            {pattern.name || "Untitled"}
          </h3>
          <p className="text-xs text-machine-500 capitalize mt-0.5">
            {pattern.garmentType}
            {pattern.yarn?.name ? ` · ${pattern.yarn.name}` : ""}
          </p>
          <p className="text-xs text-machine-400 mt-1">{dateStr}</p>
        </div>
        {pattern.machinePattern && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
            Generated
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onLoad}
          className="flex-1 text-sm py-1.5 rounded-md bg-machine-700 text-white hover:bg-machine-800 transition-colors"
        >
          Open
        </button>
        <button
          onClick={onDelete}
          className="text-sm py-1.5 px-3 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
