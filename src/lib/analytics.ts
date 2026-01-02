import { track } from "@vercel/analytics";

// Enum for all available analytics events
export enum AnalyticsEvent {
  GameCompleted = "GameCompleted",
  NewLine = "NewLine",
  GuessSubmitted = "GuessSubmitted",
}

// Type definitions for event properties
export type EventProperties = {
  [AnalyticsEvent.GameCompleted]: {
    result: string;
    guessCount: number;
    screenWidth: number;
    maxGuesses: number;
  };
  [AnalyticsEvent.NewLine]: {
    source: string;
  };
  [AnalyticsEvent.GuessSubmitted]: {
    guessValue: number;
    isCorrect: boolean;
    proximity: string;
    guessNumber: number;
    difference: number;
    actualAnswer: number;
  };
};

// Analytics wrapper class
class Analytics {
  /**
   * Track an analytics event with type-safe properties
   * @param event - The event to track (from AnalyticsEvent enum)
   * @param properties - Event-specific properties (typed based on event)
   */
  track<T extends AnalyticsEvent>(
    event: T,
    properties: EventProperties[T]
  ): void {
    track(event, properties);
  }
}

// Export singleton instance
export const analytics = new Analytics();
