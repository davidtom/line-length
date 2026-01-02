export function getScreenWidth(): number | null {
  if (typeof window === "undefined") return null;
  return window.innerWidth;
}

const enum MaxLineLength {
  Mobile = 2,
  Tablet = 4,
  LargeScreen = 6,
  ExtraLargeScreen = 8,
}

export function getMaxLineLength(): number {
  const screenWidth = getScreenWidth();

  if (screenWidth === null) return MaxLineLength.Mobile; // Fallback for SSR

  if (screenWidth < 768) {
    return MaxLineLength.Mobile;
  } else if (screenWidth < 1024) {
    return MaxLineLength.Tablet;
  } else if (screenWidth < 1440) {
    return MaxLineLength.LargeScreen;
  } else {
    return MaxLineLength.ExtraLargeScreen;
  }
}
