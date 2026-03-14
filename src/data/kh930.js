export const KH930 = {
  name: "Brother KH-930",
  type: "Standard Gauge Electronic",
  needlePitch: 4.5,
  totalNeedles: 200,
  needleRange: { left: 100, right: 100 },

  needlePositions: {
    A: "Non-working (pushed fully back)",
    B: "Working position (ready to knit)",
    D: "Upper working position (needle selected forward)",
    E: "Holding position (pushed fully forward)",
  },

  estimatedGauge: {
    fingering: { sts: 34, rows: 46, tension: 2.5, label: "Fingering" },
    sport: { sts: 30, rows: 40, tension: 3.5, label: "Sport" },
    dk: { sts: 28, rows: 36, tension: 5, label: "DK" },
    worsted: { sts: 24, rows: 32, tension: 7, label: "Worsted" },
    aran: { sts: 22, rows: 30, tension: 8, label: "Aran" },
    bulky: { sts: 18, rows: 26, tension: 9, label: "Bulky" },
  },

  yarnWeights: [
    { value: "fingering", label: "Fingering / Sock" },
    { value: "sport", label: "Sport" },
    { value: "dk", label: "DK" },
    { value: "worsted", label: "Worsted" },
    { value: "aran", label: "Aran" },
    { value: "bulky", label: "Bulky" },
  ],

  warnings: {
    bulky:
      "Bulky yarn is at the outer limit of the KH-930. Make sure your yarn feeds smoothly through the tension mast. Consider using two strands of thinner yarn instead.",
    noSwatch:
      "These are estimates based on typical gauges. Your actual gauge depends on your specific yarn and tension setting. Always knit a swatch before starting a garment.",
    maxWidth:
      "The KH-930 has 200 needles. If your pattern requires more needles than this, you will need to reduce the width or use a different approach.",
  },

  singleBedLimitations: [
    "Cannot knit true rib (1x1, 2x2) — use turned hems or mock techniques",
    "Stockinette fabric curls at edges naturally",
    "Cannot do tubular/circular knitting",
    "Cables require manual manipulation with a cable transfer tool",
  ],
};

export function getEstimatedGauge(yarnWeight) {
  return KH930.estimatedGauge[yarnWeight] || KH930.estimatedGauge.worsted;
}

export function getNeedleSetup(stitchCount) {
  if (stitchCount > KH930.totalNeedles) {
    return {
      left: KH930.needleRange.left,
      right: KH930.needleRange.right,
      warning: `Pattern requires ${stitchCount} needles but the KH-930 only has ${KH930.totalNeedles}. You'll need to adjust the pattern.`,
    };
  }
  const left = Math.floor(stitchCount / 2);
  const right = Math.ceil(stitchCount / 2);
  return { left, right, warning: null };
}
