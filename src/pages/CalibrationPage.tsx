import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCalibration } from "../hooks/useCalibration";
import { CREDIT_CARD_WIDTH_INCHES, CREDIT_CARD_HEIGHT_INCHES } from "../config";
import "./CalibrationPage.css";

const CalibrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { ppi, savePpi } = useCalibration();

  // Use current PPI to calculate initial pixel width
  const initialPixelWidth = Math.round(ppi * CREDIT_CARD_WIDTH_INCHES);
  const [pixelWidth, setPixelWidth] = useState(initialPixelWidth);

  // Calculate height based on credit card aspect ratio
  const pixelHeight =
    pixelWidth * (CREDIT_CARD_HEIGHT_INCHES / CREDIT_CARD_WIDTH_INCHES);

  const handleDecrease = () => {
    setPixelWidth((w) => Math.max(50, w - 1));
  };

  const handleIncrease = () => {
    setPixelWidth((w) => Math.min(1000, w + 1));
  };

  const handleSave = () => {
    const calculatedPpi = pixelWidth / CREDIT_CARD_WIDTH_INCHES;
    savePpi(calculatedPpi);
    navigate("/");
  };

  return (
    <div className="calibration-page">
      <h1>Screen Calibration</h1>
      <p className="instructions">
        Place a credit card in the top-left corner of your screen and adjust the
        box until it matches the card's outline exactly.
      </p>
      <p className="card-dimensions">
        Standard credit card: {CREDIT_CARD_WIDTH_INCHES}" wide ×{" "}
        {CREDIT_CARD_HEIGHT_INCHES}" tall
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
        <span className="size-display">{Math.round(pixelWidth)}px</span>
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
