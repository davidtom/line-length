import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCalibration } from "../hooks/useCalibration";
import "./CalibrationPage.css";

const CalibrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { ppi, savePpi } = useCalibration();

  // Use current PPI to calculate initial pixel length for 1 inch
  const initialPixelLength = Math.round(ppi * 1);
  const [pixelLength, setPixelLength] = useState(initialPixelLength);

  const handleDecrease = () => {
    setPixelLength((l) => Math.max(50, l - 1));
  };

  const handleIncrease = () => {
    setPixelLength((l) => Math.min(500, l + 1));
  };

  const handleSave = () => {
    const calculatedPpi = pixelLength / 1; // pixels per 1 inch
    savePpi(calculatedPpi);
    navigate("/");
  };

  return (
    <div className="calibration-page">
      <h1>Screen Calibration</h1>
      <p className="instructions">
        Hold a ruler up to the line and adjust until it measures exactly{" "}
        <strong>1 inch</strong>.
      </p>

      <div className="action-buttons">
        <button onClick={handleSave} className="save-button">
          Save Calibration
        </button>
        <button onClick={() => navigate("/")} className="cancel-button">
          Cancel
        </button>
      </div>

      <div className="controls">
        <button onClick={handleDecrease} className="adjust-button">
          -
        </button>
        <span className="size-display">{Math.round(pixelLength)}px</span>
        <button onClick={handleIncrease} className="adjust-button">
          +
        </button>
      </div>

      <div className="calibration-container">
        <div className="line-wrapper">
          <div
            className="calibration-line"
            style={{
              width: `${pixelLength}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalibrationPage;
