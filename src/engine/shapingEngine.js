/**
 * Shaping engine: translates hand-knitting shaping instructions
 * into KH-930 machine knitting steps.
 */

import { stitchesForMeasurement, rowsForMeasurement, convertShapingSchedule } from "./gaugeEngine.js";
import { getNeedleSetup } from "../data/kh930.js";

/**
 * Generate machine steps for a scarf.
 */
export function generateScarfSteps(measurements, machineGauge, edgeTreatment) {
  const stitches = stitchesForMeasurement(measurements.width, machineGauge);
  const totalRows = rowsForMeasurement(measurements.length, machineGauge);
  const needles = getNeedleSetup(stitches);
  const steps = [];
  let rowCounter = 0;

  steps.push({
    type: "setup",
    instruction: `Bring ${stitches} needles to B position (${needles.left}L to ${needles.right}R from center 0).`,
    kh930Tip: "Count needles from center 0 outward. Push them forward from A to B position.",
    stitchCount: stitches,
    rowStart: 0,
    rowEnd: 0,
    techniques: [],
  });

  if (edgeTreatment === "turnedHem") {
    const hemRows = rowsForMeasurement(1, machineGauge);
    steps.push({
      type: "cast-on",
      instruction: `Using waste yarn, knit 10 rows + 1 row ravel cord. Switch to main yarn.`,
      kh930Tip: "Thread waste yarn through the tension mast. Set tension 1-2 numbers looser than main tension. After the waste yarn rows, lay the ravel cord across by hand, then knit 1 row to secure it.",
      stitchCount: stitches,
      rowStart: rowCounter,
      rowEnd: rowCounter,
      techniques: ["wasteYarnCastOn"],
    });

    rowCounter += hemRows;
    steps.push({
      type: "hem",
      instruction: `Knit ${hemRows} rows for turning hem. Continue — you'll fold and stitch this hem when finishing.`,
      kh930Tip: "These rows will fold under to form the hem. Knit at your main tension.",
      stitchCount: stitches,
      rowStart: 1,
      rowEnd: hemRows,
      techniques: ["turnedHem"],
    });
  } else {
    steps.push({
      type: "cast-on",
      instruction: `E-wrap cast on ${stitches} stitches. This gives a finished edge.`,
      kh930Tip: "Wrap each needle from right to left. Push all to D position. Knit the first row slowly.",
      stitchCount: stitches,
      rowStart: rowCounter,
      rowEnd: rowCounter,
      techniques: ["eWrapCastOn"],
    });
  }

  const bodyRows = edgeTreatment === "turnedHem" ? totalRows - rowsForMeasurement(1, machineGauge) * 2 : totalRows;
  rowCounter += bodyRows;

  steps.push({
    type: "body",
    instruction: `Reset row counter. Knit ${bodyRows} rows in stockinette (plain knitting).`,
    kh930Tip: "Just run the carriage back and forth. Check your knitting every 20-30 rows for dropped stitches.",
    stitchCount: stitches,
    rowStart: 1,
    rowEnd: bodyRows,
    techniques: [],
  });

  if (edgeTreatment === "turnedHem") {
    const hemRows = rowsForMeasurement(1, machineGauge);
    steps.push({
      type: "hem",
      instruction: `Knit ${hemRows} more rows for the ending hem.`,
      stitchCount: stitches,
      rowStart: bodyRows + 1,
      rowEnd: bodyRows + hemRows,
      techniques: ["turnedHem"],
    });
  }

  steps.push({
    type: "bind-off",
    instruction: `Bind off all ${stitches} stitches using the latch tool.`,
    kh930Tip: "Work from right to left, chaining each stitch through the previous one. Keep an even tension.",
    stitchCount: 0,
    rowStart: rowCounter,
    rowEnd: rowCounter,
    techniques: ["latchToolBindOff"],
  });

  steps.push({
    type: "finishing",
    instruction: edgeTreatment === "turnedHem"
      ? "Fold both hems to the wrong side and stitch down with a tapestry needle. Weave in all ends. Block by wetting and pinning to measurements."
      : "Weave in all ends. Block by wetting and pinning to measurements.",
    kh930Tip: "Blocking is especially important for machine-knit scarves to even out the stitches and relax the fabric.",
    stitchCount: 0,
    rowStart: 0,
    rowEnd: 0,
    techniques: ["seamingPieces"],
  });

  return {
    name: "Main Piece",
    needles,
    steps,
    totalRows: rowCounter,
    totalStitches: stitches,
  };
}

/**
 * Generate machine steps for a hat (knit flat, seamed).
 */
export function generateHatSteps(measurements, machineGauge, edgeTreatment) {
  const stitches = stitchesForMeasurement(measurements.circumference, machineGauge);
  const totalRows = rowsForMeasurement(measurements.height, machineGauge);
  const brimRows = rowsForMeasurement(measurements.brimHeight || 1.5, machineGauge);
  const needles = getNeedleSetup(stitches);
  const steps = [];
  let rowCounter = 0;

  steps.push({
    type: "setup",
    instruction: `Bring ${stitches} needles to B position (${needles.left}L to ${needles.right}R).`,
    kh930Tip: "The hat is knit flat and will be seamed up the back.",
    stitchCount: stitches,
    rowStart: 0,
    rowEnd: 0,
    techniques: [],
  });

  steps.push({
    type: "cast-on",
    instruction: "Cast on using waste yarn method: knit 10 rows waste yarn + 1 row ravel cord, then switch to main yarn.",
    stitchCount: stitches,
    rowStart: 0,
    rowEnd: 0,
    techniques: ["wasteYarnCastOn"],
  });

  steps.push({
    type: "hem",
    instruction: `Knit ${brimRows} rows for turned hem brim. This will fold up to form the brim.`,
    kh930Tip: "These rows fold under. For a sharper fold line, knit 1 row at 2 tension numbers tighter where you want the fold.",
    stitchCount: stitches,
    rowStart: 1,
    rowEnd: brimRows,
    techniques: ["turnedHem"],
  });
  rowCounter = brimRows;

  const bodyRows = totalRows - brimRows;
  const crownRows = Math.floor(bodyRows * 0.4);
  const straightRows = bodyRows - crownRows;

  steps.push({
    type: "body",
    instruction: `Reset row counter. Knit ${straightRows} rows straight.`,
    stitchCount: stitches,
    rowStart: 1,
    rowEnd: straightRows,
    techniques: [],
  });
  rowCounter += straightRows;

  // Crown shaping: decrease evenly across
  const decreaseGroups = 6;
  const stsToDecrease = Math.floor(stitches * 0.7);
  const decreaseRounds = Math.ceil(stsToDecrease / decreaseGroups);
  const rowsBetweenDec = Math.max(2, Math.floor(crownRows / decreaseRounds));

  steps.push({
    type: "shaping",
    instruction: `Crown shaping: decrease ${decreaseGroups} stitches evenly spaced every ${rowsBetweenDec} rows, ${decreaseRounds} times. Transfer every ${Math.floor(stitches / decreaseGroups)}th stitch to its neighbor, pushing empty needles to A position.`,
    kh930Tip: "Space decreases evenly across the row. Use the single transfer tool to move stitches. Push emptied needles back to A. The fabric will gather at the top.",
    stitchCount: stitches - stsToDecrease,
    rowStart: straightRows + 1,
    rowEnd: straightRows + crownRows,
    techniques: ["singleTransferDecrease"],
  });
  rowCounter += crownRows;

  steps.push({
    type: "bind-off",
    instruction: `Cut yarn leaving a long tail. Thread through remaining ${stitches - stsToDecrease} stitches with a tapestry needle. Pull tight to close the crown.`,
    stitchCount: 0,
    rowStart: rowCounter,
    rowEnd: rowCounter,
    techniques: [],
  });

  steps.push({
    type: "finishing",
    instruction: "Remove waste yarn from cast on. Fold brim hem up and stitch in place. Seam the back of the hat with mattress stitch. Pull crown stitches tight and secure. Weave in ends. Block over a bowl or balloon.",
    stitchCount: 0,
    rowStart: 0,
    rowEnd: 0,
    techniques: ["turnedHem", "seamingPieces"],
  });

  return {
    name: "Hat",
    needles,
    steps,
    totalRows: rowCounter,
    totalStitches: stitches,
  };
}

/**
 * Generate machine steps for a pullover piece (back or front).
 */
export function generatePulloverBodySteps(
  pieceName,
  measurements,
  machineGauge,
  shaping,
  edgeTreatment,
  isFront
) {
  const halfChest = measurements.chestCircumference / 2;
  const stitches = stitchesForMeasurement(halfChest, machineGauge);
  const needles = getNeedleSetup(stitches);
  const steps = [];
  let rowCounter = 0;
  let currentStitches = stitches;

  const hemHeight = measurements.hemHeight || 2;
  const hemRows = rowsForMeasurement(hemHeight, machineGauge);
  const armholeDepthRows = rowsForMeasurement(measurements.armholeDepth, machineGauge);
  const totalBodyRows = rowsForMeasurement(measurements.bodyLength, machineGauge);
  const bodyToArmhole = totalBodyRows - armholeDepthRows;

  // Setup
  steps.push({
    type: "setup",
    instruction: `${pieceName}: Bring ${stitches} needles to B position (${needles.left}L to ${needles.right}R).`,
    stitchCount: stitches,
    rowStart: 0,
    rowEnd: 0,
    techniques: [],
  });

  // Cast on
  steps.push({
    type: "cast-on",
    instruction: "Cast on using waste yarn: 10 rows waste yarn + 1 row ravel cord + switch to main yarn.",
    stitchCount: stitches,
    rowStart: 0,
    rowEnd: 0,
    techniques: ["wasteYarnCastOn"],
  });

  // Hem
  if (edgeTreatment === "turnedHem") {
    steps.push({
      type: "hem",
      instruction: `Knit ${hemRows} rows for turning hem (replaces the ribbing from the hand pattern).`,
      kh930Tip: "This will fold under when finishing. Knit at your main tension.",
      stitchCount: stitches,
      rowStart: 1,
      rowEnd: hemRows,
      techniques: ["turnedHem"],
    });
    rowCounter = hemRows;
  }

  // Body to armhole
  const straightBodyRows = bodyToArmhole - hemRows;
  if (straightBodyRows > 0) {
    steps.push({
      type: "body",
      instruction: `Reset row counter. Knit ${straightBodyRows} rows straight to armhole.`,
      stitchCount: stitches,
      rowStart: 1,
      rowEnd: straightBodyRows,
      techniques: [],
    });
    rowCounter += straightBodyRows;
  }

  // Armhole shaping
  if (shaping.armhole) {
    const bindOff = shaping.armhole.initialBindOff || 3;
    steps.push({
      type: "shaping",
      instruction: `Armhole: bind off ${bindOff} stitches at each side (${bindOff} at start of next 2 rows).`,
      kh930Tip: `Use the latch tool to chain off ${bindOff} stitches at the carriage side, knit across, then chain off ${bindOff} at the other side.`,
      stitchCount: stitches - bindOff * 2,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + 2,
      techniques: ["latchToolBindOff"],
    });
    currentStitches = stitches - bindOff * 2;
    rowCounter += 2;

    if (shaping.armhole.decreaseSchedule && shaping.armhole.decreaseSchedule.length > 0) {
      const armholeDecLength = measurements.armholeDepth * 0.5;
      const converted = convertShapingSchedule(
        shaping.armhole.decreaseSchedule,
        armholeDecLength,
        machineGauge
      );
      const totalDecSts = converted.times * 2;
      steps.push({
        type: "shaping",
        instruction: `Armhole decreases: decrease 1 stitch each side every ${converted.every} rows, ${converted.times} times (${totalDecSts} stitches decreased total).`,
        kh930Tip: "Use single transfer decrease: move the edge stitch inward onto its neighbor. Decrease on the carriage side, knit across, then decrease on the other side on the return.",
        stitchCount: currentStitches - totalDecSts,
        rowStart: rowCounter + 1,
        rowEnd: rowCounter + converted.every * converted.times,
        techniques: ["singleTransferDecrease"],
      });
      currentStitches -= totalDecSts;
      rowCounter += converted.every * converted.times;
    }
  }

  // Knit straight to shoulder
  const rowsToShoulder = totalBodyRows - rowCounter;
  const shoulderRows = isFront && shaping.neckline ? Math.floor(rowsToShoulder * 0.6) : rowsToShoulder;

  if (shoulderRows > 0) {
    steps.push({
      type: "body",
      instruction: `Knit ${shoulderRows} rows straight to ${isFront ? "neck shaping" : "shoulder"}.`,
      stitchCount: currentStitches,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + shoulderRows,
      techniques: [],
    });
    rowCounter += shoulderRows;
  }

  // Front neck shaping
  if (isFront && shaping.neckline) {
    const centerBO = shaping.neckline.centerBindOff || Math.floor(currentStitches * 0.3);
    const sideStitches = Math.floor((currentStitches - centerBO) / 2);

    steps.push({
      type: "shaping",
      instruction: `Neck shaping: bind off center ${centerBO} stitches. You will now work each side separately.`,
      kh930Tip: "Use the latch tool to bind off the center stitches. Push all LEFT side needles to E (holding) position and engage PART button.",
      stitchCount: currentStitches - centerBO,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + 1,
      techniques: ["latchToolBindOff", "necklineShaping"],
    });
    rowCounter += 1;

    if (shaping.neckline.decreaseSchedule && shaping.neckline.decreaseSchedule.length > 0) {
      const neckDecLength = measurements.neckDepth || 3;
      const converted = convertShapingSchedule(
        shaping.neckline.decreaseSchedule,
        neckDecLength,
        machineGauge
      );

      steps.push({
        type: "shaping",
        instruction: `RIGHT side: decrease 1 stitch at neck edge every ${converted.every} rows, ${converted.times} times. Then knit straight to shoulder.`,
        kh930Tip: "Transfer the neck-edge stitch onto its neighbor. The shoulder edge stays straight.",
        stitchCount: sideStitches - converted.times,
        rowStart: rowCounter + 1,
        rowEnd: rowCounter + converted.every * converted.times,
        techniques: ["singleTransferDecrease"],
      });
      rowCounter += converted.every * converted.times;

      steps.push({
        type: "shaping",
        instruction: `LEFT side: bring held stitches back to B position. Work to match right side, reversing shaping (decrease at neck edge).`,
        kh930Tip: "Push needles from E back to B. Decrease on the opposite edge from the right side.",
        stitchCount: sideStitches - converted.times,
        rowStart: rowCounter + 1,
        rowEnd: rowCounter + converted.every * converted.times,
        techniques: ["singleTransferDecrease", "necklineShaping"],
      });
      rowCounter += converted.every * converted.times;
    }
  }

  // Shoulder bind off
  if (shaping.shoulder && shaping.shoulder.bindOffSchedule && shaping.shoulder.bindOffSchedule.length > 0) {
    const schedule = shaping.shoulder.bindOffSchedule;
    const desc = schedule.map((s) => `${s.stitches} sts × ${s.times}`).join(", then ");
    steps.push({
      type: "bind-off",
      instruction: `Shoulder: bind off in steps — ${desc} — at each shoulder edge.`,
      kh930Tip: "Alternatively, use short rows: push groups of shoulder needles to E (hold) position instead of binding off. Then bind off all at once or put on waste yarn for grafting.",
      stitchCount: 0,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + schedule.reduce((sum, s) => sum + s.times * 2, 0),
      techniques: ["latchToolBindOff", "shortRows"],
    });
  } else {
    steps.push({
      type: "bind-off",
      instruction: `Bind off remaining ${currentStitches} stitches, or knit onto waste yarn for grafting shoulders later.`,
      kh930Tip: "Waste yarn removal is recommended for shoulders — it allows you to graft (Kitchener stitch) the front and back together for a smooth seam.",
      stitchCount: 0,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + 1,
      techniques: ["wasteYarnRemoval"],
    });
  }

  return {
    name: pieceName,
    needles,
    steps,
    totalRows: rowCounter,
    totalStitches: stitches,
    finalStitches: currentStitches,
  };
}

/**
 * Generate machine steps for a sleeve.
 */
export function generateSleeveSteps(measurements, machineGauge, shaping, edgeTreatment) {
  const cuffStitches = stitchesForMeasurement(measurements.sleeveCuffWidth, machineGauge);
  const upperArmStitches = stitchesForMeasurement(measurements.sleeveUpperArm, machineGauge);
  const needles = getNeedleSetup(cuffStitches);
  const steps = [];
  let rowCounter = 0;
  let currentStitches = cuffStitches;

  const cuffHeight = measurements.sleeveCuffHeight || 2;
  const cuffRows = rowsForMeasurement(cuffHeight, machineGauge);
  const totalSleeveRows = rowsForMeasurement(measurements.sleeveLength, machineGauge);

  steps.push({
    type: "setup",
    instruction: `Sleeve: Bring ${cuffStitches} needles to B position (${needles.left}L to ${needles.right}R).`,
    stitchCount: cuffStitches,
    rowStart: 0,
    rowEnd: 0,
    techniques: [],
  });

  steps.push({
    type: "cast-on",
    instruction: "Cast on using waste yarn: 10 rows waste yarn + 1 row ravel cord + switch to main yarn.",
    stitchCount: cuffStitches,
    rowStart: 0,
    rowEnd: 0,
    techniques: ["wasteYarnCastOn"],
  });

  if (edgeTreatment === "turnedHem") {
    steps.push({
      type: "hem",
      instruction: `Knit ${cuffRows} rows for turned hem cuff.`,
      stitchCount: cuffStitches,
      rowStart: 1,
      rowEnd: cuffRows,
      techniques: ["turnedHem"],
    });
    rowCounter = cuffRows;
  }

  // Sleeve increases
  const stsToIncrease = upperArmStitches - cuffStitches;
  if (stsToIncrease > 0 && shaping.sleeveTaper) {
    const increaseLength = measurements.sleeveLength - cuffHeight;
    const schedule = shaping.sleeveTaper.increaseSchedule || [{ every: 6, times: Math.floor(stsToIncrease / 2) }];
    const converted = convertShapingSchedule(schedule, increaseLength, machineGauge);

    const actualIncreases = Math.min(converted.times, Math.floor(stsToIncrease / 2));
    const increaseRows = converted.every * actualIncreases;

    steps.push({
      type: "shaping",
      instruction: `Sleeve increases: increase 1 stitch each side every ${converted.every} rows, ${actualIncreases} times (${actualIncreases * 2} stitches added). Push one needle from A to B at each edge.`,
      kh930Tip: "At each increase row, push one needle at each edge from A to B position. Pick up the bar between stitches to prevent a hole, or just let the new needle knit on the next pass (the small hole will be hidden in the seam).",
      stitchCount: cuffStitches + actualIncreases * 2,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + increaseRows,
      techniques: ["edgeIncrease"],
    });
    currentStitches = cuffStitches + actualIncreases * 2;
    rowCounter += increaseRows;

    // Straight rows to cap if any
    const remainingRows = totalSleeveRows - rowCounter;
    if (remainingRows > 0) {
      steps.push({
        type: "body",
        instruction: `Knit ${remainingRows} rows straight to sleeve cap.`,
        stitchCount: currentStitches,
        rowStart: rowCounter + 1,
        rowEnd: rowCounter + remainingRows,
        techniques: [],
      });
      rowCounter += remainingRows;
    }
  } else {
    const straightRows = totalSleeveRows - rowCounter;
    steps.push({
      type: "body",
      instruction: `Knit ${straightRows} rows straight.`,
      stitchCount: currentStitches,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + straightRows,
      techniques: [],
    });
    rowCounter += straightRows;
  }

  // Sleeve cap
  if (shaping.sleeveCap) {
    const bindOff = shaping.sleeveCap.initialBindOff || 3;
    steps.push({
      type: "shaping",
      instruction: `Sleeve cap: bind off ${bindOff} stitches at each side.`,
      stitchCount: currentStitches - bindOff * 2,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + 2,
      techniques: ["latchToolBindOff"],
    });
    currentStitches -= bindOff * 2;
    rowCounter += 2;

    if (shaping.sleeveCap.decreaseSchedule && shaping.sleeveCap.decreaseSchedule.length > 0) {
      const capHeight = measurements.armholeDepth * 0.6;
      const converted = convertShapingSchedule(
        shaping.sleeveCap.decreaseSchedule,
        capHeight,
        machineGauge
      );
      const totalDecSts = converted.times * 2;

      steps.push({
        type: "shaping",
        instruction: `Sleeve cap decreases: decrease 1 stitch each side every ${converted.every} rows, ${converted.times} times.`,
        kh930Tip: "Use single transfer decrease at each edge. The cap curves inward as you decrease.",
        stitchCount: currentStitches - totalDecSts,
        rowStart: rowCounter + 1,
        rowEnd: rowCounter + converted.every * converted.times,
        techniques: ["singleTransferDecrease"],
      });
      currentStitches -= totalDecSts;
      rowCounter += converted.every * converted.times;
    }

    const finalBO = shaping.sleeveCap.finalBindOff || currentStitches;
    steps.push({
      type: "bind-off",
      instruction: `Bind off remaining ${Math.min(finalBO, currentStitches)} stitches.`,
      stitchCount: 0,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + 1,
      techniques: ["latchToolBindOff"],
    });
  } else {
    steps.push({
      type: "bind-off",
      instruction: `Bind off all ${currentStitches} stitches.`,
      stitchCount: 0,
      rowStart: rowCounter + 1,
      rowEnd: rowCounter + 1,
      techniques: ["latchToolBindOff"],
    });
  }

  return {
    name: "Sleeve (make 2)",
    needles,
    steps,
    totalRows: rowCounter,
    totalStitches: cuffStitches,
    finalStitches: currentStitches,
  };
}
