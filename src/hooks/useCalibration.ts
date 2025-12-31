import { useState } from "react";
import { STORAGE_KEY, DEFAULT_PPI } from "../config";

/**
 * Custom hook for managing screen calibration (PPI)
 * Reads from and writes to localStorage
 * @returns Object with ppi, savePpi function, and isCalibrated flag
 */
export function useCalibration() {
  const [ppi, setPpiState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseFloat(stored);
        // Validate that it's a reasonable PPI value (15-300)
        if (!isNaN(parsed) && parsed >= 15 && parsed <= 300) {
          return parsed;
        }
      }
    } catch (error) {
      // localStorage might not be available (private browsing, etc.)
      console.warn("Failed to read calibration from localStorage:", error);
    }
    return DEFAULT_PPI;
  });

  /**
   * Save a new PPI value to localStorage and state
   * @param newPpi - The new pixels per inch value
   */
  const savePpi = (newPpi: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, newPpi.toString());
      setPpiState(newPpi);
    } catch (error) {
      console.error("Failed to save calibration to localStorage:", error);
      // Still update state even if localStorage fails
      setPpiState(newPpi);
    }
  };

  /**
   * Whether the screen has been calibrated (not using default)
   */
  const isCalibrated = ppi !== DEFAULT_PPI;

  return { ppi, savePpi, isCalibrated };
}
