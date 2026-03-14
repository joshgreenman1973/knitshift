import { useState } from "react";
import { getTechnique } from "../../data/techniqueGuide";

const TYPE_COLORS = {
  setup: "bg-machine-100 border-machine-300",
  "cast-on": "bg-blue-50 border-blue-300",
  hem: "bg-knit-100 border-knit-300",
  body: "bg-gray-50 border-gray-200",
  shaping: "bg-amber-50 border-amber-300",
  "bind-off": "bg-purple-50 border-purple-300",
  finishing: "bg-green-50 border-green-300",
};

const TYPE_LABELS = {
  setup: "Setup",
  "cast-on": "Cast On",
  hem: "Hem / Edge",
  body: "Knit Straight",
  shaping: "Shaping",
  "bind-off": "Bind Off",
  finishing: "Finishing",
};

export default function StepCard({ step, stepNumber }) {
  const [showTips, setShowTips] = useState(false);
  const colorClass = TYPE_COLORS[step.type] || TYPE_COLORS.body;

  return (
    <div className={`step-card rounded-lg border p-4 ${colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/70 text-machine-700 text-xs font-bold px-2 py-0.5 rounded">
              Step {stepNumber}
            </span>
            <span className="text-xs font-medium text-machine-500 uppercase">
              {TYPE_LABELS[step.type] || step.type}
            </span>
          </div>
          <p className="text-sm text-machine-800 font-medium">
            {step.instruction}
          </p>
          {step.kh930Tip && (
            <p className="text-xs text-machine-600 mt-2 italic">
              {step.kh930Tip}
            </p>
          )}
        </div>
        <div className="text-right text-xs text-machine-500 whitespace-nowrap shrink-0">
          {step.stitchCount > 0 && <div>{step.stitchCount} sts</div>}
          {step.rowEnd > 0 && (
            <div>
              Rows {step.rowStart}–{step.rowEnd}
            </div>
          )}
        </div>
      </div>

      {/* Technique guides */}
      {step.techniques && step.techniques.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowTips(!showTips)}
            className="text-xs font-medium text-machine-500 hover:text-machine-700 no-print"
          >
            {showTips ? "Hide" : "Show"} KH-930 how-to ({step.techniques.length})
          </button>

          {showTips && (
            <div className="mt-2 space-y-3">
              {step.techniques.map((techKey) => {
                const tech = getTechnique(techKey);
                if (!tech) return null;
                return (
                  <div
                    key={techKey}
                    className="bg-white/60 rounded-md p-3 text-xs"
                  >
                    <h4 className="font-semibold text-machine-700 mb-1">
                      {tech.name}
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-machine-600">
                      {tech.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                    {tech.tips.length > 0 && (
                      <div className="mt-2 border-t border-machine-200 pt-2">
                        <p className="font-medium text-machine-600 mb-1">
                          Tips:
                        </p>
                        <ul className="space-y-1 text-machine-500">
                          {tech.tips.map((t, i) => (
                            <li key={i}>• {t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
