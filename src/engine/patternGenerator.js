/**
 * Pattern generator: orchestrates gauge and shaping engines
 * to produce a complete machine pattern from user input.
 */

import { generateScarfSteps, generateHatSteps, generatePulloverBodySteps, generateSleeveSteps } from "./shapingEngine.js";

export function generateMachinePattern(pattern) {
  const { garmentType, measurements, gauge, shaping, edgeTreatment, yarn } = pattern;

  const machineGauge = {
    stitchesPer4in: gauge.machine.stitchesPer4in,
    rowsPer4in: gauge.machine.rowsPer4in,
  };

  const edge = edgeTreatment || "turnedHem";
  let pieces = [];
  let finishingNotes = [];

  switch (garmentType) {
    case "scarf": {
      pieces = [generateScarfSteps(measurements, machineGauge, edge)];
      finishingNotes = [
        "Block by soaking in lukewarm water, gently squeezing out excess, and pinning flat to measurements.",
        edge === "turnedHem" ? "Fold and stitch down both hems before blocking." : "",
        "Weave in all yarn tails on the wrong side.",
      ].filter(Boolean);
      break;
    }

    case "hat": {
      pieces = [generateHatSteps(measurements, machineGauge, edge)];
      finishingNotes = [
        "Remove waste yarn carefully from the cast-on edge.",
        "Fold brim hem up and stitch in place with a tapestry needle.",
        "Seam the back of the hat with mattress stitch, working from brim to crown.",
        "Thread yarn tail through remaining crown stitches, pull tight, and secure.",
        "Weave in all ends. Block over a bowl or balloon to shape.",
      ];
      break;
    }

    case "pullover": {
      const back = generatePulloverBodySteps("Back", measurements, machineGauge, shaping, edge, false);
      const front = generatePulloverBodySteps("Front", measurements, machineGauge, shaping, edge, true);
      const sleeve = generateSleeveSteps(measurements, machineGauge, shaping, edge);

      pieces = [back, front, sleeve];
      finishingNotes = [
        "Block all pieces: soak in lukewarm water, squeeze gently, pin to measurements, and dry flat.",
        "Seam shoulders: graft with Kitchener stitch if you used waste yarn, or mattress stitch if bound off.",
        "Set in sleeves: match center of sleeve cap to shoulder seam, pin, and sew with mattress stitch.",
        "Sew side seams from hem to underarm with mattress stitch.",
        "Sew sleeve seams from cuff to underarm.",
        "Fold and stitch down all hems (body and sleeves).",
        "For neckband: pick up stitches around the neckline and either crochet an edging or hand-knit a short band.",
        "Weave in all ends on the wrong side.",
      ];
      break;
    }

    default:
      return null;
  }

  return {
    pieces,
    summary: {
      garmentType,
      totalPieces: pieces.length + (garmentType === "pullover" ? 1 : 0), // +1 for second sleeve
      yarnName: yarn?.name || "Main yarn",
      yarnWeight: yarn?.weight || "",
      machineGauge,
      finishingNotes,
      materials: [
        `Main yarn: ${yarn?.name || "your chosen yarn"} (${yarn?.weight || ""}), approximately ${yarn?.yardage || "see pattern"} yards`,
        "Waste yarn: smooth acrylic in a contrasting color, similar weight to main yarn",
        "Ravel cord: smooth, strong thread in a bright contrasting color",
        "Tapestry needle for seaming and weaving in ends",
        "Single-prong transfer tool",
        "Latch tool for binding off",
      ],
    },
  };
}
