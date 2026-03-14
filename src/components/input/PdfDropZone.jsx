import { useState, useRef } from "react";
import { extractTextFromPDF } from "../../engine/pdfExtractor";
import { parsePatternText } from "../../engine/patternParser";
import { usePatternStore } from "../../hooks/usePatternStore";
import { getEstimatedGauge } from "../../data/kh930";
import { getDefaultMeasurements } from "../../data/garmentTemplates";

export default function PdfDropZone() {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const { updateCurrent, updateField } = usePatternStore();

  const processPDF = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setResult({ error: "Please drop a PDF file." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const text = await extractTextFromPDF(file);
      const parsed = parsePatternText(text);

      // Apply parsed data to the form
      applyParsedData(parsed.data);

      setResult({
        success: true,
        warnings: parsed.warnings,
        fileName: file.name,
        fieldsFound: countFields(parsed.data),
      });
    } catch (err) {
      console.error("PDF parse error:", err);
      setResult({ error: `Could not read PDF: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const applyParsedData = (data) => {
    const updates = {};

    if (data.name) updates.name = data.name;
    if (data.garmentType) updates.garmentType = data.garmentType;

    if (data.yarn) {
      updates.yarn = { ...data.yarn };
    }

    if (data.gauge?.hand?.stitchesPer4in) {
      const machineEst = getEstimatedGauge(data.yarn?.weight || "worsted");
      updates.gauge = {
        hand: data.gauge.hand,
        machine: {
          stitchesPer4in: machineEst.sts,
          rowsPer4in: machineEst.rows,
          tensionDial: machineEst.tension,
          swatched: false,
        },
      };
    }

    if (data.measurements && Object.keys(data.measurements).length > 0) {
      const defaults = getDefaultMeasurements(data.garmentType || "pullover");
      updates.measurements = { ...defaults, ...data.measurements };
    }

    if (data.shaping && Object.keys(data.shaping).length > 0) {
      updates.shaping = data.shaping;
    }

    updates.edgeTreatment = "turnedHem";

    updateCurrent(updates);
  };

  const countFields = (data) => {
    let count = 0;
    if (data.name) count++;
    if (data.yarn?.name) count++;
    if (data.yarn?.weight) count++;
    if (data.yarn?.yardage) count++;
    if (data.gauge?.hand?.stitchesPer4in) count++;
    if (data.gauge?.hand?.rowsPer4in) count++;
    if (data.measurements) count += Object.keys(data.measurements).length;
    if (data.shaping) count += Object.keys(data.shaping).length;
    return count;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processPDF(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processPDF(file);
    e.target.value = "";
  };

  return (
    <section className="bg-white rounded-lg border border-knit-200 p-5">
      <h2 className="text-lg font-semibold text-machine-800 mb-1">
        Import from PDF
      </h2>
      <p className="text-sm text-machine-500 mb-3">
        Drop a knitting pattern PDF to auto-fill the form. You can adjust
        anything it gets wrong.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-knit-500 bg-knit-100"
            : "border-knit-300 hover:border-knit-400 hover:bg-knit-50"
        }`}
      >
        {loading ? (
          <div className="text-machine-500">
            <div className="animate-pulse text-lg mb-1">Reading pattern...</div>
            <div className="text-sm">Extracting text and looking for gauge, measurements, and shaping</div>
          </div>
        ) : (
          <div className="text-machine-500">
            <div className="text-3xl mb-2">&#128206;</div>
            <div className="text-sm font-medium">
              Drop a pattern PDF here, or click to browse
            </div>
            <div className="text-xs text-machine-400 mt-1">
              Works best with text-based PDFs (not scanned images)
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Results */}
      {result?.error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {result.error}
        </div>
      )}

      {result?.success && (
        <div className="mt-3 space-y-2">
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            Read <strong>{result.fileName}</strong> — filled in{" "}
            {result.fieldsFound} fields. Review the form below and adjust
            anything that looks wrong.
          </div>

          {result.warnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
              <p className="font-medium mb-1">Heads up:</p>
              <ul className="space-y-1">
                {result.warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
