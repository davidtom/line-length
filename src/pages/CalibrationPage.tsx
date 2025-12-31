import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCalibration } from "../hooks/useCalibration";
import { CREDIT_CARD_WIDTH_INCHES, CREDIT_CARD_HEIGHT_INCHES } from "../config";
import "./CalibrationPage.css";

const CalibrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { ppi, savePpi } = useCalibration();

  // Flip orientation: use HEIGHT as the main dimension (vertical on phone)
  // Use current PPI to calculate initial pixel height
  const initialPixelHeight = Math.round(ppi * CREDIT_CARD_WIDTH_INCHES);
  const [pixelHeight, setPixelHeight] = useState(initialPixelHeight);

  // Calculate width based on credit card aspect ratio (flipped)
  const pixelWidth =
    pixelHeight * (CREDIT_CARD_HEIGHT_INCHES / CREDIT_CARD_WIDTH_INCHES);

  const handleDecrease = () => {
    setPixelHeight((h) => Math.max(50, h - 1));
  };

  const handleIncrease = () => {
    setPixelHeight((h) => Math.min(1000, h + 1));
  };

  const handleSave = () => {
    const calculatedPpi = pixelHeight / CREDIT_CARD_WIDTH_INCHES;
    savePpi(calculatedPpi);
    navigate("/");
  };

  return (
    <div className="calibration-page">
      <h1>Screen Calibration</h1>
      <p className="instructions">
        Hold a credit card <strong>vertically</strong> against the box and
        adjust until it matches.
      </p>
      <p className="card-dimensions">
        Standard credit card: {CREDIT_CARD_WIDTH_INCHES}" tall ×{" "}
        {CREDIT_CARD_HEIGHT_INCHES}" wide
      </p>

      <div className="calibration-container">
        <div
          className="calibration-box"
          style={{
            width: `${pixelWidth}px`,
            height: `${pixelHeight}px`,
          }}
        />
      </div>

      <div className="controls">
        <button onClick={handleDecrease} className="adjust-button">
          -
        </button>
        <span className="size-display">{Math.round(pixelHeight)}px</span>
        <button onClick={handleIncrease} className="adjust-button">
          +
        </button>
      </div>

      <div className="action-buttons">
        <button onClick={handleSave} className="save-button">
          Save Calibration
        </button>
        <button onClick={() => navigate("/")} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CalibrationPage;
