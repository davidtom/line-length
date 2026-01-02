import React from "react";
import { useCalibration } from "../hooks/useCalibration";

interface LineComponentProps {
  length: number; // length in inches
}

const LineComponent: React.FC<LineComponentProps> = ({ length }) => {
  // Use calibrated PPI (or fallback to 96 DPI)
  const { ppi } = useCalibration();

  // Convert inches to pixels using actual screen PPI
  const lengthInPixels = length * ppi;

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
