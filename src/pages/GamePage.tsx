import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { Line } from "../Line";
import LineComponent from "../LineComponent";
import { guessSchema, formatFractionalInches } from "../utils/fractionalInches";
import { useCalibration } from "../hooks/useCalibration";
import { MAX_LENGTH_INCHES, INCH_INCREMENT } from "../config";
import "./GamePage.css";

// Create a random line between 1/8" and 2" in 1/8" increments
// Generate random eighths based on config
const randomEighths =
  Math.floor(Math.random() * (MAX_LENGTH_INCHES * INCH_INCREMENT)) + 1;
const line = new Line(randomEighths / INCH_INCREMENT);

// Log the actual length for testing
console.log("Line length:", line.length, "inches");

interface Guess {
  value: number;
  correct: boolean;
  proximity: string; // emoji indicator
}

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { isCalibrated } = useCalibration();
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
    setValidationError(""); // Clear error when user types
  };

  const hasWon = guesses.some((g) => g.correct);

  const getProximityEmoji = (difference: number): string => {
    if (difference <= 0.25) return "🔥🔥🔥"; // Very hot (within 1/4")
    if (difference <= 0.5) return "🔥🔥"; // Hot (within 1/2")
    if (difference <= 1) return "🔥"; // Warm (within 1")
    return "❄️"; // Cold
  };

  const handleGuessSubmit = () => {
    if (currentGuess === "" || guesses.length >= 4 || hasWon) return;

    try {
      // Parse and validate input using Zod schema
      const parsedInches = guessSchema.parse(currentGuess);

      if (parsedInches === null) {
        setValidationError("Invalid input format");
        return;
      }

      const isCorrect = line.isLength(parsedInches);
      const difference = Math.abs(parsedInches - line.length);
      const proximity = getProximityEmoji(difference);

      setGuesses([
        ...guesses,
        { value: parsedInches, correct: isCorrect, proximity },
      ]);
      setCurrentGuess("");
      setValidationError("");

      // Show confetti if correct
      if (isCorrect) {
        setShowConfetti(true);
      }
    } catch (error: any) {
      // Show Zod validation error
      setValidationError(error.errors?.[0]?.message || "Invalid input");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGuessSubmit();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const isDisabled = guesses.length >= 4 || hasWon;

  return (
    <div className="game-page">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={800}
          recycle={false}
          gravity={0.7}
        />
      )}

      <h1>Guess the Line Length</h1>
      <p>How long is this line in inches? (Max: 2"; 1/8" increments)</p>

      {isDisabled && (
        <p className="answer-reveal">
          The answer was <strong>{formatFractionalInches(line.length)}</strong>
        </p>
      )}

      <LineComponent length={line.length} />

      <div className="input-container">
        <input
          type="text"
          value={currentGuess}
          onChange={handleGuessChange}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 1 3/8"
          disabled={isDisabled}
        />
        <button
          onClick={handleGuessSubmit}
          disabled={isDisabled}
          className="guess-button"
        >
          Guess
        </button>
      </div>

      {validationError && (
        <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
          {validationError}
        </p>
      )}

      <button onClick={handleRefresh} className="refresh-button">
        🔄 New Line
      </button>

      <div className="guesses-table-container">
        <h3>Your Guesses ({guesses.length}/4)</h3>
        {guesses.length > 0 && (
          <table className="guesses-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guess (inches)</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {guesses.map((guess, index) => (
                <tr
                  key={index}
                  className={guess.correct ? "correct-row" : "wrong-row"}
                >
                  <td>{index + 1}</td>
                  <td>{formatFractionalInches(guess.value)}</td>
                  <td>
                    {guess.correct ? (
                      <span>✅</span>
                    ) : (
                      <span>{guess.proximity}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isDisabled && (
        <p className="game-over">
          Game Over! {hasWon ? "🎉 You got it!" : "😔 Better luck next time!"}
        </p>
      )}

      <button
        onClick={() => navigate("/calibrate")}
        className="refresh-button"
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          padding: isCalibrated ? "8px 16px" : "12px 28px",
          fontSize: isCalibrated ? "14px" : "16px",
          backgroundColor: isCalibrated ? "#999" : "#f44336",
        }}
      >
        📏 {isCalibrated ? "Recalibrate" : "Calibrate Screen"}
      </button>
    </div>
  );
};

export default GamePage;
