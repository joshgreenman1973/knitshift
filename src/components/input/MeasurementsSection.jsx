import { usePatternStore } from "../../hooks/usePatternStore";
import { stitchesForMeasurement, rowsForMeasurement, actualMeasurement } from "../../engine/gaugeEngine";

export default function MeasurementsSection({ template }) {
  const { currentPattern, updateField } = usePatternStore();
  const { measurements, gauge } = currentPattern;

  const machineGauge = {
    stitchesPer4in: gauge.machine.stitchesPer4in,
    rowsPer4in: gauge.machine.rowsPer4in,
  };

  return (
    <section className="bg-white rounded-lg border border-knit-200 p-5">
      <h2 className="text-lg font-semibold text-machine-800 mb-1">
        Finished Measurements
      </h2>
      <p className="text-sm text-machine-500 mb-4">
        Enter the finished dimensions from the hand pattern (in inches).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {template.measurements.map((field) => {
          const value = measurements[field.key] || "";
          const isWidth =
            field.key.toLowerCase().includes("width") ||
            field.key.toLowerCase().includes("circumference") ||
            field.key.toLowerCase().includes("cuff");

          let machineCount = "";
          let actualInches = "";
          if (value && value > 0) {
            if (isWidth) {
              machineCount = stitchesForMeasurement(value, machineGauge);
              actualInches = actualMeasurement(machineCount, machineGauge.stitchesPer4in);
            } else {
              machineCount = rowsForMeasurement(value, machineGauge);
              actualInches = actualMeasurement(machineCount, machineGauge.rowsPer4in);
            }
          }

          return (
            <div key={field.key}>
              <label className="block text-sm font-medium text-machine-700 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                step="0.25"
                value={value}
                onChange={(e) =>
                  updateField(
                    `measurements.${field.key}`,
                    Number(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-knit-200 rounded-md text-machine-800 focus:ring-2 focus:ring-knit-400 outline-none"
              />
              {machineCount && (
                <p className="text-xs text-machine-500 mt-1">
                  → {machineCount} {isWidth ? "stitches" : "rows"} on machine
                  ({actualInches}" actual)
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
