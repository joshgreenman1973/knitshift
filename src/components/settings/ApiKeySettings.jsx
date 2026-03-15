import { useState, useEffect } from "react";
import { getApiKey, setApiKey, hasApiKey } from "../../engine/visionExtractor";

export default function ApiKeySettings() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
  }, []);

  const handleSave = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setKey("");
    setApiKey("");
    setSaved(false);
  };

  const masked = key ? key.slice(0, 10) + "..." + key.slice(-4) : "";

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg border border-knit-200 p-5">
        <h2 className="text-lg font-semibold text-machine-800 mb-1">
          Anthropic API Key
        </h2>
        <p className="text-sm text-machine-500 mb-4">
          KnitShift uses Claude AI to read pattern PDFs and screenshots. Your
          key is stored only in this browser — it never leaves your device
          except to call the Anthropic API directly.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-machine-700 mb-1">
              API Key
            </label>
            <div className="flex gap-2">
              <input
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setSaved(false);
                }}
                placeholder="sk-ant-api03-..."
                className="flex-1 px-3 py-2 border border-knit-200 rounded-md text-machine-800 font-mono text-sm focus:ring-2 focus:ring-knit-400 outline-none"
              />
              <button
                onClick={() => setShow(!show)}
                className="px-3 py-2 text-sm border border-knit-200 rounded-md text-machine-600 hover:bg-knit-50"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className="px-4 py-2 bg-machine-700 text-white rounded-md text-sm font-medium hover:bg-machine-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save Key
            </button>
            {hasApiKey() && (
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Remove Key
              </button>
            )}
            {saved && (
              <span className="self-center text-sm text-green-600 font-medium">
                Saved!
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-knit-50 border border-knit-200 rounded-md text-sm text-machine-600">
          <p className="font-medium mb-1">How to get an API key:</p>
          <ol className="list-decimal list-inside space-y-1 text-machine-500">
            <li>
              Go to{" "}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-knit-600 underline"
              >
                console.anthropic.com
              </a>
            </li>
            <li>Sign up or log in</li>
            <li>Create a new API key</li>
            <li>Add a small amount of credit ($5 is plenty — each pattern read costs about 1-5 cents)</li>
          </ol>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-knit-200 p-5">
        <h2 className="text-lg font-semibold text-machine-800 mb-1">
          About KnitShift
        </h2>
        <p className="text-sm text-machine-500">
          KnitShift helps you adapt hand-knitting patterns for the Brother
          KH-930 knitting machine. Drop in a pattern PDF or screenshot, and it
          will extract the key details and translate them into machine knitting
          instructions with step-by-step guidance.
        </p>
        <ul className="mt-3 text-sm text-machine-500 space-y-1">
          <li>&bull; Single-bed stockinette patterns (no ribber needed)</li>
          <li>&bull; Gauge conversion from hand to machine</li>
          <li>&bull; Shaping translation with KH-930 specific tips</li>
          <li>&bull; Pattern catalogue saved in your browser</li>
        </ul>
      </section>
    </div>
  );
}
