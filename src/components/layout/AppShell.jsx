import TabNav from "./TabNav";

export default function AppShell({ activeTab, onTabChange, children }) {
  return (
    <div className="min-h-screen bg-knit-50">
      <header className="bg-white border-b border-knit-200 no-print">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-machine-800 tracking-tight">
                KnitShift
              </h1>
              <p className="text-sm text-machine-500">
                Hand pattern → Brother KH-930
              </p>
            </div>
          </div>
          <TabNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
