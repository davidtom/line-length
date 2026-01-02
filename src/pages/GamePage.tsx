import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analytics, AnalyticsEvent } from "../lib/analytics";
import { Line } from "../lib/Line";
import LineComponent from "../components/LineComponent";
import GameOverModal from "../components/GameOverModal";
import DirectionalConfetti from "../components/DirectionalConfetti";
import EasterEgg from "../components/EasterEgg";
import { guessSchema, formatFractionalInches } from "../lib/fractionalInches";
import { useCalibration } from "../hooks/useCalibration";
import { INCH_INCREMENT, MAX_GUESSES } from "../lib/config";
import { getScreenWidth, getMaxLineLength } from "../lib/screenDetection";
import "./GamePage.css";

interface Guess {
  value: number;
  correct: boolean;
  proximity: string; // emoji indicator
}

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { isCalibrated } = useCalibration();

  // Screen width state for dynamic max length
  const [screenWidth, setScreenWidth] = useState<number | null>(
    getScreenWidth()
  );
  const maxLength = getMaxLineLength();

  // Create a random line based on dynamic max length
  const [line] = useState(() => {
    const randomEighths =
      Math.floor(Math.random() * (maxLength * INCH_INCREMENT)) + 1;
    return new Line(randomEighths / INCH_INCREMENT);
  });

  // Calculate display max: prefer screen max, but bump up if line exceeds it
  const getDisplayMax = (): number => {
    const screenMax = getMaxLineLength();
    // If line fits within screen max, show screen max (no hints!)
    if (line.length <= screenMax) return screenMax;
    // Line exceeds screen max (window was resized), show next valid breakpoint
    if (line.length <= 2) return 2;
    if (line.length <= 4) return 4;
    return 6;
  };
  const displayMax = getDisplayMax();

  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasWon = guesses.some((g) => g.correct);
  const isDisabled = guesses.length >= MAX_GUESSES || hasWon;

  // Log the actual line length after mount
  useEffect(() => {
    console.log("Line length:", line.length, "inches");
  }, [line.length]);

  // Add resize listener to update screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(getScreenWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Open modal when game ends
  useEffect(() => {
    if (isDisabled) {
      setIsModalOpen(true);
    }
  }, [isDisabled]);

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
    setValidationError(""); // Clear error when user types
  };

  const getProximityEmoji = (difference: number): string => {
    if (difference <= 0.25) return "🔥🔥🔥"; // Very hot (within 1/4")
    if (difference <= 0.5) return "🔥🔥"; // Hot (within 1/2")
    if (difference <= 1) return "🔥"; // Warm (within 1")
    return "❄️"; // Cold
  };

  const handleGuessSubmit = () => {
    if (currentGuess === "" || guesses.length >= MAX_GUESSES || hasWon) return;

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

      const newGuesses = [
        ...guesses,
        { value: parsedInches, correct: isCorrect, proximity },
      ];
      setGuesses(newGuesses);
      setCurrentGuess("");
      setValidationError("");

      // Track individual guess
      analytics.track(AnalyticsEvent.GuessSubmitted, {
        guessValue: parsedInches,
        isCorrect: isCorrect,
        proximity: proximity,
        guessNumber: newGuesses.length,
        difference: difference,
        actualAnswer: line.length,
      });

      // Show confetti if correct
      if (isCorrect) {
        setShowConfetti(true);
      }

      // Track game outcome when game ends
      if (isCorrect || newGuesses.length >= MAX_GUESSES) {
        analytics.track(AnalyticsEvent.GameCompleted, {
          result: isCorrect ? "win" : "loss",
          guessCount: newGuesses.length,
          screenWidth: screenWidth || 0,
          maxGuesses: MAX_GUESSES,
        });
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

  const handleRefresh = (source: string) => {
    analytics.track(AnalyticsEvent.NewLine, {
      source: source,
    });
    window.location.reload();
  };

  const remainingGuesses = MAX_GUESSES - guesses.length;

  return (
    <div className="game-page">
      {showConfetti && (
        <DirectionalConfetti
          direction="center"
          numberOfPieces={1000 * (remainingGuesses + 1)}
          gravity={1}
          recycle={false}
        />
      )}

      <EasterEgg />

      <h1>Guess the Line Length</h1>
      <p>How long is this line in inches? (1/8" increments)</p>
      <p className="max-length-hint">Max: {displayMax}"</p>

      {isDisabled && (
        <p className="answer-reveal">
          The answer was <strong>{formatFractionalInches(line.length)}</strong>
        </p>
      )}

      <GameOverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hasWon={hasWon}
        answer={line.length}
        onNewGame={() => handleRefresh("modal")}
      />

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

      <button onClick={() => handleRefresh("page")} className="refresh-button">
        🔄 New Line
      </button>

      <div className="guesses-table-container">
        <h3>
          Your Guesses ({guesses.length}/{MAX_GUESSES})
        </h3>
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
