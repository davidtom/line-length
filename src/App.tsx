import React, { useState } from "react";
import Confetti from "react-confetti";
import { Line } from "./Line";
import LineComponent from "./LineComponent";
import "./App.css";

// Create a random line between 1 and 10 mm
const randomLength = Math.random() * 9 + 1; // 1 to 10
const line = new Line(randomLength);

// Log the actual length for testing
console.log("Actual line length:", line.length, "mm");

interface Guess {
  value: number;
  correct: boolean;
  hot: boolean; // within 0.5mm
}

function App() {
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
  };

  const hasWon = guesses.some((g) => g.correct);

  const handleGuessSubmit = () => {
    if (currentGuess === "" || guesses.length >= 4 || hasWon) return;

    const numericGuess = parseFloat(currentGuess);
    if (isNaN(numericGuess)) return;

    const isCorrect = line.isLength(numericGuess);
    // Calculate if "hot" - within 0.5mm of the actual length
    const difference = Math.abs(numericGuess - line.length);
    const isHot = difference <= 0.5;

    setGuesses([
      ...guesses,
      { value: numericGuess, correct: isCorrect, hot: isHot },
    ]);
    setCurrentGuess("");

    // Show confetti if correct
    if (isCorrect) {
      setShowConfetti(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGuessSubmit();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const isDisabled = guesses.length >= 4 || hasWon;

  return (
    <div className="App">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          recycle={false}
          gravity={0.3}
        />
      )}

      <h1>Guess the Line Length</h1>
      <p>How long is this line in millimeters? Round to 1 decimal place.</p>

      <LineComponent length={line.length} />

      <div className="input-container">
        <input
          type="number"
          step="0.1"
          value={currentGuess}
          onChange={handleGuessChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter length in mm"
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

      <div className="guesses-table-container">
        <h3>Your Guesses ({guesses.length}/4)</h3>
        {guesses.length > 0 && (
          <table className="guesses-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guess (mm)</th>
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
                  <td>{guess.value.toFixed(1)}</td>
                  <td>
                    {guess.correct ? (
                      <span>✅</span>
                    ) : (
                      <span>{guess.hot ? "🔥" : "❄️"}</span>
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

      <button onClick={handleRefresh} className="refresh-button">
        🔄 New Line
      </button>
    </div>
  );
}

export default App;
