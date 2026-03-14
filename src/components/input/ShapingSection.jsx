import { usePatternStore } from "../../hooks/usePatternStore";
import { SHAPING_TYPES, GARMENT_TYPES } from "../../data/garmentTemplates";

function ScheduleInput({ label, schedule, onChange }) {
  const addRule = () => {
    onChange([...schedule, { every: 2, times: 3 }]);
  };

  const updateRule = (index, field, value) => {
    const updated = schedule.map((r, i) =>
      i === index ? { ...r, [field]: Number(value) } : r
    );
    onChange(updated);
  };

  const removeRule = (index) => {
    onChange(schedule.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-machine-600 mb-2">
        {label}
      </label>
      {schedule.map((rule, i) => (
        <div key={i} className="flex items-center gap-2 mb-2 text-sm">
          <span className="text-machine-500">
            {label.includes("ncrease") ? "Inc" : "Dec"} 1 st each side every
          </span>
          <input
            type="number"
            min="1"
            value={rule.every}
            onChange={(e) => updateRule(i, "every", e.target.value)}
            className="w-16 px-2 py-1 border border-knit-200 rounded text-machine-800 text-center focus:ring-2 focus:ring-knit-400 outline-none"
          />
          <span className="text-machine-500">rows,</span>
          <input
            type="number"
            min="1"
            value={rule.times}
            onChange={(e) => updateRule(i, "times", e.target.value)}
            className="w-16 px-2 py-1 border border-knit-200 rounded text-machine-800 text-center focus:ring-2 focus:ring-knit-400 outline-none"
          />
          <span className="text-machine-500">times</span>
          {schedule.length > 1 && (
            <button
              onClick={() => removeRule(i)}
              className="text-red-400 hover:text-red-600 ml-1"
              title="Remove"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addRule}
        className="text-xs text-machine-500 hover:text-machine-700 mt-1"
      >
        + Add another stage
      </button>
    </div>
  );
}

function BindOffScheduleInput({ label, schedule, onChange }) {
  const addStep = () => {
    onChange([...schedule, { stitches: 8, times: 2 }]);
  };

  const updateStep = (index, field, value) => {
    const updated = schedule.map((s, i) =>
      i === index ? { ...s, [field]: Number(value) } : s
    );
    onChange(updated);
  };

  const removeStep = (index) => {
    onChange(schedule.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-machine-600 mb-2">
        {label}
      </label>
      {schedule.map((step, i) => (
        <div key={i} className="flex items-center gap-2 mb-2 text-sm">
          <span className="text-machine-500">Bind off</span>
          <input
            type="number"
            min="1"
            value={step.stitches}
            onChange={(e) => updateStep(i, "stitches", e.target.value)}
            className="w-16 px-2 py-1 border border-knit-200 rounded text-machine-800 text-center focus:ring-2 focus:ring-knit-400 outline-none"
          />
          <span className="text-machine-500">sts at beg of next</span>
          <input
            type="number"
            min="1"
            value={step.times}
            onChange={(e) => updateStep(i, "times", e.target.value)}
            className="w-16 px-2 py-1 border border-knit-200 rounded text-machine-800 text-center focus:ring-2 focus:ring-knit-400 outline-none"
          />
          <span className="text-machine-500">rows</span>
          {schedule.length > 1 && (
            <button
              onClick={() => removeStep(i)}
              className="text-red-400 hover:text-red-600 ml-1"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addStep}
        className="text-xs text-machine-500 hover:text-machine-700 mt-1"
      >
        + Add another step
      </button>
    </div>
  );
}

export default function ShapingSection() {
  const { currentPattern, updateField } = usePatternStore();
  const { garmentType, shaping } = currentPattern;
  const template = GARMENT_TYPES[garmentType];

  if (!template || template.shapingSections.length === 0) return null;

  const updateShapingField = (section, field, value) => {
    const updated = {
      ...shaping,
      [section]: { ...shaping[section], [field]: value },
    };
    updateField("shaping", updated);
  };

  return (
    <section className="bg-white rounded-lg border border-knit-200 p-5">
      <h2 className="text-lg font-semibold text-machine-800 mb-1">
        Shaping Schedule
      </h2>
      <p className="text-sm text-machine-500 mb-4">
        Enter the shaping instructions from the hand pattern. These will be
        recalculated for your machine gauge.
      </p>

      <div className="space-y-6">
        {template.shapingSections.map((sectionKey) => {
          const shapingType = SHAPING_TYPES[sectionKey];
          if (!shapingType) return null;

          const sectionData = shaping[sectionKey] || {};

          return (
            <div
              key={sectionKey}
              className="border-l-4 border-knit-300 pl-4"
            >
              <h3 className="text-sm font-semibold text-machine-700">
                {shapingType.label}
              </h3>
              <p className="text-xs text-machine-500 mb-2">
                {shapingType.description}
              </p>

              {/* Fixed fields */}
              {shapingType.fields.map((field) => (
                <div key={field.key} className="mt-2">
                  <label className="block text-sm text-machine-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={sectionData[field.key] || field.default || ""}
                    onChange={(e) =>
                      updateShapingField(
                        sectionKey,
                        field.key,
                        Number(e.target.value)
                      )
                    }
                    className="w-32 px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
                  />
                </div>
              ))}

              {/* Decrease schedule */}
              {shapingType.hasDecreaseSchedule && (
                <ScheduleInput
                  label={shapingType.decreaseLabel}
                  schedule={sectionData.decreaseSchedule || [{ every: 2, times: 3 }]}
                  onChange={(val) =>
                    updateShapingField(sectionKey, "decreaseSchedule", val)
                  }
                />
              )}

              {/* Increase schedule */}
              {shapingType.hasIncreaseSchedule && (
                <ScheduleInput
                  label={shapingType.increaseLabel}
                  schedule={sectionData.increaseSchedule || [{ every: 6, times: 10 }]}
                  onChange={(val) =>
                    updateShapingField(sectionKey, "increaseSchedule", val)
                  }
                />
              )}

              {/* Bind-off schedule */}
              {shapingType.hasBindOffSchedule && (
                <BindOffScheduleInput
                  label={shapingType.bindOffLabel}
                  schedule={sectionData.bindOffSchedule || [{ stitches: 8, times: 2 }]}
                  onChange={(val) =>
                    updateShapingField(sectionKey, "bindOffSchedule", val)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
