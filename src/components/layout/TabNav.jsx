const TABS = [
  { key: "input", label: "Pattern Input" },
  { key: "output", label: "Machine Pattern" },
  { key: "catalogue", label: "My Patterns" },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <nav className="flex gap-1 mt-4">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? "bg-knit-50 text-machine-800 border border-knit-200 border-b-knit-50 -mb-px"
              : "text-machine-500 hover:text-machine-700 hover:bg-knit-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
