import { usePatternStore } from "../../hooks/usePatternStore";
import StepCard from "./StepCard";
import ShapingDiagram from "./ShapingDiagram";

export default function PatternOutput() {
  const { currentPattern } = usePatternStore();
  const result = currentPattern.machinePattern;

  if (!result) {
    return (
      <div className="text-center py-16">
        <p className="text-machine-500 text-lg">
          No pattern generated yet.
        </p>
        <p className="text-machine-400 text-sm mt-2">
          Fill in the pattern form and click "Generate Machine Pattern."
        </p>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-knit-200 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-machine-800">
              {currentPattern.name || "Untitled Pattern"}
            </h2>
            <p className="text-sm text-machine-500 mt-1">
              Machine pattern for Brother KH-930 · Single bed · Stockinette
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="no-print px-4 py-2 text-sm rounded-md border border-knit-300 text-machine-600 hover:bg-knit-100 transition-colors"
          >
            Print Pattern
          </button>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-machine-500">Type</span>
            <p className="font-medium text-machine-800 capitalize">
              {currentPattern.garmentType}
            </p>
          </div>
          <div>
            <span className="text-machine-500">Gauge</span>
            <p className="font-medium text-machine-800">
              {result.summary.machineGauge.stitchesPer4in} sts ×{" "}
              {result.summary.machineGauge.rowsPer4in} rows / 4"
            </p>
          </div>
          <div>
            <span className="text-machine-500">Pieces</span>
            <p className="font-medium text-machine-800">
              {result.summary.totalPieces}
            </p>
          </div>
          <div>
            <span className="text-machine-500">Yarn</span>
            <p className="font-medium text-machine-800">
              {result.summary.yarnName || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="bg-white rounded-lg border border-knit-200 p-5">
        <h3 className="text-sm font-semibold text-machine-700 uppercase tracking-wide mb-2">
          Materials Needed
        </h3>
        <ul className="text-sm text-machine-600 space-y-1">
          {result.summary.materials.map((m, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-knit-400 mt-0.5">•</span>
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* Pieces */}
      {result.pieces.map((piece, pi) => (
        <div key={pi} className="space-y-3">
          <div className="bg-machine-700 text-white rounded-lg p-4">
            <h3 className="text-lg font-bold">{piece.name}</h3>
            <p className="text-machine-200 text-sm">
              {piece.totalStitches} stitches wide · {piece.totalRows} rows tall
              · Needles: {piece.needles.left}L to {piece.needles.right}R
            </p>
            {piece.needles.warning && (
              <p className="text-amber-300 text-sm mt-1">
                {piece.needles.warning}
              </p>
            )}
          </div>

          <ShapingDiagram piece={piece} garmentType={currentPattern.garmentType} />

          {piece.steps.map((step, si) => (
            <StepCard key={si} step={step} stepNumber={si + 1} />
          ))}
        </div>
      ))}

      {/* Finishing */}
      <div className="bg-white rounded-lg border border-knit-200 p-5">
        <h3 className="text-lg font-semibold text-machine-800 mb-3">
          Finishing
        </h3>
        <ol className="space-y-2">
          {result.summary.finishingNotes.map((note, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-machine-600"
            >
              <span className="bg-knit-200 text-knit-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shrink-0">
                {i + 1}
              </span>
              {note}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
