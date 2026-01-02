import React from "react";
import Confetti from "react-confetti";

export type Direction = "top" | "bottom" | "left" | "right" | "center";

interface DirectionalConfettiProps {
  direction?: Direction;
  numberOfPieces?: number;
  gravity?: number;
  recycle?: boolean;
}

/**
 * Confetti component with configurable direction
 * Supports firing confetti from different screen edges or center
 */
const DirectionalConfetti: React.FC<DirectionalConfettiProps> = ({
  direction = "center",
  numberOfPieces = 400,
  gravity = 0.3,
  recycle = false,
}) => {
  const getConfettiConfig = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    switch (direction) {
      case "bottom":
        return {
          gravity,
          confettiSource: {
            x: 0,
            y: height,
            w: width,
            h: 0,
          },
        };

      case "top":
        return {
          gravity,
          confettiSource: {
            x: 0,
            y: 0,
            w: width,
            h: 0,
          },
        };

      case "left":
        return {
          gravity: 0.1,
          initialVelocityX: 20,
          initialVelocityY: 0,
          confettiSource: {
            x: 0,
            y: 0,
            w: 0,
            h: height,
          },
        };

      case "right":
        return {
          gravity: 0.1,
          initialVelocityX: -20,
          initialVelocityY: 0,
          confettiSource: {
            x: width,
            y: 0,
            w: 0,
            h: height,
          },
        };

      case "center":
      default:
        return {
          gravity,
          // No custom source - defaults to center
        };
    }
  };

  const config = getConfettiConfig();

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={numberOfPieces}
      recycle={recycle}
      {...config}
    />
  );
};

export default DirectionalConfetti;
