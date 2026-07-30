/**
 * Calculates mean of numbers
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Calculates standard deviation
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const squareDiffs = values.map((val) => Math.pow(val - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

/**
 * Exponential Weighted Moving Average (EWMA) calculation for Training Load (CTL/ATL)
 */
export function calculateEwma(loads: { date: string; load: number }[], timeConstantDays: number): number {
  if (loads.length === 0) return 0;

  // Sort loads by date ascending
  const sorted = [...loads].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const lambda = 1 - Math.exp(-1 / timeConstantDays);
  let ewma = sorted[0].load;

  for (let i = 1; i < sorted.length; i++) {
    ewma = lambda * sorted[i].load + (1 - lambda) * ewma;
  }

  return Math.round(ewma * 10) / 10;
}
