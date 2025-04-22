/**
 * Time formatting utilities
 */

export const TimeFormats = {
  ISO: "ISO",
  LOCALE: "LOCALE",
  UNIX: "UNIX",
} as const;

export type TimeFormatType = typeof TimeFormats[keyof typeof TimeFormats];

export function formatTimestamp(
  date: Date,
  format: TimeFormatType = TimeFormats.ISO
): string {
  switch (format) {
    case TimeFormats.ISO:
      return date.toISOString();
    case TimeFormats.LOCALE:
      return date.toLocaleString();
    case TimeFormats.UNIX:
      return Math.floor(date.getTime() / 1000).toString();
    default:
      return date.toISOString();
  }
}
