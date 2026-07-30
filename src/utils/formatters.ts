/**
 * Formats seconds into mm:ss or hh:mm:ss string
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats seconds per km into mm:ss /km
 */
export function formatPace(paceSecPerKm: number): string {
  if (!paceSecPerKm || !isFinite(paceSecPerKm) || paceSecPerKm <= 0) return '-:-- /km';
  const mins = Math.floor(paceSecPerKm / 60);
  const secs = Math.round(paceSecPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
}

/**
 * Converts speed in m/s to pace in seconds per km
 */
export function speedMpsToPaceSecKm(speedMps: number): number {
  if (!speedMps || speedMps <= 0) return 0;
  return 1000 / speedMps;
}

/**
 * Converts pace in seconds per km to speed in m/s
 */
export function paceSecKmToSpeedMps(paceSecKm: number): number {
  if (!paceSecKm || paceSecKm <= 0) return 0;
  return 1000 / paceSecKm;
}
