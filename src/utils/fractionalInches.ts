import { z } from "zod";
import { INCH_INCREMENT, MAX_LENGTH_INCHES } from "../config";

/**
 * Parses fractional inch input strings
 * Supports formats: "2", "5/8", "2 5/8", "1 1/8"
 * @param input - The input string to parse
 * @returns The numeric value in inches, or null if invalid
 */
export function parseFractionalInches(input: string): number | null {
  const trimmed = input.trim();

  // Pattern: optional whole number, optional space, optional fraction
  // Examples: "2", "5/8", "2 5/8", "1 1/8"
  const match = trimmed.match(/^(\d+)?(\s+)?(\d+)\/(\d+)?$/);

  if (!match) {
    // No fraction found, try parsing as whole number or decimal
    const num = parseFloat(trimmed);
    return isNaN(num) ? null : num;
  }

  const [, wholeStr, , numeratorStr, denominatorStr] = match;
  const wholePart = wholeStr ? parseInt(wholeStr, 10) : 0;
  const numerator = parseInt(numeratorStr, 10);
  const denominator = denominatorStr ? parseInt(denominatorStr, 10) : 1;

  if (denominator === 0) return null;

  const fractionPart = numerator / denominator;
  return wholePart + fractionPart;
}

/**
 * Formats a decimal inch value as a fractional string
 * Always displays in eighths (doesn't simplify 6/8 to 3/4)
 * @param inches - The value in inches
 * @returns Formatted string like "2 5/8"" or "1/8""
 */
export function formatFractionalInches(inches: number): string {
  const whole = Math.floor(inches);
  const fraction = inches - whole;

  if (fraction === 0) return `${whole}"`;

  // Convert to the configured increment (keep in eighths, don't simplify)
  const numerator = Math.round(fraction * INCH_INCREMENT);

  if (whole === 0) return `${numerator}/${INCH_INCREMENT}"`;
  return `${whole} ${numerator}/${INCH_INCREMENT}"`;
}

/**
 * Zod schema for validating fractional inch guesses
 */
export const guessSchema = z
  .string()
  .min(1, "Please enter a guess")
  .refine((val) => {
    const parsed = parseFractionalInches(val);
    return parsed !== null && parsed > 0 && parsed <= MAX_LENGTH_INCHES;
  }, `Must be between 1/${INCH_INCREMENT}" and ${MAX_LENGTH_INCHES}"`)
  .refine((val) => {
    const parsed = parseFractionalInches(val);
    if (parsed === null) return false;
    const inIncrements = parsed * INCH_INCREMENT;
    return Math.abs(inIncrements - Math.round(inIncrements)) < 0.001;
  }, `Must be in 1/${INCH_INCREMENT}" increments`)
  .transform(parseFractionalInches);
