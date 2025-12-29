import React from "react";

interface LineComponentProps {
  length: number; // length in millimeters
}

const LineComponent: React.FC<LineComponentProps> = ({ length }) => {
  // Convert mm to pixels at a fixed ratio
  // Standard conversion: 1 inch = 25.4mm, at 96 DPI: 1 inch = 96 pixels
  // Therefore: 1mm = 96/25.4 ≈ 3.7795 pixels
  const MM_TO_PIXELS = 96 / 25.4;
  const lengthInPixels = length * MM_TO_PIXELS;

  return (
    <div className="line-container">
      <div
        className="line"
        style={{
          width: `${lengthInPixels}px`,
          minWidth: `${lengthInPixels}px`,
          maxWidth: `${lengthInPixels}px`,
          height: "3px",
          backgroundColor: "#333",
          margin: "20px 0",
          flexShrink: 0,
        }}
      />
    </div>
  );
};

export default LineComponent;
