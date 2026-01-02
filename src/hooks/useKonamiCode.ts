import { useState, useEffect } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

interface KonamiCodeOptions {
  duration?: number;
}

/**
 * Custom hook to detect the Konami code sequence
 * @param options.duration - How long to show confetti (ms), defaults to 5000
 * @returns boolean indicating if confetti should be displayed
 */
export function useKonamiCode(options?: KonamiCodeOptions): boolean {
  const { duration = 5000 } = options || {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_sequence, setSequence] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only track arrow keys
      if (!e.key.startsWith("Arrow")) return;

      setSequence((prev) => {
        const newSequence = [...prev, e.key];

        // Check if current sequence matches the start of Konami code
        const isValid = KONAMI_CODE.slice(0, newSequence.length).every(
          (key, index) => key === newSequence[index]
        );

        // If invalid, reset sequence
        if (!isValid) {
          return [];
        }

        // If complete sequence matched, trigger confetti
        if (newSequence.length === KONAMI_CODE.length) {
          setShowConfetti(true);
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-hide confetti after duration
  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti, duration]);

  return showConfetti;
}
