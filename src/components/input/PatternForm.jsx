import { usePatternStore } from "../../hooks/usePatternStore";
import { GARMENT_TYPES, getDefaultMeasurements } from "../../data/garmentTemplates";
import GaugeSection from "./GaugeSection";
import MeasurementsSection from "./MeasurementsSection";
import ShapingSection from "./ShapingSection";
import { generateMachinePattern } from "../../engine/patternGenerator";

export default function PatternForm({ onGenerate }) {
  const { currentPattern, updateField, updateCurrent, savePattern } = usePatternStore();

  const handleGarmentChange = (type) => {
    updateCurrent({
      garmentType: type,
      measurements: getDefaultMeasurements(type),
      shaping: {},
    });
  };

  const handleGenerate = () => {
    const result = generateMachinePattern(currentPattern);
    updateField("machinePattern", result);
    savePattern();
    onGenerate();
  };

  const template = GARMENT_TYPES[currentPattern.garmentType];

  return (
    <div className="space-y-6">
      {/* Pattern Name */}
      <section className="bg-white rounded-lg border border-knit-200 p-5">
        <label className="block text-sm font-medium text-machine-700 mb-1">
          Pattern Name
        </label>
        <input
          type="text"
          value={currentPattern.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="e.g., Autumn Pullover"
          className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 focus:border-knit-400 outline-none"
        />
      </section>

      {/* Garment Type */}
      <section className="bg-white rounded-lg border border-knit-200 p-5">
        <h2 className="text-lg font-semibold text-machine-800 mb-3">
          Garment Type
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(GARMENT_TYPES).map(([key, gt]) => (
            <button
              key={key}
              onClick={() => handleGarmentChange(key)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                currentPattern.garmentType === key
                  ? "border-knit-500 bg-knit-50"
                  : "border-knit-200 hover:border-knit-300"
              }`}
            >
              <div className="font-medium text-machine-800">{gt.label}</div>
              <div className="text-xs text-machine-500 mt-1">
                {gt.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Yarn */}
      <section className="bg-white rounded-lg border border-knit-200 p-5">
        <h2 className="text-lg font-semibold text-machine-800 mb-3">Yarn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-machine-700 mb-1">
              Yarn Name
            </label>
            <input
              type="text"
              value={currentPattern.yarn.name}
              onChange={(e) => updateField("yarn.name", e.target.value)}
              placeholder="e.g., Cascade 220"
              className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-machine-700 mb-1">
              Yarn Weight
            </label>
            <select
              value={currentPattern.yarn.weight}
              onChange={(e) => updateField("yarn.weight", e.target.value)}
              className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
            >
              <option value="fingering">Fingering / Sock</option>
              <option value="sport">Sport</option>
              <option value="dk">DK</option>
              <option value="worsted">Worsted</option>
              <option value="aran">Aran</option>
              <option value="bulky">Bulky</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-machine-700 mb-1">
              Fiber Content
            </label>
            <input
              type="text"
              value={currentPattern.yarn.fiberContent}
              onChange={(e) => updateField("yarn.fiberContent", e.target.value)}
              placeholder="e.g., 100% wool"
              className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-machine-700 mb-1">
              Total Yardage (from hand pattern)
            </label>
            <input
              type="number"
              value={currentPattern.yarn.yardage}
              onChange={(e) => updateField("yarn.yardage", e.target.value)}
              placeholder="e.g., 1200"
              className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Gauge */}
      <GaugeSection />

      {/* Measurements */}
      <MeasurementsSection template={template} />

      {/* Edge Treatment */}
      <section className="bg-white rounded-lg border border-knit-200 p-5">
        <h2 className="text-lg font-semibold text-machine-800 mb-3">
          Edge Treatment
        </h2>
        <p className="text-sm text-machine-500 mb-3">
          Without a ribber, true ribbing isn't possible on the KH-930. Choose an
          alternative for hems and cuffs.
        </p>
        <div className="space-y-2">
          {[
            {
              value: "turnedHem",
              label: "Turned hem (recommended)",
              desc: "Knit extra rows that fold under. Clean, non-curling edge.",
            },
            {
              value: "rollEdge",
              label: "Rolled stockinette edge",
              desc: "Let the natural curl form the edge. Simple but casual.",
            },
            {
              value: "crochetEdge",
              label: "Crochet edging (added after)",
              desc: "Finish the piece, then crochet an edge. Versatile.",
            },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                currentPattern.edgeTreatment === opt.value
                  ? "border-knit-500 bg-knit-50"
                  : "border-knit-200 hover:border-knit-300"
              }`}
            >
              <input
                type="radio"
                name="edgeTreatment"
                value={opt.value}
                checked={currentPattern.edgeTreatment === opt.value}
                onChange={(e) => updateField("edgeTreatment", e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-machine-800 text-sm">
                  {opt.label}
                </div>
                <div className="text-xs text-machine-500">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Shaping (for pullover and hat) */}
      {template.shapingSections.length > 0 && <ShapingSection />}

      {/* Generate Button */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          className="flex-1 bg-machine-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-machine-800 transition-colors"
        >
          Generate Machine Pattern
        </button>
        <button
          onClick={savePattern}
          className="px-6 py-3 rounded-lg font-medium border border-knit-300 text-machine-700 hover:bg-knit-100 transition-colors"
        >
          Save Draft
        </button>
      </div>
    </div>
  );
}
