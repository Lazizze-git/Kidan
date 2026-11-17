// @ts-check
// Dates de l'agenda au format romand : « samedi 21.11.2026 »

const weekdayFormatter = new Intl.DateTimeFormat("fr-CH", { weekday: "long" });

/** @param {number} value */
function pad(value) {
  return String(value).padStart(2, "0");
}

/**
 * @param {string} isoDate date au format AAAA-MM-JJ
 * @returns {{ short: string, long: string }}
 */
export function formatEventDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  const short = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
  return { short, long: `${weekdayFormatter.format(date)} ${short}` };
}

/**
 * @param {string} start
 * @param {string} end
 */
export function formatTimeRange(start, end) {
  return `${start} – ${end}`;
}
