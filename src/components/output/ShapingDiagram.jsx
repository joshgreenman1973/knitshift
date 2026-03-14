/**
 * Simple SVG schematic showing piece outline with measurements.
 */
export default function ShapingDiagram({ piece, garmentType }) {
  if (garmentType === "scarf") {
    return <ScarfDiagram piece={piece} />;
  }
  if (garmentType === "hat") {
    return <HatDiagram piece={piece} />;
  }
  if (piece.name === "Sleeve (make 2)") {
    return <SleeveDiagram piece={piece} />;
  }
  return <BodyDiagram piece={piece} />;
}

function ScarfDiagram({ piece }) {
  return (
    <div className="bg-white rounded-lg border border-knit-200 p-4">
      <svg viewBox="0 0 300 80" className="w-full max-w-md mx-auto">
        <rect
          x="10"
          y="15"
          width="280"
          height="50"
          fill="none"
          stroke="#829ab1"
          strokeWidth="2"
        />
        <text x="150" y="45" textAnchor="middle" fontSize="11" fill="#486581">
          {piece.totalStitches} sts
        </text>
        <text x="150" y="12" textAnchor="middle" fontSize="10" fill="#829ab1">
          {piece.totalRows} rows
        </text>
      </svg>
    </div>
  );
}

function HatDiagram({ piece }) {
  return (
    <div className="bg-white rounded-lg border border-knit-200 p-4">
      <svg viewBox="0 0 200 140" className="w-full max-w-xs mx-auto">
        {/* Hat body */}
        <rect
          x="20"
          y="30"
          width="160"
          height="90"
          fill="none"
          stroke="#829ab1"
          strokeWidth="2"
        />
        {/* Crown shaping hint */}
        <line x1="20" y1="30" x2="60" y2="10" stroke="#829ab1" strokeWidth="1" strokeDasharray="4" />
        <line x1="180" y1="30" x2="140" y2="10" stroke="#829ab1" strokeWidth="1" strokeDasharray="4" />
        <line x1="60" y1="10" x2="140" y2="10" stroke="#829ab1" strokeWidth="1" strokeDasharray="4" />
        {/* Labels */}
        <text x="100" y="80" textAnchor="middle" fontSize="11" fill="#486581">
          {piece.totalStitches} sts
        </text>
        <text x="195" y="75" textAnchor="start" fontSize="10" fill="#829ab1">
          {piece.totalRows} rows
        </text>
        <text x="100" y="135" textAnchor="middle" fontSize="9" fill="#9fb3c8">
          ← brim (fold) →
        </text>
      </svg>
    </div>
  );
}

function BodyDiagram({ piece }) {
  const hasShaping = piece.steps.some((s) => s.type === "shaping");

  return (
    <div className="bg-white rounded-lg border border-knit-200 p-4">
      <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto">
        {/* Main body rectangle */}
        <rect
          x="20"
          y="40"
          width="160"
          height="140"
          fill="none"
          stroke="#829ab1"
          strokeWidth="2"
        />
        {/* Armhole notches */}
        {hasShaping && (
          <>
            <rect x="20" y="40" width="15" height="25" fill="white" stroke="#829ab1" strokeWidth="1.5" />
            <rect x="165" y="40" width="15" height="25" fill="white" stroke="#829ab1" strokeWidth="1.5" />
          </>
        )}
        {/* Neck */}
        {piece.name.includes("Front") && (
          <path
            d="M 70 40 Q 100 55 130 40"
            fill="white"
            stroke="#829ab1"
            strokeWidth="1.5"
          />
        )}
        {/* Labels */}
        <text x="100" y="120" textAnchor="middle" fontSize="11" fill="#486581">
          {piece.totalStitches} sts
        </text>
        <text x="100" y="195" textAnchor="middle" fontSize="9" fill="#9fb3c8">
          ← hem →
        </text>
        <text x="8" y="110" textAnchor="middle" fontSize="10" fill="#829ab1" transform="rotate(-90, 8, 110)">
          {piece.totalRows} rows
        </text>
      </svg>
    </div>
  );
}

function SleeveDiagram({ piece }) {
  return (
    <div className="bg-white rounded-lg border border-knit-200 p-4">
      <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto">
        {/* Sleeve trapezoid */}
        <polygon
          points="50,40 150,40 170,180 30,180"
          fill="none"
          stroke="#829ab1"
          strokeWidth="2"
        />
        {/* Cap curve */}
        <path
          d="M 50 40 Q 100 15 150 40"
          fill="none"
          stroke="#829ab1"
          strokeWidth="1.5"
          strokeDasharray="4"
        />
        {/* Labels */}
        <text x="100" y="110" textAnchor="middle" fontSize="11" fill="#486581">
          {piece.totalStitches} → {piece.finalStitches || "?"} sts
        </text>
        <text x="100" y="195" textAnchor="middle" fontSize="9" fill="#9fb3c8">
          ← cuff →
        </text>
        <text x="15" y="110" textAnchor="middle" fontSize="10" fill="#829ab1" transform="rotate(-90, 15, 110)">
          {piece.totalRows} rows
        </text>
      </svg>
    </div>
  );
}
