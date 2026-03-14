import { useReducer, useEffect, createContext, useContext } from "react";
import { getDefaultMeasurements } from "../data/garmentTemplates.js";

const STORAGE_KEY = "knitshift_patterns";

function createNewPattern() {
  return {
    id: crypto.randomUUID(),
    name: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    garmentType: "scarf",
    yarn: { name: "", weight: "worsted", fiberContent: "", yardage: "" },
    gauge: {
      hand: { stitchesPer4in: 18, rowsPer4in: 24, needleSize: "" },
      machine: { stitchesPer4in: 24, rowsPer4in: 32, tensionDial: 7, swatched: false },
    },
    measurements: getDefaultMeasurements("scarf"),
    edgeTreatment: "turnedHem",
    shaping: {},
    machinePattern: null,
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        patterns: data.patterns || [],
        currentPattern: data.currentPattern || createNewPattern(),
      };
    }
  } catch {
    // ignore
  }
  return { patterns: [], currentPattern: createNewPattern() };
}

function saveToStorage(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, patterns: state.patterns, currentPattern: state.currentPattern })
    );
  } catch {
    // ignore quota errors
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_CURRENT": {
      const updated = { ...state.currentPattern, ...action.payload, updatedAt: new Date().toISOString() };
      return { ...state, currentPattern: updated };
    }
    case "UPDATE_FIELD": {
      const { path, value } = action.payload;
      const keys = path.split(".");
      const updated = { ...state.currentPattern, updatedAt: new Date().toISOString() };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return { ...state, currentPattern: updated };
    }
    case "SAVE": {
      const pattern = { ...state.currentPattern, updatedAt: new Date().toISOString() };
      const existing = state.patterns.findIndex((p) => p.id === pattern.id);
      const patterns = [...state.patterns];
      if (existing >= 0) {
        patterns[existing] = pattern;
      } else {
        patterns.push(pattern);
      }
      return { ...state, patterns, currentPattern: pattern };
    }
    case "LOAD": {
      const pattern = state.patterns.find((p) => p.id === action.id);
      if (pattern) return { ...state, currentPattern: { ...pattern } };
      return state;
    }
    case "DELETE": {
      const patterns = state.patterns.filter((p) => p.id !== action.id);
      const currentPattern =
        state.currentPattern.id === action.id ? createNewPattern() : state.currentPattern;
      return { ...state, patterns, currentPattern };
    }
    case "NEW":
      return { ...state, currentPattern: createNewPattern() };
    case "IMPORT": {
      try {
        const imported = JSON.parse(action.json);
        const newPatterns = Array.isArray(imported) ? imported : imported.patterns || [];
        const merged = [...state.patterns];
        for (const p of newPatterns) {
          if (!merged.find((m) => m.id === p.id)) merged.push(p);
        }
        return { ...state, patterns: merged };
      } catch {
        return state;
      }
    }
    default:
      return state;
  }
}

export const PatternContext = createContext(null);

export function PatternProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const value = {
    patterns: state.patterns,
    currentPattern: state.currentPattern,
    dispatch,
    updateField: (path, value) => dispatch({ type: "UPDATE_FIELD", payload: { path, value } }),
    updateCurrent: (payload) => dispatch({ type: "UPDATE_CURRENT", payload }),
    savePattern: () => dispatch({ type: "SAVE" }),
    loadPattern: (id) => dispatch({ type: "LOAD", id }),
    deletePattern: (id) => dispatch({ type: "DELETE", id }),
    newPattern: () => dispatch({ type: "NEW" }),
    importPatterns: (json) => dispatch({ type: "IMPORT", json }),
    exportAll: () => JSON.stringify(state.patterns, null, 2),
  };

  return <PatternContext.Provider value={value}>{children}</PatternContext.Provider>;
}

export function usePatternStore() {
  const ctx = useContext(PatternContext);
  if (!ctx) throw new Error("usePatternStore must be used within PatternProvider");
  return ctx;
}
