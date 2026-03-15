import { useState, useRef } from "react";
import {
  hasApiKey,
  pdfToImages,
  imageToBase64,
  extractPatternWithVision,
} from "../../engine/visionExtractor";
import { usePatternStore } from "../../hooks/usePatternStore";
import { getEstimatedGauge } from "../../data/kh930";
import { getDefaultMeasurements } from "../../data/garmentTemplates";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg,.webp,.gif";

export default function PdfDropZone() {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const { updateCurrent } = usePatternStore();

  const processFile = async (file) => {
    if (!file) return;

    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      setResult({ error: "Please drop a PDF or image file (PNG, JPG, WEBP)." });
      return;
    }

    if (!hasApiKey()) {
      setResult({
        error:
          'No API key set. Go to the Settings tab (gear icon) and add your Anthropic API key first.',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Step 1: Convert to images
      let images;
      if (isPdf) {
        setLoadingStep("Rendering PDF pages...");
        images = await pdfToImages(file);
        setLoadingStep(
          `Sending ${images.length} page${images.length > 1 ? "s" : ""} to Claude...`
        );
      } else {
        setLoadingStep("Preparing image...");
        const img = await imageToBase64(file);
        images = [img];
        setLoadingStep("Sending image to Claude...");
      }

      // Step 2: Send to Claude vision
      const extracted = await extractPatternWithVision(images);

      // Step 3: Apply to form
      setLoadingStep("Filling in the form...");
      applyExtractedData(extracted);

      const warnings = extracted.warnings || [];
      if (extracted.selectedSize) {
        warnings.unshift(`Extracted for size: ${extracted.selectedSize}`);
      }

      setResult({
        success: true,
        warnings,
        fileName: file.name,
        fieldsFound: countFields(extracted),
      });
    } catch (err) {
      console.error("Pattern extraction error:", err);
      setResult({ error: err.message });
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const applyExtractedData = (data) => {
    const updates = {};

    if (data.name) updates.name = data.name;
    if (data.garmentType) updates.garmentType = data.garmentType;

    if (data.yarn) {
      updates.yarn = {
        name: data.yarn.name || "",
        weight: data.yarn.weight || "worsted",
        fiberContent: data.yarn.fiberContent || "",
        yardage: data.yarn.yardage || "",
      };
    }

    if (data.gauge?.hand?.stitchesPer4in) {
      const weight = data.yarn?.weight || "worsted";
      const machineEst = getEstimatedGauge(weight);
      updates.gauge = {
        hand: {
          stitchesPer4in: data.gauge.hand.stitchesPer4in,
          rowsPer4in: data.gauge.hand.rowsPer4in || 0,
          needleSize: data.gauge.hand.needleSize || "",
        },
        machine: {
          stitchesPer4in: machineEst.sts,
          rowsPer4in: machineEst.rows,
          tensionDial: machineEst.tension,
          swatched: false,
        },
      };
    }

    if (data.measurements && Object.keys(data.measurements).length > 0) {
      const garmentType = data.garmentType || "pullover";
      const defaults = getDefaultMeasurements(garmentType);
      // Filter out null values from extracted measurements
      const cleaned = {};
      for (const [k, v] of Object.entries(data.measurements)) {
        if (v != null) cleaned[k] = v;
      }
      updates.measurements = { ...defaults, ...cleaned };
    }

    if (data.shaping && Object.keys(data.shaping).length > 0) {
      // Filter out null/empty shaping sections
      const cleaned = {};
      for (const [k, v] of Object.entries(data.shaping)) {
        if (v && Object.keys(v).length > 0) cleaned[k] = v;
      }
      if (Object.keys(cleaned).length > 0) updates.shaping = cleaned;
    }

    updates.edgeTreatment = "turnedHem";
    updateCurrent(updates);
  };

  const countFields = (data) => {
    let count = 0;
    if (data.name) count++;
    if (data.garmentType) count++;
    if (data.yarn?.name) count++;
    if (data.yarn?.weight) count++;
    if (data.yarn?.yardage) count++;
    if (data.yarn?.fiberContent) count++;
    if (data.gauge?.hand?.stitchesPer4in) count++;
    if (data.gauge?.hand?.rowsPer4in) count++;
    if (data.gauge?.hand?.needleSize) count++;
    if (data.measurements) {
      count += Object.values(data.measurements).filter((v) => v != null).length;
    }
    if (data.shaping) count += Object.keys(data.shaping).length;
    return count;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  return (
    <section className="bg-white rounded-lg border border-knit-200 p-5">
      <h2 className="text-lg font-semibold text-machine-800 mb-1">
        Import Pattern
      </h2>
      <p className="text-sm text-machine-500 mb-3">
        Drop a pattern PDF or screenshot. Claude will read it and fill in the
        form. You can adjust anything it gets wrong.
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
            <div className="text-sm">{loadingStep}</div>
          </div>
        ) : (
          <div className="text-machine-500">
            <div className="text-3xl mb-2">&#128206;</div>
            <div className="text-sm font-medium">
              Drop a pattern PDF or screenshot here, or click to browse
            </div>
            <div className="text-xs text-machine-400 mt-1">
              PDF, PNG, JPG, or WEBP — uses Claude AI to read the pattern
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
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
                  <li key={i}>&bull; {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
