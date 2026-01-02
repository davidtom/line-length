import React from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import GamePage from "./pages/GamePage";
import CalibrationPage from "./pages/CalibrationPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/calibrate" element={<CalibrationPage />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
