/**
 * Configuration constants for the line-guessing game
 */

/**
 * The increment for line measurements and guesses
 * 8 = 1/8 inch increments
 * 16 = 1/16 inch increments (future)
 */
export const INCH_INCREMENT = 8;

/**
 * Default maximum line length in inches (fallback for SSR)
 * Actual max length is determined dynamically by getMaxLineLength()
 */
export const DEFAULT_MAX_LENGTH_INCHES = 2;

/**
 * Maximum number of guesses allowed per game
 */
export const MAX_GUESSES = 4;

/**
 * Default pixels per inch (96 DPI web standard)
 * Used as fallback when not calibrated
 */
export const DEFAULT_PPI = 96;

/**
 * localStorage key for storing calibrated PPI
 */
export const STORAGE_KEY = "screen-ppi";
