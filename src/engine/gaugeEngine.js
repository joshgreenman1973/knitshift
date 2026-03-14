/**
 * Gauge conversion engine.
 * All conversions work through physical measurements (inches) to avoid
 * compounding rounding errors from stitch-to-stitch conversion.
 */

export function stitchesForMeasurement(inches, machineGauge) {
  return Math.round((inches / 4) * machineGauge.stitchesPer4in);
}

export function rowsForMeasurement(inches, machineGauge) {
  return Math.round((inches / 4) * machineGauge.rowsPer4in);
}

export function inchesForStitches(stitches, gauge) {
  return (stitches / gauge.stitchesPer4in) * 4;
}

export function inchesForRows(rows, gauge) {
  return (rows / gauge.rowsPer4in) * 4;
}

export function convertStitchCount(handStitches, handGauge, machineGauge) {
  const inches = inchesForStitches(handStitches, handGauge);
  return Math.round((inches / 4) * machineGauge.stitchesPer4in);
}

export function convertRowCount(handRows, handGauge, machineGauge) {
  const inches = inchesForRows(handRows, handGauge);
  return Math.round((inches / 4) * machineGauge.rowsPer4in);
}

/**
 * Recalculate a shaping schedule for machine gauge.
 * Input: array of { every, times } rules from the hand pattern, plus the
 * total length (in inches) the shaping should span.
 * Output: a single consolidated { every, times, remainder } for the machine.
 */
export function convertShapingSchedule(schedule, targetLengthInches, machineGauge) {
  const totalMachineRows = rowsForMeasurement(targetLengthInches, machineGauge);
  const totalEvents = schedule.reduce((sum, s) => sum + (s.times || 0), 0);

  if (totalEvents === 0) {
    return { every: 0, times: 0, totalRows: totalMachineRows, remainder: totalMachineRows };
  }

  let rowsBetween = Math.floor(totalMachineRows / totalEvents);
  // Ensure even number for carriage position consistency
  if (rowsBetween > 1 && rowsBetween % 2 !== 0) {
    rowsBetween -= 1;
  }
  rowsBetween = Math.max(2, rowsBetween);

  const usedRows = rowsBetween * totalEvents;
  const remainder = totalMachineRows - usedRows;

  return {
    every: rowsBetween,
    times: totalEvents,
    totalRows: totalMachineRows,
    remainder: Math.max(0, remainder),
  };
}

/**
 * Calculate the actual finished measurement that a given stitch/row count
 * will produce at machine gauge. Useful for showing the user how their
 * machine piece will compare to the hand pattern dimensions.
 */
export function actualMeasurement(count, gaugeValuePer4in) {
  return Number(((count / gaugeValuePer4in) * 4).toFixed(2));
}

/**
 * Full gauge summary: given measurements and machine gauge, return all
 * the computed stitch/row counts and actual dimensions.
 */
export function computeGaugeSummary(measurements, machineGauge) {
  const summary = {};
  for (const [key, inches] of Object.entries(measurements)) {
    if (typeof inches !== "number" || inches <= 0) continue;

    const isWidth =
      key.toLowerCase().includes("width") ||
      key.toLowerCase().includes("circumference") ||
      key.toLowerCase().includes("cuff");

    if (isWidth) {
      const sts = stitchesForMeasurement(inches, machineGauge);
      summary[key] = {
        inches,
        stitches: sts,
        actualInches: actualMeasurement(sts, machineGauge.stitchesPer4in),
      };
    } else {
      const rws = rowsForMeasurement(inches, machineGauge);
      summary[key] = {
        inches,
        rows: rws,
        actualInches: actualMeasurement(rws, machineGauge.rowsPer4in),
      };
    }
  }
  return summary;
}
