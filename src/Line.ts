/**
 * Represents a line with a precise length in inches.
 * Internally stores length in eighths of an inch to avoid floating point errors.
 */
export class Line {
  private lengthInEighths: number;

  /**
   * Creates a new Line with the specified length in inches
   * @param lengthInInches - The length in inches
   */
  constructor(lengthInInches: number) {
    // Store as eighths of inches (integers) to maintain precision
    this.lengthInEighths = Math.round(lengthInInches * 8);
  }

  /**
   * Gets the length of the line in inches
   */
  get length(): number {
    return this.lengthInEighths / 8;
  }

  /**
   * Sets the length of the line in inches
   */
  set length(lengthInInches: number) {
    this.lengthInEighths = Math.round(lengthInInches * 8);
  }

  /**
   * Checks if the line's length matches the estimate
   * @param estimate - The estimated length in inches
   * @returns true if the estimate matches the line's length (to the nearest 1/8")
   */
  isLength(estimate: number): boolean {
    const estimateInEighths = Math.round(estimate * 8);
    return this.lengthInEighths === estimateInEighths;
  }
}

// Example usage:
// const line = new Line(1.375);  // 1 3/8"
// console.log(line.length); // 1.375
// console.log(line.isLength(1.375)); // true
// console.log(line.isLength(1.4)); // false (not on an eighth boundary)
