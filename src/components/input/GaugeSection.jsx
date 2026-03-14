import { usePatternStore } from "../../hooks/usePatternStore";
import { getEstimatedGauge, KH930 } from "../../data/kh930";

export default function GaugeSection() {
  const { currentPattern, updateField } = usePatternStore();
  const { gauge, yarn } = currentPattern;

  const handleUseEstimate = () => {
    const est = getEstimatedGauge(yarn.weight);
    updateField("gauge.machine.stitchesPer4in", est.sts);
    updateField("gauge.machine.rowsPer4in", est.rows);
    updateField("gauge.machine.tensionDial", est.tension);
    updateField("gauge.machine.swatched", false);
  };

  const yarnWarning =
    yarn.weight === "bulky" ? KH930.warnings.bulky : null;

  return (
    <section className="bg-white rounded-lg border border-knit-200 p-5">
      <h2 className="text-lg font-semibold text-machine-800 mb-3">Gauge</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hand Gauge */}
        <div>
          <h3 className="text-sm font-semibold text-machine-600 uppercase tracking-wide mb-3">
            Hand Pattern Gauge
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-machine-700 mb-1">
                Stitches per 4 inches
              </label>
              <input
                type="number"
                value={gauge.hand.stitchesPer4in}
                onChange={(e) =>
                  updateField(
                    "gauge.hand.stitchesPer4in",
                    Number(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-machine-700 mb-1">
                Rows per 4 inches
              </label>
              <input
                type="number"
                value={gauge.hand.rowsPer4in}
                onChange={(e) =>
                  updateField(
                    "gauge.hand.rowsPer4in",
                    Number(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-machine-700 mb-1">
                Needle size (for reference)
              </label>
              <input
                type="text"
                value={gauge.hand.needleSize}
                onChange={(e) =>
                  updateField("gauge.hand.needleSize", e.target.value)
                }
                placeholder="e.g., US 8"
                className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Machine Gauge */}
        <div>
          <h3 className="text-sm font-semibold text-machine-600 uppercase tracking-wide mb-3">
            Your Machine Gauge
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-machine-700 mb-1">
                Stitches per 4 inches
              </label>
              <input
                type="number"
                value={gauge.machine.stitchesPer4in}
                onChange={(e) =>
                  updateField(
                    "gauge.machine.stitchesPer4in",
                    Number(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-machine-700 mb-1">
                Rows per 4 inches
              </label>
              <input
                type="number"
                value={gauge.machine.rowsPer4in}
                onChange={(e) =>
                  updateField(
                    "gauge.machine.rowsPer4in",
                    Number(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-machine-700 mb-1">
                Tension dial setting
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={gauge.machine.tensionDial}
                onChange={(e) =>
                  updateField(
                    "gauge.machine.tensionDial",
                    Number(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
              />
            </div>
            <button
              onClick={handleUseEstimate}
              className="w-full text-sm py-2 px-3 rounded-md border border-knit-300 text-machine-600 hover:bg-knit-100 transition-colors"
            >
              Use estimated gauge for {yarn.weight || "worsted"}
            </button>
            {!gauge.machine.swatched && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                {KH930.warnings.noSwatch}
              </p>
            )}
          </div>
        </div>
      </div>

      {yarnWarning && (
        <div className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
          {yarnWarning}
        </div>
      )}
    </section>
  );
}
