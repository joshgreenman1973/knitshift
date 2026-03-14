/**
 * Pattern parser: extracts knitting pattern data from raw PDF text.
 *
 * Knitting patterns aren't standardized, so this uses heuristics and
 * common conventions. It returns what it finds and flags confidence levels.
 */

/**
 * Main entry: parse raw text into a structured pattern object.
 * Returns { data, warnings, rawText } where data has the extracted fields
 * and warnings lists anything uncertain.
 */
export function parsePatternText(text) {
  const warnings = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const fullText = lines.join(" ");
  const lowerText = fullText.toLowerCase();

  const data = {};

  // Pattern name — usually the first prominent line or near "pattern:" label
  data.name = extractPatternName(lines);

  // Yarn info
  data.yarn = extractYarn(fullText, lowerText, warnings);

  // Gauge
  data.gauge = extractGauge(fullText, lowerText, warnings);

  // Garment type
  data.garmentType = detectGarmentType(lowerText, warnings);

  // Finished measurements
  data.measurements = extractMeasurements(fullText, lowerText, data.garmentType, warnings);

  // Shaping
  data.shaping = extractShaping(fullText, lowerText, warnings);

  return { data, warnings, rawText: text };
}

function extractPatternName(lines) {
  // Skip lines that look like metadata, copyright, designer name, etc.
  for (const line of lines.slice(0, 10)) {
    if (line.length < 3 || line.length > 80) continue;
    if (/^(by |designed by |copyright|©|\d{4}|www\.|http|ravelry|size|gauge|yarn|needle|material)/i.test(line)) continue;
    if (/^\d+$/.test(line)) continue;
    // First non-metadata line with reasonable length is likely the name
    return line;
  }
  return "";
}

function extractYarn(text, lower, warnings) {
  const yarn = { name: "", weight: "worsted", fiberContent: "", yardage: "" };

  // Yarn name — look for "Yarn:" or "yarn used:" labels
  const yarnNameMatch = text.match(/(?:yarn(?:\s*used)?|recommended yarn)\s*[:\-–]\s*([^\n,;]+)/i);
  if (yarnNameMatch) {
    yarn.name = yarnNameMatch[1].trim();
  }

  // Yarn weight
  const weightMap = [
    [/\b(?:lace\s*weight|lace)\b/i, "fingering"],
    [/\b(?:fingering|sock\s*(?:weight|yarn)?)\b/i, "fingering"],
    [/\bsport\s*(?:weight)?\b/i, "sport"],
    [/\b(?:dk|double\s*knit(?:ting)?|light\s*worsted)\b/i, "dk"],
    [/\bworsted\s*(?:weight)?\b/i, "worsted"],
    [/\baran\s*(?:weight)?\b/i, "aran"],
    [/\b(?:bulky|chunky|roving)\b/i, "bulky"],
  ];
  for (const [regex, weight] of weightMap) {
    if (regex.test(text)) {
      yarn.weight = weight;
      break;
    }
  }

  // Fiber content
  const fiberMatch = text.match(/(\d+%\s*\w+(?:\s*,?\s*\d+%\s*\w+)*)/i);
  if (fiberMatch) {
    yarn.fiberContent = fiberMatch[1].trim();
  }

  // Yardage — look for total yards/meters needed
  const yardagePatterns = [
    /(\d{2,5})\s*(?:yards?|yds?)\s*(?:total|needed|required)?/i,
    /(?:total|approx(?:imately)?|about)\s*(\d{2,5})\s*(?:yards?|yds?)/i,
    /(\d{1,2})\s*(?:skeins?|balls?|hanks?)\s*[\(\[]\s*(\d+)\s*(?:yards?|yds?)/i,
  ];
  for (const pat of yardagePatterns) {
    const m = text.match(pat);
    if (m) {
      if (m[2]) {
        // "4 skeins (220 yds)" format
        yarn.yardage = String(Number(m[1]) * Number(m[2]));
      } else {
        yarn.yardage = m[1];
      }
      break;
    }
  }

  if (!yarn.name && !yarn.yardage) {
    warnings.push("Could not find yarn information. Please fill in manually.");
  }

  return yarn;
}

function extractGauge(text, lower, warnings) {
  const gauge = {
    hand: { stitchesPer4in: 0, rowsPer4in: 0, needleSize: "" },
  };

  // Common gauge patterns:
  // "18 sts and 24 rows = 4 inches"
  // "18 stitches and 24 rows per 4 inches"
  // "Gauge: 18 sts x 24 rows / 4 in"
  const gaugePatterns = [
    /(\d+\.?\d*)\s*(?:sts?|stitches?)\s*(?:and|&|x|×|,)\s*(\d+\.?\d*)\s*(?:rows?|rnds?)\s*(?:=|per|\/|in|over)\s*(?:4\s*(?:in(?:ches)?|"|cm)?|10\s*cm)/i,
    /(\d+\.?\d*)\s*(?:sts?|stitches?)\s*(?:=|per|\/|in|over)\s*(?:4\s*(?:in(?:ches)?|"|cm)?|10\s*cm)/i,
    /gauge\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:sts?|stitches?)/i,
  ];

  for (const pat of gaugePatterns) {
    const m = text.match(pat);
    if (m) {
      let sts = parseFloat(m[1]);
      let rows = m[2] ? parseFloat(m[2]) : 0;

      // If gauge was given in 10cm, convert to 4 inches (roughly same)
      if (/10\s*cm/i.test(m[0])) {
        // 10cm ≈ 3.94 inches, close enough to 4in
      }

      gauge.hand.stitchesPer4in = Math.round(sts);
      if (rows) gauge.hand.rowsPer4in = Math.round(rows);
      break;
    }
  }

  // If we got stitches but not rows, estimate rows as ~1.33x stitches (common for stockinette)
  if (gauge.hand.stitchesPer4in && !gauge.hand.rowsPer4in) {
    gauge.hand.rowsPer4in = Math.round(gauge.hand.stitchesPer4in * 1.33);
    warnings.push(`Row gauge not found in pattern. Estimated at ${gauge.hand.rowsPer4in} rows/4in. Please verify.`);
  }

  // Needle size
  const needleMatch = text.match(/(?:needle|ndl)s?\s*[:\-–]?\s*(?:US\s*)?(\d+\.?\d*)\s*(?:mm)?\s*(?:\(?\s*US\s*(\d+\.?\d*)\s*\)?)?/i);
  if (needleMatch) {
    if (needleMatch[2]) {
      gauge.hand.needleSize = `US ${needleMatch[2]}`;
    } else if (needleMatch[1]) {
      const val = parseFloat(needleMatch[1]);
      if (val <= 15) {
        gauge.hand.needleSize = `US ${needleMatch[1]}`;
      } else {
        gauge.hand.needleSize = `${needleMatch[1]}mm`;
      }
    }
  }

  if (!gauge.hand.stitchesPer4in) {
    warnings.push("Could not find gauge information. This is required — please enter it manually.");
  }

  return gauge;
}

function detectGarmentType(lower, warnings) {
  if (/\b(?:scarf|wrap|shawl|cowl|stole)\b/.test(lower)) return "scarf";
  if (/\b(?:hat|beanie|cap|toque|beret)\b/.test(lower)) return "hat";
  if (/\b(?:pullover|sweater|jumper|crew\s*neck|raglan)\b/.test(lower)) return "pullover";
  if (/\b(?:cardigan|cardi)\b/.test(lower)) {
    warnings.push("This appears to be a cardigan pattern. KnitShift will treat it as a pullover — you may need to adjust for front opening and button bands.");
    return "pullover";
  }
  if (/\b(?:vest|tank|sleeveless)\b/.test(lower)) {
    warnings.push("This appears to be a vest. KnitShift will treat it as a pullover — ignore the sleeve instructions.");
    return "pullover";
  }

  warnings.push("Could not determine garment type. Defaulting to pullover — please change if needed.");
  return "pullover";
}

function extractMeasurements(text, lower, garmentType, warnings) {
  const m = {};

  if (garmentType === "scarf") {
    const widthMatch = text.match(/(?:width|wide)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches|cm)?/i);
    const lengthMatch = text.match(/(?:length|long)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches|cm)?/i);
    if (widthMatch) m.width = parseFloat(widthMatch[1]);
    if (lengthMatch) m.length = parseFloat(lengthMatch[1]);
    return m;
  }

  if (garmentType === "hat") {
    const circumMatch = text.match(/(?:circumference|head|fits?\s*head)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches|cm)?/i);
    const heightMatch = text.match(/(?:height|depth|tall|long)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches|cm)?/i);
    if (circumMatch) m.circumference = parseFloat(circumMatch[1]);
    if (heightMatch) m.height = parseFloat(heightMatch[1]);
    return m;
  }

  // Pullover measurements — these labels vary a lot
  const measurementPatterns = [
    { key: "chestCircumference", patterns: [
      /(?:chest|bust)\s*(?:circumference)?\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
      /(?:finished)\s*(?:chest|bust)\s*[:\-–]?\s*(\d+\.?\d*)/i,
    ]},
    { key: "bodyLength", patterns: [
      /(?:body\s*length|total\s*length|length)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
      /(?:hem\s*to\s*shoulder|shoulder\s*length)\s*[:\-–]?\s*(\d+\.?\d*)/i,
    ]},
    { key: "armholeDepth", patterns: [
      /(?:armhole\s*depth|arm\s*hole)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
    ]},
    { key: "shoulderWidth", patterns: [
      /(?:shoulder\s*(?:width|to\s*shoulder))\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
    ]},
    { key: "neckWidth", patterns: [
      /(?:neck\s*(?:width|opening))\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
    ]},
    { key: "sleeveLength", patterns: [
      /(?:sleeve\s*length)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
    ]},
    { key: "sleeveUpperArm", patterns: [
      /(?:upper\s*arm|sleeve\s*(?:width|circumference))\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
    ]},
    { key: "sleeveCuffWidth", patterns: [
      /(?:cuff\s*(?:circumference|width))\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:in|"|inches)?/i,
    ]},
  ];

  for (const { key, patterns } of measurementPatterns) {
    for (const pat of patterns) {
      const match = text.match(pat);
      if (match) {
        m[key] = parseFloat(match[1]);
        break;
      }
    }
  }

  // Try to extract from a size chart / table format
  // Many patterns list sizes like: "S (M, L, XL)" with measurements
  // For now, take the first number found for each measurement
  const foundKeys = Object.keys(m);
  if (foundKeys.length < 3) {
    warnings.push(`Only found ${foundKeys.length} measurements (${foundKeys.join(", ") || "none"}). Please fill in missing measurements manually.`);
  }

  return m;
}

function extractShaping(text, lower, warnings) {
  const shaping = {};

  // Armhole shaping — look for bind off at armhole
  const armholeBO = text.match(/(?:armhole|arm\s*hole)[^.]*?(?:bind\s*off|BO|cast\s*off)\s*(\d+)\s*(?:sts?|stitches?)/i);
  if (armholeBO) {
    shaping.armhole = { initialBindOff: parseInt(armholeBO[1]) };
  }

  // Decrease patterns — "dec 1 st each side every RS row 3 times"
  const decreasePatterns = [
    /(?:dec(?:rease)?)\s*(?:1\s*st(?:itch)?\s*)?(?:each\s*side|both\s*sides?|at\s*each\s*end)\s*(?:every|ev)\s*(?:RS\s*row|other\s*row|(\d+)(?:st|nd|rd|th)\s*row)\s*[,\s]*(\d+)\s*times?/gi,
    /(?:dec(?:rease)?)\s*(?:1\s*st(?:itch)?\s*)?(?:each\s*side|both\s*sides?)\s*(?:every|ev)\s*(\d+)\s*rows?\s*[,\s]*(\d+)\s*times?/gi,
  ];

  const decreases = [];
  for (const pat of decreasePatterns) {
    let match;
    while ((match = pat.exec(text)) !== null) {
      const every = match[1] ? parseInt(match[1]) : 2; // "every RS row" = every 2 rows
      const times = parseInt(match[2]) || parseInt(match[1]);
      if (every && times) {
        decreases.push({ every, times });
      }
    }
  }

  if (decreases.length > 0 && shaping.armhole) {
    shaping.armhole.decreaseSchedule = decreases.slice(0, 3);
  }

  // Sleeve increases — "inc 1 st each side every 6th row 12 times"
  const incPatterns = [
    /(?:inc(?:rease)?)\s*(?:1\s*st(?:itch)?\s*)?(?:each\s*side|both\s*sides?|at\s*each\s*end)\s*(?:every|ev)\s*(\d+)(?:st|nd|rd|th)?\s*rows?\s*[,\s]*(\d+)\s*times?/gi,
  ];

  const increases = [];
  for (const pat of incPatterns) {
    let match;
    while ((match = pat.exec(text)) !== null) {
      increases.push({ every: parseInt(match[1]), times: parseInt(match[2]) });
    }
  }

  if (increases.length > 0) {
    shaping.sleeveTaper = { increaseSchedule: increases.slice(0, 2) };
  }

  // Neckline — center bind off
  const neckBO = text.match(/(?:neck|center|centre)\s*[^.]*?(?:bind\s*off|BO|cast\s*off)\s*(?:center|centre)?\s*(\d+)\s*(?:sts?|stitches?)/i);
  if (neckBO) {
    shaping.neckline = { centerBindOff: parseInt(neckBO[1]) };
  }

  // Shoulder bind off
  const shoulderBO = text.match(/(?:shoulder)[^.]*?(?:bind\s*off|BO)\s*(\d+)\s*(?:sts?|stitches?)\s*(?:at\s*(?:beg(?:inning)?|each)\s*(?:of\s*)?(?:next)?\s*(\d+))?/i);
  if (shoulderBO) {
    shaping.shoulder = {
      bindOffSchedule: [{
        stitches: parseInt(shoulderBO[1]),
        times: shoulderBO[2] ? parseInt(shoulderBO[2]) : 2,
      }],
    };
  }

  // Sleeve cap
  const capBO = text.match(/(?:sleeve\s*cap|cap\s*shaping)[^.]*?(?:bind\s*off|BO)\s*(\d+)\s*(?:sts?|stitches?)/i);
  if (capBO) {
    shaping.sleeveCap = {
      initialBindOff: parseInt(capBO[1]),
      finalBindOff: 6,
      decreaseSchedule: [{ every: 2, times: 3 }],
    };
  }

  return shaping;
}
