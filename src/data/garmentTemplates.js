export const GARMENT_TYPES = {
  scarf: {
    label: "Scarf / Wrap",
    pieces: ["main"],
    measurements: [
      { key: "width", label: "Width (inches)", default: 8 },
      { key: "length", label: "Length (inches)", default: 60 },
    ],
    shapingSections: [],
    edgeTreatment: true,
    description: "A flat rectangle — the simplest project for getting started with machine knitting.",
  },

  hat: {
    label: "Hat (knit flat, seamed)",
    pieces: ["main"],
    measurements: [
      { key: "circumference", label: "Head circumference (inches)", default: 22 },
      { key: "height", label: "Hat height (inches)", default: 8 },
      { key: "brimHeight", label: "Brim height (inches)", default: 1.5 },
    ],
    shapingSections: ["crown"],
    edgeTreatment: true,
    description: "Knit flat as a rectangle with crown shaping, then seamed. Brim is a turned hem.",
  },

  pullover: {
    label: "Pullover (crew neck)",
    pieces: ["back", "front", "sleeveLeft", "sleeveRight"],
    measurements: [
      { key: "chestCircumference", label: "Chest circumference (inches)", default: 40 },
      { key: "bodyLength", label: "Body length, hem to shoulder (inches)", default: 25 },
      { key: "hemHeight", label: "Hem / edge height (inches)", default: 2 },
      { key: "armholeDepth", label: "Armhole depth (inches)", default: 9 },
      { key: "shoulderWidth", label: "Shoulder width (inches)", default: 15 },
      { key: "neckWidth", label: "Neck width (inches)", default: 7 },
      { key: "neckDepth", label: "Front neck depth (inches)", default: 3 },
      { key: "sleeveLength", label: "Sleeve length (inches)", default: 18 },
      { key: "sleeveCuffWidth", label: "Sleeve cuff circumference (inches)", default: 8 },
      { key: "sleeveUpperArm", label: "Upper arm circumference (inches)", default: 14 },
      { key: "sleeveCuffHeight", label: "Sleeve cuff / edge height (inches)", default: 2 },
    ],
    shapingSections: ["armhole", "shoulder", "neckline", "sleeveTaper", "sleeveCap"],
    edgeTreatment: true,
    description: "Classic crew neck pullover: back, front, and two sleeves with set-in or drop shoulders.",
  },
};

export const EDGE_TREATMENTS = [
  {
    value: "turnedHem",
    label: "Turned hem (recommended)",
    description: "Knit extra rows that fold under for a clean, non-curling edge. Easiest on single bed.",
    difficulty: "beginner",
  },
  {
    value: "rollEdge",
    label: "Rolled stockinette edge",
    description: "Let the natural stockinette curl form the edge. Simple but casual.",
    difficulty: "beginner",
  },
  {
    value: "crochetEdge",
    label: "Crochet edging (added after)",
    description: "Finish the piece, then add a crocheted edge by hand. Versatile and decorative.",
    difficulty: "intermediate",
  },
  {
    value: "handKnitRib",
    label: "Hand-knit ribbing (attached to machine)",
    description: "Knit the ribbing by hand on needles, then hang live stitches onto the machine to continue. Most like the original pattern.",
    difficulty: "intermediate",
  },
];

export const SHAPING_TYPES = {
  armhole: {
    label: "Armhole Shaping",
    description: "Bind off and decrease at armhole edge",
    fields: [
      { key: "initialBindOff", label: "Initial bind-off (each side)", type: "number", default: 3 },
    ],
    hasDecreaseSchedule: true,
    decreaseLabel: "Armhole decreases",
  },
  shoulder: {
    label: "Shoulder Shaping",
    description: "Bind off or short-row at shoulders",
    fields: [],
    hasBindOffSchedule: true,
    bindOffLabel: "Shoulder bind-off steps",
  },
  neckline: {
    label: "Neckline Shaping",
    description: "Center bind-off and side decreases for crew neck",
    fields: [
      { key: "centerBindOff", label: "Center neck stitches to bind off", type: "number", default: 20 },
    ],
    hasDecreaseSchedule: true,
    decreaseLabel: "Neck side decreases",
  },
  sleeveTaper: {
    label: "Sleeve Increases",
    description: "Gradual increase from cuff to upper arm",
    fields: [],
    hasIncreaseSchedule: true,
    increaseLabel: "Sleeve increases",
  },
  sleeveCap: {
    label: "Sleeve Cap Shaping",
    description: "Bind off and decrease for set-in sleeve cap",
    fields: [
      { key: "initialBindOff", label: "Initial bind-off (each side)", type: "number", default: 3 },
      { key: "finalBindOff", label: "Final bind-off (remaining stitches)", type: "number", default: 6 },
    ],
    hasDecreaseSchedule: true,
    decreaseLabel: "Sleeve cap decreases",
  },
  crown: {
    label: "Crown Shaping",
    description: "Decrease for hat crown",
    fields: [],
    hasDecreaseSchedule: true,
    decreaseLabel: "Crown decreases",
  },
};

export function getDefaultMeasurements(garmentType) {
  const template = GARMENT_TYPES[garmentType];
  if (!template) return {};
  const m = {};
  template.measurements.forEach((field) => {
    m[field.key] = field.default;
  });
  return m;
}
