/**
 * Represents a line with a precise length in millimeters.
 * Internally stores length in tenths of a millimeter to avoid floating point errors.
 */
export class Line {
  private lengthInTenths: number;

  /**
   * Creates a new Line with the specified length in millimeters
   * @param lengthInMm - The length in millimeters
   */
  constructor(lengthInMm: number) {
    // Store as tenths of mm (integers) to maintain precision
    this.lengthInTenths = Math.round(lengthInMm * 10);
  }

  /**
   * Gets the length of the line in millimeters
   */
  get length(): number {
    return this.lengthInTenths / 10;
  }

  /**
   * Sets the length of the line in millimeters
   */
  set length(lengthInMm: number) {
    this.lengthInTenths = Math.round(lengthInMm * 10);
  }

  /**
   * Adds length to the line
   * @param mmToAdd - Millimeters to add
   */
  addLength(mmToAdd: number): void {
    this.lengthInTenths += Math.round(mmToAdd * 10);
  }

  /**
   * Checks if the line's length matches the estimate when rounded to one decimal place
   * @param estimate - The estimated length in millimeters
   * @returns true if the estimate matches the line's length (rounded to 1 decimal)
   */
  isLength(estimate: number): boolean {
    const roundedActual = Math.round(this.lengthInTenths) / 10;
    const roundedEstimate = Math.round(estimate * 10) / 10;
    return roundedActual === roundedEstimate;
  }
}

// Example usage:
// const line = new Line(10.5);
// console.log(line.length); // 10.5
// line.addLength(0.1);
// console.log(line.length); // 10.6
// console.log(line.isLength(10.6)); // true
// console.log(line.isLength(10.63)); // true (rounds to 10.6)
// console.log(line.isLength(10.7)); // false
