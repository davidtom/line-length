import React, { useState } from "react";
import Confetti from "react-confetti";
import { Line } from "./Line";
import LineComponent from "./LineComponent";
import "./App.css";

// Create a random line between 1 and 254 mm (10 inches)
const randomLength = Math.round(Math.random() * 253 + 1);
const line = new Line(randomLength);

// Log the actual length for testing
console.log("Actual line length:", line.length, "mm");

interface Guess {
  value: number;
  correct: boolean;
  hot: boolean;
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

    const numericGuess = Math.round(parseFloat(currentGuess));
    if (isNaN(numericGuess)) return;

    const isCorrect = line.isLength(numericGuess);
    // Calculate if "hot" - within 15mm of the actual length
    // For a 1-254mm range, 15mm is about 6% tolerance and gives helpful feedback
    const difference = Math.abs(numericGuess - Math.round(line.length));
    const isHot = difference <= 15;

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
      <p>How long is this line in millimeters?</p>

      {isDisabled && (
        <p className="answer-reveal">
          The answer was <strong>{Math.round(line.length)} mm</strong>
        </p>
      )}

      <LineComponent length={line.length} />

      <div className="input-container">
        <input
          type="number"
          step="1"
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
                  <td>{guess.value}</td>
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
