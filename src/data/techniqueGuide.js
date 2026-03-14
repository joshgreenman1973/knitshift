const TECHNIQUES = {
  wasteYarnCastOn: {
    name: "Waste Yarn Cast On",
    handEquivalent: "Cast on",
    difficulty: "beginner",
    steps: [
      "Thread waste yarn (smooth acrylic in a contrasting color) through the tension mast.",
      "Bring the required number of needles to B (working) position.",
      "Set the tension dial 1-2 numbers higher than your main tension (looser).",
      "With the carriage on the right, knit 10-15 rows of waste yarn.",
      "Knit 1 row with ravel cord (a smooth, strong, contrasting thread).",
      "Change to your main yarn by threading it through the tension mast.",
      "Reset the tension dial to your main tension setting.",
      "Continue knitting with main yarn.",
    ],
    tips: [
      "The waste yarn gives you a stable start and can be removed later, leaving live stitches you can finish (hem, graft, etc.).",
      "Use a smooth, non-fuzzy acrylic for waste yarn — it needs to pull out easily later.",
      "The ravel cord marks where your main knitting begins and makes it easy to separate the waste yarn later.",
    ],
    commonMistakes: [
      "Forgetting to change the tension back when switching to main yarn.",
      "Using fuzzy or sticky waste yarn that's hard to remove later.",
    ],
  },

  eWrapCastOn: {
    name: "E-Wrap Cast On",
    handEquivalent: "Long-tail cast on",
    difficulty: "beginner",
    steps: [
      "Bring the required needles to B (working) position.",
      "Starting from the right, wrap the yarn around each needle in an e-wrap (figure-8 motion): come from behind the needle, wrap counterclockwise.",
      "Make sure each wrap sits in the hook of the needle.",
      "Set the tension dial to your main tension.",
      "Push all wrapped needles to D position.",
      "Run the carriage across slowly for the first row.",
    ],
    tips: [
      "This creates a finished cast-on edge — good for scarves and items where the cast-on edge is visible.",
      "The first row can be tight. Knit the first 2-3 rows at a slightly looser tension, then tighten.",
      "Hold the wraps gently with your hand as the carriage passes for the first row.",
    ],
    commonMistakes: [
      "Wrapping too tightly — makes the first row hard to knit.",
      "Wrapping in the wrong direction — all wraps should go the same way.",
    ],
  },

  latchToolBindOff: {
    name: "Latch Tool Bind Off",
    handEquivalent: "Standard bind off / cast off",
    difficulty: "beginner",
    steps: [
      "Cut the yarn, leaving a tail about 4x the width of your knitting.",
      "Starting at the right side, take the stitch off the first needle with the single-prong latch tool.",
      "Hook the next stitch and pull it through the first stitch (chain one).",
      "Continue across, chaining each stitch through the previous one.",
      "When you reach the last stitch, pull the yarn tail through to secure.",
    ],
    tips: [
      "Keep an even tension — not too tight or the edge will pucker.",
      "If the bind-off is too tight, use a slightly thicker yarn or a looser technique.",
      "For shoulder seams, consider using waste yarn instead so you can graft (Kitchener stitch) the pieces together later.",
    ],
    commonMistakes: [
      "Binding off too tightly — the edge won't stretch.",
      "Dropping a stitch while transferring to the latch tool.",
    ],
  },

  wasteYarnRemoval: {
    name: "Waste Yarn Removal (for grafting)",
    handEquivalent: "Putting stitches on hold / live stitches",
    difficulty: "beginner",
    steps: [
      "When you're ready to remove the piece, knit 8-10 rows of waste yarn.",
      "Remove the piece from the machine by running the carriage across without yarn (or carefully lifting off).",
      "The waste yarn holds your live stitches secure.",
      "Later, you can remove the waste yarn one stitch at a time as you graft, seam, or pick up stitches.",
    ],
    tips: [
      "This is the preferred method for shoulder seams — allows you to graft for a smooth, invisible join.",
      "Also useful for necklines — pick up the live stitches later to add an edging.",
    ],
    commonMistakes: [
      "Not knitting enough rows of waste yarn — the stitches can unravel.",
    ],
  },

  singleTransferDecrease: {
    name: "Single Transfer Decrease",
    handEquivalent: "K2tog / SSK / SKP",
    difficulty: "beginner",
    steps: [
      "Identify which edge to decrease (the carriage side).",
      "Using the single transfer tool, lift the edge stitch off its needle.",
      "Place it onto the next needle inward (so two stitches share one needle).",
      "Push the now-empty needle back to A (non-working) position.",
      "Continue knitting — the two stitches will knit together on the next pass.",
    ],
    tips: [
      "Always decrease on the carriage side — you need to be able to reach the edge the carriage is coming from.",
      "For fully fashioned decreasing (visible diagonal line), move stitches 2 and 3 from the edge inward, leaving stitch 1 on its needle, then transfer stitch 1 onto the doubled needle.",
      "If decreasing both sides on the same row, decrease the carriage side, knit across, then decrease the other side on the return pass.",
    ],
    commonMistakes: [
      "Forgetting to push the empty needle to A position — it will create a hole.",
      "Trying to decrease on the side away from the carriage.",
    ],
  },

  edgeIncrease: {
    name: "Edge Increase",
    handEquivalent: "M1 / KFB / Make 1",
    difficulty: "beginner",
    steps: [
      "At the edge where you want to increase, find the first non-working needle next to your knitting.",
      "Push it forward to B (working) position.",
      "Using the single transfer tool, pick up the bar between the last stitch and the new needle, and place it on the new needle.",
      "Alternatively, just push the needle to B and let the carriage knit it on the next pass (creates a small hole — acceptable for edges hidden in seams).",
    ],
    tips: [
      "Work increases 1-2 stitches in from the edge for a neater result.",
      "If the increase edge will be visible (not seamed), use the picked-up bar method for a cleaner look.",
      "For sleeve increases, you typically increase 1 stitch each side at regular intervals.",
    ],
    commonMistakes: [
      "Not hooking the bar — leaving the needle empty creates a hole, not an increase.",
      "Increasing too close to the very edge, causing loose loops.",
    ],
  },

  shortRows: {
    name: "Short Rows / Holding",
    handEquivalent: "Wrap and turn / Short rows",
    difficulty: "intermediate",
    steps: [
      "Decide which needles will be held (not knitting).",
      "Push those needles to E (holding) position — fully forward.",
      "Engage the PART button on the carriage (the holding cam lever).",
      "Knit across — the carriage will skip the held needles.",
      "To bring needles back into work, push them back to B position before the next pass.",
    ],
    tips: [
      "The PART button must be set on the side where needles are being held.",
      "Short rows are used for shoulder shaping — instead of binding off in steps, you hold groups of needles, then bind off all at once for a smoother line.",
      "When bringing needles back to work, push them to D (upper working) first, then wrap yarn around them before knitting to prevent holes.",
    ],
    commonMistakes: [
      "Forgetting to engage the PART button — the carriage will try to knit held needles and jam.",
      "Having the PART button on the wrong side.",
    ],
  },

  turnedHem: {
    name: "Turned Hem",
    handEquivalent: "1x1 rib / 2x2 rib border",
    difficulty: "beginner",
    steps: [
      "After casting on with waste yarn and switching to main yarn, knit the number of rows for your hem depth (e.g., 14 rows for a 1-inch hem).",
      "This creates the underside of the hem that will fold up.",
      "Continue knitting the body of your garment.",
      "When the piece is finished and off the machine, fold the hem to the wrong side along the first row of main yarn.",
      "Using a tapestry needle and matching yarn, stitch the hem in place, catching every stitch to prevent rolling.",
    ],
    tips: [
      "A turned hem is the best single-bed alternative to ribbing — it lies flat and prevents the stockinette curl.",
      "For a sharper fold line, you can knit one row at a much tighter tension where you want the fold.",
      "The hem rows should be slightly fewer than the body rows for the same measurement, since the fold takes up a tiny bit of length.",
      "You can also hang the hem while still on the machine: pick up the first row of main yarn stitches with a transfer tool and hang them onto the corresponding needles. Then knit one row to join. This is faster but takes practice.",
    ],
    commonMistakes: [
      "Making the hem too long — it gets bulky.",
      "Not stitching the hem down evenly — creates a bumpy edge.",
    ],
  },

  changingYarn: {
    name: "Changing Yarn / Joining New Ball",
    handEquivalent: "Joining new yarn",
    difficulty: "beginner",
    steps: [
      "When you're running low on yarn, stop with the carriage on one side.",
      "Cut the old yarn, leaving a 6-inch tail.",
      "Thread the new yarn through the tension mast.",
      "Tie the new yarn to the old tail with a loose knot at the edge of the knitting.",
      "Continue knitting. The knot will be at the edge and can be woven in later.",
    ],
    tips: [
      "Try to change yarn at the same edge each time for consistency.",
      "Don't change yarn in the middle of a shaping sequence if you can avoid it.",
    ],
    commonMistakes: [
      "Tying the knot too tight — it pulls the edge in.",
      "Not leaving enough tail to weave in later.",
    ],
  },

  droppedStitchRepair: {
    name: "Dropped Stitch Repair",
    handEquivalent: "Picking up a dropped stitch",
    difficulty: "beginner",
    steps: [
      "Stop the carriage immediately when you notice a dropped stitch.",
      "Identify the dropped stitch and how far down it has laddered.",
      "Using the single-prong latch tool, insert it through the dropped stitch from front to back.",
      "Hook the lowest ladder bar and pull it through the stitch.",
      "Continue hooking each ladder bar up through the stitch until you reach the current row.",
      "Place the repaired stitch back on its needle in B position.",
    ],
    tips: [
      "A dropped stitch ladders fast on the machine — stop as soon as you notice it.",
      "Check your knitting every 20-30 rows to catch problems early.",
      "If multiple stitches have dropped, work them one at a time from the edges inward.",
    ],
    commonMistakes: [
      "Latching the bars in the wrong order — the stitch will be twisted.",
      "Not putting the stitch back on the needle correctly — it will drop again.",
    ],
  },

  necklineShaping: {
    name: "Working a Neckline (single bed)",
    handEquivalent: "Neck shaping — work each side separately",
    difficulty: "intermediate",
    steps: [
      "When you reach the neck shaping rows, bind off the center stitches using the latch tool.",
      "Push all the needles on the LEFT side of the neck to E (holding) position.",
      "Engage the PART button.",
      "Work the RIGHT side only: decrease at the neck edge as directed, while continuing to knit the shoulder.",
      "When the right side is complete, put those stitches on waste yarn.",
      "Bring the LEFT side needles back to B position.",
      "Work the left side to match, reversing all shaping.",
    ],
    tips: [
      "Keep notes on exactly which rows you decreased on the first side — you need to mirror it.",
      "The carriage direction matters: you can only decrease on the side the carriage is coming from.",
      "After binding off center stitches, you may need to use a separate length of yarn for the first row of the second side.",
    ],
    commonMistakes: [
      "Forgetting which side you already shaped — always work right side first, then left.",
      "Not engaging PART when holding one side — the carriage will try to knit held needles.",
    ],
  },

  seamingPieces: {
    name: "Seaming / Finishing",
    handEquivalent: "Mattress stitch / seaming",
    difficulty: "intermediate",
    steps: [
      "Block all pieces first: wet them, pin to measurements, and let dry flat.",
      "Seam shoulders first (graft with Kitchener stitch if you used waste yarn, or mattress stitch if bound off).",
      "Set in sleeves: match the center of the sleeve cap to the shoulder seam. Pin in place, then mattress stitch around the armhole.",
      "Sew side seams and sleeve seams with mattress stitch, working from the bottom up.",
      "Add neckband or edge treatment last.",
      "Weave in all yarn tails.",
    ],
    tips: [
      "Machine-knit fabric is denser than hand-knit — use a blunt tapestry needle.",
      "Blocking is especially important for machine knitting to even out the stitches and relax the fabric.",
      "Mattress stitch worked one full stitch in from the edge gives the neatest seam.",
    ],
    commonMistakes: [
      "Skipping blocking — machine-knit pieces can look uneven until blocked.",
      "Seaming too tightly — the seam should have the same stretch as the knit fabric.",
    ],
  },
};

export function getTechnique(key) {
  return TECHNIQUES[key] || null;
}

export function getAllTechniques() {
  return TECHNIQUES;
}

export default TECHNIQUES;
