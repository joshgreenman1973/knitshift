import { useState } from "react";
import AppShell from "./components/layout/AppShell";
import PatternForm from "./components/input/PatternForm";
import PatternOutput from "./components/output/PatternOutput";
import PatternList from "./components/catalogue/PatternList";
import ApiKeySettings from "./components/settings/ApiKeySettings";

function App() {
  const [activeTab, setActiveTab] = useState("input");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "input" && (
        <PatternForm onGenerate={() => setActiveTab("output")} />
      )}
      {activeTab === "output" && <PatternOutput />}
      {activeTab === "catalogue" && (
        <PatternList onLoadPattern={() => setActiveTab("input")} />
      )}
      {activeTab === "settings" && <ApiKeySettings />}
    </AppShell>
  );
}

export default App;
