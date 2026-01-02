import React from "react";
import DirectionalConfetti, { type Direction } from "./DirectionalConfetti";
import { useKonamiCode } from "../hooks/useKonamiCode";

const KONAMI_CONFETTI_DIRECTIONS: Direction[] = [
  "top",
  "center",
  "left",
  "right",
];
const KONAMI_CONFETTI_PIECES = 10000;
const KONAMI_CONFETTI_GRAVITY = 10;

/**
 * Konami code easter egg component
 * Self-contained - detects konami code and renders multi-directional confetti
 */
const EasterEgg: React.FC = () => {
  const active = useKonamiCode();

  if (!active) return null;

  return (
    <>
      {KONAMI_CONFETTI_DIRECTIONS.map((dir) => (
        <DirectionalConfetti
          key={dir}
          direction={dir}
          numberOfPieces={KONAMI_CONFETTI_PIECES}
          gravity={KONAMI_CONFETTI_GRAVITY}
          recycle={true}
        />
      ))}
    </>
  );
};

export default EasterEgg;
