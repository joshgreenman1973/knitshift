/**
 * Vision-based pattern extractor using Claude API.
 * Sends pattern images (from PDFs or screenshots) to Claude's vision
 * and gets back structured knitting pattern data.
 */

const API_KEY_STORAGE = "knitshift_anthropic_key";

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

export function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export function hasApiKey() {
  return !!getApiKey();
}

/**
 * Convert a PDF file to an array of base64-encoded page images using pdf.js.
 */
export async function pdfToImages(file) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).href;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images = [];

  // Render each page at 2x scale for readability
  const scale = 2;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Convert to base64 JPEG (smaller than PNG, good enough for text)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = dataUrl.split(",")[1];
    images.push({ base64, mediaType: "image/jpeg", pageNum: i });
  }

  return images;
}

/**
 * Convert an image file to a base64 object.
 */
export async function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",")[1];
      const mediaType = file.type || "image/png";
      resolve({ base64, mediaType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EXTRACTION_PROMPT = `You are a knitting pattern reader. Analyze this knitting pattern and extract structured data.

Return ONLY a JSON object with this exact structure (omit fields you can't find, use null for uncertain values):

{
  "name": "Pattern name",
  "garmentType": "scarf" | "hat" | "pullover",
  "yarn": {
    "name": "Yarn name",
    "weight": "fingering" | "sport" | "dk" | "worsted" | "aran" | "bulky",
    "fiberContent": "e.g., 100% merino wool",
    "yardage": "total yards needed (number as string)"
  },
  "gauge": {
    "hand": {
      "stitchesPer4in": number,
      "rowsPer4in": number,
      "needleSize": "e.g., US 7"
    }
  },
  "measurements": {
    For scarves: { "width": number, "length": number }
    For hats: { "circumference": number, "height": number }
    For pullovers: {
      "chestCircumference": number,
      "bodyLength": number,
      "armholeDepth": number,
      "shoulderWidth": number,
      "neckWidth": number,
      "sleeveLength": number,
      "sleeveUpperArm": number,
      "sleeveCuffWidth": number
    }
  },
  "shaping": {
    "armhole": {
      "initialBindOff": number,
      "decreaseSchedule": [{ "every": number, "times": number }]
    },
    "neckline": { "centerBindOff": number },
    "shoulder": {
      "bindOffSchedule": [{ "stitches": number, "times": number }]
    },
    "sleeveTaper": {
      "increaseSchedule": [{ "every": number, "times": number }]
    },
    "sleeveCap": {
      "initialBindOff": number,
      "finalBindOff": number,
      "decreaseSchedule": [{ "every": number, "times": number }]
    },
    "crown": {
      "decreaseSchedule": [{ "every": number, "times": number }]
    }
  },
  "warnings": ["Any notes about the pattern that might need attention"],
  "selectedSize": "Which size these numbers are for, if multiple sizes listed"
}

Important notes:
- All measurements should be in INCHES. Convert from cm if needed (divide by 2.54).
- Gauge should be per 4 inches (10cm). If given per inch, multiply by 4.
- For multi-size patterns, extract the SMALLEST size by default and note other available sizes in warnings.
- "garmentType" should be "pullover" for sweaters, cardigans, vests.
- If this is a cardigan, note it in warnings — the app will treat it as a pullover.
- For yardage, calculate total if given per-skein amounts.
- Only include shaping fields that are clearly present in the pattern.
- Return ONLY valid JSON, no markdown formatting or explanation.`;

/**
 * Send pattern images to Claude API and get structured data back.
 */
export async function extractPatternWithVision(images) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("No API key configured. Please add your Anthropic API key in Settings.");
  }

  // Build the content array with images and the extraction prompt
  const content = [];

  for (const img of images) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType,
        data: img.base64,
      },
    });
  }

  content.push({ type: "text", text: EXTRACTION_PROMPT });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your Anthropic API key in Settings.");
    }
    if (response.status === 429) {
      throw new Error("Rate limited. Please wait a moment and try again.");
    }
    throw new Error(`API error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const text = result.content?.[0]?.text || "";

  // Parse the JSON from Claude's response
  // Handle potential markdown code fences
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const jsonStr = jsonMatch[1].trim();

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Try to find JSON object in the response
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }
    throw new Error("Could not parse pattern data from AI response. Please try again.");
  }
}
