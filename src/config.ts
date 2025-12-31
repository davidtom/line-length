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
 * Maximum line length in inches
 */
export const MAX_LENGTH_INCHES = 2;

/**
 * Standard credit card dimensions (ISO/IEC 7810)
 */
export const CREDIT_CARD_WIDTH_INCHES = 3.37;
export const CREDIT_CARD_HEIGHT_INCHES = 2.125;

/**
 * Default pixels per inch (96 DPI web standard)
 * Used as fallback when not calibrated
 */
export const DEFAULT_PPI = 96;

/**
 * localStorage key for storing calibrated PPI
 */
export const STORAGE_KEY = "screen-ppi";
